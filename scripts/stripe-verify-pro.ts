/**
 * Verify Stripe Pro-priser — leser direkte fra API og printer beløp.
 *
 * Kjør:  npx tsx scripts/stripe-verify-pro.ts
 */

import Stripe from "stripe";
import { promises as fs } from "node:fs";
import path from "node:path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

async function loadEnv(): Promise<Record<string, string>> {
  const raw = await fs.readFile(ENV_PATH, "utf8").catch(() => "");
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^"|"$/g, "");
  }
  return out;
}

async function main() {
  const env = await loadEnv();
  const key = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("❌ STRIPE_SECRET_KEY mangler");
    process.exit(1);
  }
  const productId = env.STRIPE_PRODUCT_PRO;
  if (!productId) {
    console.error("❌ STRIPE_PRODUCT_PRO mangler i .env.local");
    process.exit(1);
  }

  const mode = key.includes("_live_") ? "LIVE" : "TEST";
  console.log(`\nStripe (${mode} mode) — Pro-produkt ${productId}\n`);

  const stripe = new Stripe(key);
  const product = await stripe.products.retrieve(productId);
  console.log(`Product: ${product.name} (${product.id})`);
  console.log(`Active:  ${product.active}\n`);

  console.log("Aktive priser på dette produktet:");
  for await (const p of stripe.prices.list({ product: productId, active: true, limit: 100 })) {
    const amount = p.unit_amount ? `${(p.unit_amount / 100).toLocaleString("nb-NO")} kr` : "—";
    const interval = p.recurring?.interval ? `/${p.recurring.interval}` : " (engangs)";
    console.log(`  ${p.id}  ${p.nickname ?? "(ingen nickname)"}  ${amount}${interval}`);
  }
}

main().catch((err) => {
  console.error("\n❌ Feil:", err?.message || err);
  process.exit(1);
});
