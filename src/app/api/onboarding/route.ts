import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      company = "",
      website = "",
      about = "",
      contactName = "",
      contactEmail = "",
      contactPhone = "",
      sessionId = "",
    } = body as Record<string, string>;

    if (!company.trim() || !about.trim()) {
      return NextResponse.json(
        { error: "Bedriftsnavn og beskrivelse er påkrevd." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY mangler");
      return NextResponse.json(
        { error: "Tjenesten er ikke konfigurert." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Arxon Onboarding <onboarding@resend.dev>",
      to: ["kontakt@arxon.no"],
      replyTo: contactEmail || undefined,
      subject: `Ny onboarding: ${company}`,
      html: `
        <h2>Ny onboarding-forespørsel</h2>
        <p><strong>Bedrift:</strong> ${escapeHtml(company)}</p>
        ${website ? `<p><strong>Nettside:</strong> <a href="${escapeHtml(website)}">${escapeHtml(website)}</a></p>` : ""}
        ${contactName ? `<p><strong>Kontaktperson:</strong> ${escapeHtml(contactName)}</p>` : ""}
        ${contactEmail ? `<p><strong>E-post:</strong> ${escapeHtml(contactEmail)}</p>` : ""}
        ${contactPhone ? `<p><strong>Telefon:</strong> ${escapeHtml(contactPhone)}</p>` : ""}
        <p><strong>Om bedriften:</strong></p>
        <p>${escapeHtml(about).replace(/\n/g, "<br>")}</p>
        ${sessionId ? `<hr><p style="color:#666;font-size:12px">Stripe session: ${escapeHtml(sessionId)}</p>` : ""}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "ukjent feil";
    console.error("Onboarding form error:", msg);
    return NextResponse.json(
      { error: "Kunne ikke sende skjemaet. Prøv igjen." },
      { status: 500 }
    );
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
