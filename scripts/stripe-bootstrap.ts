/**
 * Stripe bootstrap — oppretter Arxon-products og priser én gang.
 *
 * Kjør:   npx tsx scripts/stripe-bootstrap.ts
 *
 * Leser STRIPE_SECRET_KEY fra .env.local, oppretter:
 *   - Product: "Arxon Lite"   + 2 recurring priser (mnd/år) + 1 one-time setup
 *   - Product: "Arxon Pro"    + 2 recurring priser (mnd/år) + 1 one-time setup
 *   - Product: "Arxon Scale"  + 2 recurring priser (mnd/år) + 2 one-time setups
 *                                                            (mnd: 49 990, årlig: 24 990)
 *
 * Enterprise håndteres alltid manuelt — ingen Stripe-product for det.
 *
 * Idempotent via product.metadata.arxon_key — kjører du scriptet på nytt,
 * gjenbrukes eksisterende products og priser legges bare til hvis de mangler.
 *
 * Skriver alle price-ID-ene tilbake til .env.local automatisk.
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
    envKey: "STRIPE_PRODUCT_LITE",
    arxon_key: "arxon_lite",
    name: "Arxon Lite",
    description:
      "AI-resepsjonist 24/7 på flytende norsk. Booker timer i Cal.com, sender SMS-bekreftelser og påminnelser, e-post-varsler og ukentlig sammendrag. 300 min telefon + 200 SMS / mnd.",
    prices: [
      {
        envKey: "STRIPE_PRICE_LITE_MONTHLY",
        nickname: "Lite — månedlig",
        unit_amount: 990_00,
        recurring: { interval: "month" },
        metadata: { plan: "lite", cycle: "monthly" },
      },
      {
        envKey: "STRIPE_PRICE_LITE_YEARLY",
        nickname: "Lite — årlig",
        unit_amount: 9_990_00,
        recurring: { interval: "year" },
        metadata: { plan: "lite", cycle: "yearly" },
      },
      {
        envKey: "STRIPE_PRICE_LITE_SETUP",
        nickname: "Lite — engangs oppsett",
        unit_amount: 4_990_00,
        metadata: { plan: "lite", kind: "setup" },
      },
    ],
  },
  {
    envKey: "STRIPE_PRODUCT_PRO",
    arxon_key: "arxon_pro",
    name: "Arxon Pro",
    description:
      "Sanntids-dashboard, integrasjoner (Google Calendar, Outlook, HubSpot, Timely), branded web-chat, multi-agent (telefon/chat/SMS), dedikert kontaktperson. 1 200 min + 1 000 SMS / mnd.",
    prices: [
      {
        envKey: "STRIPE_PRICE_PRO_MONTHLY",
        nickname: "Pro — månedlig",
        unit_amount: 2990_00,
        recurring: { interval: "month" },
        metadata: { plan: "pro", cycle: "monthly" },
      },
      {
        envKey: "STRIPE_PRICE_PRO_YEARLY",
        nickname: "Pro — årlig",
        unit_amount: 28_704_00,
        recurring: { interval: "year" },
        metadata: { plan: "pro", cycle: "yearly" },
      },
      {
        envKey: "STRIPE_PRICE_PRO_SETUP",
        nickname: "Pro — engangs oppsett",
        unit_amount: 9_990_00,
        metadata: { plan: "pro", kind: "setup" },
      },
    ],
  },
  {
    envKey: "STRIPE_PRODUCT_SCALE",
    arxon_key: "arxon_scale",
    name: "Arxon Scale",
    description:
      "Hele den digitale stacken: branded Next.js-nettside med drift, aktiv SEO, bransje-tilpasset AI-modell, 3 custom n8n-automatiseringer, 1 nisje-solutions-pakke. 2 500 min + ubegrenset SMS, multi-agent (5), opptil 3 lokasjoner.",
    prices: [
      {
        envKey: "STRIPE_PRICE_SCALE_MONTHLY",
        nickname: "Scale — månedlig",
        unit_amount: 7990_00,
        recurring: { interval: "month" },
        metadata: { plan: "scale", cycle: "monthly" },
      },
      {
        envKey: "STRIPE_PRICE_SCALE_YEARLY",
        nickname: "Scale — årlig",
        unit_amount: 76_704_00,
        recurring: { interval: "year" },
        metadata: { plan: "scale", cycle: "yearly" },
      },
      {
        envKey: "STRIPE_PRICE_SCALE_SETUP_MONTHLY",
        nickname: "Scale — engangs oppsett (månedlig plan)",
        unit_amount: 49_990_00,
        metadata: { plan: "scale", kind: "setup", cycle: "monthly" },
      },
      {
        envKey: "STRIPE_PRICE_SCALE_SETUP_YEARLY",
        nickname: "Scale — engangs oppsett (årlig plan, 50 % rabatt)",
        unit_amount: 24_990_00,
        metadata: { plan: "scale", kind: "setup", cycle: "yearly" },
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
