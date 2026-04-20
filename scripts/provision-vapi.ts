/**
 * provision-vapi.ts
 * ---------------------------------------------------------------
 * Reads voiceagents/<niche>/vapi-config.resolved.json, sanitises it
 * (drops internal _/$ keys, substitutes env:NAME sigils), then either
 * creates a new Vapi assistant via POST /assistant, or updates an
 * existing one via PATCH /assistant/{id}.
 *
 * On success, prints the three Assistant IDs in a format you can paste
 * into .env.local and Vercel env:
 *
 *   NEXT_PUBLIC_VAPI_ASSISTANT_LISA=...
 *   NEXT_PUBLIC_VAPI_ASSISTANT_MAX=...
 *   NEXT_PUBLIC_VAPI_ASSISTANT_ELLA=...
 *   NEXT_PUBLIC_VAPI_ASSISTANT_ARXON=...
 *
 * Env required:
 *   VAPI_PRIVATE_KEY              — bearer token for api.vapi.ai
 *   VAPI_API_BASE                 — default https://api.vapi.ai
 *   VAPI_WEBHOOK_SECRET           — substituted into serverUrlSecret
 *   NEXT_PUBLIC_VAPI_ASSISTANT_*  — optional; if set, PATCH instead of POST
 *
 * Run:
 *   node --experimental-strip-types --env-file=.env.local \
 *     scripts/provision-vapi.ts
 *   # single niche:
 *   node --experimental-strip-types --env-file=.env.local \
 *     scripts/provision-vapi.ts --niche lisa-helse
 *   # dry-run: prints sanitised payload, no POST:
 *   node --experimental-strip-types scripts/provision-vapi.ts --dry-run
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

const EXISTING_ENV_KEY: Record<Niche, string> = {
  'lisa-helse': 'NEXT_PUBLIC_VAPI_ASSISTANT_LISA',
  'max-bilverksted': 'NEXT_PUBLIC_VAPI_ASSISTANT_MAX',
  'ella-elektriker': 'NEXT_PUBLIC_VAPI_ASSISTANT_ELLA',
  'arxon-sales': 'NEXT_PUBLIC_VAPI_ASSISTANT_ARXON',
};

// ----------------------------------------------------------------------
// Sanitiser: strip "_*" / "$*" keys, substitute env:VAR sigils
// ----------------------------------------------------------------------

type JsonVal =
  | string
  | number
  | boolean
  | null
  | JsonVal[]
  | { [k: string]: JsonVal };

function sanitise(value: JsonVal): JsonVal {
  if (Array.isArray(value)) {
    return value.map(sanitise);
  }
  if (value && typeof value === 'object') {
    const out: { [k: string]: JsonVal } = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith('_') || k.startsWith('$')) continue;
      out[k] = sanitise(v as JsonVal);
    }
    return out;
  }
  if (typeof value === 'string' && value.startsWith('env:')) {
    const envName = value.slice(4);
    const envValue = process.env[envName];
    if (envValue === undefined) {
      throw new Error(
        `Sigil "env:${envName}" requested but ${envName} is not set. Aborting so we don't ship a placeholder to Vapi.`,
      );
    }
    return envValue;
  }
  return value;
}

// ----------------------------------------------------------------------
// Vapi API helpers
// ----------------------------------------------------------------------

interface VapiAssistantResponse {
  id?: string;
  name?: string;
  [k: string]: unknown;
}

async function vapiRequest(
  method: 'POST' | 'PATCH',
  url: string,
  body: unknown,
  apiKey: string,
): Promise<{ ok: boolean; status: number; body: VapiAssistantResponse; raw: string }> {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let parsed: VapiAssistantResponse = {};
  try {
    parsed = raw ? (JSON.parse(raw) as VapiAssistantResponse) : {};
  } catch {
    parsed = { _parse_error: true } as VapiAssistantResponse;
  }
  return { ok: res.ok, status: res.status, body: parsed, raw };
}

// ----------------------------------------------------------------------
// Per-niche driver
// ----------------------------------------------------------------------

interface ProvisionResult {
  niche: Niche;
  action: 'created' | 'updated' | 'dry-run' | 'skipped' | 'failed';
  assistantId?: string;
  error?: string;
}

async function provisionNiche(
  niche: Niche,
  opts: { apiBase: string; apiKey: string; dryRun: boolean },
): Promise<ProvisionResult> {
  const configPath = path.join(VA_ROOT, niche, 'vapi-config.resolved.json');
  if (!fs.existsSync(configPath)) {
    return {
      niche,
      action: 'skipped',
      error: `Missing ${configPath}. Run the resolver first: npm run resolve:voiceagents`,
    };
  }

  const raw = JSON.parse(fs.readFileSync(configPath, 'utf8')) as JsonVal;
  let payload: JsonVal;
  try {
    payload = sanitise(raw);
  } catch (err) {
    return { niche, action: 'failed', error: (err as Error).message };
  }

  if (opts.dryRun) {
    console.log(`\n─── ${niche} (dry-run) ───`);
    console.log(JSON.stringify(payload, null, 2).slice(0, 800) + '\n…');
    return { niche, action: 'dry-run' };
  }

  const existingId = process.env[EXISTING_ENV_KEY[niche]];
  if (existingId) {
    const res = await vapiRequest(
      'PATCH',
      `${opts.apiBase}/assistant/${existingId}`,
      payload,
      opts.apiKey,
    );
    if (!res.ok) {
      return {
        niche,
        action: 'failed',
        error: `PATCH ${res.status}: ${res.raw.slice(0, 400)}`,
      };
    }
    return { niche, action: 'updated', assistantId: existingId };
  }

  const res = await vapiRequest(
    'POST',
    `${opts.apiBase}/assistant`,
    payload,
    opts.apiKey,
  );
  if (!res.ok) {
    return {
      niche,
      action: 'failed',
      error: `POST ${res.status}: ${res.raw.slice(0, 400)}`,
    };
  }
  if (!res.body.id) {
    return {
      niche,
      action: 'failed',
      error: `Vapi returned 2xx but no assistant id: ${res.raw.slice(0, 300)}`,
    };
  }
  return { niche, action: 'created', assistantId: res.body.id };
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
        'Usage: node --experimental-strip-types scripts/provision-vapi.ts [--niche <name>] [--dry-run]',
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown argument "${a}".`);
    }
  }
  return { niches, dryRun };
}

async function main(): Promise<void> {
  const { niches, dryRun } = parseArgs(process.argv);

  const apiBase = process.env.VAPI_API_BASE ?? 'https://api.vapi.ai';
  const apiKey = process.env.VAPI_PRIVATE_KEY ?? '';

  if (!dryRun && !apiKey) {
    console.error(
      '[FATAL] VAPI_PRIVATE_KEY not set. Either run with --dry-run or export credentials.',
    );
    process.exit(1);
  }

  const results: ProvisionResult[] = [];
  for (const niche of niches) {
    process.stdout.write(`[${niche}] provisioning… `);
    const r = await provisionNiche(niche, { apiBase, apiKey, dryRun });
    results.push(r);
    if (r.action === 'created' || r.action === 'updated') {
      console.log(`${r.action} → ${r.assistantId}`);
    } else if (r.action === 'dry-run') {
      console.log('dry-run OK');
    } else if (r.action === 'skipped') {
      console.log(`skipped — ${r.error}`);
    } else {
      console.log(`FAILED — ${r.error}`);
    }
  }

  // Emit paste-ready env snippet for success cases
  const successes = results.filter(
    (r) => (r.action === 'created' || r.action === 'updated') && r.assistantId,
  );
  if (successes.length && !dryRun) {
    console.log('\n─── Paste into .env.local + Vercel env ───');
    for (const r of successes) {
      console.log(`${EXISTING_ENV_KEY[r.niche]}=${r.assistantId}`);
    }
  }

  const failed = results.filter((r) => r.action === 'failed').length;
  console.log(
    `\nDone. ${successes.length}/${niches.length} provisioned. ${failed} failure(s).`,
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
