/**
 * Repair-script: Pro-produktet i Stripe ble opprettet med gamle priser
 * (4 990 mnd / 47 900 år / 15 000 setup). Vi vil ha 2 990 / 28 704 / 9 990.
 *
 * Stripe-priser er immutable — vi kan ikke endre beløpet. Løsning:
 *   1) Arkiver de tre gamle Pro-prisene
 *   2) Opprett tre nye med nye nicknames ("Pro v2 — …")
 *   3) Skriv de nye price-IDene til .env.local
 *
 * Idempotent: hvis "Pro v2"-prisene allerede finnes brukes de.
 *
 * Kjør:  npx tsx scripts/stripe-fix-pro-prices.ts
 */

import Stripe from "stripe";
import { promises as fs } from "node:fs";
import path from "node:path";

const ENV_PATH = path.join(process.cwd(), ".env.local");
const PRO_PRODUCT_ENV_KEY = "STRIPE_PRODUCT_PRO";

type NewPrice = {
  envKey: string;
  nickname: string; // ny nickname så de ikke kolliderer med gamle
  oldNickname: string; // gammel nickname som vi skal arkivere
  unit_amount: number;
  recurring?: Stripe.PriceCreateParams.Recurring;
  metadata: Record<string, string>;
};

const NEW_PRICES: NewPrice[] = [
  {
    envKey: "STRIPE_PRICE_PRO_MONTHLY",
    nickname: "Pro v2 — månedlig",
    oldNickname: "Pro — månedlig",
    unit_amount: 2990_00,
    recurring: { interval: "month" },
    metadata: { plan: "pro", cycle: "monthly", version: "v2" },
  },
  {
    envKey: "STRIPE_PRICE_PRO_YEARLY",
    nickname: "Pro v2 — årlig",
    oldNickname: "Pro — årlig",
    unit_amount: 28_704_00,
    recurring: { interval: "year" },
    metadata: { plan: "pro", cycle: "yearly", version: "v2" },
  },
  {
    envKey: "STRIPE_PRICE_PRO_SETUP",
    nickname: "Pro v2 — engangs oppsett",
    oldNickname: "Pro — engangs oppsett",
    unit_amount: 9_990_00,
    metadata: { plan: "pro", kind: "setup", version: "v2" },
  },
];

async function loadEnvLocal(): Promise<Record<string, string>> {
  const raw = await fs.readFile(ENV_PATH, "utf8").catch(() => "");
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return out;
}

async function writeEnvUpdates(updates: Record<string, string>): Promise<void> {
  let raw = "";
  try {
    raw = await fs.readFile(ENV_PATH, "utf8");
  } catch {
    raw = "";
  }
  const lines = raw.split("\n");
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=/);
    if (m && m[1] in updates) {
      out.push(`${m[1]}=${updates[m[1]]}`);
      seen.add(m[1]);
    } else {
      out.push(line);
    }
  }
  for (const [k, v] of Object.entries(updates)) {
    if (!seen.has(k)) out.push(`${k}=${v}`);
  }
  await fs.writeFile(ENV_PATH, out.join("\n"), "utf8");
}

async function findPriceByNickname(
  stripe: Stripe,
  productId: string,
  nickname: string,
  activeOnly = true
): Promise<Stripe.Price | null> {
  for await (const p of stripe.prices.list({
    product: productId,
    limit: 100,
    active: activeOnly,
  })) {
    if (p.nickname === nickname) return p;
  }
  return null;
}

async function archivePriceIfActive(
  stripe: Stripe,
  productId: string,
  nickname: string
): Promise<string | null> {
  const existing = await findPriceByNickname(stripe, productId, nickname, true);
  if (!existing) return null;
  await stripe.prices.update(existing.id, { active: false });
  console.log(`  ✓ archived OLD price: ${nickname} (${existing.id}, beløp ${existing.unit_amount! / 100} kr)`);
  return existing.id;
}

async function ensureNewPrice(
  stripe: Stripe,
  productId: string,
  spec: NewPrice
): Promise<Stripe.Price> {
  // Sjekk om "v2"-prisen allerede er opprettet (idempotent re-run)
  const existing = await findPriceByNickname(stripe, productId, spec.nickname, true);
  if (existing) {
    console.log(`  ↺ NEW price already exists: ${spec.nickname} (${existing.id})`);
    return existing;
  }
  const created = await stripe.prices.create({
    product: productId,
    currency: "nok",
    unit_amount: spec.unit_amount,
    nickname: spec.nickname,
    recurring: spec.recurring,
    metadata: spec.metadata,
    tax_behavior: "exclusive",
  });
  console.log(`  + NEW price created: ${spec.nickname} (${created.id}, beløp ${spec.unit_amount / 100} kr)`);
  return created;
}

async function main() {
  const env = await loadEnvLocal();
  const key = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("\n❌ STRIPE_SECRET_KEY mangler i .env.local\n");
    process.exit(1);
  }
  const productId = env[PRO_PRODUCT_ENV_KEY];
  if (!productId) {
    console.error(`\n❌ ${PRO_PRODUCT_ENV_KEY} mangler i .env.local — kjør stripe-bootstrap først\n`);
    process.exit(1);
  }

  const mode = key.includes("_live_") ? "LIVE" : "TEST";
  console.log(`\nStripe Pro-pris fix (${mode} mode) — produkt ${productId}\n`);

  const stripe = new Stripe(key);

  // 1) Arkiver gamle priser
  console.log("Step 1: Arkiverer gamle Pro-priser…");
  for (const spec of NEW_PRICES) {
    await archivePriceIfActive(stripe, productId, spec.oldNickname);
  }

  // 2) Opprett nye priser
  console.log("\nStep 2: Oppretter nye Pro-priser…");
  const updates: Record<string, string> = {};
  for (const spec of NEW_PRICES) {
    const price = await ensureNewPrice(stripe, productId, spec);
    updates[spec.envKey] = price.id;
  }

  // 3) Oppdater .env.local
  await writeEnvUpdates(updates);
  console.log("\n✅ .env.local oppdatert med nye Pro-price-IDer:");
  for (const [k, v] of Object.entries(updates)) console.log(`   ${k}=${v}`);
  console.log("\nNeste steg: oppdater de samme variablene i Vercel (Settings → Environment Variables) og redeploy.\n");
}

main().catch((err) => {
  console.error("\n❌ Feil:", err?.message || err);
  process.exit(1);
});
