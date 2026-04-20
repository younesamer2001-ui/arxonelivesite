/**
 * load-kb-to-trieve.ts
 * ---------------------------------------------------------------
 * Reads voiceagents/<niche>/kb/*.md, splits into chunks (~400 tokens),
 * and POSTs to Trieve's /chunk API keyed by dataset_id.
 *
 * Env required:
 *   TRIEVE_API_KEY                 — bearer token
 *   TRIEVE_HOST                    — e.g. https://api.trieve.ai
 *   TRIEVE_DATASET_LISA            — dataset UUID for Lisa's KB
 *   TRIEVE_DATASET_MAX             — dataset UUID for Max's KB
 *   TRIEVE_DATASET_ELLA            — dataset UUID for Ella's KB
 *
 * Run:
 *   node --experimental-strip-types --env-file=.env.local \
 *     scripts/load-kb-to-trieve.ts
 *   # or per niche:
 *   node --experimental-strip-types --env-file=.env.local \
 *     scripts/load-kb-to-trieve.ts --niche lisa-helse
 *   # dry-run (prints chunks, no POST):
 *   node --experimental-strip-types scripts/load-kb-to-trieve.ts --dry-run
 *
 * Safety:
 *   - Re-upsert uses `tracking_id` = `${niche}:${filename}:${chunk_idx}`
 *     so reruns overwrite instead of duplicating.
 *   - Live POSTs require explicit env vars; missing ones abort loudly.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const VA_ROOT = path.join(ROOT, 'voiceagents');

const NICHES = [
  'lisa-helse',
  'max-bilverksted',
  'ella-elektriker',
  'arxon-sales',
] as const;
type Niche = (typeof NICHES)[number];

const DATASET_ENV: Record<Niche, string> = {
  'lisa-helse': 'TRIEVE_DATASET_LISA',
  'max-bilverksted': 'TRIEVE_DATASET_MAX',
  'ella-elektriker': 'TRIEVE_DATASET_ELLA',
  'arxon-sales': 'TRIEVE_DATASET_ARXON',
};

// Approximate 1 token ≈ 4 chars (OpenAI-ish).
// Target ~400 tokens / chunk → ~1600 chars with 200-char overlap.
const TARGET_CHARS = 1600;
const OVERLAP_CHARS = 200;

interface Chunk {
  niche: Niche;
  filename: string;
  chunkIdx: number;
  trackingId: string;
  content: string;
  metadata: Record<string, unknown>;
}

// ----------------------------------------------------------------------
// Frontmatter parser (minimal — just the keys we use)
// ----------------------------------------------------------------------

function splitFrontmatter(md: string): { fm: Record<string, unknown>; body: string } {
  if (!md.startsWith('---')) return { fm: {}, body: md };
  const end = md.indexOf('\n---', 4);
  if (end === -1) return { fm: {}, body: md };
  const fmBlock = md.slice(3, end).trim();
  const body = md.slice(end + 4).replace(/^\s*\n/, '');
  const fm: Record<string, unknown> = {};
  for (const line of fmBlock.split('\n')) {
    const m = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    let value: unknown = rawValue.trim();
    // [a, b, c] → array
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    fm[key] = value;
  }
  return { fm, body };
}

// ----------------------------------------------------------------------
// Chunking: split on "## " headers first, then by size
// ----------------------------------------------------------------------

function chunkByHeaders(body: string): string[] {
  const parts = body.split(/^(?=##\s)/m).filter((p) => p.trim().length > 0);
  // If any single part is too big, re-split with char windows
  const out: string[] = [];
  for (const part of parts) {
    if (part.length <= TARGET_CHARS) {
      out.push(part.trim());
      continue;
    }
    let start = 0;
    while (start < part.length) {
      const end = Math.min(start + TARGET_CHARS, part.length);
      out.push(part.slice(start, end).trim());
      if (end === part.length) break;
      start = Math.max(0, end - OVERLAP_CHARS);
    }
  }
  return out;
}

// ----------------------------------------------------------------------
// Build chunks for a niche
// ----------------------------------------------------------------------

function buildChunksForNiche(niche: Niche): Chunk[] {
  const kbDir = path.join(VA_ROOT, niche, 'kb');
  if (!fs.existsSync(kbDir)) {
    console.warn(`[${niche}] no kb/ folder at ${kbDir}, skipping`);
    return [];
  }
  const files = fs
    .readdirSync(kbDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
  const chunks: Chunk[] = [];

  for (const filename of files) {
    const full = fs.readFileSync(path.join(kbDir, filename), 'utf8');
    const { fm, body } = splitFrontmatter(full);
    const pieces = chunkByHeaders(body);
    pieces.forEach((content, chunkIdx) => {
      chunks.push({
        niche,
        filename,
        chunkIdx,
        trackingId: `${niche}:${filename}:${chunkIdx}`,
        content,
        metadata: {
          niche,
          source_file: filename,
          topic: fm.topic ?? null,
          dataset: fm.dataset ?? null,
          tags: fm.tags ?? [],
          last_reviewed: fm.last_reviewed ?? null,
        },
      });
    });
  }
  return chunks;
}

// ----------------------------------------------------------------------
// Trieve POST
// ----------------------------------------------------------------------

async function postChunk(
  chunk: Chunk,
  host: string,
  apiKey: string,
  datasetId: string,
): Promise<{ ok: boolean; status: number; error?: string }> {
  const body = {
    chunk_html: chunk.content,
    tracking_id: chunk.trackingId,
    metadata: chunk.metadata,
    upsert_by_tracking_id: true,
    tag_set: Array.isArray(chunk.metadata.tags)
      ? (chunk.metadata.tags as string[])
      : [],
  };
  const res = await fetch(`${host}/api/chunk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
      'TR-Dataset': datasetId,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, status: res.status, error: text.slice(0, 200) };
  }
  return { ok: true, status: res.status };
}

// ----------------------------------------------------------------------
// CLI
// ----------------------------------------------------------------------

function parseArgs(argv: string[]): { niches: Niche[]; dryRun: boolean } {
  let niches: Niche[] = [...NICHES];
  let dryRun = false;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') dryRun = true;
    else if (a === '--niche') {
      const n = argv[++i];
      if (!NICHES.includes(n as Niche)) {
        throw new Error(`Unknown niche "${n}".`);
      }
      niches = [n as Niche];
    } else if (a === '--help' || a === '-h') {
      console.log(
        'Usage: node --experimental-strip-types scripts/load-kb-to-trieve.ts [--niche <name>] [--dry-run]',
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown argument "${a}".`);
    }
  }
  return { niches, dryRun };
}

async function main() {
  const { niches, dryRun } = parseArgs(process.argv);

  const host = process.env.TRIEVE_HOST || 'https://api.trieve.ai';
  const apiKey = process.env.TRIEVE_API_KEY ?? '';

  if (!dryRun && !apiKey) {
    console.error(
      '[FATAL] TRIEVE_API_KEY not set. Either run with --dry-run or export credentials.',
    );
    process.exit(1);
  }

  let total = 0;
  let failed = 0;

  for (const niche of niches) {
    const chunks = buildChunksForNiche(niche);
    console.log(`[${niche}] ${chunks.length} chunks built.`);
    total += chunks.length;

    if (dryRun) {
      for (const c of chunks) {
        console.log(`  · ${c.trackingId}  (${c.content.length} chars)`);
      }
      continue;
    }

    const datasetEnvKey = DATASET_ENV[niche];
    const datasetId = process.env[datasetEnvKey] ?? '';
    if (!datasetId) {
      console.error(
        `[${niche}] ${datasetEnvKey} not set — skipping live upload for this niche.`,
      );
      failed += chunks.length;
      continue;
    }

    for (const c of chunks) {
      const r = await postChunk(c, host, apiKey, datasetId);
      if (r.ok) {
        process.stdout.write('.');
      } else {
        failed++;
        console.error(`\n  ✗ ${c.trackingId}  HTTP ${r.status}  ${r.error ?? ''}`);
      }
    }
    console.log(`\n[${niche}] done.`);
  }

  console.log(`\nTotal chunks: ${total}. Failed: ${failed}.`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
