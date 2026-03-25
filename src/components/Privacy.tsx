'use client';

import { motion } from 'framer-motion';

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">

      <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">
          Personvernerklæring
        </h1>
        <p className="text-sm text-white/40 mb-16">Sist oppdatert: 25. mars 2026</p>
      </motion.div>

      {[
        {
          title: '1. Behandlingsansvarlig',
          text: 'Arxon, organisasjonsnummer under registrering, ved Younes Amer, er behandlingsansvarlig for personopplysninger som samles inn via arxon.no og våre tjenester. Kontakt: younes@arxon.no.',
        },
        {
          title: '2. Hvilke opplysninger vi samler inn',
          text: 'Vi samler inn opplysninger du gir oss direkte: navn, e-postadresse, telefonnummer og bedriftsnavn via kontaktskjema og konsultasjonsbookinger. Vi samler også inn tekniske data som IP-adresse, nettlesertype og sidevisninger via anonymisert analyse.',
        },
        {
          title: '3. Formål og rettslig grunnlag',
          text: 'Kontaktinformasjon behandles for å levere våre tjenester (avtale, GDPR art. 6(1)(b)), svare på henvendelser (berettiget interesse, art. 6(1)(f)), og sende relevant informasjon om våre tjenester (samtykke, art. 6(1)(a)). Anonymisert analyse brukes for å forbedre nettsiden (berettiget interesse).',
        },
        {
          title: '4. AI-tjenester og kundedata',
          text: 'Når vi leverer AI-løsninger (resepsjonist, chatbot, automasjon) for din bedrift, behandler vi personopplysninger på vegne av deg som kunde. I dette tilfellet er du behandlingsansvarlig og Arxon er databehandler. En egen databehandleravtale (DPA) regulerer dette forholdet, inkludert sikkerhetstiltak, underleverandører og sletting ved opphør.',
        },
        {
          title: '5. Underleverandører',
          text: 'Vi bruker følgende underleverandører som kan behandle personopplysninger: Supabase (database, EU/US, DPA tilgjengelig), OpenAI/Anthropic API (AI-behandling, US, data brukes ikke til trening), Vercel (hosting, global CDN), og n8n (automasjon, EU). Alle har databehandleravtaler på plass.',
        },
        {
          title: '6. Lagring og sletting',
          text: 'Kontaktinformasjon lagres så lenge det er nødvendig for å oppfylle formålet. Kundedata slettes innen 30 dager etter opphør av kundeforhold, med mindre lovpålagt oppbevaring krever lenger (f.eks. regnskapsloven: 5 år). Du kan når som helst be om sletting.',
        },
        {
          title: '7. Dine rettigheter',
          text: 'Du har rett til innsyn, retting, sletting, begrensning av behandling, dataportabilitet og å protestere mot behandling. For å utøve dine rettigheter, kontakt oss på younes@arxon.no. Vi svarer innen 30 dager. Du kan også klage til Datatilsynet (datatilsynet.no).',
        },
        {
          title: '8. Informasjonskapsler (cookies)',
          text: 'Vi bruker kun nødvendige tekniske cookies for at nettsiden skal fungere. Vi bruker ingen tredjeparts sporings-cookies eller markedsføringscookies. Anonymisert analyse samler ikke inn personopplysninger.',
        },
        {
          title: '9. Sikkerhet',
          text: 'Vi bruker kryptering (TLS/SSL), tilgangsstyring og sikker lagring for å beskytte dine opplysninger. Ved sikkerhetsbrudd varsles berørte og Datatilsynet innen 72 timer i henhold til GDPR art. 33.',
        },
        {
          title: '10. Kontakt',
          text: 'Spørsmål om personvern? Kontakt Younes Amer på younes@arxon.no. Arxon, Oslo, Norge.',
        },
      ].map((section, i) => (
        <motion.div key={section.title} initial="hidden" whileInView="visible"
          viewport={{ once: true }} variants={fade} custom={i * 0.05}
          className="py-8 border-t border-white/[0.08]"
        >
          <h2 className="text-white font-medium mb-3">{section.title}</h2>
          <p className="text-white/60 leading-relaxed text-sm">{section.text}</p>
        </motion.div>
      ))}

    </div>
  );
}
