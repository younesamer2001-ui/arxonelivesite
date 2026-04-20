import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, phone, message } = await req.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Navn, e-post og melding er påkrevd.' },
        { status: 400 }
      )
    }

    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Arxon Kontaktskjema <onboarding@resend.dev>',
      to: ['kontakt@arxon.no'],
      replyTo: email,
      subject: `Ny henvendelse fra ${name}${company ? ` (${company})` : ''}`,
      html: `
        <h2>Ny henvendelse fra kontaktskjemaet</h2>
        <p><strong>Navn:</strong> ${name}</p>
        <p><strong>E-post:</strong> ${email}</p>
        ${company ? `<p><strong>Bedrift:</strong> ${company}</p>` : ''}
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
        <p><strong>Melding:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke sende meldingen. Prøv igjen senere.' },
      { status: 500 }
    )
  }
}
