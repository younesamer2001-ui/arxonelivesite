import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type Plan = "lite" | "pro" | "scale";
type Cycle = "monthly" | "yearly";

function priceIdFor(plan: Plan, cycle: Cycle): string | undefined {
  const map: Record<Plan, { monthly?: string; yearly?: string }> = {
    lite: {
      monthly: process.env.STRIPE_PRICE_LITE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_LITE_YEARLY,
    },
    pro: {
      monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
      yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    },
    scale: {
      monthly: process.env.STRIPE_PRICE_SCALE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_SCALE_YEARLY,
    },
  };
  return map[plan][cycle];
}

/**
 * Setup-fee-policy per pakke:
 *  - Lite + Pro:  månedlig = full setup, årlig = GRATIS oppsett (ingen line-item)
 *  - Scale:       månedlig = 49 990 setup, årlig = 24 990 setup (50 % rabatt) — alltid med
 */
function setupPriceIdFor(plan: Plan, cycle: Cycle): string | undefined | null {
  if (plan === "lite") {
    if (cycle === "yearly") return null; // gratis oppsett
    return process.env.STRIPE_PRICE_LITE_SETUP;
  }
  if (plan === "pro") {
    if (cycle === "yearly") return null; // gratis oppsett
    return process.env.STRIPE_PRICE_PRO_SETUP;
  }
  // scale: alltid setup, men beløp avhenger av syklus
  return cycle === "yearly"
    ? process.env.STRIPE_PRICE_SCALE_SETUP_YEARLY
    : process.env.STRIPE_PRICE_SCALE_SETUP_MONTHLY;
}

function isValidPlan(p: string): p is Plan {
  return p === "lite" || p === "pro" || p === "scale";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const planRaw = (body.plan ?? "").toString().toLowerCase();
    const cycle = (body.cycle ?? "monthly").toString().toLowerCase() as Cycle;

    if (!isValidPlan(planRaw)) {
      return NextResponse.json(
        { error: "Ugyldig plan. Bruk lite, pro eller scale." },
        { status: 400 }
      );
    }
    const plan: Plan = planRaw;

    if (cycle !== "monthly" && cycle !== "yearly") {
      return NextResponse.json({ error: "Ugyldig syklus." }, { status: 400 });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      console.error("STRIPE_SECRET_KEY mangler");
      return NextResponse.json(
        { error: "Betaling er ikke konfigurert." },
        { status: 500 }
      );
    }

    const subPriceId = priceIdFor(plan, cycle);
    if (!subPriceId) {
      console.error("Subscription price-ID mangler for", plan, cycle);
      return NextResponse.json(
        { error: "Betaling er ikke konfigurert." },
        { status: 500 }
      );
    }

    // setupPriceId kan være null = bevisst gratis (Lite/Pro årlig)
    const setupPriceId = setupPriceIdFor(plan, cycle);
    if (setupPriceId === undefined) {
      console.error("Setup price-ID mangler for", plan, cycle);
      return NextResponse.json(
        { error: "Betaling er ikke konfigurert." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secret);

    const lineItems: NonNullable<
      Stripe.Checkout.SessionCreateParams["line_items"]
    > = [{ price: subPriceId, quantity: 1 }];
    if (setupPriceId) {
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
      return NextResponse.json(
        { error: "Kunne ikke starte betaling." },
        { status: 500 }
      );
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
