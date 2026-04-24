import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Diagnostic GET — trigger a test insert and return full error. Remove after debug.
export async function GET() {
  const testRow = {
    name: 'SANDBOX_DIAG',
    email: 'diag@sandbox.test',
    company: null,
    phone: null,
    message: 'diagnostic ping from GET handler',
    status: 'new',
  };
  const { error, data } = await supabaseAdmin
    .from('contact_submissions')
    .insert(testRow)
    .select('id')
    .single();
  return NextResponse.json({
    ok: !error,
    serviceRole: hasServiceRole,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '(unset, using hardcoded)',
    hasAnonEnv: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    error: error ? { code: error.code, message: error.message, details: error.details, hint: error.hint } : null,
    inserted: data ?? null,
  }, { status: error ? 500 : 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name ?? '').toString().trim();
    const email = (body.email ?? '').toString().trim();
    const company = (body.company ?? '').toString().trim() || null;
    const phone = (body.phone ?? '').toString().trim() || null;
    const message = (body.message ?? '').toString().trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Navn, e-post og melding er påkrevd.' }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({ name, email, company, phone, message, status: 'new' });

    if (dbError) {
      const isMissingTable = dbError.code === '42P01' || /relation.*does not exist/i.test(dbError.message || '');
      if (isMissingTable) {
        console.warn('[contact] contact_submissions missing — falling back to leads');
        const { error: leadErr } = await supabaseAdmin.from('leads').upsert({
          email,
          full_name: name,
          phone_number: phone,
          source: 'contact_form',
          notes: `${message}` + (company ? `\n\nBedrift: ${company}` : ''),
        }, { onConflict: 'email' });
        if (leadErr) {
          console.error(`[contact] leads fallback failed code=${leadErr.code} message=${leadErr.message}`);
          return NextResponse.json({ error: 'Kunne ikke lagre meldingen.' }, { status: 500 });
        }
      } else {
        console.error(`CONTACT_ERR code=${dbError.code} sr=${hasServiceRole} msg=${(dbError.message || '').slice(0, 80)}`);
        console.error(`CONTACT_ERR details=${(dbError.details || '').slice(0, 120)}`);
        console.error(`CONTACT_ERR hint=${(dbError.hint || '').slice(0, 120)}`);
        return NextResponse.json({ error: 'Kunne ikke lagre meldingen.', debug: { code: dbError.code, message: dbError.message, serviceRole: hasServiceRole } }, { status: 500 });
      }
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'Arxon Kontaktskjema <onboarding@resend.dev>',
          to: ['kontakt@arxon.no'],
          replyTo: email,
          subject: `Ny henvendelse fra ${name}${company ? ` (${company})` : ''}`,
          html: `<h2>Ny henvendelse fra kontaktskjemaet</h2>
<p><strong>Navn:</strong> ${escapeHtml(name)}</p>
<p><strong>E-post:</strong> ${escapeHtml(email)}</p>
${company ? `<p><strong>Bedrift:</strong> ${escapeHtml(company)}</p>` : ''}
${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ''}
<p><strong>Melding:</strong></p>
<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
<hr /><p style="color:#666;font-size:12px;">Henvendelsen er også lagret i dashboardet.</p>`,
        });
      } catch (e) {
        console.warn('[contact] e-postvarsel feilet:', (e as Error).message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[contact] unhandled:', (error as Error).message);
    return NextResponse.json({ error: 'Kunne ikke sende meldingen.' }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
