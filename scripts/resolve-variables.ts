/**
 * resolve-variables.ts
 * ---------------------------------------------------------------
 * Reads:
 *   voiceagents/shared/skeleton-system-prompt.md    (template)
 *   voiceagents/<niche>/variables.md                (YAML + prosa)
 *   voiceagents/<niche>/vapi-config.json            (shell w/ _systemPromptSource)
 *
 * Validates against:
 *   voiceagents/shared/variables-schema.md          (contract)
 *
 * Emits:
 *   voiceagents/<niche>/resolved-system-prompt.txt  (pure rendered prompt)
 *   voiceagents/<niche>/vapi-config.resolved.json   (deploy-ready, prompt inlined)
 *
 * Run:
 *   node --experimental-strip-types scripts/resolve-variables.ts
 *   node --experimental-strip-types scripts/resolve-variables.ts --niche lisa-helse
 *   node --experimental-strip-types scripts/resolve-variables.ts --check
 *
 * Exits 0 on success, 1 on any validation failure.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import yaml from 'js-yaml';

// ----------------------------------------------------------------------
// Paths
// ----------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const VA_ROOT = path.join(ROOT, 'voiceagents');
const SHARED = path.join(VA_ROOT, 'shared');

const NICHES = [
  'lisa-helse',
  'max-bilverksted',
  'ella-elektriker',
  'arxon-sales',
] as const;
type Niche = (typeof NICHES)[number];

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

type Scalar = string | number | boolean | null;
type YamlVal = Scalar | YamlVal[] | { [k: string]: YamlVal };
type Vars = Record<string, YamlVal>;

interface ResolveResult {
  niche: Niche;
  renderedPrompt: string;
  resolvedConfigPath: string;
  promptPath: string;
  warnings: string[];
}

// ----------------------------------------------------------------------
// Markdown extractors
// ----------------------------------------------------------------------

/** Grab the first ```yaml ... ``` fenced block. */
function extractYamlBlock(md: string, sourceLabel: string): string {
  const m = md.match(/```yaml\s*\n([\s\S]*?)\n```/);
  if (!m) {
    throw new Error(
      `[${sourceLabel}] No \`\`\`yaml fenced block found. ` +
        `The YAML frontmatter/block is required — see shared/variables-schema.md.`,
    );
  }
  return m[1];
}

/**
 * Grab the skeleton template — the first ``` fenced block following
 * the "## Selve promptten" header in skeleton-system-prompt.md.
 */
function extractSkeletonTemplate(md: string): string {
  const headerIdx = md.indexOf('## Selve promptten');
  if (headerIdx === -1) {
    throw new Error(
      '[skeleton] Expected "## Selve promptten" section in skeleton-system-prompt.md.',
    );
  }
  const rest = md.slice(headerIdx);
  const m = rest.match(/```\s*\n([\s\S]*?)\n```/);
  if (!m) {
    throw new Error('[skeleton] No ``` fenced template block found after header.');
  }
  return m[1];
}

/**
 * Parse ### headers and their body, handling code-fenced sections.
 * Header is stripped to slug (lowercase, underscores, stable).
 */
function extractSections(md: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = md.split('\n');
  let current: string | null = null;
  let buf: string[] = [];
  let inFence = false;

  const flush = () => {
    if (current !== null) {
      let body = buf.join('\n').trim();
      // Strip a single outer ``` fence if present
      const fenceMatch = body.match(/^```[a-zA-Z0-9_-]*\n([\s\S]*)\n```$/);
      if (fenceMatch) body = fenceMatch[1];
      sections[current] = body;
    }
  };

  for (const line of lines) {
    if (/^```/.test(line.trim())) inFence = !inFence;
    if (!inFence && /^###\s+/.test(line)) {
      flush();
      const name = line
        .replace(/^###\s+/, '')
        .trim()
        .toLowerCase()
        .replace(/[^\w]+/g, '_')
        .replace(/^_+|_+$/g, '');
      current = name;
      buf = [];
      continue;
    }
    if (!inFence && /^##\s+/.test(line)) {
      // Any ## header closes the current ### section
      flush();
      current = null;
      buf = [];
      continue;
    }
    if (current !== null) buf.push(line);
  }
  flush();
  return sections;
}

/**
 * The niche's authored tools-list block. Looks for ## Tools-liste...
 * and grabs the first ``` block beneath it.
 */
function extractToolsList(md: string): string {
  const headerIdx = md.search(/^##\s+Tools-liste[^\n]*$/m);
  if (headerIdx === -1) return '';
  const rest = md.slice(headerIdx);
  const m = rest.match(/```[a-zA-Z0-9_-]*\s*\n([\s\S]*?)\n```/);
  return m ? m[1].trim() : '';
}

// ----------------------------------------------------------------------
// Value formatting (render-side)
// ----------------------------------------------------------------------

function formatForPrompt(val: YamlVal, key: string): string {
  if (val === null || val === undefined) {
    throw new Error(`Cannot render null/undefined for "${key}".`);
  }
  if (Array.isArray(val)) {
    // Arrays of strings → comma-joined list (suits emergency_keywords, etc.)
    if (val.every((x) => typeof x === 'string')) return val.join(', ');
    throw new Error(`Array value for "${key}" must be array of strings.`);
  }
  if (typeof val === 'object') {
    throw new Error(
      `Object value for "${key}" cannot be rendered directly. ` +
        `Flatten in variables.md or handle explicitly in the resolver.`,
    );
  }
  return String(val);
}

// ----------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------

const SCHEMA_VERSION_EXPECTED = '1.0.0';

const REQUIRED_FRONTMATTER = [
  'schema_version',
  'agent_name',
  'business_name',
  'primary_language',
  'primary_language_label',
  'persona_traits',
  'tone_description',
  'speaking_speed_hint',
  'industry_short_description',
  'location',
  'opening_hours_prose',
  'max_qualification_questions',
  'emergency_keywords',
  'emergency_script',
  'pii_extra_blocklist',
  'enabled_tools',
];

const REQUIRED_SECTIONS = [
  'business_one_paragraph_summary',
  'in_scope_bullets',
  'out_of_scope_bullets',
  'qualification_questions_bulleted',
  'niche_specific_rules',
];

/**
 * Throws on schema violations; returns soft warnings for later display.
 */
function validate(
  flat: Vars,
  sections: Record<string, string>,
  firstMessage: string | null,
  niche: Niche,
): string[] {
  const warnings: string[] = [];

  // 1. schema_version
  if (flat.schema_version !== SCHEMA_VERSION_EXPECTED) {
    throw new Error(
      `[${niche}] schema_version "${flat.schema_version}" !== expected "${SCHEMA_VERSION_EXPECTED}".`,
    );
  }

  // 2. Required frontmatter keys
  //    emergency_keywords + emergency_script are allowed to be empty together —
  //    semantically "this niche has no emergency scenarios" (e.g. arxon-sales web-chat).
  //    Consistency between the two is enforced in rule 7 below.
  const emergencyOptOut =
    Array.isArray(flat.emergency_keywords) &&
    (flat.emergency_keywords as YamlVal[]).length === 0;
  for (const k of REQUIRED_FRONTMATTER) {
    if (emergencyOptOut && (k === 'emergency_keywords' || k === 'emergency_script')) {
      continue;
    }
    if (flat[k] === undefined || flat[k] === null || flat[k] === '') {
      throw new Error(`[${niche}] Missing required frontmatter: "${k}".`);
    }
  }

  // 3. Required sections
  for (const k of REQUIRED_SECTIONS) {
    if (!sections[k] || sections[k].trim().length < 10) {
      throw new Error(
        `[${niche}] Missing or too-short section "${k}" in variables.md.`,
      );
    }
  }

  // 4. Primary language enum
  const lang = String(flat.primary_language);
  if (!['nb-NO', 'nn-NO', 'en-US'].includes(lang)) {
    throw new Error(`[${niche}] primary_language "${lang}" not in allowed enum.`);
  }

  // 5. max_qualification_questions 1..5
  const qq = Number(flat.max_qualification_questions);
  if (!Number.isInteger(qq) || qq < 1 || qq > 5) {
    throw new Error(
      `[${niche}] max_qualification_questions=${qq} must be integer in 1..5.`,
    );
  }

  // 6. Qualification bullet count == max_qualification_questions
  const bulletCount = (sections.qualification_questions_bulleted.match(/^\s*[-*]/gm) || [])
    .length;
  if (bulletCount !== qq) {
    warnings.push(
      `qualification_questions_bulleted has ${bulletCount} bullets but max_qualification_questions=${qq}.`,
    );
  }

  // 7. Emergency consistency
  //    Either both populated, or both empty (niche has no emergency scenarios).
  const ek = flat.emergency_keywords;
  if (!Array.isArray(ek) && typeof ek !== 'string') {
    throw new Error(`[${niche}] emergency_keywords must be array or string.`);
  }
  const keywords = Array.isArray(ek)
    ? (ek as string[]).filter((s) => String(s).trim().length > 0)
    : String(ek).split(',').map((s) => s.trim()).filter(Boolean);
  const scriptPresent = String(flat.emergency_script ?? '').trim().length > 0;
  if (keywords.length > 0 && !scriptPresent) {
    throw new Error(
      `[${niche}] emergency_keywords non-empty but emergency_script empty. Both must be set together.`,
    );
  }
  if (keywords.length === 0 && scriptPresent) {
    throw new Error(
      `[${niche}] emergency_script set but emergency_keywords empty. Both must be set together.`,
    );
  }

  // 8. enabled_tools baseline
  //    endCall + create_ticket are the universal baseline. transferCall is
  //    required for phone-context niches but optional for web-chat (arxon-sales).
  const enabled = flat.enabled_tools;
  if (!Array.isArray(enabled)) {
    throw new Error(`[${niche}] enabled_tools must be array.`);
  }
  const enabledSet = new Set(enabled.map(String));
  for (const must of ['endCall', 'create_ticket']) {
    if (!enabledSet.has(must)) {
      throw new Error(`[${niche}] enabled_tools missing required "${must}".`);
    }
  }
  if (!enabledSet.has('transferCall')) {
    warnings.push(
      'transferCall not in enabled_tools — acceptable for web-context niches, confirm intentional.',
    );
  }

  // 9. firstMessage disclosure (G3) — read from vapi-config.json, not variables.md
  if (firstMessage !== null) {
    const fm = firstMessage.toLowerCase();
    if (!fm.includes('ai') && !fm.includes('kunstig')) {
      throw new Error(
        `[${niche}] firstMessage missing AI disclosure (G3). Must contain "AI" or "kunstig".`,
      );
    }
  }

  // 10. pii_extra_blocklist must exist but empty-string OK
  if (flat.pii_extra_blocklist === undefined) {
    throw new Error(`[${niche}] pii_extra_blocklist must be defined (empty string OK).`);
  }

  return warnings;
}

// ----------------------------------------------------------------------
// Renderer
// ----------------------------------------------------------------------

const VAR_TOKEN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

function render(template: string, vars: Vars, niche: Niche): string {
  const unresolved: string[] = [];
  const out = template.replace(VAR_TOKEN, (_match, key: string) => {
    if (!(key in vars)) {
      unresolved.push(key);
      return `{{UNRESOLVED:${key}}}`;
    }
    return formatForPrompt(vars[key], key);
  });
  if (unresolved.length > 0) {
    const uniq = [...new Set(unresolved)];
    throw new Error(
      `[${niche}] Unresolved template variables: ${uniq.join(', ')}. ` +
        `Add them to variables.md YAML or prosa sections.`,
    );
  }
  return out;
}

// ----------------------------------------------------------------------
// Per-niche pipeline
// ----------------------------------------------------------------------

function resolveNiche(niche: Niche, skeletonTemplate: string): ResolveResult {
  const nicheDir = path.join(VA_ROOT, niche);
  const varsPath = path.join(nicheDir, 'variables.md');
  const configPath = path.join(nicheDir, 'vapi-config.json');

  if (!fs.existsSync(varsPath)) {
    throw new Error(`[${niche}] variables.md not found at ${varsPath}`);
  }
  if (!fs.existsSync(configPath)) {
    throw new Error(`[${niche}] vapi-config.json not found at ${configPath}`);
  }

  const varsMd = fs.readFileSync(varsPath, 'utf8');
  const rawConfig = fs.readFileSync(configPath, 'utf8');
  const config = JSON.parse(rawConfig) as Record<string, unknown>;

  const yamlBlock = extractYamlBlock(varsMd, `${niche}/variables.md`);
  const flat = (yaml.load(yamlBlock) ?? {}) as Vars;
  const sections = extractSections(varsMd);
  const toolsList = extractToolsList(varsMd);

  if (!toolsList) {
    throw new Error(
      `[${niche}] "Tools-liste som rendres i prompten" block missing from variables.md.`,
    );
  }

  // Pull firstMessage from vapi-config for G3 validation
  const firstMessage =
    typeof config.firstMessage === 'string' ? config.firstMessage : null;

  const warnings = validate(flat, sections, firstMessage, niche);

  // Emergency opt-out placeholders: when a niche has no emergency scenarios
  // (arxon-sales web-chat), render stable stubs so the prompt stays coherent.
  const emergencyOptOut =
    Array.isArray(flat.emergency_keywords) &&
    (flat.emergency_keywords as YamlVal[]).filter(
      (x) => String(x).trim().length > 0,
    ).length === 0;

  const emergencyKeywordsRendered = emergencyOptOut
    ? '(ingen — dette nichet har ingen akutt-scenarier)'
    : Array.isArray(flat.emergency_keywords)
      ? (flat.emergency_keywords as string[]).join(', ')
      : flat.emergency_keywords;

  const emergencyScriptRendered = emergencyOptOut
    ? 'Ikke relevant for dette nichet — følg vanlig eskalering til e-post/ticket.'
    : flat.emergency_script;

  // Assemble full variable map consumed by the template
  const renderVars: Vars = {
    ...flat,
    business_one_paragraph_summary: sections.business_one_paragraph_summary,
    in_scope_bullets: sections.in_scope_bullets,
    out_of_scope_bullets: sections.out_of_scope_bullets,
    qualification_questions_bulleted: sections.qualification_questions_bulleted,
    niche_specific_rules: sections.niche_specific_rules,
    tools_list_with_when_to_use: toolsList,
    emergency_keywords: emergencyKeywordsRendered,
    emergency_script: emergencyScriptRendered,
    // out_of_scope_advice_bullets comes from YAML as a string (| pipe) — leave as-is
    out_of_scope_advice_bullets:
      flat.out_of_scope_advice_bullets ??
      sections.out_of_scope_advice_bullets ??
      '- (no extra out-of-scope advice configured)',
  };

  const renderedPrompt = render(skeletonTemplate, renderVars, niche);

  // Patch config: inline the prompt; keep _systemPromptSource for traceability.
  const model = (config.model ?? {}) as Record<string, unknown>;
  const resolvedConfig: Record<string, unknown> = {
    ...config,
    _meta: {
      ...(config._meta as Record<string, unknown> | undefined),
      resolved_at: new Date().toISOString(),
      resolver_script: 'scripts/resolve-variables.ts',
    },
    model: {
      ...model,
      systemPrompt: renderedPrompt,
      _systemPromptSource: {
        template: '../shared/skeleton-system-prompt.md',
        variables_file: './variables.md',
        resolver: 'scripts/resolve-variables.ts',
        resolved: true,
      },
    },
  };

  const promptPath = path.join(nicheDir, 'resolved-system-prompt.txt');
  const resolvedConfigPath = path.join(nicheDir, 'vapi-config.resolved.json');

  fs.writeFileSync(promptPath, renderedPrompt + '\n', 'utf8');
  fs.writeFileSync(resolvedConfigPath, JSON.stringify(resolvedConfig, null, 2) + '\n', 'utf8');

  return { niche, renderedPrompt, resolvedConfigPath, promptPath, warnings };
}

// ----------------------------------------------------------------------
// CLI
// ----------------------------------------------------------------------

function parseArgs(argv: string[]): { niches: Niche[]; checkOnly: boolean } {
  let niches: Niche[] = [...NICHES];
  let checkOnly = false;
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') {
      checkOnly = true;
    } else if (a === '--niche') {
      const n = argv[++i];
      if (!NICHES.includes(n as Niche)) {
        throw new Error(`Unknown niche "${n}". Allowed: ${NICHES.join(', ')}.`);
      }
      niches = [n as Niche];
    } else if (a === '--help' || a === '-h') {
      process.stdout.write(
        'Usage: node --experimental-strip-types scripts/resolve-variables.ts [--niche <name>] [--check]\n',
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown argument "${a}".`);
    }
  }
  return { niches, checkOnly };
}

function main() {
  const { niches, checkOnly } = parseArgs(process.argv);

  const skeletonPath = path.join(SHARED, 'skeleton-system-prompt.md');
  if (!fs.existsSync(skeletonPath)) {
    console.error(`[FATAL] skeleton-system-prompt.md not found at ${skeletonPath}`);
    process.exit(1);
  }
  const skeletonMd = fs.readFileSync(skeletonPath, 'utf8');
  const skeletonTemplate = extractSkeletonTemplate(skeletonMd);

  let failures = 0;
  const results: ResolveResult[] = [];

  for (const niche of niches) {
    try {
      const r = resolveNiche(niche, skeletonTemplate);
      results.push(r);
      const snippet = r.renderedPrompt.slice(0, 60).replace(/\s+/g, ' ');
      console.log(
        `✓ ${niche.padEnd(18)} ${r.renderedPrompt.length.toString().padStart(5)} chars  ` +
          `→ ${path.relative(ROOT, r.resolvedConfigPath)}`,
      );
      console.log(`   prompt[0..60]: "${snippet}…"`);
      for (const w of r.warnings) console.log(`   ⚠ ${w}`);
    } catch (err) {
      failures++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`✗ ${niche}: ${msg}`);
    }
  }

  if (checkOnly) {
    // Remove the written files in check mode so we don't leave artefacts
    for (const r of results) {
      fs.rmSync(r.resolvedConfigPath, { force: true });
      fs.rmSync(r.promptPath, { force: true });
    }
    console.log(`\n[--check] ${results.length} niche(s) validated, ${failures} failure(s).`);
  } else {
    console.log(
      `\nDone. ${results.length}/${niches.length} niche(s) resolved, ${failures} failure(s).`,
    );
  }

  process.exit(failures > 0 ? 1 : 0);
}

main();
