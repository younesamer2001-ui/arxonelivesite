/**
 * Stripe bootstrap — oppretter Arxon-products og priser én gang.
 *
 * Kjør:   npx tsx scripts/stripe-bootstrap.ts
 *
 * Leser STRIPE_SECRET_KEY fra .env.local, oppretter:
 *   - Product: "Arxon Starter"   + 2 recurring priser (mnd/år) + 1 one-time setup
 *   - Product: "Arxon Pro"       + 2 recurring priser (mnd/år) + 1 one-time setup
 *
 * Idempotent via product.metadata.arxon_key — kjører du scriptet på nytt,
 * gjenbrukes eksisterende products og priser legges bare til hvis de mangler.
 *
 * Skriver de 6 price-ID-ene tilbake til .env.local automatisk.
 */

import Stripe from "stripe";
import { promises as fs } from "node:fs";
import path from "node:path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

type PriceDef = {
  envKey: string;
  nickname: string;
  unit_amount: number; // øre (NOK × 100)
  recurring?: Stripe.PriceCreateParams.Recurring;
  metadata: Record<string, string>;
};

type ProductDef = {
  envKey: string; // env var for product id
  arxon_key: string; // metadata idempotency key
  name: string;
  description: string;
  prices: PriceDef[];
};

const PLAN: ProductDef[] = [
  {
    envKey: "STRIPE_PRODUCT_STARTER",
    arxon_key: "arxon_starter",
    name: "Arxon Starter",
    description:
      "AI-resepsjonist 24/7, chatbot, workflows, SMS-bekreftelser, norsk språkstøtte, e-postsupport.",
    prices: [
      {
        envKey: "STRIPE_PRICE_STARTER_MONTHLY",
        nickname: "Starter — månedlig",
        unit_amount: 2990_00,
        recurring: { interval: "month" },
        metadata: { plan: "starter", cycle: "monthly" },
      },
      {
        envKey: "STRIPE_PRICE_STARTER_YEARLY",
        nickname: "Starter — årlig",
        unit_amount: 28_700_00,
        recurring: { interval: "year" },
        metadata: { plan: "starter", cycle: "yearly" },
      },
      {
        envKey: "STRIPE_PRICE_STARTER_SETUP",
        nickname: "Starter — engangs oppsett",
        unit_amount: 5_000_00,
        metadata: { plan: "starter", kind: "setup" },
      },
    ],
  },
  {
    envKey: "STRIPE_PRODUCT_PRO",
    arxon_key: "arxon_pro",
    name: "Arxon Pro",
    description:
      "Ubegrenset samtaler, sanntids-dashboard, samtaleanalyse, Google Reviews-automatikk, prioritert support, dedikert kontakt, CRM/kalender-integrasjoner.",
    prices: [
      {
        envKey: "STRIPE_PRICE_PRO_MONTHLY",
        nickname: "Pro — månedlig",
        unit_amount: 4990_00,
        recurring: { interval: "month" },
        metadata: { plan: "pro", cycle: "monthly" },
      },
      {
        envKey: "STRIPE_PRICE_PRO_YEARLY",
        nickname: "Pro — årlig",
        unit_amount: 47_900_00,
        recurring: { interval: "year" },
        metadata: { plan: "pro", cycle: "yearly" },
      },
      {
        envKey: "STRIPE_PRICE_PRO_SETUP",
        nickname: "Pro — engangs oppsett",
        unit_amount: 15_000_00,
        metadata: { plan: "pro", kind: "setup" },
      },
    ],
  },
];

async function loadEnvLocal(): Promise<Record<string, string>> {
  try {
    const raw = await fs.readFile(ENV_PATH, "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) out[m[1]] = m[2].replace(/^"|"$/g, "");
    }
    return out;
  } catch {
    return {};
  }
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
  const toAppend = Object.entries(updates).filter(([k]) => !seen.has(k));
  if (toAppend.length) {
    if (out.length && out[out.length - 1] !== "") out.push("");
    out.push("# --- Stripe (added by scripts/stripe-bootstrap.ts) ---");
    for (const [k, v] of toAppend) out.push(`${k}=${v}`);
    out.push("");
  }
  await fs.writeFile(ENV_PATH, out.join("\n"), "utf8");
}

async function findProductByKey(stripe: Stripe, arxon_key: string): Promise<Stripe.Product | null> {
  // Stripe has no direct metadata search on the products list endpoint,
  // so we iterate active products (should be few in the early-stage account).
  for await (const product of stripe.products.list({ limit: 100, active: true })) {
    if (product.metadata?.arxon_key === arxon_key) return product;
  }
  return null;
}

async function findPriceOnProduct(
  stripe: Stripe,
  productId: string,
  nickname: string,
): Promise<Stripe.Price | null> {
  for await (const price of stripe.prices.list({ product: productId, limit: 100, active: true })) {
    if (price.nickname === nickname) return price;
  }
  return null;
}

async function ensureProduct(stripe: Stripe, def: ProductDef): Promise<Stripe.Product> {
  const existing = await findProductByKey(stripe, def.arxon_key);
  if (existing) {
    console.log(`  ↺ product exists: ${def.name} (${existing.id})`);
    return existing;
  }
  const created = await stripe.products.create({
    name: def.name,
    description: def.description,
    metadata: { arxon_key: def.arxon_key },
  });
  console.log(`  + product created: ${def.name} (${created.id})`);
  return created;
}

async function ensurePrice(
  stripe: Stripe,
  product: Stripe.Product,
  p: PriceDef,
): Promise<Stripe.Price> {
  const existing = await findPriceOnProduct(stripe, product.id, p.nickname);
  if (existing) {
    console.log(`    ↺ price exists: ${p.nickname} (${existing.id})`);
    return existing;
  }
  const created = await stripe.prices.create({
    product: product.id,
    currency: "nok",
    unit_amount: p.unit_amount,
    nickname: p.nickname,
    recurring: p.recurring,
    metadata: p.metadata,
    tax_behavior: "exclusive",
  });
  console.log(`    + price created: ${p.nickname} (${created.id})`);
  return created;
}

async function main() {
  const env = await loadEnvLocal();
  const key = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error(
      "\n❌ STRIPE_SECRET_KEY mangler. Legg inn i .env.local:\n   STRIPE_SECRET_KEY=sk_test_... (eller sk_live_...)\n",
    );
    process.exit(1);
  }
  const mode = key.startsWith("sk_live_") ? "LIVE" : "TEST";
  console.log(`\nStripe bootstrap (${mode} mode)\n`);

  const stripe = new Stripe(key);

  const updates: Record<string, string> = {};
  for (const def of PLAN) {
    const product = await ensureProduct(stripe, def);
    updates[def.envKey] = product.id;
    for (const p of def.prices) {
      const price = await ensurePrice(stripe, product, p);
      updates[p.envKey] = price.id;
    }
  }

  await writeEnvUpdates(updates);
  console.log("\n✅ .env.local oppdatert med:");
  for (const [k, v] of Object.entries(updates)) console.log(`   ${k}=${v}`);
  console.log(
    "\nNeste steg: legg de samme variablene + STRIPE_SECRET_KEY inn i Vercel (Settings → Environment Variables) og redeploy.\n",
  );
}

main().catch((err) => {
  console.error("\n❌ Feil:", err?.message || err);
  process.exit(1);
});
