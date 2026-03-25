'use client';

import { motion } from 'framer-motion';

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (d: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32">

      <motion.div initial="hidden" animate="visible" variants={fade} custom={0}>
        <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight mb-4">
          Vilkår for bruk
        </h1>
        <p className="text-sm text-white/40 mb-16">Sist oppdatert: 25. mars 2026</p>
      </motion.div>

      {[
        {
          title: '1. Om Arxon',
          text: 'Arxon leverer AI-konsulent­tjenester, inkludert AI-resepsjonister, workflow-automasjon, CRM-integrasjoner og skreddersydde AI-agenter for norske bedrifter. Disse vilkårene gjelder for bruk av nettsiden arxon.no og tilhørende tjenester.',
        },
        {
          title: '2. Tjenesteavtale',
          text: 'Levering av AI-løsninger reguleres av en separat tjenesteavtale mellom Arxon og kunden. Tjenesteavtalen spesifiserer omfang, priser, betalingsvilkår, leveringstid og øvrige betingelser. Ved motstrid mellom disse vilkårene og tjenesteavtalen, gjelder tjenesteavtalen.',
        },
        {
          title: '3. Priser og betaling',
          text: 'Alle priser på nettsiden er veiledende og oppgis eks. MVA med mindre annet er spesifisert. Setupkostnad faktureres ved oppstart. Månedlige abonnement faktureres forskuddsvis. Betalingsfrist er 14 dager fra fakturadato. Ved forsinket betaling påløper forsinkelsesrente etter forsinkelsesrenteloven.',
        },
        {
          title: '4. 10-Day Promise og garanti',
          text: 'Arxon tilbyr en 10-dagers leveringsgaranti på AI-resepsjonist­løsninger. Dersom løsningen ikke er operativ innen 10 virkedager fra signert avtale, faktureres ikke setupkostnad. 30-dagers pengene-tilbake-garanti gjelder fra leveringsdato. Kunden må melde fra skriftlig innen fristen.',
        },
        {
          title: '5. Oppsigelse',
          text: 'Tjenester kan sies opp med 1 måneds gjensidig varsel, med mindre annet er avtalt. Ved oppsigelse stoppes tjenesten ved utløp av oppsigelsesperioden. Kundens data eksporteres eller slettes innen 30 dager etter opphør.',
        },
        {
          title: '6. Immaterielle rettigheter',
          text: 'Arxon eier alle immaterielle rettigheter til plattform, verktøy, AI-modeller og workflows. Kunden eier sine egne data og tilpassede treningsdata. Kunden får en ikke-eksklusiv bruksrett til løsningen så lenge avtalen løper.',
        },
        {
          title: '7. Ansvarsbegrensning',
          text: 'Arxons maksimale erstatningsansvar er begrenset til 3x månedlig abonnementskostnad. Arxon er ikke ansvarlig for indirekte tap, følgeskader eller tapt fortjeneste. Oppetidsgaranti: 99.5% for Tier 2/3-kunder, best effort for Tier 1.',
        },
        {
          title: '8. Databehandling',
          text: 'Behandling av personopplysninger reguleres av vår personvernerklæring og en separat databehandleravtale (DPA). Kunden er behandlingsansvarlig for sine kunders data. Arxon behandler data kun etter kundens instrukser og i henhold til GDPR.',
        },
        {
          title: '9. Force majeure',
          text: 'Ingen av partene er ansvarlige for manglende oppfyllelse som skyldes forhold utenfor deres kontroll, herunder naturkatastrofer, krig, pandemi, strømbrudd, eller svikt hos tredjepartsleverandører.',
        },
        {
          title: '10. Lovvalg og tvisteløsning',
          text: 'Disse vilkårene er underlagt norsk lov. Tvister søkes løst i minnelighet. Dersom dette ikke fører frem, avgjøres tvisten ved Oslo tingrett.',
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
