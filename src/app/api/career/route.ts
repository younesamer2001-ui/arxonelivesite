import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin, hasServiceRole } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name ?? '').toString().trim();
    const email = (body.email ?? '').toString().trim();
    const phone = (body.phone ?? '').toString().trim() || null;
    const role = (body.role ?? '').toString().trim();
    const motivation = (body.motivation ?? '').toString().trim();
    const videoUrl = (body.videoUrl ?? body.video_url ?? '').toString().trim() || null;

    if (!name || !email || !role || !motivation) {
      return NextResponse.json({ error: 'Navn, e-post, rolle og motivasjon er påkrevd.' }, { status: 400 });
    }

    const { error: dbError } = await supabaseAdmin
      .from('job_applications')
      .insert({ name, email, phone, role, motivation, video_url: videoUrl, status: 'new' });

    if (dbError) {
      console.error(`[career] insert failed code=${dbError.code} message=${dbError.message} hint=${dbError.hint ?? ''} serviceRole=${hasServiceRole}`);
      return NextResponse.json({ error: 'Kunne ikke lagre søknaden.' }, { status: 500 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'Arxon Karriere <onboarding@resend.dev>',
          to: ['kontakt@arxon.no'],
          replyTo: email,
          subject: `Ny jobbsøknad fra ${name} — ${role}`,
          html: `<h2>Ny jobbsøknad</h2>
<p><strong>Navn:</strong> ${escapeHtml(name)}</p>
<p><strong>E-post:</strong> ${escapeHtml(email)}</p>
${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ''}
<p><strong>Rolle:</strong> ${escapeHtml(role)}</p>
<p><strong>Motivasjon:</strong></p>
<p>${escapeHtml(motivation).replace(/\n/g, '<br>')}</p>
<hr /><p style="color:#666;font-size:12px;">Søknaden er også lagret i dashboardet.</p>`,
        });
      } catch (e) {
        console.warn('[career] e-postvarsel feilet:', (e as Error).message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[career] unhandled:', (error as Error).message);
    return NextResponse.json({ error: 'Noe gikk galt.' }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
