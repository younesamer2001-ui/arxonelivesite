import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type Plan = "starter" | "pro";
type Cycle = "monthly" | "yearly";

function priceIdFor(plan: Plan, cycle: Cycle): string | undefined {
  if (plan === "starter") {
    return cycle === "monthly"
      ? process.env.STRIPE_PRICE_STARTER_MONTHLY
      : process.env.STRIPE_PRICE_STARTER_YEARLY;
  }
  return cycle === "monthly"
    ? process.env.STRIPE_PRICE_PRO_MONTHLY
    : process.env.STRIPE_PRICE_PRO_YEARLY;
}

function setupPriceIdFor(plan: Plan): string | undefined {
  return plan === "starter"
    ? process.env.STRIPE_PRICE_STARTER_SETUP
    : process.env.STRIPE_PRICE_PRO_SETUP;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = (body.plan ?? "").toString().toLowerCase() as Plan;
    const cycle = (body.cycle ?? "monthly").toString().toLowerCase() as Cycle;

    if (plan !== "starter" && plan !== "pro") {
      return NextResponse.json({ error: "Ugyldig plan." }, { status: 400 });
    }
    if (cycle !== "monthly" && cycle !== "yearly") {
      return NextResponse.json({ error: "Ugyldig syklus." }, { status: 400 });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      console.error("STRIPE_SECRET_KEY mangler");
      return NextResponse.json({ error: "Betaling er ikke konfigurert." }, { status: 500 });
    }

    const subPriceId = priceIdFor(plan, cycle);
    const setupPriceId = setupPriceIdFor(plan);
    if (!subPriceId || !setupPriceId) {
      console.error("Price-ID mangler for", plan, cycle);
      return NextResponse.json({ error: "Betaling er ikke konfigurert." }, { status: 500 });
    }

    const stripe = new Stripe(secret);

    // Årlig = gratis oppsett (matcher UI-badge "Gratis oppsett ✓").
    // Månedlig = subscription + one-time setup i samme Checkout.
    const lineItems: NonNullable<Stripe.Checkout.SessionCreateParams["line_items"]> = [
      { price: subPriceId, quantity: 1 },
    ];
    if (cycle === "monthly") {
      lineItems.push({ price: setupPriceId, quantity: 1 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://arxon.no";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      locale: "nb",
      billing_address_collection: "required",
      allow_promotion_codes: true,
      phone_number_collection: { enabled: true },
      subscription_data: {
        metadata: { plan, cycle },
      },
      metadata: { plan, cycle },
      success_url: `${origin}/takk?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#priser`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Kunne ikke starte betaling." }, { status: 500 });
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const anyErr = err as {
      message?: string;
      type?: string;
      code?: string;
      statusCode?: number;
      raw?: { message?: string; type?: string; code?: string };
    };
    const msg = anyErr?.message ?? "ukjent feil";
    const type = anyErr?.type ?? anyErr?.raw?.type ?? "unknown";
    const code = anyErr?.code ?? anyErr?.raw?.code ?? "unknown";
    // Logg med tydelige markører så hele teksten er søkbar i Vercel runtime logs.
    console.error(
      `STRIPE_FAIL type=${type} code=${code} status=${anyErr?.statusCode ?? "?"} msg=${msg}`
    );
    console.error("STRIPE_FAIL_RAW", JSON.stringify(anyErr?.raw ?? {}));
    return NextResponse.json(
      { error: "Kunne ikke starte betaling.", debug: { type, code, msg } },
      { status: 500 }
    );
  }
}
