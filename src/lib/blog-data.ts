export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  category: 'ai' | 'business' | 'guides' | 'news';
  author: string;
  featured?: boolean;
  image?: string;
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
    excerpt: 'Norske SMB-er misser 30 % av innkommende henvendelser. En AI-resepsjonist svarer 24/7, booker timer og følger opp leads automatisk.',
    date: '25. mars 2026',
    readTime: '5 min',
    tag: 'AI',
    category: 'ai',
    author: 'Arxon',
    featured: true,
    content: [
      {
        type: 'paragraph',
        text: 'Hver dag ringer potensielle kunder bedriften din. Noen vil booke time. Andre har et spørsmål. Mange ringer utenfor arbeidstid. Og de fleste legger på etter 30 sekunder uten svar.',
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
        text: 'En typisk norsk tannklinikk, treningssenter eller regnskapskontor får mellom 20 og 60 henvendelser per uke. Via telefon, e-post, chat og sosiale medier. Ofte samtidig.',
      },
      {
        type: 'paragraph',
        text: 'Problemet er ikke at de ikke bryr seg. Problemet er kapasitet. Resepsjonisten er opptatt. Telefonen ringer mens noen står i skranken. E-poster hoper seg opp.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '30 %', label: 'av henvendelser misses av SMB-er' },
          { value: '67 %', label: 'av kunder booker ikke på nytt' },
          { value: '15 sek', label: 'gjennomsnittlig tålmodighet' },
        ],
      },
      {
        type: 'heading',
        text: 'Hva er en AI-resepsjonist?',
      },
      {
        type: 'paragraph',
        text: 'En AI-resepsjonist er ikke en chatbot fra 2018. Det er et intelligent system som håndterer innkommende kommunikasjon på tvers av kanaler — telefon, SMS, e-post, chat — og gjør det en menneskelig resepsjonist gjør. Bare raskere, og 24 timer i døgnet.',
      },
      {
        type: 'list',
        items: [
          'Svarer på henvendelser innen sekunder — på norsk',
          'Booker timer direkte i kalendersystemet ditt',
          'Kvalifiserer leads og sender varme leads videre til rett person',
          'Følger opp kunder som ikke dukket opp',
          'Gir svar på vanlige spørsmål uten å involvere ansatte',
        ],
      },
      {
        type: 'paragraph',
        text: 'Tenk på det som en kollega som aldri er syk, aldri tar pause, og aldri glemmer å følge opp.',
      },
      {
        type: 'heading',
        text: 'Hvorfor norske bedrifter trenger dette na',
      },
      {
        type: 'paragraph',
        text: 'Norge har et av verdens høyeste lønnsnivåer. A ansette en resepsjonist til fulltid koster fort 500 000 kroner i året. For mange sma bedrifter er det urealistisk.',
      },
      {
        type: 'paragraph',
        text: 'Samtidig forventer kundene dine umiddelbare svar. De sammenligner deg med selskaper som har 24/7-support. Hvis du ikke svarer, gjør konkurrenten det.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '500 000 kr', label: 'årlig kostnad for en resepsjonist' },
          { value: '24/7', label: 'tilgjengelighet med AI' },
          { value: '< 5 sek', label: 'responstid på henvendelser' },
        ],
      },
      {
        type: 'heading',
        text: 'Hva koster det å ikke svare?',
      },
      {
        type: 'paragraph',
        text: 'La oss gjøre et enkelt regnestykke. Si du misser 5 henvendelser per uke. Av disse ville 2 blitt betalende kunder med en gjennomsnittlig ordresum på 3 000 kroner.',
      },
      {
        type: 'paragraph',
        text: 'Det er 6 000 kroner per uke. 24 000 per måned. 288 000 kroner i året. Tapt. Fordi ingen tok telefonen.',
      },
      {
        type: 'quote',
        text: 'Den dyreste ansettelsen du aldri gjør er resepsjonisten du ikke har råd til. Den billigste er AI-en som gjør jobben for en brøkdel.',
      },
      {
        type: 'heading',
        text: 'Slik fungerer det i praksis',
      },
      {
        type: 'paragraph',
        text: 'Arxon setter opp AI-resepsjonisten gjennom en strukturert 5-fase prosess. Kartlegging, pilot, evaluering, utrulling og optimalisering:',
      },
      {
        type: 'list',
        items: [
          'Vi kartlegger henvendelsene dine — hva kommer inn, hvor, og nar',
          'Vi konfigurerer AI-en til å svare med din tone, dine priser, dine tjenester',
          'Vi kobler den til kalender, CRM og eksisterende systemer',
          'Vi tester grundig før du ser den i aksjon',
          'Du er live på dag 10',
        ],
      },
      {
        type: 'paragraph',
        text: 'Etter lansering overvaker vi systemet og finjusterer basert på reelle data. Du får en dedikert kontaktperson — ikke et ticketsystem.',
      },
      {
        type: 'heading',
        text: 'Er dette riktig for din bedrift?',
      },
      {
        type: 'paragraph',
        text: 'AI-resepsjonist fungerer best for bedrifter som har jevn strøm av henvendelser men ikke kapasitet til å håndtere alle. Tannklinikker, frisørsalonger, treningssentre, regnskapskontorer, advokatfirmaer, eiendomsmeglere — alle med bookinger og kundekontakt.',
      },
      {
        type: 'paragraph',
        text: 'Hvis bedriften din misser henvendelser, har du allerede svaret. Spørsmålet er bare hvor lenge du har råd til å vente.',
      },
    ],
  },
  {
    slug: 'roi-ai-automasjon-smb',
    title: 'ROI på AI-automasjon: tallene ingen snakker om',
    excerpt: '23 flere bookinger per måned. 15 timer spart per uke. Vi deler konkrete tall fra våre første kunder.',
    date: '20. mars 2026',
    readTime: '4 min',
    tag: 'Resultater',
    category: 'business',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'Alle snakker om AI. Færre snakker om hva det faktisk gir tilbake. Vi har samlet konkrete tall fra de første bedriftene som bruker Arxon — og resultatene er tydeligere enn vi hadde trodd.',
      },
      {
        type: 'heading',
        text: 'Hva måler vi egentlig?',
      },
      {
        type: 'paragraph',
        text: 'Når vi snakker om ROI på AI-automasjon, handler det ikke om abstrakte prosentpoeng. Det handler om tre ting: hvor mange flere henvendelser du fanger opp, hvor mye tid ansatte sparer, og hvor mange av de henvendelsene som ender i faktisk omsetning.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '+23', label: 'flere bookinger per måned' },
          { value: '15 t', label: 'spart per uke i admin' },
          { value: '97 %', label: 'av samtaler besvart' },
        ],
      },
      {
        type: 'heading',
        text: 'Case: bilvask med 3 lokasjoner',
      },
      {
        type: 'paragraph',
        text: 'En bilvask-kjede med tre lokasjoner i Oslo-omradet slet med det samme problemet som de fleste servicebedrifter: telefonen ringte, men ingen svarte. De hadde en deltidsansatt i resepsjonen som også handterte kassen, vask-koordinering og klager. Resultatet? Over halvparten av samtaler gikk ubesvart.',
      },
      {
        type: 'paragraph',
        text: 'Etter to uker med Arxon var bildet et helt annet. AI-resepsjonisten tok samtaler døgnet rundt, booket timer direkte i kalendersystemet og sendte automatiske påminnelser. Kunden trengte ikke lenger ringe tilbake — alt var på plass før de hang opp.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '52 %', label: 'ubesvart før Arxon' },
          { value: '3 %', label: 'ubesvart etter Arxon' },
          { value: '+ 34 000 kr', label: 'ekstra omsetning per måned' },
        ],
      },
      {
        type: 'heading',
        text: 'Regnestykket de fleste overser',
      },
      {
        type: 'paragraph',
        text: 'De fleste bedrifter regner kostnaden av en AI-løsning mot hva de betaler i dag. Men det er feil sammenligning. Du bør regne kostnaden mot hva du taper uten den.',
      },
      {
        type: 'paragraph',
        text: 'Si at du misser 8 henvendelser per uke. 3 av disse ville blitt kunder med en snittordre på 2 500 kroner. Det er 7 500 kroner per uke — 30 000 per måned — i tapt omsetning. En AI-resepsjonist fra Arxon koster en brøkdel av det.',
      },
      {
        type: 'quote',
        text: 'Spørsmålet er ikke om du har råd til AI. Spørsmålet er om du har råd til å la være.',
      },
      {
        type: 'heading',
        text: 'Tid er den skjulte gevinsten',
      },
      {
        type: 'paragraph',
        text: 'Penger er en ting. Men tidsbesparelsen er kanskje enda viktigere for småbedrifter. Når AI-en håndterer rutinesamtaler — åpningstider, priser, booking — frigjør du tid til det som faktisk krever et menneske. Kundeklager. Salg. Strategi.',
      },
      {
        type: 'list',
        items: [
          'Ingen manuell booking — AI-en gjør det direkte i kalenderen',
          'Ingen «kan du ringe tilbake?» — alt løses i første samtale',
          'Automatiske oppsummeringer — du får en daglig rapport, ikke 40 post-its',
          'Færre avbrytelser — ansatte kan fokusere på kjerneoppgavene',
        ],
      },
      {
        type: 'heading',
        text: 'Er dette realistisk for din bedrift?',
      },
      {
        type: 'paragraph',
        text: 'Ja — hvis du har minst 10-15 innkommende henvendelser per uke og tilbyr tjenester som kan bookes eller estimeres. Jo mer repetitivt henvendelsene er, jo større effekt får AI-en.',
      },
      {
        type: 'paragraph',
        text: 'Vi tilbyr en pilotperiode der du ser reelle tall fra din egen bedrift før du forplikter deg. Ingen gjetting — bare data.',
      },
    ],
  },
  {
    slug: 'hvorfor-store-konsulenter-feiler-smb',
    title: 'Hvorfor de store konsulenthusene feiler på SMB-markedet',
    excerpt: 'Cognite, Bouvet og Bekk betjener enterprise. Men 95 % av norske bedrifter har under 50 ansatte. Hvem hjelper dem?',
    date: '15. mars 2026',
    readTime: '6 min',
    tag: 'Marked',
    category: 'business',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'Norge har noen av Europas beste teknologiselskaper. Cognite bygger industriell datainfrastruktur. Bouvet og Bekk leverer digital transformasjon til storbanker og oljebransjen. Men spørsmålet ingen stiller er: hvem hjelper resten?',
      },
      {
        type: 'heading',
        text: '95 % av norske bedrifter har under 50 ansatte',
      },
      {
        type: 'paragraph',
        text: 'Det er lett å glemme når man leser Shifter og E24. Overskriftene handler om milliardkontrakter og enterprise-kunder. Men virkeligheten for norsk næringsliv er frisørsalongen på Grünerløkka, tannklinikken i Sandvika, bilverkstedet på Alnabru. Disse bedriftene har verken budsjett eller tid til å engasjere et konsulenthus til 1 500 kroner timen.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '95 %', label: 'av norske bedrifter har < 50 ansatte' },
          { value: '1 500 kr/t', label: 'typisk timepris store konsulenter' },
          { value: '6-12 mnd', label: 'typisk prosjektlengde enterprise' },
        ],
      },
      {
        type: 'heading',
        text: 'Problemet med enterprise-tilnærmingen',
      },
      {
        type: 'paragraph',
        text: 'Store konsulentselskaper er bygget for store kunder. Lange salgsykluser, omfattende kartleggingsfaser, styringsgrupper og rapporter. Det gir mening når kunden er Equinor. Men når kunden er en treningskjede med 5 lokasjoner, er modellen absurd.',
      },
      {
        type: 'list',
        items: [
          'Oppstartskostnader på 500 000+ kroner før prosjektet i det hele tatt starter',
          'Leveringstid på 6-12 måneder for noe som kunne vært live på 2 uker',
          'Løsninger bygget for skalerbarhet på tvers av 50 land, når kunden trenger noe som fungerer i Fredrikstad',
          'Manglende forståelse for hverdagen til en bedrift med 8 ansatte',
        ],
      },
      {
        type: 'heading',
        text: 'SMB trenger noe helt annet',
      },
      {
        type: 'paragraph',
        text: 'Små og mellomstore bedrifter trenger ikke en «digital strategi». De trenger noen som svarer telefonen når de ikke kan. De trenger et system som booker timer uten at noen logger inn i et dashboard. De trenger en løsning som er oppe på 10 dager, ikke 10 måneder.',
      },
      {
        type: 'quote',
        text: 'Det finnes tusenvis av AI-selskaper for enterprise. Det finnes nesten ingen som faktisk forstår en bilvask med 4 ansatte.',
      },
      {
        type: 'heading',
        text: 'Hvorfør Arxon tenker annerledes',
      },
      {
        type: 'paragraph',
        text: 'Vi bygde Arxon for bedriftene som aldri får besøk av konsulenter. Modellen vår er enkel: vi kartlegger, bygger en pilot, og lar resultatene snakke for seg selv. Ingen PowerPoint-presentasjoner. Ingen styringsgrupper. Bare en AI som tar telefonen og booker timer.',
      },
      {
        type: 'paragraph',
        text: 'Oppstartskostnaden er en brøkdel av hva de store tar. Leveringstiden er dager, ikke måneder. Og vi går faktisk inn i butikken, snakker med de ansatte og forstår hva problemet er før vi skriver en eneste linje kode.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '10 dager', label: 'fra signering til live' },
          { value: '< 15 000 kr', label: 'oppstartskostnad' },
          { value: '4 990 kr/mnd', label: 'standard abonnement' },
        ],
      },
      {
        type: 'heading',
        text: 'Framtiden tilhører de som forstår småbedriftene',
      },
      {
        type: 'paragraph',
        text: 'De neste ti årene vil AI bli like grunnleggende som e-post og nettside. Spørsmålet er om småbedriftene får tilgang til teknologien — eller om den forbeholdes de som allerede har budget og IT-avdeling.',
      },
      {
        type: 'paragraph',
        text: 'Vi tror svaret er ganske enkelt: noen må gjøre det enkelt nok, billig nok og praktisk nok til at en frisørsalong i Trondheim kan bruke det. Det er det vi holder på med.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
