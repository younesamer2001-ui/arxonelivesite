export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  author: string;
  content: BlogSection[];
}

export interface BlogSection {
  type: 'paragraph' | 'heading' | 'stat-row' | 'quote' | 'list';
  text?: string;
  items?: string[];
  stats?: { value: string; label: string }[];
}

export const posts: BlogPost[] = [
  {
    slug: 'ai-resepsjonist-norske-bedrifter',
    title: 'Hva er en AI-resepsjonist — og hvorfor trenger norske bedrifter det?',
    excerpt: 'Norske SMB-er misser 30 % av innkommende henvendelser. En AI-resepsjonist svarer 24/7, booker timer og folger opp leads automatisk.',
    date: '25. mars 2026',
    readTime: '5 min',
    tag: 'AI',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'Hver dag ringer potensielle kunder bedriften din. Noen vil booke time. Andre har et sporsmal. Mange ringer utenfor arbeidstid. Og de fleste legger pa etter 30 sekunder uten svar.',
      },
      {
        type: 'paragraph',
        text: 'For norske bedrifter med 5-50 ansatte er dette ikke et lite problem. Det er tapt omsetning. Hver eneste dag.',
      },
      {
        type: 'heading',
        text: 'Problemet: henvendelser som forsvinner',
      },
      {
        type: 'paragraph',
        text: 'En typisk norsk tannklinikk, treningssenter eller regnskapskontor far mellom 20 og 60 henvendelser per uke. Via telefon, e-post, chat og sosiale medier. Ofte samtidig.',
      },
      {
        type: 'paragraph',
        text: 'Problemet er ikke at de ikke bryr seg. Problemet er kapasitet. Resepsjonisten er opptatt. Telefonen ringer mens noen star i skranken. E-poster hoper seg opp.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '30 %', label: 'av henvendelser misses av SMB-er' },
          { value: '67 %', label: 'av kunder booker ikke pa nytt' },
          { value: '15 sek', label: 'gjennomsnittlig talsmodighet' },
        ],
      },
      {
        type: 'heading',
        text: 'Hva er en AI-resepsjonist?',
      },
      {
        type: 'paragraph',
        text: 'En AI-resepsjonist er ikke en chatbot fra 2018. Det er et intelligent system som handterer innkommende kommunikasjon pa tvers av kanaler — telefon, SMS, e-post, chat — og gjor det en menneskelig resepsjonist gjor. Bare raskere, og 24 timer i dognet.',
      },
      {
        type: 'list',
        items: [
          'Svarer pa henvendelser innen sekunder — pa norsk',
          'Booker timer direkte i kalendersystemet ditt',
          'Kvalifiserer leads og sender varme leads videre til rett person',
          'Folger opp kunder som ikke dukket opp',
          'Gir svar pa vanlige sporsmal uten a involvere ansatte',
        ],
      },
      {
        type: 'paragraph',
        text: 'Tenk pa det som en kollega som aldri er syk, aldri tar pause, og aldri glemmer a folge opp.',
      },
      {
        type: 'heading',
        text: 'Hvorfor norske bedrifter trenger dette na',
      },
      {
        type: 'paragraph',
        text: 'Norge har et av verdens hoyeste lonnsnivaer. A ansette en resepsjonist til fulltid koster fort 500 000 kroner i aret. For mange sma bedrifter er det urealistisk.',
      },
      {
        type: 'paragraph',
        text: 'Samtidig forventer kundene dine umiddelbare svar. De sammenligner deg med selskaper som har 24/7-support. Hvis du ikke svarer, gjor konkurrenten det.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '500 000 kr', label: 'arlig kostnad for en resepsjonist' },
          { value: '24/7', label: 'tilgjengelighet med AI' },
          { value: '< 5 sek', label: 'responstid pa henvendelser' },
        ],
      },
      {
        type: 'heading',
        text: 'Hva koster det a ikke svare?',
      },
      {
        type: 'paragraph',
        text: 'La oss gjore et enkelt regnestykke. Si du misser 5 henvendelser per uke. Av disse ville 2 blitt betalende kunder med en gjennomsnittlig ordresum pa 3 000 kroner.',
      },
      {
        type: 'paragraph',
        text: 'Det er 6 000 kroner per uke. 24 000 per maned. 288 000 kroner i aret. Tapt. Fordi ingen tok telefonen.',
      },
      {
        type: 'quote',
        text: 'Den dyreste ansettelsen du aldri gjor er resepsjonisten du ikke har rad til. Den billigste er AI-en som gjor jobben for en brokdel.',
      },
      {
        type: 'heading',
        text: 'Slik fungerer det i praksis',
      },
      {
        type: 'paragraph',
        text: 'Arxon setter opp AI-resepsjonisten pa 10 dager. Ikke 10 uker. Prosessen er enkel:',
      },
      {
        type: 'list',
        items: [
          'Vi kartlegger henvendelsene dine — hva kommer inn, hvor, og nar',
          'Vi konfigurerer AI-en til a svare med din tone, dine priser, dine tjenester',
          'Vi kobler den til kalender, CRM og eksisterende systemer',
          'Vi tester grundig for du ser den i aksjon',
          'Du er live pa dag 10',
        ],
      },
      {
        type: 'paragraph',
        text: 'Etter lansering overvaker vi systemet og finjusterer basert pa reelle data. Du far en dedikert kontaktperson — ikke et ticketsystem.',
      },
      {
        type: 'heading',
        text: 'Er dette riktig for din bedrift?',
      },
      {
        type: 'paragraph',
        text: 'AI-resepsjonist fungerer best for bedrifter som har jevn strom av henvendelser men ikke kapasitet til a handtere alle. Tannklinikker, frisorsalonger, treningssentre, regnskapskontorer, advokatfirmaer, eiendomsmeglere — alle med bookinger og kundekontakt.',
      },
      {
        type: 'paragraph',
        text: 'Hvis bedriften din misser henvendelser, har du allerede svaret. Sporsmalet er bare hvor lenge du har rad til a vente.',
      },
    ],
  },
  {
    slug: 'roi-ai-automasjon-smb',
    title: 'ROI pa AI-automasjon: tallene ingen snakker om',
    excerpt: '23 flere bookinger per maned. 15 timer spart per uke. Vi deler konkrete tall fra vare forste kunder.',
    date: '20. mars 2026',
    readTime: '4 min',
    tag: 'Resultater',
    author: 'Arxon',
    content: [
      { type: 'paragraph', text: 'Kommer snart.' },
    ],
  },
  {
    slug: 'hvorfor-store-konsulenter-feiler-smb',
    title: 'Hvorfor de store konsulenthusene feiler pa SMB-markedet',
    excerpt: 'Cognite, Bouvet og Bekk betjener enterprise. Men 95 % av norske bedrifter har under 50 ansatte. Hvem hjelper dem?',
    date: '15. mars 2026',
    readTime: '6 min',
    tag: 'Marked',
    author: 'Arxon',
    content: [
      { type: 'paragraph', text: 'Kommer snart.' },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
