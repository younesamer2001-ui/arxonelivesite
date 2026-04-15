'use client';

import { motion } from 'framer-motion';

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const sections = [
  {
    title: '1. Om tjenesten og behandlingsansvarlig',
    text: 'Arxon er en tjeneste utviklet, driftet og eid av Arxon (org.nr. 837 230 012). Tjenesten tilbys under varemerket «Arxon» og er underlagt gjeldende norsk lovgivning, herunder personopplysningsloven og GDPR (EU) 2016/679. Arxon, ved Younes Amer, er behandlingsansvarlig for personopplysninger som samles inn via arxon.no og våre tjenester. Kontakt: kontakt@arxon.no.',
  },
  {
    title: '2. Hvilke opplysninger vi samler inn',
    text: 'Vi samler inn opplysninger i følgende kategorier:\n\n'
      + 'Kontaktinformasjon: Navn, e-postadresse, telefonnummer og bedriftsnavn — via kontaktskjema, konsultasjonsbookinger og kontoopprettelse.\n\n'
      + 'Betalingsinformasjon: Behandles via sikre tredjepartsleverandører (f.eks. Stripe). Vi lagrer ikke kortinformasjon.\n\n'
      + 'Tekniske data: IP-adresse, nettlesertype, enhetstype, sidevisninger og klikkdata — samlet inn via anonymisert analyse.\n\n'
      + 'Plattformdata (AI-tjenester): Agentkonfigurasjon, systeminstruksjoner, kunnskapsinnhold, stemme- og språkinnstillinger, samt integrasjonskonfigurasjoner.\n\n'
      + 'Samtaledata: Telefonnumre, samtalemetadata (tidspunkt, varighet, status, retning), samtaleopptak og transkripsjoner (dersom aktivert av kunden), samtalelogger og strukturert samtaledata.',
  },  {
    title: '3. Hvordan opplysningene samles inn',
    text: 'Personopplysninger samles inn gjennom: kontaktskjema og bookingskjema på nettsiden, kontoopprettelse og bruk av administrasjonspanelet, telefonsamtaler med Arxons AI-agent, tredjepartsintegrasjoner (f.eks. Google Calendar, CRM-systemer), samt automatisk datainnsamling via cookies og analyseverktøy.',
  },
  {
    title: '4. Formål og rettslig grunnlag',
    text: 'Vi behandler personopplysninger for følgende formål:\n\n'
      + 'Levere og drifte tjenestene: Nødvendig for avtaleoppfyllelse (GDPR art. 6(1)(b)).\n\n'
      + 'Svare på henvendelser og gi kundesupport: Berettiget interesse (art. 6(1)(f)).\n\n'
      + 'Forbedre og videreutvikle tjenesten: Berettiget interesse, basert på anonymisert og aggregert data.\n\n'
      + 'Sende relevant informasjon om våre tjenester: Samtykke (art. 6(1)(a)).\n\n'
      + 'Oppfylle lovpålagte krav: Rettslig forpliktelse (art. 6(1)(c)), f.eks. regnskap og skatt.',
  },
  {
    title: '5. AI-tjenester og kundedata',
    text: 'Når Arxon leverer AI-løsninger (resepsjonist, chatbot, automasjon) for din bedrift, behandler vi personopplysninger på vegne av deg som kunde. I dette tilfellet er du behandlingsansvarlig og Arxon er databehandler. En egen databehandleravtale (DPA) regulerer dette forholdet, inkludert sikkerhetstiltak, bruk av underleverandører og sletting ved opphør. Kunder er selv ansvarlige for å innhente nødvendig samtykke fra sluttbrukere som interagerer med AI-agenter.',
  },  {
    title: '6. Underleverandører',
    text: 'Vi bruker pålitelige underleverandører for å drifte tjenesten, blant annet innen: database og lagring (Supabase, EU/US), AI-behandling (OpenAI / Anthropic, US — data brukes ikke til modelltrening), hosting (Vercel, global CDN), automasjon (n8n, EU), telefoni og tale (Vapi, Twilio, Deepgram, ElevenLabs), og betaling (Stripe). Alle underleverandører er underlagt databehandleravtaler. En oppdatert og fullstendig liste er tilgjengelig for eksisterende kunder ved forespørsel.',
  },
  {
    title: '7. Lagring og sletting',
    text: 'Vi lagrer personopplysninger kun så lenge det er nødvendig:\n\n'
      + 'Samtaleopptak og transkripsjoner: Slettes automatisk etter 90 dager, med mindre kunden har konfigurert annen lagringstid.\n\n'
      + 'Kundedata: Slettes innen 30 dager etter opphør av kundeforhold.\n\n'
      + 'Bruksdata og analyse: Anonymisert analysedata lagres i inntil 26 måneder, serverlogger i 90 dager.\n\n'
      + 'Regnskaps- og skattedata: 5 år i henhold til norsk regnskapslov.\n\n'
      + 'Du kan når som helst be om sletting av dine data.',
  },
  {
    title: '8. Internasjonal dataoverføring',
    text: 'Noen av våre underleverandører behandler data utenfor EU/EØS. I slike tilfeller sikrer vi tilstrekkelig beskyttelse gjennom EUs standardkontrakter (SCCs), adekvansvedtak eller databehandleravtaler med underleverandører.',
  },  {
    title: '9. Sikkerhet',
    text: 'Vi bruker egnede tekniske og organisatoriske tiltak for å beskytte dine opplysninger, herunder: kryptering under transport og lagring (TLS/SSL), tilgangsstyring og autentisering, brannmurer og sikkerhetsovervåking, samt konfidensialitetsavtaler med ansatte og samarbeidspartnere. Ved sikkerhetsbrudd varsles berørte personer og Datatilsynet innen 72 timer i henhold til GDPR art. 33.',
  },
  {
    title: '10. Informasjonskapsler (cookies)',
    text: 'Vi bruker informasjonskapsler for å sikre at nettsiden fungerer korrekt og for å forbedre brukeropplevelsen. For ikke-innloggede besøkende bruker vi kun anonymiserte analysecookies som ikke kan kobles til deg som person. For innloggede brukere kan cookies knyttes til din konto for funksjonalitet og personalisering. Vi bruker ingen tredjeparts sporings- eller markedsføringscookies. Du kan administrere cookie-innstillinger i nettleseren din.',
  },
  {
    title: '11. Dine rettigheter',
    text: 'I henhold til GDPR har du rett til: innsyn i hvilke opplysninger vi har om deg, retting av feilaktige data, sletting av dine data, begrensning av behandling, dataportabilitet, samt å protestere mot behandling og trekke tilbake samtykke. For å utøve dine rettigheter, kontakt oss på kontakt@arxon.no. Vi svarer innen 30 dager. Du kan også klage til Datatilsynet (datatilsynet.no).',
  },
  {
    title: '12. Barn',
    text: 'Våre tjenester er ikke rettet mot barn under 16 år. Vi samler ikke bevisst inn personopplysninger fra barn.',
  },  {
    title: '13. Endringer i personvernerklæringen',
    text: 'Vi kan oppdatere denne personvernerklæringen ved behov. Vesentlige endringer varsles ved oppdatering av denne siden, e-postvarsling for betydelige endringer, og/eller varsling i administrasjonspanelet. Fortsatt bruk av tjenesten etter endringer utgjør aksept av den oppdaterte erklæringen.',
  },
  {
    title: '14. Kontakt',
    text: 'Spørsmål om personvern? Kontakt Younes Amer på kontakt@arxon.no.\nArxon, Oslo, Norge.',
  },
];

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">

      <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">
          Personvernerklæring
        </h1>
        <p className="text-sm text-white/40 mb-16">Sist oppdatert: 14. april 2026</p>
      </motion.div>

      {sections.map((section, i) => (
        <motion.div key={section.title} initial="hidden" whileInView="visible"
          viewport={{ once: true }} variants={fade} custom={i * 0.05}
          className="py-8 border-t border-white/[0.08]"
        >
          <h2 className="text-white font-medium mb-3">{section.title}</h2>
          <p className="text-white/60 leading-relaxed text-sm whitespace-pre-line">{section.text}</p>
        </motion.div>
      ))}

    </div>
  );
}