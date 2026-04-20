/**
 * Bransjespesifikke landing-pages-innhold.
 * Hver bransje = en dedikert landing-page optimalisert for long-tail-søk:
 *   - "AI telefonsvarer frisør"
 *   - "AI resepsjonist verksted"
 *   - "AI booking tannlege"
 *
 * Strukturen er identisk (samme komponent renderer alle), kun innholdet
 * varierer. Dette holder SEO på-side-struktur konsistent og gir Google
 * et tydelig signal om tema per URL.
 */

export interface BransjeTestimonial {
  quote: string
  author: string
  role: string
  company: string
  logo?: string
}

export interface BransjeFAQ {
  question: string
  answer: string
}

export interface BransjePage {
  slug:
    | "frisor"
    | "verksted"
    | "tannlege"
    | "legekontor"
    | "hudpleie"
    | "advokat"
    | "regnskap"
    | "eiendomsmegler"
    | "rorlegger"
    | "elektriker"
    | "restaurant"
    | "treningssenter"
  emoji: string

  // SEO
  metaTitle: string
  metaDescription: string
  h1: string
  lede: string // First paragraph — direct answer for AEO

  // Content
  problemTitle: string
  problems: string[]
  solutionTitle: string
  solutionPoints: { title: string; description: string }[]
  roiTitle: string
  roiStat: { value: string; label: string }[]
  useCaseTitle: string
  useCases: { title: string; description: string }[]

  testimonial?: BransjeTestimonial
  faq: BransjeFAQ[]

  ctaTitle: string
  ctaText: string
}

export const bransjePages: Record<BransjePage["slug"], BransjePage> = {
  frisor: {
    slug: "frisor",
    emoji: "✂️",
    metaTitle:
      "AI-resepsjonist for frisørsalonger — book timer mens du klipper | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske frisørsalonger. Tar telefoner når saksen er i bruk, booker timer 24/7, sender SMS-bekreftelse og reduserer no-show. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for frisørsalonger i Norge",
    lede: "Arxon tar telefonen når du ikke kan slippe saksen. AI-en svarer på norsk, booker timer direkte i kalenderen din, sender SMS-bekreftelse, og følger opp no-show — automatisk, 24/7. Bygget for norske frisørsalonger som mister kunder hver dag til telefonen som aldri blir besvart.",

    problemTitle: "Problemet: telefonen ringer mens saksen er i bruk",
    problems: [
      "En typisk salong med 5 stoler får 40–60 innkommende anrop per dag. 30–40 % blir aldri besvart fordi alle klipper.",
      "Kunder som ikke får svar ringer nestemann på lista. Du mister bookingen før du visste den fantes.",
      "Åpningstider er en flaskehals: 70 % av bookingforespørsler kommer etter kl. 17 eller i helgen, når salongen er stengt.",
      "No-show og sent-avlyste timer koster en gjennomsnittssalong 20 000–40 000 kr/måned i tapt inntekt.",
      "Resepsjonist i full stilling koster 450 000–550 000 kr/år. De fleste salonger har ikke råd.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Svarer på norsk, 24/7",
        description:
          "AI-en tar telefonen fra første sekund. Flytende norsk, forstår dialekt, kjenner tjenestene dine og prislista di.",
      },
      {
        title: "Booker direkte i kalenderen",
        description:
          "Integrert med Fresha, Timely, Calendly og Cal.com. AI-en ser ledige tider, booker, og sender SMS-bekreftelse automatisk.",
      },
      {
        title: "Reduserer no-show",
        description:
          "Automatisk SMS-påminnelse dagen før. Stripe-integrasjon for depositum på dyre behandlinger.",
      },
      {
        title: "Kvalifiserer før du blir involvert",
        description:
          "Spesielle forespørsler (hårforlengelse, balayage, bryllupshåring) rutes til rett stylist. Du slipper avbrytelser mens du klipper.",
      },
      {
        title: "Flerspråklig salong? Ingen problem",
        description:
          "AI-en bytter til engelsk, polsk, arabisk eller spansk basert på innringeren. 30+ språk støttes.",
      },
    ],

    roiTitle: "ROI for en typisk frisørsalong",
    roiStat: [
      { value: "+22 %", label: "flere bookinger per måned" },
      { value: "-60 %", label: "tapte anrop" },
      { value: "15 800 kr", label: "ekstra omsetning/mnd (snitt)" },
    ],

    useCaseTitle: "Slik bruker frisører Arxon",
    useCases: [
      {
        title: "Booking utenfor åpningstid",
        description:
          "Kunder ringer kl. 19 for å booke en klipp neste dag. AI-en tar bookingen, sender SMS — du våkner opp med full kalender.",
      },
      {
        title: "Flere stylister, smart ruting",
        description:
          "Maria klipper herrer, Sofie gjør balayage. AI-en ruter bookingen til rett stylist basert på tjeneste og tilgjengelighet.",
      },
      {
        title: "No-show-håndtering",
        description:
          "Kunden avlyser med 2 timers varsel. AI-en ringer ventelista og fyller luken — uten at du løfter en finger.",
      },
      {
        title: "Priser og tjenester",
        description:
          "'Hva koster klipp og farge?' — AI-en svarer presist basert på din prisliste, og booker direkte hvis kunden sier ja.",
      },
    ],

    faq: [
      {
        question: "Hvilke bookingsystem for frisører støtter Arxon?",
        answer:
          "Arxon integreres med Fresha, Timely, Booksy, Calendly, Cal.com, Shortcuts og direkte Google/Outlook-kalender. Vi setter opp integrasjonen under onboarding.",
      },
      {
        question: "Kan AI-en håndtere kompliserte forespørsler som balayage eller hårforlengelse?",
        answer:
          "Ja. AI-en samler inn relevante detaljer (nåværende farge, ønsket resultat, hårlengde), ruter til rett stylist, og booker konsultasjon om nødvendig.",
      },
      {
        question: "Hva skjer når flere kunder ringer samtidig?",
        answer:
          "Arxon håndterer ubegrenset antall samtidige samtaler. Ingen køer, ingen opptatt-signal. Hver kunde får sin egen AI-resepsjonist.",
      },
      {
        question: "Hvor mye koster Arxon for en liten salong?",
        answer:
          "Starter fra 2 990 kr/mnd dekker typisk en salong med 3–5 stoler. Pro-planen (4 990 kr/mnd) passer for salonger med flere stylister eller flerspråklig kundegrunnlag.",
      },
      {
        question: "Kan jeg teste AI-en med mine tjenester?",
        answer:
          "Ja. Ring live-demo direkte fra arxon.no, eller book en 20-minutters gjennomgang der vi setter opp AI-en med dine tjenester og priser.",
      },
    ],

    ctaTitle: "Slutt å miste bookinger",
    ctaText:
      "Book en demo på 20 minutter, eller ring AI-en live akkurat nå — helt gratis.",
  },

  verksted: {
    slug: "verksted",
    emoji: "🔧",
    metaTitle:
      "AI-resepsjonist for bilverksteder — svar kunder 24/7 | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske bilverksteder. Tar telefonen når mekanikerne jobber, booker serviceavtaler, svarer på akuttspørsmål og gir prisestimater — 24/7 på norsk. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for bilverksteder i Norge",
    lede: "Arxon svarer når mekanikerne jobber. AI-en tar bookinger for service og EU-kontroll, håndterer akuttsamtaler utenfor åpningstid, gir prisestimater på standard jobber, og ruter komplekse saker til rett tekniker. Bygget for norske bilverksteder som mister kunder fordi telefonen aldri ringer tilbake.",

    problemTitle: "Problemet: ingen svarer når kunden trenger det",
    problems: [
      "Mekanikerne har hender i en motor — de kan ikke ta telefonen. Kundene legger på etter 20 sekunder.",
      "Akuttsamtaler utenfor åpningstid (varsellampe, dekk-skift, startproblemer) går til konkurrenten som faktisk svarer.",
      "Prisestimater på standard jobber (service, clutch, EU-kontroll) gis ikke fordi ingen har tid til å svare på e-post.",
      "Bookingkø for EU-kontroll og service er manuell og inkonsekvent. Dobbeltbookinger skjer hver uke.",
      "Resepsjonist eller administrativt personale er en kostnad verksted ikke har råd til i full stilling.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Svarer akuttsamtaler 24/7",
        description:
          "Kunden ringer kl. 22 med varsellampe lyser gult. AI-en svarer, vurderer hastegrad, gir første-råd, og booker time neste morgen hvis akutt.",
      },
      {
        title: "Booker EU-kontroll og service",
        description:
          "AI-en kjenner kalenderen, ledige heisposisjoner, og standard servicejobber. Booker direkte med SMS-bekreftelse og påminnelse.",
      },
      {
        title: "Prisestimater på standard jobber",
        description:
          "'Hva koster hovedservice på en Volvo V70?' — AI-en gir riktig estimat basert på din prisliste.",
      },
      {
        title: "Ruter kompliserte saker til rett tekniker",
        description:
          "Motor-tekniker, elektriker, dekk-spesialist. AI-en stiller de riktige spørsmålene og legger dem i arbeidsordre direkte.",
      },
      {
        title: "Integrert med verkstedssystemer",
        description:
          "AutoPlan, Verkstedsportalen, HubSpot, Tripletex. Vi setter opp integrasjon under onboarding.",
      },
    ],

    roiTitle: "ROI for et typisk verksted",
    roiStat: [
      { value: "+18 %", label: "flere serviceavtaler" },
      { value: "-75 %", label: "tapte akuttsamtaler" },
      { value: "22 400 kr", label: "ekstra omsetning/mnd (snitt)" },
    ],

    useCaseTitle: "Slik bruker verksteder Arxon",
    useCases: [
      {
        title: "Varsellampe kl. 21:30",
        description:
          "Kunden ringer i panikk — varsellampe lyser gult. AI-en vurderer hastegrad, booker første ledige time neste dag, og gir trygghet.",
      },
      {
        title: "EU-kontroll-booking",
        description:
          "'Når kan jeg komme til EU-kontroll?' AI-en finner neste ledige time, booker, og sender SMS med adresse og tidspunkt.",
      },
      {
        title: "Prisestimat før bookingbeslutning",
        description:
          "Kunden vil vite hva clutch-bytte koster. AI-en gir estimat basert på din prisliste, og booker hvis kunden sier ja.",
      },
      {
        title: "Dekkhotell-varsling",
        description:
          "AI-en ringer ut til kunder som har dekk på dekkhotell når sesongen nærmer seg — og booker dekkskift automatisk.",
      },
    ],

    faq: [
      {
        question: "Hvilke verkstedssystemer integreres Arxon med?",
        answer:
          "AutoPlan, Verkstedsportalen, Workshop Mate, HubSpot, Pipedrive, Tripletex og direkte kalenderintegrasjon. Skreddersydd integrasjon er mulig på Enterprise-planen.",
      },
      {
        question: "Kan AI-en gi eksakte prisestimater?",
        answer:
          "AI-en gir estimater basert på din egen prisliste. For komplekse jobber gir den et spenn og booker inn for inspeksjon. Eksakte priser avgjøres av deg.",
      },
      {
        question: "Hva om kunden har et teknisk spørsmål AI-en ikke kan svare på?",
        answer:
          "AI-en eskalerer automatisk — enten ved å ta kontaktinfo for tilbakeringing, eller ved å koble direkte til rett tekniker hvis tilgjengelig.",
      },
      {
        question: "Håndterer Arxon akuttsamtaler?",
        answer:
          "Ja. AI-en identifiserer hastegrad basert på symptomer (varsellampe, startproblemer, bremseproblemer), booker akutttimer hvis du har satt opp slots, og sender direkte-varsel til mekaniker-vakt hvis definert.",
      },
      {
        question: "Kan AI-en håndtere dekkhotell og sesongbooking?",
        answer:
          "Ja. Vi setter opp automatisk utsending av booking-forespørsler til kunder med dekk på dekkhotell 4 uker før sesongstart. Kunden svarer, og AI-en booker.",
      },
    ],

    ctaTitle: "Slutt å la kunder ringe konkurrenten",
    ctaText:
      "Book en demo på 20 minutter, eller ring AI-en live og test den med et ekte verksted-scenario.",
  },

  tannlege: {
    slug: "tannlege",
    emoji: "🦷",
    metaTitle:
      "AI-resepsjonist for tannleger — reduser no-show og fyll kalenderen | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske tannleger. Booker timer 24/7, reduserer no-show med SMS-påminnelse og depositum, håndterer akuttsamtaler og smertepasienter — GDPR-kompatibelt. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for tannleger i Norge",
    lede: "Arxon tar telefonen mens du behandler pasienter. AI-en booker undersøkelser, hygieniketimer og kontroller, håndterer akutt-tannverk-samtaler 24/7, reduserer no-show med SMS-påminnelse og depositum, og er full GDPR-kompatibel med EU-hosting. Bygget for norske tannklinikker som mister pasienter til fulle kalendere og travle telefonlinjer.",

    problemTitle: "Problemet: pasienter ringer når du ikke kan svare",
    problems: [
      "Tannlegen er i behandling — telefonen går til personal som også er opptatt. 35 % av samtaler blir ikke besvart.",
      "Akutt tannverk om natten: pasienten ringer legevakttannlege, ikke deg. Du mister pasienten for hele livet.",
      "No-show-rate på 8–12 % koster en klinikk 180 000–350 000 kr/år i tapt inntekt.",
      "Personvern og GDPR må behandles nøye. Vanlige chatbot-løsninger eksporterer data til USA.",
      "Booking av kontroller 6 måneder frem krever oppfølging — manuelt tar det timer per uke.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Svarer på norsk, alle døgnets timer",
        description:
          "Pasienter kan ringe når det passer dem — ikke når resepsjonen er åpen. AI-en svarer med empati og profesjonalitet.",
      },
      {
        title: "Booker kontroller, undersøkelser, hygieniker",
        description:
          "Integrert med DentalSuite, Opus Dental, Plandent. AI-en ser ledig tid, velger riktig tannlege/hygieniker, og booker.",
      },
      {
        title: "Akutt tannverk — rask triage",
        description:
          "AI-en stiller strukturerte spørsmål om smerten, vurderer hastegrad, og booker akutt time eller ruter til vakt-tannlege.",
      },
      {
        title: "No-show-reduksjon",
        description:
          "Automatisk SMS-påminnelse 48 og 2 timer før. Stripe-depositum på lengre behandlinger. Reduserer no-show med 60 %.",
      },
      {
        title: "GDPR-kompatibel — EU-hosting",
        description:
          "Alle pasientdata lagres på servere i Frankfurt og Stockholm. DPA klar for alle kunder. Ingen data ut av EU.",
      },
    ],

    roiTitle: "ROI for en typisk tannklinikk",
    roiStat: [
      { value: "-60 %", label: "no-show-rate" },
      { value: "+27 %", label: "nye pasienter/mnd" },
      { value: "38 200 kr", label: "ekstra omsetning/mnd (snitt)" },
    ],

    useCaseTitle: "Slik bruker tannleger Arxon",
    useCases: [
      {
        title: "Akutt tannverk kl. 02:00",
        description:
          "Pasienten ringer med bankende tannverk. AI-en gir beroligende råd, tar kontaktinfo, og booker første ledige time neste morgen.",
      },
      {
        title: "Årlig kontroll-booking",
        description:
          "AI-en ringer/SMS-er pasienter 6 måneder etter siste kontroll. De svarer, og AI-en booker direkte. Ingen manuell oppfølging.",
      },
      {
        title: "Ny pasient onboarding",
        description:
          "'Jeg er ny pasient, hva koster en undersøkelse?' AI-en svarer, samler inn grunnleggende info, og booker første undersøkelse.",
      },
      {
        title: "Forsikringsspørsmål",
        description:
          "Dekker HELFO dette? Hva koster behandlingen etter egenandel? AI-en svarer basert på din klinikks regler og Helfo-satser.",
      },
    ],

    faq: [
      {
        question: "Er Arxon GDPR-kompatibel for pasientdata?",
        answer:
          "Ja. All pasientdata lagres kryptert på EU-servere (Frankfurt/Stockholm). Vi har databehandleravtale (DPA) for alle kunder. Ingen data sendes til USA eller tredjeland.",
      },
      {
        question: "Hvilke tannlegesystemer integreres Arxon med?",
        answer:
          "DentalSuite, Opus Dental, Plandent, OrisDental, Dentica, Helsenett og direkte kalenderintegrasjon. Skreddersydd integrasjon på Enterprise-plan.",
      },
      {
        question: "Kan AI-en vurdere hastegrad ved akutt tannverk?",
        answer:
          "Ja. AI-en bruker strukturerte triage-spørsmål (smertegrad 1–10, varighet, hevelse, feber) og vurderer hastegrad. Ved alvorlige tilfeller ruter den direkte til vakt-tannlege.",
      },
      {
        question: "Kan AI-en ta betalt depositum?",
        answer:
          "Ja, via Stripe-integrasjon. Typisk 500–1 000 kr depositum på lengre behandlinger, refunderbart hvis kansellert innen 24 timer. Reduserer no-show med 50–70 %.",
      },
      {
        question: "Hvor mye tid sparer vi på oppfølging av kontroller?",
        answer:
          "Typisk 6–10 timer i uken for en klinikk med 3 tannleger. AI-en håndterer både utgående oppfølging og innkommende bookingforespørsler uten manuell innblanding.",
      },
    ],

    ctaTitle: "Fyll kalenderen, reduser no-show",
    ctaText:
      "Book en 20-minutters demo, eller ring AI-en live og test den med et tannlege-scenario.",
  },

  legekontor: {
    slug: "legekontor",
    emoji: "🩺",
    metaTitle:
      "AI-resepsjonist for legekontor — reduser telefonkø og frigjør helsesekretær | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske legekontor. Tar triage-samtaler, booker konsultasjoner, håndterer reseptfornyelser og reduserer telefonkø — HELFO-kompatibelt og GDPR-sikret. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for legekontor i Norge",
    lede: "Arxon tar telefonkøen mens helsesekretæren hjelper pasienter i resepsjonen. AI-en triage-vurderer henvendelser på norsk, booker konsultasjoner direkte i CGM Allmenn, Infodoc eller System X, håndterer reseptfornyelser og gir informasjon om åpningstider og legevakt — 24/7, GDPR-kompatibelt og hostet i EU. Bygget for norske fastlegekontor som drukner i telefonhenvendelser og taper kapasitet på administrativt arbeid.",

    problemTitle: "Problemet: telefonkøen sluker halve dagen",
    problems: [
      "En typisk fastlegepraksis med 2 000 listepasienter mottar 60–120 telefonsamtaler per dag. 40 % av tiden til helsesekretær går til telefonen — tid som skulle gått til pasienter i resepsjonen.",
      "Pasienter gir opp etter 3–5 minutter kø og ringer legevakt eller privatklinikk. Du mister både pasienten og inntekten fra HELFO-refusjonen.",
      "Reseptfornyelser og enkle administrative henvendelser stjeler kapasitet som burde gå til faktisk medisinsk triage.",
      "Akuttsamtaler drukner i støyen fordi alle får samme kø — ingen automatisk hastegradsvurdering før helsesekretær tar telefonen.",
      "Utenfor åpningstid henvises pasienter til legevakt selv for spørsmål som kunne vært booket til neste dag.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Strukturert triage på norsk",
        description:
          "AI-en stiller standardiserte spørsmål om symptomer, varighet og hastegrad. Sorterer rødt/gult/grønt, ruter akutt til vaktlege, booker ikke-akutt i vanlig timekalender.",
      },
      {
        title: "Integrert med EPJ-systemer",
        description:
          "CGM Allmenn, Infodoc Plenario, System X, Pridok og HelseNorge-portalen. Vi setter opp integrasjon under onboarding, med databehandleravtale.",
      },
      {
        title: "Reseptfornyelse uten å involvere helsesekretær",
        description:
          "Pasienten ber om fornyelse av kjent medisin. AI-en verifiserer identitet, sjekker journal for siste forskrivning, legger i legens oppgavekø.",
      },
      {
        title: "Helsedata på EU-servere",
        description:
          "All pasientinformasjon lagres kryptert i Frankfurt/Stockholm. Full DPA (databehandleravtale) inkludert. Ingen data til USA eller tredjeland.",
      },
      {
        title: "Frigjør helsesekretær til pasientarbeid",
        description:
          "Typisk 15–20 timer/uke frigjort. Brukes på det som ikke kan automatiseres: prøvetaking, vaksinering, pasienter i resepsjon.",
      },
    ],

    roiTitle: "ROI for et typisk legekontor",
    roiStat: [
      { value: "-70 %", label: "telefonkø-tid" },
      { value: "18 t/uke", label: "frigjort fra helsesekretær" },
      { value: "45 000 kr", label: "spart lønn/mnd" },
    ],

    useCaseTitle: "Slik bruker legekontor Arxon",
    useCases: [
      {
        title: "Triage mandag morgen",
        description:
          "20 pasienter i kø kl. 08:15. AI-en vurderer hver i parallell: 3 akutte rutes til legens telefon, 14 bookes time, 3 får info om selvhjelp.",
      },
      {
        title: "Reseptfornyelse uten ventetid",
        description:
          "'Kan jeg få fornyet blodtrykksmedisinen?' AI-en verifiserer identitet, sjekker siste forskrivning, legger i legens oppgavekø. Pasienten får SMS når resepten er klar.",
      },
      {
        title: "Etter-arbeidstid-håndtering",
        description:
          "Pasient ringer kl. 20 med spørsmål om prøvesvar. AI-en forklarer at svar er i HelseNorge-portalen, tilbyr booking til neste dag hvis pasienten vil snakke med lege.",
      },
      {
        title: "Kronisk oppfølging",
        description:
          "AI-en ringer kronikere 14 dager før kontroll-tid går ut. Booker, sender SMS-bekreftelse, varsler helsesekretær hvis pasienten ikke svarer.",
      },
    ],

    faq: [
      {
        question: "Er Arxon kompatibel med norske EPJ-systemer?",
        answer:
          "Ja. Vi integrerer med CGM Allmenn, Infodoc Plenario, System X, Pridok og HelseNorge-portalen. Skreddersydd integrasjon mot kjedesystemer er mulig på Enterprise-planen.",
      },
      {
        question: "Hvordan håndteres sensitive helsedata?",
        answer:
          "All data lagres kryptert på EU-servere (Frankfurt og Stockholm), med full databehandleravtale (DPA) signert før oppstart. Vi følger Helsenorges sikkerhetskrav, GDPR artikkel 9, og Normens krav til informasjonssikkerhet i helse- og omsorgstjenesten.",
      },
      {
        question: "Kan AI-en gi medisinske råd?",
        answer:
          "Nei. AI-en gir aldri medisinsk rådgivning. Den triage-vurderer hastegrad, booker time, gir informasjon om åpningstider, og henviser akutt til lege eller legevakt. Alle medisinske vurderinger gjøres av helsepersonell.",
      },
      {
        question: "Hvordan vurderer AI-en akutte tilfeller?",
        answer:
          "Med standardiserte triage-protokoller validert mot etablerte skalaer (Manchester Triage). Ved røde flagg (brystsmerter, pustevansker, bevisstløshet, alvorlig blødning) rutes samtalen umiddelbart til vaktlege eller instruerer om å ringe 113.",
      },
      {
        question: "Hvor mye helsesekretær-tid spares?",
        answer:
          "Typisk 15–20 timer per uke for en to-legers praksis med 2 000 listepasienter. Tiden frigjøres til pasientmøter, prøvetaking, vaksinering og annet arbeid som ikke kan automatiseres.",
      },
    ],

    ctaTitle: "Gi helsesekretæren tid til pasientene",
    ctaText:
      "Book en 20-minutters demo skreddersydd for legekontor, eller ring AI-en live og test med et reellt triage-scenario.",
  },

  hudpleie: {
    slug: "hudpleie",
    emoji: "💆",
    metaTitle:
      "AI-resepsjonist for hudpleie og skjønnhetsklinikker — fyll kalenderen 24/7 | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske hudpleieklinikker og skjønnhetssalonger. Booker konsultasjoner, tar depositum via Stripe, reduserer no-show og håndterer spørsmål om laser, fillers og behandlinger — 24/7. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for hudpleie og skjønnhetsklinikker",
    lede: "Arxon tar imot bookinger mens terapeutene jobber med kunder. AI-en svarer på norsk, booker i Fresha, Timely eller Booksy, tar inn depositum via Stripe på dyre behandlinger (laser, fillers, hårfjerning), sender SMS-påminnelser og håndterer oppfølging etter behandling. Bygget for norske hudpleieklinikker og skjønnhetssalonger som mister bookinger fordi telefonen ikke kan besvares under behandling.",

    problemTitle: "Problemet: bookinger glipper mens du behandler",
    problems: [
      "Terapeuten er i gang med en ansiktsbehandling — telefonen kan ikke tas. 40 % av samtaler går til telefonsvarer, og bare 25 % av dem ringer tilbake.",
      "Forespørsler om laser, fillers og dyre behandlinger kommer på kveld og helg. Kunden finner klinikken som svarer raskest — ofte ikke deg.",
      "No-show på dyre behandlinger (2 000–8 000 kr) koster typisk 25 000–60 000 kr/mnd i tapt omsetning per behandler.",
      "Kompliserte spørsmål ('Hvor mange behandlinger trenger jeg for permanent hårfjerning?') krever tid på telefon som ingen har.",
      "Oppfølging etter behandling (hudanalyse, second-check, pakkekonsultasjon) blir ofte ikke booket fordi kunden glemmer, og du glemmer å minne om.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Svarer kvalifisert på behandlingsspørsmål",
        description:
          "AI-en kjenner behandlingene dine, prisene, antall økter anbefalt, og kontraindikasjoner. Gir faglig riktige svar uten å involvere deg.",
      },
      {
        title: "Depositum via Stripe på høy-verdi-behandlinger",
        description:
          "Automatisk 500–1 500 kr depositum ved booking av laser, fillers, Botox. Refunderbart ved kansellering >24t før. Reduserer no-show med 60–70 %.",
      },
      {
        title: "Booker i din kalender",
        description:
          "Fresha, Timely, Booksy, Treatwell, Mangopoint, Calendly. AI-en ser ledig tid per behandler, matcher behandlingstype med kompetanse, booker direkte.",
      },
      {
        title: "Automatisk oppfølging",
        description:
          "AI-en sender SMS etter behandling: 'Hvordan går det? Er du klar for neste økt?' Booker oppfølging eller pakkekonsultasjon direkte.",
      },
      {
        title: "Flerspråklig klientell",
        description:
          "Klinikker i Oslo sentrum har ofte internasjonalt klientell. AI-en bytter til engelsk, polsk, arabisk basert på innringer. 30+ språk.",
      },
    ],

    roiTitle: "ROI for en typisk hudpleieklinikk",
    roiStat: [
      { value: "+31 %", label: "flere bookinger/mnd" },
      { value: "-65 %", label: "no-show-rate" },
      { value: "28 400 kr", label: "ekstra omsetning/mnd" },
    ],

    useCaseTitle: "Slik bruker hudpleieklinikker Arxon",
    useCases: [
      {
        title: "Laser-konsultasjon-booking",
        description:
          "Kunde ringer og spør om permanent hårfjerning. AI-en stiller spørsmål (hudtype, område, tidligere behandlinger), gir prisestimat, booker konsultasjon og tar depositum.",
      },
      {
        title: "Fillers-booking med kontraindikasjonssjekk",
        description:
          "AI-en spør om graviditet, antikoagulanter og allergier før booking. Rødflagger rutes til sykepleier for manuell vurdering.",
      },
      {
        title: "Pakke-kjøp",
        description:
          "'Kan jeg kjøpe pakke med 6 laser-behandlinger?' AI-en tar betaling via Stripe-link, booker første økt, planlegger resten i kalenderen.",
      },
      {
        title: "Etter-behandling-oppfølging",
        description:
          "7 dager etter ansiktsbehandling: AI-en sender 'Hvordan er huden? Ønsker du å booke oppfølging?' Kunden svarer ja, AI-en booker direkte.",
      },
    ],

    faq: [
      {
        question: "Kan AI-en håndtere medisinske spørsmål om fillers og Botox?",
        answer:
          "AI-en svarer på generelle spørsmål (pris, varighet, restitusjon), men eskalerer alle medisinske vurderinger til sykepleier eller lege. Kontraindikasjonssjekk gjøres i bookingen, ikke rådgivning.",
      },
      {
        question: "Hvilke bookingsystemer integreres Arxon med?",
        answer:
          "Fresha, Timely, Booksy, Treatwell, Mangopoint, Phorest, Calendly, Cal.com og direkte kalenderintegrasjon. Vi setter opp under onboarding.",
      },
      {
        question: "Hvordan fungerer Stripe-depositum?",
        answer:
          "Under booking får kunden en sikker Stripe-link for 500–1 500 kr depositum (du setter beløp per behandling). Betalt = bekreftet booking. Refunderbart ved kansellering >24t før. Reduserer no-show med 60–70 %.",
      },
      {
        question: "Kan AI-en håndtere etter-behandling-oppfølging?",
        answer:
          "Ja. AI-en sender automatisk SMS eller ringer x dager etter behandling (du bestemmer), spør om hvordan huden er, og booker oppfølging hvis ønsket. Typisk 40 % konvertering til gjentakende booking.",
      },
      {
        question: "Koster Arxon mer for flerspråklig klientell?",
        answer:
          "Nei. Starter (2 990 kr/mnd) inkluderer norsk, engelsk og 3 andre språk. Pro (4 990 kr/mnd) inkluderer alle 30+ språk. Samme pris uavhengig av hvilke språk som er i bruk.",
      },
    ],

    ctaTitle: "Fyll kalenderen mens du behandler",
    ctaText:
      "Book en 20-minutters demo skreddersydd for hudpleie, eller ring AI-en live og test med en laser-konsultasjon-forespørsel.",
  },

  advokat: {
    slug: "advokat",
    emoji: "⚖️",
    metaTitle:
      "AI-resepsjonist for advokatkontor — kvalifiser leads og book konsultasjoner | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske advokatkontor. Svarer på henvendelser 24/7, screener saker, kvalifiserer leads, sjekker konfliktsituasjoner og booker inntaksmøter — konfidensielt og GDPR-sikret. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for advokatkontor i Norge",
    lede: "Arxon tar imot henvendelser når advokater er i retten eller i møte. AI-en intervjuer potensielle klienter på norsk, samler grunninfo (sakstype, motpart, tidsfrist), sjekker for åpenbar interessekonflikt, og booker inntaksmøte direkte i kalenderen. Bygget for norske advokatkontor som mister mandater fordi ingen svarer når klienten trenger svar — og som ikke vil bruke sekretær til screening.",

    problemTitle: "Problemet: kvalifiserte mandater glipper",
    problems: [
      "Advokaten er i retten 3–4 dager i uken. Klienter som ringer får ikke svar, og de fleste prøver aldri igjen.",
      "Første-inntrykkssamtalen er kritisk — men 30–40 % av potensielle klienter kommer aldri frem til advokat.",
      "Sekretærtid går til screening av henvendelser som aldri blir til mandater. Ikke effektiv bruk av en 550 000 kr-ressurs.",
      "Saker med kort tidsfrist (arbeidsrett, barnevern, strafferett-varetekt) krever rask respons — men kommer ofte inn etter åpningstid.",
      "Interessekonflikt-sjekk mot eksisterende klienter er manuell og feilbart når sekretær har det travelt.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Strukturert inntakssamtale",
        description:
          "AI-en stiller riktige spørsmål basert på sakstype: arbeidsrett, familierett, eiendomsrett, strafferett. Samler navn, motpart, tidsfrist, relevante dokumenter, og budsjett.",
      },
      {
        title: "Interessekonflikt-sjekk",
        description:
          "Integrert med klientregisteret (Advisor, Simployer Legal, egen Excel). Ved truffet konflikt eskaleres samtalen umiddelbart til partner eller blokkerer videre inntak.",
      },
      {
        title: "Prioriterer tidssensitive saker",
        description:
          "AI-en identifiserer saker med korte frister (varetekt, midlertidige forføyninger, anke-frister) og varsler advokat direkte, også utenfor arbeidstid.",
      },
      {
        title: "Konfidensialitet og GDPR",
        description:
          "All data kryptert, EU-hosted, full DPA. Ingen trening på klientdata. Taushetsplikt etter domstolsloven respekteres — data kan ikke utleveres til tredjepart.",
      },
      {
        title: "Book inntaksmøter direkte",
        description:
          "Kvalifiserte leads booker inntaksmøte i advokatens kalender (Outlook, Google). Ukvalifiserte får høflig forklaring om hvorfor kontoret ikke passer.",
      },
    ],

    roiTitle: "ROI for et typisk advokatkontor",
    roiStat: [
      { value: "+26 %", label: "kvalifiserte inntak/mnd" },
      { value: "8 t/uke", label: "spart sekretær-tid" },
      { value: "55 000 kr", label: "økt omsetning/mnd" },
    ],

    useCaseTitle: "Slik bruker advokatkontor Arxon",
    useCases: [
      {
        title: "Arbeidsrett-sak fra oppsagt klient",
        description:
          "Klient ringer fredag kveld etter oppsigelse. AI-en tar inntak, identifiserer 1-månedsfrist, flagger som tidssensitiv, sender varsel til advokat som ringer tilbake søndag kveld.",
      },
      {
        title: "Interessekonflikt detektert",
        description:
          "Potensielle klient oppgir motpart = eksisterende klient. AI-en eskalerer til partner, informerer vennlig om konflikt, gir henvisning til andre kontor.",
      },
      {
        title: "Familierett-kvalifisering",
        description:
          "AI-en samler info om skilsmisse-status, barnefordeling, økonomi, tidligere tvist. Scorer som sterk lead/middels lead/henvis videre basert på kriterier partner har satt.",
      },
      {
        title: "Strafferett-varetekt",
        description:
          "Familie ringer etter pågripelse. AI-en identifiserer hast, henter grunninfo, ruter direkte til strafferettsadvokat på vakt.",
      },
    ],

    faq: [
      {
        question: "Er Arxon kompatibel med advokaters taushetsplikt?",
        answer:
          "Ja. Alle data krypteres, lagres i EU (Frankfurt/Stockholm), og behandles under databehandleravtale. Arxon trener ikke AI-modeller på klientdata. Systemet er designet for å respektere domstolslovens taushetsplikt.",
      },
      {
        question: "Kan AI-en gi juridisk rådgivning?",
        answer:
          "Nei. AI-en samler inn informasjon, kvalifiserer saker og booker møter. Alle juridiske vurderinger gjøres av advokat. Dette er tydelig kommunisert til innringer, og er i tråd med domstolsloven § 218.",
      },
      {
        question: "Hvordan fungerer interessekonflikt-sjekken?",
        answer:
          "AI-en spør om motpartens navn og sjekker mot klientregisteret ditt før inntaksmøte bookes. Ved truffet konflikt avbrytes bookingen og samtalen eskaleres til partner for manuell vurdering.",
      },
      {
        question: "Hvilke klientregister-systemer integreres?",
        answer:
          "Advisor, Simployer Legal, NetDocuments, iManage, og Excel/Google Sheets for mindre kontor. Skreddersydd integrasjon på Enterprise-planen.",
      },
      {
        question: "Hvordan håndteres tidssensitive saker?",
        answer:
          "AI-en er trent på å kjenne igjen kritiske frister (arbeidsrett-frister, anke-frister, varetekt) og sender umiddelbart varsel til advokat via SMS/e-post, også utenfor arbeidstid hvis konfigurert.",
      },
    ],

    ctaTitle: "Fang kvalifiserte mandater døgnet rundt",
    ctaText:
      "Book en 20-minutters demo skreddersydd for advokatkontor, eller ring AI-en live og test med et reellt inntaksscenario.",
  },

  regnskap: {
    slug: "regnskap",
    emoji: "📊",
    metaTitle:
      "AI-resepsjonist for regnskapskontor — håndter henvendelser og frigjør tid | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske regnskapskontor. Svarer på bokførings- og MVA-spørsmål, booker konsultasjoner, håndterer papirarbeid-forespørsler og frigjør regnskapsfører-tid — integrert med Tripletex, Fiken og Poweroffice. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for regnskapskontor i Norge",
    lede: "Arxon tar imot kundehenvendelser mens regnskapsførere jobber i Tripletex eller Fiken. AI-en svarer på vanlige spørsmål om MVA, frister, skatt og bokføring, booker konsultasjoner, samler inn dokumenter som mangler, og varsler ved kritiske frister (MVA-innsending, årsoppgjør). Bygget for norske regnskapskontor som ønsker å skalere kundeporteføljen uten å ansette flere — og slutte å bruke 30 % av tiden på repeterende spørsmål.",

    problemTitle: "Problemet: samme spørsmål, hundre ganger i måneden",
    problems: [
      "Regnskapskontor mottar 40–80 spørsmål per uke om MVA, frister, reiseregninger, kvitteringer — alle med samme svar.",
      "Regnskapsfører-tid (750 kr/time) går til å svare 'når er MVA-fristen?' istedenfor bokføring som faktisk fakturers.",
      "Tidsfrister (MVA 14. februar/april/juni/august, A-ordning 7. hver måned, årsoppgjør 31. mai) krever oppfølging, men går i hverdagen.",
      "Ny-kunde-henvendelser kommer i bølger etter nyttår og skatte-sesong — sekretær får ikke tak i dem alle.",
      "Kunder som ikke leverer bilag til deadline trenger purring, men ingen har tid til å ringe alle.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Svarer vanlige spørsmål 24/7",
        description:
          "MVA-frister, A-ordningsfrister, skattesatser, reiseregningsregler, reglene for hjemmekontor. AI-en kjenner norske regler og din kunstlisteråd.",
      },
      {
        title: "Integrert med regnskapssystemer",
        description:
          "Tripletex, Fiken, Poweroffice, Visma eAccounting, DNB Regnskap. AI-en ser kundens status, manglende bilag, innsendte rapporter — og gir oppdatert info.",
      },
      {
        title: "Automatisk purring på bilag",
        description:
          "AI-en ringer/SMSer kunder som ikke har levert bilag 5 dager før frist. Samler inn manglende dokumenter via Stripe-link eller e-post.",
      },
      {
        title: "Frist-varsling før kritiske datoer",
        description:
          "MVA-frister, A-ordning, årsoppgjør. AI-en sender påminnelse til kunder, samler manglende info, og varsler regnskapsfører når alt er klart.",
      },
      {
        title: "Kvalifiserer nye kunder",
        description:
          "Henvendelser om ny regnskapsavtale: AI-en samler selskapsform, omsetning, antall bilag, kompleksitet — og booker møte kun med kvalifiserte leads.",
      },
    ],

    roiTitle: "ROI for et typisk regnskapskontor",
    roiStat: [
      { value: "12 t/uke", label: "frigjort regnskapsfører-tid" },
      { value: "+40 %", label: "bilag levert innen frist" },
      { value: "36 000 kr", label: "økt fakturerbar tid/mnd" },
    ],

    useCaseTitle: "Slik bruker regnskapskontor Arxon",
    useCases: [
      {
        title: "'Når er MVA-fristen?'",
        description:
          "Spurt 15 ganger per måned. AI-en svarer instant: neste frist, hva kunden må levere, og link til upload. Regnskapsfører slipper avbrytelse.",
      },
      {
        title: "Purring på manglende bilag",
        description:
          "MVA-frist om 3 dager — 8 kunder mangler bilag. AI-en ringer alle, samler inn, og varsler regnskapsfører kun ved problemkunder.",
      },
      {
        title: "Reiseregningspørsmål",
        description:
          "'Kan jeg trekke fra lunsj på forretningsreise?' AI-en svarer riktig basert på skatteetatens regler og klientens bransje.",
      },
      {
        title: "Ny-kunde-inntak",
        description:
          "Startup ringer om regnskap. AI-en samler info (AS/ENK, omsetning, antall bilag/mnd), gir indikativ pris, og booker møte kun hvis kunden passer porteføljen.",
      },
    ],

    faq: [
      {
        question: "Hvilke regnskapssystemer integreres Arxon med?",
        answer:
          "Tripletex, Fiken, Poweroffice Go, Visma eAccounting, DNB Regnskap, 24SevenOffice, Unimicro og Xledger. Skreddersydd integrasjon på Enterprise-planen.",
      },
      {
        question: "Kan AI-en gi skatteråd?",
        answer:
          "AI-en svarer på generelle regler (MVA-satser, fradragsregler, frister) og henviser til Skatteetatens veileder. Individuell skatterådgivning gjøres av regnskapsfører med autorisasjon.",
      },
      {
        question: "Kan AI-en håndtere bilagspurring?",
        answer:
          "Ja. AI-en ringer/SMSer kunder som ikke har levert bilag X dager før frist, samler inn manglende dokumenter, og rapporterer status til regnskapsfører. Typisk øker leveringsgrad innen frist med 40 %.",
      },
      {
        question: "Hvordan håndteres sensitiv økonomisk informasjon?",
        answer:
          "All data krypteres, lagres i EU, og behandles under DPA. Arxon trener ikke på klientdata. Vi følger norsk regnskapslov og GDPR, inkludert retten til innsyn og sletting.",
      },
      {
        question: "Kan AI-en sende ut faktura til klienter?",
        answer:
          "Arxon sender ikke ut faktura (det gjør regnskapssystemet ditt), men kan påminne kunder om ubetalte fakturaer og spørre om grunn til utsettelse. Enterprise-kunder kan koble Stripe-link for direkte innbetaling.",
      },
    ],

    ctaTitle: "Fakturer mer, svar mindre",
    ctaText:
      "Book en 20-minutters demo skreddersydd for regnskapskontor, eller ring AI-en live og test med et typisk kundespørsmål.",
  },

  eiendomsmegler: {
    slug: "eiendomsmegler",
    emoji: "🏠",
    metaTitle:
      "AI-resepsjonist for eiendomsmeglere — fang leads 24/7 | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske eiendomsmeglere. Svarer på boligannonser 24/7, kvalifiserer kjøpere, booker visninger og verdivurderinger, integrert med Finn.no og Vitec. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for eiendomsmeglere i Norge",
    lede: "Arxon svarer på henvendelser fra Finn.no 24/7 mens megleren er på visning. AI-en kvalifiserer kjøpere (finansiering på plass, tidsramme, prisklasse), booker visninger og verdivurderinger, gir info om objektet (prospekt, egenandelsberegning, felleskostnader), og varsler megler kun når leaden er reell. Bygget for norske eiendomsmeglere som mister henvendelser om kvelden og i helgen fordi ingen svarer.",

    problemTitle: "Problemet: de fleste boligkjøpere ringer om kvelden",
    problems: [
      "70 % av Finn.no-henvendelser kommer mellom kl. 18 og 23. Megleren er hjemme, telefonen kobles ut, kjøperen ringer neste megler i lista.",
      "Hver ubesvart henvendelse = en potensiell kjøper som går til konkurrent. For en megler med 2–4 % provisjon på 5 MNOK-boliger er dette 100 000–200 000 kr per tapte salg.",
      "Helg-visninger genererer 30–50 henvendelser på én ettermiddag. Umulig å ta alle i sanntid.",
      "Ukvalifiserte leads sluker tid — folk som 'bare kikker' uten finansiering.",
      "Verdivurderings-forespørsler kommer ofte rundt skatte-sesong, når megler er overbelastet.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Svarer Finn-henvendelser på sekunder",
        description:
          "AI-en er trent på objektet (adresse, pris, kvadrat, felleskostnader, egenandel, visningstider). Svarer mens interessen er varm.",
      },
      {
        title: "Kvalifiserer kjøpere profesjonelt",
        description:
          "Har du finansiering fra bank? Når planlegger du å kjøpe? Hvilken prisklasse? Flytter du opp/ned/sideveis? AI-en samler info uten å være påtrengende.",
      },
      {
        title: "Booker visninger direkte",
        description:
          "Integrert med Vitec, Webmegler, Xledger Meglerfag. AI-en ser ledige visningstider, booker, sender kalenderinvitasjon og adresse.",
      },
      {
        title: "Automatisk verdivurderings-pipeline",
        description:
          "'Hva er huset mitt verdt?' AI-en tar gateadresse, finner matrikkel, sjekker sammenlignbare salg, gir grovt estimat, og booker befaring.",
      },
      {
        title: "Varsler kun på kvalifiserte leads",
        description:
          "Megler får ikke varsel på tidskjekkere. Kun når leaden er kvalifisert: finansiering + tidsramme + interesse i spesifikt objekt.",
      },
    ],

    roiTitle: "ROI for en typisk eiendomsmegler",
    roiStat: [
      { value: "+38 %", label: "flere kvalifiserte visninger" },
      { value: "<10 sek", label: "responstid på Finn-henvendelser" },
      { value: "1–2", label: "ekstra salg/mnd (snitt)" },
    ],

    useCaseTitle: "Slik bruker meglere Arxon",
    useCases: [
      {
        title: "Finn.no-henvendelse kl. 22:30",
        description:
          "Ny henvendelse om 4-roms i Lørenskog. AI-en svarer innen 10 sekunder, gir info, kvalifiserer (finansiering, ja/nei), booker visning på lørdag.",
      },
      {
        title: "Mass-visning helg",
        description:
          "Visning kl. 13–14, 28 personer innom. Alle spør om prospekt, egenandel, felleskostnader. AI-en håndterer oppfølging via SMS dagen etter — megler fokuserer på de seriøse budene.",
      },
      {
        title: "Verdivurderings-inntak",
        description:
          "Selger ringer om verdivurdering. AI-en tar adresse, antall rom, kvadrat, byggeår — og booker 30-minutters befaring direkte i meglerens kalender.",
      },
      {
        title: "Ettersalg-oppfølging",
        description:
          "AI-en ringer selger 2 uker etter overtakelse: 'Hvordan gikk flyttingen? Kjenner du noen som vurderer å selge?' Fanger opp referanse-leads.",
      },
    ],

    faq: [
      {
        question: "Er Arxon integrert med Finn.no?",
        answer:
          "Ja. Innkomne meldinger fra Finn.no (via e-post eller API hvis du har avtale) rutes til AI-en, som svarer på kundens språk innen sekunder. Svaret logges også i Vitec/Webmegler.",
      },
      {
        question: "Kan AI-en gi eksakt verdivurdering?",
        answer:
          "AI-en gir et grovt estimat basert på offentlige data (Matrikkelen, sammenlignbare solgte objekter i området). Eksakt verdivurdering gjøres alltid av autorisert megler etter befaring.",
      },
      {
        question: "Hvilke meglersystemer integreres Arxon med?",
        answer:
          "Vitec, Webmegler, Xledger Meglerfag, Tromsø Takst & Megler-systemer, Privatmegleren-sentralsystem. Skreddersydd integrasjon på Enterprise-planen.",
      },
      {
        question: "Hvordan kvalifiseres leads?",
        answer:
          "AI-en stiller 4 standardspørsmål: finansiering på plass (ja/nei/i prosess), tidsramme (nå/3 mnd/6 mnd+), prisklasse, og hvilken type bolig. Scorer automatisk A/B/C-lead. Megler får varsel kun på A-leads utenfor arbeidstid.",
      },
      {
        question: "Kan AI-en håndtere budrunder?",
        answer:
          "Nei. Budgivning håndteres alltid av autorisert megler etter eiendomsmeglerloven. AI-en tar imot henvendelser før budrunden, ikke selve budgivningen.",
      },
    ],

    ctaTitle: "Svar mens interessen er varm",
    ctaText:
      "Book en 20-minutters demo skreddersydd for eiendomsmeglere, eller ring AI-en live og test med en Finn-henvendelse.",
  },

  rorlegger: {
    slug: "rorlegger",
    emoji: "🔧",
    metaTitle:
      "AI-resepsjonist for rørleggere — vinn akuttsamtaler 24/7 | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske rørleggere. Tar akuttsamtaler (lekkasje, varmtvann, tett avløp), gir prisestimater, booker tid og ruter til vakt-rørlegger — 24/7. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for rørleggere i Norge",
    lede: "Arxon svarer rørleggerens telefon mens han er under vasken hos en kunde. AI-en vurderer hastegrad (lekkasje? varmt vann borte? tett toalett?), gir prisestimat på standardjobber, booker service, og ruter akuttsamtaler direkte til vakt-rørlegger — 24/7. Bygget for norske rørleggerbedrifter som mister akuttjobber til konkurrenten som faktisk svarer kl. 21 på søndag kveld.",

    problemTitle: "Problemet: akutt-kunden finner den som svarer først",
    problems: [
      "Lekkasje kl. 22 søndag kveld. Kunden googler 'rørlegger akutt [bynavn]' og ringer første nummer. Har du ikke svart innen 2 ringinger — du taper jobben.",
      "Rørleggeren er med hendene i en vegg — han kan ikke ta telefonen. 50 % av akutt-samtaler blir ikke besvart.",
      "Kunder som ikke får svar i dag, ringer nestemann på lista. Du mister en 3 000–8 000 kr-jobb.",
      "Prisspørsmål ('hva koster bytte av varmtvannsbereder?') ringer på hverdager, men ingen har tid til å svare grundig.",
      "Vakt-rørlegger koster 25 000–40 000 kr/mnd i beredskap — og folk er likevel tregere enn AI.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Hastegradsvurdering i 30 sekunder",
        description:
          "Lekker det? Er varmtvannet borte? Har du stengt hovedkranen? AI-en vurderer akutt/dagsferskt/vanlig og ruter deretter.",
      },
      {
        title: "Prisestimat på standard-jobber",
        description:
          "Bytte av varmtvannsbereder (fra 8 500 kr), utbedring lekkasje (fra 1 800 kr), bytte av WC (fra 4 500 kr). AI-en bruker din prisliste.",
      },
      {
        title: "Booker direkte i kalenderen",
        description:
          "Integrert med Kobas, Tripletex, Superoffice, eller enkel Outlook/Google. AI-en ser ledig tid, matcher jobb med rett rørlegger.",
      },
      {
        title: "Akutt-ruting til vakt",
        description:
          "Ved reell akuttsituasjon sendes samtalen direkte til vakt-rørlegger, med all info (adresse, problem, bilder hvis sendt) i SMS før vakten tar den.",
      },
      {
        title: "Utførende-bilder via SMS",
        description:
          "'Kan du sende bilde?' Kunden sender via SMS, AI-en analyserer (lekkasje under vask? korrodert rør?) og gir bedre estimat.",
      },
    ],

    roiTitle: "ROI for en typisk rørleggerbedrift",
    roiStat: [
      { value: "+28 %", label: "vunnet akuttjobber" },
      { value: "-80 %", label: "tapte henvendelser utenfor arbeidstid" },
      { value: "31 500 kr", label: "ekstra omsetning/mnd" },
    ],

    useCaseTitle: "Slik bruker rørleggere Arxon",
    useCases: [
      {
        title: "Vannlekkasje kl. 23:15",
        description:
          "Kunden ringer i panikk — vann renner fra taket. AI-en spør: 'Har du stengt hovedkranen?' Guider kunden, varsler vakt-rørlegger, gir forventet ankomsttid.",
      },
      {
        title: "Prisestimat før booking",
        description:
          "'Hva koster varmtvannsbereder?' AI-en spør om modell/størrelse, gir estimat (fra 8 500 kr inkl. montering), og booker installasjon.",
      },
      {
        title: "EU-kontroll av gass/vann",
        description:
          "Boligmegler ringer om pålagt kontroll før salg. AI-en booker inspektør, sender rapport-mal, fakturerer ved utført jobb.",
      },
      {
        title: "Entreprise-forespørsel",
        description:
          "Byggefirma ringer om nybygg-rørlegging. AI-en identifiserer stor jobb, ruter direkte til driftsleder — ikke til vanlig vakt.",
      },
    ],

    faq: [
      {
        question: "Kan AI-en gi eksakt pris før befaring?",
        answer:
          "AI-en gir estimater basert på din prisliste (bytte av bereder fra 8 500 kr, lekkasjeutbedring fra 1 800 kr). Eksakt pris avgjøres etter befaring, men estimatet er innenfor ±15 % i 85 % av tilfellene.",
      },
      {
        question: "Hvordan fungerer akutt-ruting?",
        answer:
          "AI-en vurderer hastegrad i 30 sekunder (lekkasje aktiv? varmtvann borte? tett avløp i hoved-wc?). Ved akutt sendes samtalen umiddelbart til vakt-rørlegger via ring-forward, med SMS-briefing til vakten før de tar den.",
      },
      {
        question: "Hvilke rørleggersystemer integreres?",
        answer:
          "Kobas, Tripletex, Superoffice, Pipelife, samt enkel integrasjon med Outlook/Google kalender. Skreddersydd integrasjon på Enterprise-planen.",
      },
      {
        question: "Kan kunden sende bilder av problemet?",
        answer:
          "Ja. AI-en ber om bilde via SMS-link. Bilder analyseres (type rør, omfang av skade, korrosjon) og brukes til å gi bedre estimat eller forberede rørleggeren.",
      },
      {
        question: "Hva om kunden ringer fra landet uten mobildekning?",
        answer:
          "AI-en håndterer tradisjonelle fasttelefoner identisk. Ved dårlig samband gjentas viktige spørsmål og all info fanges — du mister ikke kunden.",
      },
    ],

    ctaTitle: "Svar på akutt-samtaler — også kl. 23",
    ctaText:
      "Book en 20-minutters demo skreddersydd for rørleggere, eller ring AI-en live og test med en 'lekkasje'-samtale.",
  },

  elektriker: {
    slug: "elektriker",
    emoji: "⚡",
    metaTitle:
      "AI-resepsjonist for elektrikere — vinn akuttsamtaler og el-kontroll | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske elektrikere. Svarer på akutt-strømutfall, booker el-kontroll før salg, gir prisestimater og ruter vakt-elektriker — 24/7. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for elektrikere i Norge",
    lede: "Arxon tar telefonen når elektrikeren er oppe på en stige. AI-en håndterer akutt-strømutfall på sekunder, booker el-kontroll før boligsalg, gir prisestimater på standardjobber (sikringsskap, stikkontakter, lamper), og ruter samtaler til rett elektriker basert på jobb-type — 24/7. Bygget for norske elektrikerbedrifter som taper akuttoppdrag fordi telefonen ikke kan besvares i felten.",

    problemTitle: "Problemet: akutt = konkurrenten som svarer",
    problems: [
      "Strømutfall i hele huset. Kunden googler og ringer første elektriker i lista. Går den til telefonsvarer — ringer de nummer to.",
      "Elektrikeren er i skap på hytten til en kunde, langt fra telefonen. 40–50 % av samtaler tapes.",
      "El-kontroll før boligsalg er et stort marked (4 000–8 000 kr per jobb), men kundene må ta tak i det selv. Hvis de ikke får svar, ringer de neste.",
      "Prisspørsmål sluker tid fra fakturerbart arbeid — og hver ubesvart samtale = tapt jobb.",
      "Vakt-elektriker-beredskap er dyrt; en AI som kvalifiserer før vakten ringes gir bedre beredskap-økonomi.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Akutt-triage i sanntid",
        description:
          "Er det lysende eller ikke? Lukter svidd? Varm stikkontakt? AI-en vurderer farepotensiale og ruter — akutt til vakt, ikke-akutt til booking.",
      },
      {
        title: "El-kontroll-booking før salg",
        description:
          "'Jeg skal selge hytta, trenger el-kontroll.' AI-en tar adresse, størrelse, år bygget, gir fast pris og booker inspektør.",
      },
      {
        title: "Prisestimat på standard-jobber",
        description:
          "Sikringsskap-oppgradering (fra 12 000 kr), ny stikkontakt (fra 1 500 kr), LED-downlights (pakke fra 6 500 kr). AI-en bruker din prisliste.",
      },
      {
        title: "Jobb-type-ruting",
        description:
          "Installatør, automasjon, solcelle, industri. AI-en identifiserer jobb-type og ruter samtalen til rett elektriker direkte.",
      },
      {
        title: "Bilder av skap/opplegg via SMS",
        description:
          "Kunden sender bilde av sikringsskapet. AI-en analyserer (gammelt/nytt, antall kurser, jordfeilbryter ja/nei) for bedre tilbud.",
      },
    ],

    roiTitle: "ROI for en typisk elektrikerbedrift",
    roiStat: [
      { value: "+24 %", label: "vunnet akutt-oppdrag" },
      { value: "+45 %", label: "flere el-kontroll-bookinger" },
      { value: "27 800 kr", label: "ekstra omsetning/mnd" },
    ],

    useCaseTitle: "Slik bruker elektrikere Arxon",
    useCases: [
      {
        title: "Strømutfall kl. 20",
        description:
          "Hele huset mørkt. AI-en spør: 'Sikringer nede? Kan du prøve å skru dem på?' Guider kunden, ringer vakt-elektriker hvis det ikke løser seg.",
      },
      {
        title: "Sikringsskap-oppgradering",
        description:
          "'Eldre skap uten jordfeilbryter, må det oppgraderes?' AI-en spør om byggeår, forklarer kravene, gir estimat (fra 12 000 kr), booker befaring.",
      },
      {
        title: "El-kontroll før boligsalg",
        description:
          "Megler ringer på vegne av selger. AI-en tar adresse/størrelse, gir fast pris (4 500 kr for <100 m²), booker inspektør og sender rapport.",
      },
      {
        title: "Varm stikkontakt",
        description:
          "Kunde kjenner at en stikkontakt er varm. AI-en: 'Trekk ut støpsel nå, ikke bruk kontakten, vi booker noen i morgen.' Ruter til vakt hvis røyklukt.",
      },
    ],

    faq: [
      {
        question: "Kan AI-en gi el-forskrift-råd?",
        answer:
          "AI-en forklarer generelle regler (NEK 400, kravet til jordfeilbryter i bolig, osv.) basert på Direktoratet for samfunnssikkerhet og beredskap sine retningslinjer. Konkret installasjonsråd gjøres av autorisert elektriker på befaring.",
      },
      {
        question: "Hvordan vurderes akutte situasjoner?",
        answer:
          "AI-en stiller 3 nøkkelspørsmål: er det strømutfall i hele huset eller kun deler? Lukter det svidd eller røyk? Er noe varmt å ta på? Ved røyklukt eller varm kontakt rutes samtalen umiddelbart til vakt-elektriker med instruks om å koble strømmen på hovedbryter.",
      },
      {
        question: "Hvilke elektrikersystemer integreres?",
        answer:
          "FDV-Elektro, Kobas, Tripletex, Superoffice, samt direkte Outlook/Google-kalender. Skreddersydd integrasjon på Enterprise-planen.",
      },
      {
        question: "Kan AI-en håndtere solcelle-forespørsler?",
        answer:
          "Ja. AI-en samler inn takareal, orientering, hustype og strømforbruk, gir indikativt estimat (Enova-støtte, tilbakebetalingstid), og booker befaring med solcelle-spesialist i bedriften.",
      },
      {
        question: "Hvor raskt rutes akuttsamtaler til vakt?",
        answer:
          "Innen 30–60 sekunder etter at AI-en har vurdert det som akutt. Samtalen viderekobles automatisk, og vakt-elektriker får SMS med all info (adresse, problem-beskrivelse, bilder hvis sendt) før de tar samtalen.",
      },
    ],

    ctaTitle: "Vinn akutt-oppdragene",
    ctaText:
      "Book en 20-minutters demo skreddersydd for elektrikere, eller ring AI-en live og test med en 'strømutfall'-samtale.",
  },

  restaurant: {
    slug: "restaurant",
    emoji: "🍽️",
    metaTitle:
      "AI-resepsjonist for restauranter — ta bordbestillinger 24/7 | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske restauranter. Tar bordreservasjoner 24/7, håndterer take-away-bestillinger, svarer på allergi- og menyspørsmål, og reduserer no-show — integrert med OpenTable og Dinnerbooking. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for restauranter i Norge",
    lede: "Arxon tar telefonen mens kokken skjærer, kelneren serverer og maître d' håndterer gjestene i resepsjonen. AI-en tar bordreservasjoner på norsk, håndterer take-away-bestillinger, svarer på meny-, allergi- og åpningstid-spørsmål, og sender SMS-bekreftelse med no-show-depositum på fullbooket kveld. Bygget for norske restauranter som mister reservasjoner fordi telefonen ringer midt i servitt-trafikken.",

    problemTitle: "Problemet: reservasjoner mistes i servitten",
    problems: [
      "Kveldsvakt har 3 ringinger i minuttet mellom kl. 18 og 20. Ingen har tid til å ta imot alle — 35 % av samtaler forsvinner.",
      "No-show på fullbooket kveld koster typisk 8 000–25 000 kr per fraværende bord.",
      "Take-away-bestillinger blandes sammen med reservasjoner. Kaoset gir feil bestillinger og sure kunder.",
      "Allergi- og spesialbestillinger kommer i siste minutt og krever personal-tid i kjøkken.",
      "Reservasjon-helg-henvendelser i 'off-hours' (søndag ettermiddag, mandag morgen) går tapt helt.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Tar reservasjoner 24/7",
        description:
          "Kunder booker når de vil, ikke når du er åpen. AI-en ser tilgjengelige tider, bordstørrelser, og booker direkte i OpenTable/Dinnerbooking/Resmio.",
      },
      {
        title: "Depositum via Stripe på travle kvelder",
        description:
          "Fredag-lørdag: automatisk 100–200 kr depositum per gjest (refunderbart ved cancel >24t). Reduserer no-show med 70 %.",
      },
      {
        title: "Take-away-bestilling på norsk",
        description:
          "AI-en gjennomgår menyen med kunden, tar bestilling, beregner pris, tar betaling via Stripe-link, og sender til kjøkkenet med klokkeslett.",
      },
      {
        title: "Allergi- og spesialbestilling-håndtering",
        description:
          "Nøtteallergi, glutenintoleranse, vegetarian. AI-en kjenner meny-ingrediensene og varsler kjøkken i forkant — ikke i 18:30-kaoset.",
      },
      {
        title: "Flerspråklig turist-håndtering",
        description:
          "Restaurant i Oslo sentrum eller Bergen: AI-en bytter automatisk til engelsk, tysk, spansk eller kinesisk basert på innringeren.",
      },
    ],

    roiTitle: "ROI for en typisk restaurant",
    roiStat: [
      { value: "-70 %", label: "no-show-rate" },
      { value: "+22 %", label: "reservasjoner/uke" },
      { value: "42 000 kr", label: "ekstra omsetning/mnd" },
    ],

    useCaseTitle: "Slik bruker restauranter Arxon",
    useCases: [
      {
        title: "Fredag-reservasjon fra kl. 15",
        description:
          "Alle vil booke samme kveld. AI-en tar 15 reservasjoner parallelt, krever depositum, sender SMS-bekreftelse, og synkroniserer med OpenTable.",
      },
      {
        title: "Take-away-bestilling kl. 22:00",
        description:
          "Kunden vil ha pizza + salat hentet 22:30. AI-en går gjennom menyen, tar betaling, sender til kjøkken med ferdig-tid — ingen flaskehals på telefonen.",
      },
      {
        title: "Allergi-forespørsel",
        description:
          "'Jeg har nøtte-allergi, hva kan jeg spise?' AI-en går gjennom menyen med hensyn til kryss-kontaminasjon og varsler kjøkken i reservasjonen.",
      },
      {
        title: "Jule-selskap (10+)",
        description:
          "Firma-julelunsj for 12. AI-en tar inn størrelse, menyvalg, allergier, sender meny-forslag og booker lokale/tid med kjøkkensjef.",
      },
    ],

    faq: [
      {
        question: "Hvilke reservasjonssystemer integreres Arxon med?",
        answer:
          "OpenTable, Dinnerbooking, Resmio, TheFork (LaFourchette), ResDiary, og direkte kalenderintegrasjon. Skreddersydd integrasjon på Enterprise-planen.",
      },
      {
        question: "Kan AI-en håndtere allergi-spørsmål ansvarlig?",
        answer:
          "AI-en går gjennom menyen med hensyn til hovedallergener, men varsler alltid kjøkken/kjøkkensjef før retten serveres. Ved alvorlige allergier anbefaler AI-en å ringe direkte for bekreftelse — trygghet først.",
      },
      {
        question: "Hvordan fungerer no-show-depositum?",
        answer:
          "På utvalgte kvelder (fredag/lørdag/helligdager) kan du aktivere 100–200 kr depositum per gjest via Stripe-link. Refunderbart ved kansellering >24t før. Reduserer typisk no-show fra 12 % til <4 %.",
      },
      {
        question: "Kan AI-en ta take-away-bestilling og betaling?",
        answer:
          "Ja. AI-en går gjennom menyen, summerer pris, sender Stripe-link for betaling, og overfører bestilling direkte til kjøkkenet med ferdig-tid. Fungerer også med ekstern leveringstjeneste som Foodora/Wolt hvis integrert.",
      },
      {
        question: "Hvor mange samtidige samtaler håndteres?",
        answer:
          "Ubegrenset. 50 personer kan ringe samtidig — hver får sin egen AI-resepsjonist uten kø.",
      },
    ],

    ctaTitle: "Aldri miste en reservasjon igjen",
    ctaText:
      "Book en 20-minutters demo skreddersydd for restauranter, eller ring AI-en live og test med en 'fredag kveld for 4'-reservasjon.",
  },

  treningssenter: {
    slug: "treningssenter",
    emoji: "💪",
    metaTitle:
      "AI-resepsjonist for treningssenter — fang leads og book PT-timer 24/7 | Arxon",
    metaDescription:
      "Arxon er AI-resepsjonisten for norske treningssentre. Svarer på medlemskap-henvendelser 24/7, booker PT-timer og gruppetimer, håndterer medlemskap-endringer og tar betaling via Stripe. Fra 2 990 kr/mnd.",
    h1: "AI-resepsjonist for treningssenter i Norge",
    lede: "Arxon svarer på medlemskap-henvendelser mens de ansatte jobber i resepsjonen. AI-en forklarer priser og fasiliteter, booker PT-timer og gruppetimer, håndterer medlemskap-endringer (pause, oppsigelse, oppgradering), og tar betaling via Stripe-link — 24/7. Bygget for norske treningssentre som mister leads på kveld og helg fordi telefonen ikke besvares, og som kaster bort personaltid på repeterende medlemskap-spørsmål.",

    problemTitle: "Problemet: leads kommer når du ikke kan svare",
    problems: [
      "50 % av medlemskap-henvendelser kommer på kveld og helg — når resepsjonen er stengt eller underbemannet.",
      "Hver henvendelse som ikke svares innen 1 time har 70 % sannsynlighet for å velge konkurrent.",
      "PT-booking krever koordinering mellom PT-er, tilgjengelighet og medlemmer — og gjøres ofte via manuell SMS-kommunikasjon.",
      "Medlemskap-endringer (pause pga. sykdom, oppsigelse, oppgradering) genererer 30–50 samtaler per uke for en medium senter. Alle med samme svar.",
      "Gruppetime-avbestillinger i siste minutt fører til tomme plasser som kunne vært solgt fra venteliste.",
    ],

    solutionTitle: "Slik løser Arxon det",
    solutionPoints: [
      {
        title: "Konverterer leads 24/7",
        description:
          "'Hva koster medlemskap?' AI-en forklarer priser, fasiliteter, åpningstider, og tilbyr gratis prøvetime — alt på norsk, mens konkurrenten sover.",
      },
      {
        title: "Booker PT og gruppetimer",
        description:
          "Integrert med Mindbody, Glofox, exerp, Compete Loud. AI-en ser ledige slots, matcher PT-kompetanse med medlemsbehov, booker direkte.",
      },
      {
        title: "Medlemskap-endringer uten involvering",
        description:
          "Pause, oppsigelse, oppgradering, endring av betalingsmetode. AI-en utfører selv i systemet ditt og sender bekreftelse.",
      },
      {
        title: "Automatisk ventelisteruting",
        description:
          "Gruppetime-avbud 3 timer før: AI-en ringer/SMSer de 3 øverste på ventelista og fyller plassen. Ingen tom-plasser.",
      },
      {
        title: "Prøvetime-booking + oppfølging",
        description:
          "AI-en booker gratis prøvetime, ringer dagen etter for feedback, og tilbyr medlemskap med Stripe-link direkte — konverterer 35 % flere enn manuell salg.",
      },
    ],

    roiTitle: "ROI for et typisk treningssenter",
    roiStat: [
      { value: "+42 %", label: "medlemskapssalg fra kveldsleads" },
      { value: "14 t/uke", label: "frigjort fra resepsjonen" },
      { value: "52 000 kr", label: "økt omsetning/mnd" },
    ],

    useCaseTitle: "Slik bruker treningssenter Arxon",
    useCases: [
      {
        title: "Medlemskap-lead kl. 21 søndag",
        description:
          "Potensielt medlem ringer etter å ha sett nettsiden. AI-en forklarer priser, booker gratis prøvetime, sender bekreftelse — ferdig salg innen mandag morgen.",
      },
      {
        title: "PT-booking",
        description:
          "Medlem vil booke PT-time. AI-en viser ledige tider for 3 PT-er som matcher målet (vektnedgang, styrke, yoga), booker direkte og sender kalenderinvitasjon.",
      },
      {
        title: "Medlemskap-pause",
        description:
          "Medlem sykmeldt 2 måneder. AI-en verifiserer medlemskap, setter pause i systemet, bekrefter ingen trekk, sender SMS. Null resepsjonsinvolvering.",
      },
      {
        title: "Gruppetime-avbestilling + ventelistefylling",
        description:
          "Yoga-time kl. 18 — 1 avmelding kl. 15. AI-en ringer de 3 øverste på ventelista, får raskt ja fra nr. 1, oppdaterer systemet.",
      },
    ],

    faq: [
      {
        question: "Hvilke treningssenter-systemer integreres Arxon med?",
        answer:
          "Mindbody, Glofox, exerp, Compete Loud, Virtuagym, Membr, Sats-plattformen (for kjeder). Skreddersydd integrasjon på Enterprise-planen.",
      },
      {
        question: "Kan AI-en håndtere medlemskap-oppsigelse?",
        answer:
          "Ja. AI-en verifiserer medlemskap, sjekker oppsigelsestid (typisk 1–3 måneder), bekrefter siste treningsdag, og utfører oppsigelse i systemet. Sender SMS-bekreftelse til medlem.",
      },
      {
        question: "Kan AI-en booke PT-timer basert på mål?",
        answer:
          "Ja. AI-en spør om målet (vektnedgang, styrke, yoga, rehabilitering), matcher mot PT-profiler i systemet, og booker PT med rett kompetanse. Kan også foreslå PT-pakke for bedre pris.",
      },
      {
        question: "Hvordan fungerer ventelistefylling?",
        answer:
          "Ved avbud på full gruppetime ringer/SMSer AI-en de øverste på ventelista umiddelbart. Første som svarer får plassen. Typisk fyllingsgrad ved avbud går fra 30 % (manuell) til 85 % (AI).",
      },
      {
        question: "Kan AI-en ta medlemskap-betaling?",
        answer:
          "Ja, via Stripe-link. Ved ny medlemskap sendes sikker betalingslink, og medlemskap aktiveres automatisk ved betaling. For månedstrekk håndteres dette av ditt medlemskapssystem som vanlig.",
      },
    ],

    ctaTitle: "Konverter flere leads, ikke flere resepsjonister",
    ctaText:
      "Book en 20-minutters demo skreddersydd for treningssenter, eller ring AI-en live og test med en medlemskap-henvendelse.",
  },
}
