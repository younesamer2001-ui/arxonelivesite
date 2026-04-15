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
    title: '1. Om tjenesten',
    text: 'Arxon er en tjeneste utviklet, driftet og eid av Arxon (org.nr. 837 230 012). Tjenesten tilbys under varemerket «Arxon» og er underlagt gjeldende norsk lovgivning. Ved å opprette en konto, klikke «Aksepter» eller bruke våre tjenester, bekrefter du at du har lest, forstått og godtar disse vilkårene. Dersom du handler på vegne av en bedrift, bekrefter du at du har fullmakt til å binde denne.',
  },
  {
    title: '2. Tjenestens innhold',
    text: 'Arxon leverer en skybasert plattform for AI-drevne tjenester, inkludert:\n\n'
      + 'AI-resepsjonist: Intelligente stemmeagenter som besvarer samtaler, booker avtaler og håndterer henvendelser.\n\n'
      + 'Dashboard og analyse: Konfigurasjon, overvåking, samtalelogger og rapportering.\n\n'
      + 'Integrasjoner: Kobling mot kalender, CRM, booking-systemer og andre verktøy.\n\n'
      + 'Workflow-automasjon: Skreddersydde automasjonsflyter tilpasset kundens drift.\n\n'
      + 'Vi forbeholder oss retten til å legge til, endre eller fjerne funksjonalitet uten forhåndsvarsel.',
  },  {
    title: '3. Tjenesteavtale',
    text: 'Levering av AI-løsninger reguleres av en separat tjenesteavtale mellom Arxon og kunden. Tjenesteavtalen spesifiserer omfang, priser, betalingsvilkår, leveringstid og øvrige betingelser. Ved motstrid mellom disse vilkårene og tjenesteavtalen, gjelder tjenesteavtalen.',
  },
  {
    title: '4. Tredjepartsleverandører',
    text: 'Tjenesten integrerer med tredjepartsleverandører innen AI/språkmodeller, tale-til-tekst, tekst-til-tale, telefoni, infrastruktur og betaling. Du aksepterer at Arxon kan legge til, fjerne eller bytte leverandører uten varsel, og at Arxon ikke er ansvarlig for feil, nedetid eller datatap forårsaket av tredjepartsleverandører. Kunden er selv ansvarlig for egne integrasjoner koblet via API, webhooks eller automasjonsplattformer.',
  },
  {
    title: '5. Brukerens ansvar',
    text: 'Du forplikter deg til å bruke tjenesten i tråd med gjeldende lovgivning og disse vilkårene. Det er ikke tillatt å bruke tjenesten til:\n\n'
      + 'Å utgi seg for å være en annen person eller bedrift.\n\n'
      + 'Formål som bryter med norsk lovgivning, inkludert personvern- og markedsføringsregler.\n\n'
      + 'Uautorisert overvåking eller innsamling av data.\n\n'
      + 'Spredning av skadelig programvare, spam eller lignende.',
  },
  {
    title: '6. AI-transparens og opplysningsplikt',
    text: 'Tjenesten benytter kunstig intelligens (AI) til å generere tale- og tekstsvar. I henhold til EU AI Act og gjeldende forbrukerbeskyttelseslovgivning, plikter du å informere sluttbrukere om at de kommuniserer med et AI-system, ikke bruke tjenesten til å simulere en ekte person på en villedende måte, og sikre at AI-generert innhold brukes i samsvar med gjeldende lovgivning. Arxon tilbyr verktøy for dette (f.eks. via systeminstruksjoner), men ansvaret for etterlevelse ligger hos deg som bruker.',
  },  {
    title: '7. Kontotilgang og sikkerhet',
    text: 'Du er ansvarlig for all aktivitet som skjer gjennom din brukerkonto. Hold innloggingsinformasjon konfidensiell, og varsle oss umiddelbart ved mistanke om uautorisert tilgang. Tjenesten er kun for personer over 18 år.',
  },
  {
    title: '8. Priser og betaling',
    text: 'Alle priser oppgis i norske kroner (NOK) eks. MVA med mindre annet er spesifisert. Oppstartskostnad faktureres i henhold til avtalt betalingsplan. Månedlig abonnement faktureres forskuddsvis. Betalingsfrist er 14 dager fra fakturadato. Ved forsinket betaling påløper forsinkelsesrente etter forsinkelsesrenteloven. Ved manglende betaling kan tjenesten bli begrenset eller avsluttet.',
  },
  {
    title: '9. Leveransemodell og pilot',
    text: 'Arxon følger en 5-fase gjennomføringsmodell: kartlegging, pilot, evaluering, utrulling og løpende optimalisering. Pilotfasen gjennomføres med ekte samtaler, slik at kunden ser konkrete resultater før beslutning om full utrulling. Oppstartskostnaden dekker kartlegging, pilot og oppsett, og er ikke refunderbar. Enterprise-avtaler reguleres av separat tjenesteavtale med tilpassede vilkår.',
  },
  {
    title: '10. Bindingstid og oppsigelse',
    text: 'Etter utrulling kan kunden velge månedlig (ingen binding), 6-måneders eller 12-måneders avtale med rabattert pris. Månedlige avtaler kan sies opp med 1 måneds varsel. Bindingsavtaler løper ut avtaleperioden og fornyes deretter månedlig med 1 måneds oppsigelse. Ved oppsigelse stoppes tjenesten ved utløp av perioden. Kundens data eksporteres eller slettes innen 30 dager etter opphør.',
  },  {
    title: '11. Immaterielle rettigheter',
    text: 'Alt innhold og teknologi relatert til Arxon — inkludert plattform, programvare, brukergrensesnitt, AI-modeller, workflows og varemerke — er og forblir Arxons eiendom. Kunden eier sine egne data og tilpassede treningsdata. Lydopptak og transkripsjoner generert gjennom kundens bruk av tjenesten eies av kunden, som har rett til å laste ned, lagre og bruke dette innholdet for egne formål. Samtaleopptak og transkripsjoner slettes automatisk etter 90 dager. Det er kundens ansvar å eksportere ønsket innhold før denne fristen.',
  },
  {
    title: '12. Innholdsansvar',
    text: 'Du er ansvarlig for alt innhold du laster opp, integrerer eller gjør tilgjengelig gjennom tjenesten. Du må kun benytte innhold du selv eier, administrerer eller har gyldig rett til å bruke. Brudd på tredjeparts rettigheter, inkludert opphavsrett og personvern, kan føre til utestengelse.',
  },
  {
    title: '13. Databehandling',
    text: 'Behandling av personopplysninger reguleres av vår personvernerklæring og en separat databehandleravtale (DPA). Kunden er behandlingsansvarlig for sine kunders data. Arxon behandler data kun etter kundens instrukser og i henhold til GDPR. Kundedata slettes innen 30 dager etter opphør av kundeforhold, med mindre lovpålagt oppbevaring krever lenger (f.eks. regnskapsloven: 5 år).',
  },  {
    title: '14. Ansvarsbegrensning',
    text: 'Tjenesten leveres «som den er». Arxon garanterer ikke at tjenesten til enhver tid er feilfri, tilgjengelig eller at AI-svar er korrekte. AI-agenter kan produsere unøyaktige svar. Arxons maksimale erstatningsansvar er begrenset til 3x månedlig abonnementskostnad. Arxon er ikke ansvarlig for indirekte tap, følgeskader eller tapt fortjeneste.',
  },
  {
    title: '15. Skadesløsholdelse',
    text: 'Du godtar å holde Arxon (og dets ansatte, samarbeidspartnere og leverandører) skadesløse mot ethvert krav, skade, tap eller kostnad (inkludert advokathonorarer) som følge av din bruk av tjenesten, brudd på disse vilkårene, brudd på tredjeparts rettigheter, eller dine egne integrasjoner og AI-resultater.',
  },
  {
    title: '16. Force majeure',
    text: 'Ingen av partene er ansvarlige for manglende oppfyllelse som skyldes forhold utenfor deres kontroll, herunder naturkatastrofer, krig, pandemi, streik, strømbrudd, nedetid hos underleverandører, eller alvorlige tekniske feil utenfor partens kontroll.',
  },
  {
    title: '17. Endringer i vilkårene',
    text: 'Vi kan oppdatere disse vilkårene ved behov. Ved vesentlige endringer varsles du via e-post eller i tjenestens grensesnitt minst 30 dager i forveien. Fortsatt bruk av tjenesten etter endringer utgjør aksept av de oppdaterte vilkårene.',
  },  {
    title: '18. Overdragelse',
    text: 'Du kan ikke overdra disse vilkårene uten Arxons skriftlige samtykke. Arxon kan overdra vilkårene uten begrensning, for eksempel ved overføring av eierskap til et nytt selskap. Ved overføring vil vilkårene fortsatt være bindende for brukeren.',
  },
  {
    title: '19. Lovvalg og tvisteløsning',
    text: 'Disse vilkårene er underlagt norsk lov. Tvister søkes løst i minnelighet. Dersom dette ikke fører frem, avgjøres tvisten ved Oslo tingrett som verneting.',
  },
  {
    title: '20. Kontakt',
    text: 'Arxon (org.nr. 837 230 012)\nYounes Amer\nE-post: kontakt@arxon.no\nOslo, Norge',
  },
];

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">

      <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">
          Vilkår for bruk
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