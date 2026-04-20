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
  {
    slug: 'hva-koster-ai-resepsjonist-norge-2026',
    title: 'Hva koster en AI-resepsjonist i Norge i 2026?',
    excerpt: 'Prisene varierer fra 990 kr til 25 000 kr i måneden. Her er en ærlig gjennomgang av hva du faktisk får — og hva du bør unngå.',
    date: '18. april 2026',
    readTime: '7 min',
    tag: 'Pris',
    category: 'guides',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'Kort svar: en AI-resepsjonist for norske SMB-er koster typisk mellom 2 000 og 5 000 kr i måneden for en fullt fungerende løsning. Hvis noen tilbyr deg noe for 299 kr i måneden, er det ikke en AI-resepsjonist — det er en chatbot. Hvis noen tar 25 000 kr i måneden, betaler du for konsulenten, ikke teknologien.',
      },
      {
        type: 'heading',
        text: 'Hva påvirker prisen?',
      },
      {
        type: 'paragraph',
        text: 'Det er tre kostnadsdrivere som bestemmer hva en AI-resepsjonist faktisk koster: hvor mange samtaler den håndterer, hvor mange kanaler (telefon, SMS, e-post, chat), og hvor mye skreddersøm den krever.',
      },
      {
        type: 'list',
        items: [
          'Volum: ubegrenset eller per-minutt-prising? Per-minutt kan bli dyrt fort hvis du har mye trafikk.',
          'Kanaler: bare telefon, eller også SMS, e-post og live chat? Multi-kanal er det som faktisk gir ROI.',
          'Integrasjoner: booker den direkte i Fresha/Timely/DentalSuite, eller må du kopiere manuelt?',
          'Språk: norsk støtte koster mer enn engelsk-bare. Passene at leverandøren faktisk har trent modellen på norsk, ikke bare oversatt.',
          'Støtte: får du en account manager, eller må du finne ut alt selv via dokumentasjon?',
        ],
      },
      {
        type: 'stat-row',
        stats: [
          { value: '990 kr', label: 'chatbot (ikke AI-resepsjonist)' },
          { value: '2 990 kr', label: 'Arxon Starter — full løsning SMB' },
          { value: '25 000 kr', label: 'enterprise-skreddersøm' },
        ],
      },
      {
        type: 'heading',
        text: 'Tre pris-segmenter i markedet',
      },
      {
        type: 'paragraph',
        text: 'Segment 1 — chatbot-verktøy (500–1 500 kr/mnd): Tidio, Intercom, Manychat. Disse er IKKE AI-resepsjonister. De svarer på chat på hjemmesiden, har ingen telefonintegrasjon, og booker ikke automatisk. Greit for B2B SaaS, håpløst for en frisørsalong.',
      },
      {
        type: 'paragraph',
        text: 'Segment 2 — AI-resepsjonist for SMB (2 500–5 000 kr/mnd): Arxon, en håndfull internasjonale alternativer. Full løsning: telefon, SMS, e-post, chat, booking, oppfølging. Gir ROI innen 2–3 måneder på de fleste bransjer.',
      },
      {
        type: 'paragraph',
        text: 'Segment 3 — enterprise (15 000 kr+/mnd): Cognigy, Kore.ai, custom bygg. Kraftige plattformer, men du må ha en utvikler tilgjengelig og budsjettet til å implementere det skikkelig. Overkill for under 50 ansatte.',
      },
      {
        type: 'heading',
        text: 'Skjulte kostnader du bør passe på',
      },
      {
        type: 'list',
        items: [
          'Oppsett-fee: noen tar 10 000–50 000 kr for "onboarding". Arxon gjør det som del av månedsavgiften.',
          'Per-minutt-billing: ser billig ut, men 500 minutter i måneden blir fort 8 000 kr.',
          'Integrasjonsgebyr: noen tar ekstra for hver integrasjon. Sjekk at prisen inkluderer bookingsystemet du faktisk bruker.',
          'Språkmodell-bruk: LLM-kall er ikke gratis. Enten inkluderer leverandøren det, eller du får en overraskelse på regningen.',
          'Oppsigelse: 12 måneders bindingstid er vanlig. Arxon kjører månedlig oppsigelse fordi det er mer rettferdig.',
        ],
      },
      {
        type: 'heading',
        text: 'Hva er ROI på 2 990 kr/mnd?',
      },
      {
        type: 'paragraph',
        text: 'En frisørsalong med 5 stoler som mister 10 bookinger i uka på grunn av ubesvart telefon, taper ca. 24 000 kr/mnd i bruttomargin. En AI-resepsjonist som fanger 60–70 % av dem betaler seg inn 5 ganger over. Regn selv — eller bruk kalkulatoren vår på arxon.no.',
      },
    ],
  },
  {
    slug: 'ai-vs-svartjeneste-sma-bedrifter',
    title: 'AI-resepsjonist vs. svartjeneste — hva bør du velge i 2026?',
    excerpt: 'Svartjenester koster 3 000–8 000 kr i måneden. AI-resepsjonister koster det samme, men gjør mer. Her er forskjellen.',
    date: '12. april 2026',
    readTime: '6 min',
    tag: 'Sammenligning',
    category: 'business',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'For norske småbedrifter har det i mange år vært to alternativer for å håndtere innkommende telefoner når resepsjonisten er opptatt: ansette en til, eller leie en svartjeneste. I 2026 er det et tredje alternativ — AI-resepsjonist — og det endrer regnestykket.',
      },
      {
        type: 'heading',
        text: 'Svartjeneste — hva er det?',
      },
      {
        type: 'paragraph',
        text: 'En svartjeneste er et call-senter som tar telefonene dine når du ikke kan. De svarer med bedriftens navn, tar imot beskjeder, og sender dem til deg via SMS eller e-post. Kostnad: typisk 3 000–8 000 kr/mnd for 50–200 samtaler i måneden, ofte med per-minutt-tillegg.',
      },
      {
        type: 'list',
        items: [
          'Fordeler: ekte menneske i andre enden, god for komplekse samtaler, kunden merker sjelden at det ikke er dere.',
          'Ulemper: åpningstid 08–20 (ikke 24/7), kan ikke booke direkte i systemet ditt, dyre per-minutt-priser, noe som kan eksplodere ved høye volum.',
        ],
      },
      {
        type: 'heading',
        text: 'AI-resepsjonist — hva er forskjellen?',
      },
      {
        type: 'paragraph',
        text: 'En AI-resepsjonist gjør omtrent det samme som en svartjeneste, pluss mye mer — og for samme eller lavere pris. Den booker timer direkte i kalenderen din, følger opp no-shows automatisk, svarer på SMS og e-post i tillegg til telefon, og jobber 24/7 uten ekstra kostnad.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '24/7', label: 'AI svarer alltid' },
          { value: '08–20', label: 'svartjeneste åpen' },
          { value: '0 sek', label: 'AI-svartid' },
        ],
      },
      {
        type: 'heading',
        text: 'Når er svartjeneste best?',
      },
      {
        type: 'paragraph',
        text: 'Svartjeneste gir fortsatt mening hvis samtalene dine er svært komplekse og emosjonelle. Eksempler: begravelsesbyrå, kriseintervensjon, advokat med klientsamtaler som krever mye empati. Der er ekte mennesker verdien verdt.',
      },
      {
        type: 'heading',
        text: 'Når er AI-resepsjonist best?',
      },
      {
        type: 'paragraph',
        text: 'For alt annet — booking, ruting, vanlige spørsmål, oppfølging — er AI-resepsjonist billigere, raskere og mer konsistent. Frisør, verksted, tannlege, legekontor, treningssenter, restaurant, hudpleie — alle disse får bedre ROI på AI enn på svartjeneste.',
      },
      {
        type: 'list',
        items: [
          'Tilgjengelig 24/7 — også kvelder, helger, helligdager',
          'Booker direkte i kalenderen din — ingen dobbeltarbeid',
          'Håndterer ubegrenset volum parallelt — 100 samtaler samtidig, samme pris',
          'SMS, e-post og chat i tillegg til telefon — samme system',
          'Loggfører alt — full sporbarhet uten manuell registrering',
        ],
      },
      {
        type: 'heading',
        text: 'Hybrid: det beste av to verdener',
      },
      {
        type: 'paragraph',
        text: 'Mange norske bedrifter kjører en hybrid-modell: AI tar 80 % av samtalene (bookinger, enkle spørsmål, tidspunktbekreftelser), og ruter de 20 % komplekse samtalene til en menneskelig operatør eller direkte til eier. Dette gir lavest total-kostnad og høyest kundetilfredshet.',
      },
    ],
  },
  {
    slug: 'gdpr-ai-kundeservice-norsk-guide',
    title: 'GDPR og AI-kundeservice i Norge — komplett guide for 2026',
    excerpt: 'Kan du lovlig bruke AI til å håndtere norske kundedata? Ja — men det krever DPA, samtykke og dataresidens. Her er hva du må vite.',
    date: '5. april 2026',
    readTime: '9 min',
    tag: 'Jus',
    category: 'guides',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'Den korte versjonen: ja, du kan lovlig bruke AI-resepsjonist til å håndtere norske kundedata. Men du må ha databehandleravtale (DPA), informere kundene tydelig, holde dataene i EU, og kunne slette dem på forespørsel. Her er hele bildet.',
      },
      {
        type: 'heading',
        text: '1. Rettslig grunnlag — hva må du ha?',
      },
      {
        type: 'paragraph',
        text: 'All behandling av personopplysninger under GDPR krever et rettslig grunnlag. For AI-resepsjonist som håndterer bookinger og kundehenvendelser er de to relevante grunnlagene vanligvis "berettiget interesse" (art. 6(1)(f)) eller "nødvendig for gjennomføring av avtale" (art. 6(1)(b)).',
      },
      {
        type: 'paragraph',
        text: 'Du trenger IKKE alltid eksplisitt samtykke — men du må informere tydelig. Arxon hjelper kunder med å lage riktig personvernerklæring og eventuelle samtykketekster for nettsiden eller telefonmenyen.',
      },
      {
        type: 'heading',
        text: '2. Databehandleravtale (DPA)',
      },
      {
        type: 'paragraph',
        text: 'Når en AI-leverandør behandler personopplysninger på vegne av deg, er de en databehandler. Det krever en skriftlig DPA (art. 28) som regulerer:',
      },
      {
        type: 'list',
        items: [
          'Formål og varighet av behandlingen',
          'Type personopplysninger og kategorier av registrerte',
          'Leverandørens plikter og ansvar',
          'Sikkerhetstiltak (kryptering, tilgangskontroll, logging)',
          'Sletting eller retur av data ved opphør',
          'Eventuelle underdatabehandlere og deres lokasjon',
        ],
      },
      {
        type: 'paragraph',
        text: 'Arxon har ferdig DPA som dekker alle disse punktene og som kan signeres digitalt før oppstart.',
      },
      {
        type: 'heading',
        text: '3. Dataresidens — hvor ligger dataene?',
      },
      {
        type: 'paragraph',
        text: 'Dette er det vanligste spørsmålet vi får. Svaret er enkelt: dataene må ligge i EU/EØS, eller i et land som EU har vurdert som "adequate". USA er IKKE adequate etter Schrems II-dommen — med mindre leverandøren er sertifisert under EU-US Data Privacy Framework.',
      },
      {
        type: 'paragraph',
        text: 'Praktisk betyr det: velg en leverandør som kjører hele stacken i EU-datasentre. Arxon bruker Frankfurt (AWS eu-central-1) og Dublin (eu-west-1) for all databehandling. Ingen norske kundedata forlater EU.',
      },
      {
        type: 'heading',
        text: '4. LLM-bruk og treningsdata',
      },
      {
        type: 'paragraph',
        text: 'Spesielt viktig: blir samtalene dine brukt til å trene fremtidige modeller? Dette er et rødt flagg hvis svaret er ja. OpenAI, Anthropic og Google tilbyr alle "no-training"-opt-out for enterprise-kunder. Sjekk at din leverandør faktisk har skrudd det av.',
      },
      {
        type: 'paragraph',
        text: 'Arxon kjører med zero-retention enterprise-kontrakter mot alle LLM-leverandører. Ingen av kundenes samtaler brukes til trening.',
      },
      {
        type: 'heading',
        text: '5. Rett til innsyn og sletting',
      },
      {
        type: 'paragraph',
        text: 'Kundene dine har rett til å be om innsyn i egne data (art. 15) og rett til sletting (art. 17). Som dataansvarlig er du forpliktet til å svare innen 30 dager. Din AI-leverandør må kunne levere et export/delete-API som du kan bruke når forespørsler kommer inn.',
      },
      {
        type: 'heading',
        text: '6. Automatiserte avgjørelser (art. 22)',
      },
      {
        type: 'paragraph',
        text: 'GDPR gir kundene rett til IKKE å være gjenstand for "fullstendig automatisert avgjørelse" som har betydelig rettslig effekt. I praksis betyr det at hvis AI-resepsjonisten din avslår en bookingforespørsel, må kunden kunne be om menneskelig overprøving. Lav risiko for de fleste SMB-caser, men god å vite.',
      },
      {
        type: 'heading',
        text: 'Sjekkliste før oppstart',
      },
      {
        type: 'list',
        items: [
          'DPA signert med leverandør',
          'Personvernerklæring oppdatert med AI-bruk',
          'Dataresidens bekreftet i EU/EØS',
          'No-training-klausul i LLM-kontrakter',
          'Export/delete-API tilgjengelig',
          'Retensjonstid definert (Arxon: 90 dager som standard, kortere på forespørsel)',
          'Sikkerhetstiltak dokumentert (ISO 27001 / SOC 2 Type II hos leverandør)',
        ],
      },
      {
        type: 'paragraph',
        text: 'Ta kontakt hvis du vil at vi går gjennom din spesifikke situasjon. Arxon har hjulpet over 50 norske bedrifter med GDPR-klar AI-oppsett, inkludert bransjer med ekstra sensitive data (legekontor, tannlege, advokat).',
      },
    ],
  },
  {
    slug: 'integrer-fresha-timely-dentalsuite-ai',
    title: 'Slik integrerer du Fresha, Timely og DentalSuite med AI-resepsjonist',
    excerpt: 'De tre mest brukte booking-systemene i Norge — og hvordan du kobler dem til AI for automatisk booking 24/7.',
    date: '28. mars 2026',
    readTime: '8 min',
    tag: 'Integrasjon',
    category: 'guides',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'Norske SMB-er bruker stort sett tre booking-systemer: Fresha for frisør og skjønnhet, Timely for bredere serviceyrker, og DentalSuite for tannklinikker. Her er en teknisk gjennomgang av hvordan Arxon AI-resepsjonist kobler seg til hver av dem — og hva som faktisk skjer i bakgrunnen når en kunde ringer.',
      },
      {
        type: 'heading',
        text: 'Integrasjon 1 — Fresha',
      },
      {
        type: 'paragraph',
        text: 'Fresha er gratis for salongen, og har en robust API som Arxon kobler seg til via OAuth 2.0. Når en kunde ringer, kjører AI-en denne flyten:',
      },
      {
        type: 'list',
        items: [
          'Kunde ringer og ber om time til klipp neste uke',
          'AI henter tilgjengelige timer for riktig tjeneste + stylist via GET /appointments/available',
          'AI foreslår 2–3 tider på norsk',
          'Kunde velger en',
          'AI booker via POST /appointments med kundeinfo og tjeneste-ID',
          'Fresha sender automatisk SMS-bekreftelse til kunden',
          'AI bekrefter muntlig og avslutter samtalen',
        ],
      },
      {
        type: 'paragraph',
        text: 'Hele flyten tar 30–60 sekunder. Viktig: Fresha har rate-limiting på 100 kall/minutt per salong. For høyere volum må du be Fresha om å øke kvoten.',
      },
      {
        type: 'heading',
        text: 'Integrasjon 2 — Timely',
      },
      {
        type: 'paragraph',
        text: 'Timely brukes mye av hudpleie, massasje, frisør og bredere service-yrker. API-en er REST-basert med API-key-autentisering. Integrasjonen er enklere enn Fresha, men har færre muligheter rundt oppfølging.',
      },
      {
        type: 'paragraph',
        text: 'Arxon håndterer service-mapping automatisk — dvs. når en kunde sier "jeg vil ha gel-negler", finner AI-en den riktige Timely-tjenesten selv uten at du må konfigurere det manuelt. Dette er forskjellen mellom en skikkelig AI-integrasjon og et skript.',
      },
      {
        type: 'heading',
        text: 'Integrasjon 3 — DentalSuite',
      },
      {
        type: 'paragraph',
        text: 'DentalSuite er det mest brukte journalsystemet hos norske tannklinikker. API-en er mer restriktiv — av gode grunner, siden det inneholder pasientjournaler — og krever ekstra sertifisering.',
      },
      {
        type: 'paragraph',
        text: 'Arxon har direkte sertifisering med DentalSuite, og kan derfor booke, endre og kansellere timer på vegne av klinikken. Viktig: AI-en har IKKE tilgang til journaldata. Den ser kun timebok + grunnleggende pasientdata (navn, telefon, preferansetannlege).',
      },
      {
        type: 'heading',
        text: 'Hva med CRM og kalender samtidig?',
      },
      {
        type: 'paragraph',
        text: 'De fleste kundene våre har flere systemer samtidig — f.eks. Fresha for booking, HubSpot for CRM, Gmail Calendar for eierens personlige avtaler. Arxon kjører en to-veis sync mellom alle tre, slik at du ikke får dobbeltbookinger eller duplikate kunder.',
      },
      {
        type: 'list',
        items: [
          'Booking skjer i Fresha/Timely/DentalSuite (primær sannhet)',
          'Leads og oppfølging logges i CRM',
          'Eiers kalender får blokker når eieren har personlige avtaler som skal respekteres',
          'Arxon holder alt synkront i sanntid via webhooks',
        ],
      },
      {
        type: 'heading',
        text: 'Hvor lang tid tar integrasjonen?',
      },
      {
        type: 'paragraph',
        text: 'For Fresha og Timely: 24–48 timer. Du gir Arxon tilgang via OAuth eller API-key, vi konfigurerer tjeneste-mapping, og AI-en er live. For DentalSuite: 3–5 dager, fordi sertifiseringsprosessen tar litt mer tid.',
      },
      {
        type: 'paragraph',
        text: 'Bruker du et annet system (SuperSalon, Shortcut, Visma, osv.)? Arxon støtter 30+ bransjeverktøy. Ta kontakt og be om en integrasjonssjekk før du signerer — vi gjør det gratis.',
      },
    ],
  },
  {
    slug: 'kostnaden-av-ubesvarte-telefoner-regneeksempel',
    title: 'Kostnaden av ubesvarte telefoner — ekte regne-eksempler fra 4 norske bransjer',
    excerpt: 'En ubesvart telefon koster mer enn du tror. Her er tall fra frisør, verksted, tannlege og legekontor — regnet ut med ekte data.',
    date: '22. mars 2026',
    readTime: '6 min',
    tag: 'ROI',
    category: 'business',
    author: 'Arxon',
    content: [
      {
        type: 'paragraph',
        text: 'Vi blir ofte spurt: "men hvor mye koster det egentlig å la en telefon ringe uten svar?". Her er tallene, delt opp på fire typiske norske bransjer, basert på data fra våre første 60 kunder.',
      },
      {
        type: 'heading',
        text: 'Bransje 1 — Frisørsalong (5 stoler, Oslo)',
      },
      {
        type: 'list',
        items: [
          'Innkommende anrop per dag: 45',
          'Missrate uten AI: 38 % (17 anrop/dag)',
          'Anrop som ville ha blitt booking: ca. 60 % (10 bookinger/dag)',
          'Gjennomsnittsverdi per booking: 650 kr',
          'Tapt omsetning per dag: 6 500 kr',
          'Tapt per måned (22 arbeidsdager): 143 000 kr',
          'Bruttomargin (40 %): 57 200 kr/mnd tapt',
        ],
      },
      {
        type: 'paragraph',
        text: 'En AI-resepsjonist til 2 990 kr/mnd som fanger 70 % av disse = 40 000 kr/mnd i reddet margin. ROI: 13× på månedsbasis.',
      },
      {
        type: 'heading',
        text: 'Bransje 2 — Bilverksted (3 teknikere, Bergen)',
      },
      {
        type: 'list',
        items: [
          'Innkommende anrop per dag: 28',
          'Missrate uten AI: 42 % (12 anrop/dag)',
          'Anrop som ville ha blitt service-booking: ca. 50 % (6 bookinger/dag)',
          'Gjennomsnittsverdi per service: 3 200 kr',
          'Tapt omsetning per dag: 19 200 kr',
          'Tapt per måned (22 arbeidsdager): 422 400 kr',
          'Bruttomargin (30 %): 126 720 kr/mnd tapt',
        ],
      },
      {
        type: 'paragraph',
        text: 'Verksted har høyere ordre-verdi, men også færre anrop totalt. ROI på AI-resepsjonist her er typisk 25–35× på månedsbasis. Dette er bransjen hvor AI-en tjener seg inn raskest.',
      },
      {
        type: 'heading',
        text: 'Bransje 3 — Tannklinikk (4 tannleger, Trondheim)',
      },
      {
        type: 'list',
        items: [
          'Innkommende anrop per dag: 65',
          'Missrate uten AI: 25 % (resepsjonisten er til stede)',
          'Anrop som ville ha blitt booking: ca. 55 % (9 bookinger/dag)',
          'Gjennomsnittsverdi per første-konsultasjon: 1 800 kr',
          'Livstidsverdi per pasient: ca. 18 000 kr over 5 år',
          'Tapt livstidsverdi per dag: 162 000 kr',
          'Tapt per måned: 3 564 000 kr i livstidsverdi',
        ],
      },
      {
        type: 'paragraph',
        text: 'Tannlegebransjen har det mest ekstreme regnestykket fordi livstidsverdien på en pasient er så høy. Selv om "bare" 2 pasienter/måned går tapt, er det 36 000 kr i livstidsverdi per måned.',
      },
      {
        type: 'heading',
        text: 'Bransje 4 — Legekontor (2 leger, Stavanger)',
      },
      {
        type: 'list',
        items: [
          'Innkommende anrop per dag: 90 (høyt volum pga. sykdom)',
          'Missrate uten AI: 55 % (anrop over kapasitet, spesielt mandag morgen)',
          'Anrop som fører til negativ pasientopplevelse: ca. 40 %',
          'Pasienter som bytter fastlege per år pga. dårlig tilgjengelighet: 8–15 %',
          'Økonomisk tap per pasient som bytter: ca. 4 500 kr/år i fastlegerefusjon',
        ],
      },
      {
        type: 'paragraph',
        text: 'For legekontor er problemet ikke bare tapt omsetning — det er pasientretensjon og omdømme. En AI som svarer på alle anrop innen 3 sekunder og gir reell hjelp (ikke bare "ring tilbake mellom 08 og 10"), er den største enkeltinvesteringen et legekontor kan gjøre for pasienttilfredshet.',
      },
      {
        type: 'heading',
        text: 'Mønsteret på tvers av bransjer',
      },
      {
        type: 'paragraph',
        text: 'Noen mønstre går igjen uansett bransje: telefonen ringer mest mandag og fredag, mellom 08 og 11, og igjen mellom 15 og 17. 60–70 % av ubesvarte anrop ringer aldri tilbake. Og når de ringer tilbake neste dag, har 30 % allerede booket hos en konkurrent.',
      },
      {
        type: 'stat-row',
        stats: [
          { value: '60 %', label: 'ringer aldri tilbake' },
          { value: '30 %', label: 'booker hos konkurrent' },
          { value: '2–5 mnd', label: 'typisk ROI på AI-resepsjonist' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Vil du ha et regne-eksempel for din spesifikke bransje? Bruk kalkulatoren på arxon.no eller ring oss på +47 993 53 596 — AI-en svarer.',
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
