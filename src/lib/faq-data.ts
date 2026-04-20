/**
 * Single source of truth for FAQ content.
 * Used in:
 *   - src/components/FAQ.tsx (UI)
 *   - src/app/layout.tsx (JSON-LD FAQPage schema — AEO)
 *   - src/app/api/chat (agent knowledge base)
 *
 * When adding a new FAQ, put it here and both the visible FAQ and the
 * structured data on arxon.no update in lockstep. Schema.org requires
 * the answer to match the on-page text; drift between them causes
 * Google to drop rich-results eligibility.
 *
 * Answers written with AEO in mind: direct, ~2 sentences max, facts up
 * front so ChatGPT/Claude/Perplexity can quote them cleanly.
 */

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQContent {
  label: string
  heading: string
  subtext: string
  items: FAQItem[]
  footerText: string
  footerCta: string
}

export const faqContent: { no: FAQContent; en: FAQContent } = {
  no: {
    label: "FAQ",
    heading: "Lurer du på noe?",
    subtext:
      "Her finner du svar på de vanligste spørsmålene om Arxon. Finner du ikke svaret? Ta kontakt.",
    items: [
      {
        question: "Hva er Arxon?",
        answer:
          "Arxon er en norsk AI-plattform som leverer AI-resepsjonister til bedrifter. AI-en svarer på telefon, chat og e-post, booker timer og kvalifiserer leads — automatisk, 24/7, på norsk.",
      },
      {
        question: "Hvordan fungerer AI-resepsjonisten?",
        answer:
          "Når noen ringer bedriften din, svarer Arxon sin AI automatisk. Den forstår hva kunden trenger, booker timer i kalenderen din, sender SMS-bekreftelse og logger alt i dashboardet ditt. Alt skjer på norsk, og kunden merker knapt at det er en AI.",
      },
      {
        question: "Hva koster Arxon?",
        answer:
          "Arxon Starter koster fra 2 990 kr/mnd og Arxon Pro fra 4 990 kr/mnd. Ved månedlig betaling kommer et engangs oppsettsgebyr (5 000 kr Starter, 15 000 kr Pro). Årlig betaling inkluderer gratis oppsett. Enterprise har tilpasset pris for kjeder.",
      },
      {
        question: "Hvilke bedrifter passer Arxon for?",
        answer:
          "Arxon er bygget for norske SMB-er med 5–50 ansatte som mister kunder fordi telefonen ikke blir besvart. Vi har kunder innen frisør, verksted, tannlege, regnskap, treningssenter og eiendom — alle bransjer der innkommende henvendelser er direkte knyttet til omsetning.",
      },
      {
        question: "Hva skjer etter jeg har kjøpt?",
        answer:
          "Når du har valgt en pakke, booker vi en kartleggingscall. Vi går gjennom åpningstider, tjenester og vanlige spørsmål. Deretter bygger vi din skreddersydde AI-resepsjonist og setter den live. Hele prosessen tar 5–10 arbeidsdager.",
      },
      {
        question: "Kan jeg prøve Arxon gratis før jeg bestemmer meg?",
        answer:
          "Ja. Du kan ringe og teste AI-en live akkurat nå — helt gratis, ingen registrering. I tillegg tilbyr vi 30 dagers full refusjon hvis du ikke er fornøyd etter kjøp.",
      },
      {
        question: "Hvor mange språk støtter Arxon?",
        answer:
          "Arxon støtter over 30 språk, inkludert norsk, engelsk, arabisk, spansk, polsk, svensk, dansk og tysk. AI-en kan bytte språk midt i samtalen basert på hva innringeren snakker.",
      },
      {
        question: "Er Arxon GDPR-kompatibel?",
        answer:
          "Ja. All samtaledata behandles i henhold til GDPR, lagres på EU-servere, og kan slettes på forespørsel. Vi har databehandleravtale (DPA) klar for alle kunder. Ingen kundedata sendes ut av EU.",
      },
      {
        question: "Hvordan integreres Arxon med eksisterende systemer?",
        answer:
          "Arxon kobler seg til de fleste norske booking- og CRM-systemer (Cal.com, Calendly, HubSpot, Pipedrive, Fiken, Tripletex, Jobber, Mamut) samt kalendere (Google Calendar, Outlook) og meldingssystemer (SMS, WhatsApp, e-post). Vi setter opp alle integrasjoner under onboarding.",
      },
      {
        question: "Hva skjer hvis AI-en ikke kan svare på et spørsmål?",
        answer:
          "Arxon eskalerer automatisk. Den kan sende samtalen videre til en ansatt, ta en beskjed med kontaktinfo, eller booke et tidspunkt for tilbakering. Du bestemmer selv eskaleringsregler under kartleggingen.",
      },
      {
        question: "Kan jeg avslutte abonnementet når som helst?",
        answer:
          "Ja. Månedlige abonnementer kan avsluttes når som helst uten binding. Årlige abonnementer fullfører perioden, men fornyes ikke automatisk med mindre du velger det.",
      },
      {
        question: "Trenger jeg teknisk kunnskap for å bruke Arxon?",
        answer:
          "Nei. Vi håndterer hele oppsettet — telefonnummer, integrasjoner, trening av AI-en. Du får en enkel web-dashbord der du ser samtaler, bookinger og statistikk. Ingen koding eller IT-avdeling kreves.",
      },
      {
        question: "Hvor raskt kan Arxon være live?",
        answer:
          "Fra signert avtale til live AI-resepsjonist tar typisk 5–10 arbeidsdager. Enkle oppsett går raskere; komplekse integrasjoner eller flerspråklige flyter kan ta opp til 3 uker.",
      },
      {
        question: "Hva er forskjellen mellom Arxon og en vanlig chatbot?",
        answer:
          "En chatbot svarer på tekst i et vindu. Arxon er en fullstendig AI-resepsjonist som tar telefoner, snakker naturlig norsk, booker i kalenderen din, følger opp leads, og jobber på tvers av kanaler. Chatbots erstatter ingen — Arxon erstatter en hel resepsjonistrolle.",
      },
      {
        question: "Hvor lagres dataene mine?",
        answer:
          "Samtaledata og kundedata lagres kryptert på servere i EU (Frankfurt og Stockholm). Vi bruker Supabase (EU-region) og OpenAI Europe for AI-prosessering. Ingen data sendes til USA.",
      },
      {
        question: "Kan Arxon ta betalt for bookinger?",
        answer:
          "Ja. Arxon Pro og Enterprise støtter Stripe-integrasjon for depositum eller forhåndsbetaling ved booking. Nyttig for bransjer der no-show er et problem (tannlege, frisør, behandling).",
      },
      {
        question: "Hva skiller Arxon fra Klaviyo, Intercom og Drift?",
        answer:
          "Disse er internasjonale chat-verktøy. Arxon er norsk-bygget, snakker flytende norsk på telefon, er GDPR-optimalisert for Norge, og støtter norske booking- og regnskapssystemer ut-av-boksen. Vi er bygget for norske SMB-er, ikke globale enterprise.",
      },
      {
        question: "Kan Arxon håndtere flere lokasjoner?",
        answer:
          "Ja. Arxon Enterprise er bygget for kjeder og multi-lokasjon. Én AI kan rute anrop til riktig lokasjon basert på innringerens valg eller geografi, med separat kalender og rapportering per lokasjon.",
      },
      {
        question: "Hva er typisk ROI for Arxon?",
        answer:
          "Kunder ser typisk 15–30 % økt bookingrate fordi tapte anrop nå blir besvart. En frisørsalong med 200 samtaler/uke som berget 10 % flere kunder, tjener ~15 000 kr ekstra/mnd — mer enn hele abonnementet.",
      },
      {
        question: "Tilbyr Arxon en demo?",
        answer:
          "Ja. Book en 20-minutters demo på arxon.no, så viser vi AI-en i aksjon med eksempler fra din bransje. Du kan også ringe live-demoen direkte fra forsiden uten å registrere deg.",
      },
    ],
    footerText: "Fant du ikke svaret?",
    footerCta: "Kontakt oss",
  },
  en: {
    label: "FAQ",
    heading: "Got questions?",
    subtext:
      "Here are the most common questions about Arxon. Can't find your answer? Get in touch.",
    items: [
      {
        question: "What is Arxon?",
        answer:
          "Arxon is a Norwegian AI platform delivering AI receptionists to businesses. The AI answers calls, chat and email, books appointments and qualifies leads — automatically, 24/7, in fluent Norwegian.",
      },
      {
        question: "How does the AI receptionist work?",
        answer:
          "When someone calls your business, Arxon's AI answers automatically. It understands what the customer needs, books appointments in your calendar, sends SMS confirmation, and logs everything in your dashboard.",
      },
      {
        question: "What does Arxon cost?",
        answer:
          "Arxon Starter starts at NOK 2,990/mo and Arxon Pro at NOK 4,990/mo. Monthly billing includes a one-time setup fee (NOK 5,000 Starter, NOK 15,000 Pro). Annual billing includes free setup. Enterprise has custom pricing.",
      },
      {
        question: "Which businesses is Arxon for?",
        answer:
          "Arxon is built for Norwegian SMBs with 5–50 employees that lose customers because calls go unanswered. Our customers span hair salons, auto repair, dentistry, accounting, gyms and real estate.",
      },
      {
        question: "What happens after I buy?",
        answer:
          "After you choose a plan, we book a discovery call, review your opening hours, services and common questions, then build your custom AI receptionist. End-to-end setup takes 5–10 business days.",
      },
      {
        question: "Can I try Arxon for free before buying?",
        answer:
          "Yes. You can call and test the AI live right now — free, no signup. We also offer a 30-day full refund if you're not satisfied after purchase.",
      },
      {
        question: "How many languages does Arxon support?",
        answer:
          "Arxon supports 30+ languages including Norwegian, English, Arabic, Spanish, Polish, Swedish, Danish and German. The AI can switch languages mid-call based on the caller's speech.",
      },
      {
        question: "Is Arxon GDPR-compliant?",
        answer:
          "Yes. All call data is processed per GDPR, stored on EU servers, and deletable on request. We have a Data Processing Agreement (DPA) ready for all customers. No customer data leaves the EU.",
      },
      {
        question: "How does Arxon integrate with existing systems?",
        answer:
          "Arxon connects to most Norwegian booking and CRM systems (Cal.com, Calendly, HubSpot, Pipedrive, Fiken, Tripletex, Jobber, Mamut), calendars (Google, Outlook) and messaging (SMS, WhatsApp, email). We set up all integrations during onboarding.",
      },
      {
        question: "What if the AI can't answer a question?",
        answer:
          "Arxon escalates automatically. It can forward the call to an employee, take a message with contact info, or book a callback time. You define escalation rules during discovery.",
      },
      {
        question: "Can I cancel at any time?",
        answer:
          "Yes. Monthly plans are cancellable anytime with no lock-in. Annual plans run their term but don't auto-renew unless you choose to.",
      },
      {
        question: "Do I need technical knowledge to use Arxon?",
        answer:
          "No. We handle all setup — phone numbers, integrations, training. You get a simple web dashboard to see calls, bookings and stats. No coding or IT team required.",
      },
      {
        question: "How fast can Arxon go live?",
        answer:
          "From signed agreement to live AI receptionist typically takes 5–10 business days. Simple setups are faster; complex integrations or multilingual flows can take up to 3 weeks.",
      },
      {
        question: "How is Arxon different from a chatbot?",
        answer:
          "A chatbot answers text in a widget. Arxon is a full AI receptionist — it takes calls, speaks fluent Norwegian, books appointments, follows up leads, and works across channels. Chatbots replace nothing; Arxon replaces a full receptionist role.",
      },
      {
        question: "Where is my data stored?",
        answer:
          "Call and customer data is stored encrypted on EU servers (Frankfurt and Stockholm). We use Supabase (EU region) and OpenAI Europe for AI processing. No data goes to the US.",
      },
      {
        question: "Can Arxon take payments?",
        answer:
          "Yes. Arxon Pro and Enterprise support Stripe integration for deposits or prepayment at booking. Useful for industries where no-shows are a problem (dentistry, hair, beauty).",
      },
      {
        question: "How is Arxon different from Intercom or Drift?",
        answer:
          "Those are international chat tools. Arxon is Norwegian-built, speaks fluent Norwegian on the phone, is GDPR-optimized for Norway, and supports Norwegian booking and accounting systems out of the box. Built for Norwegian SMBs, not global enterprise.",
      },
      {
        question: "Can Arxon handle multi-location businesses?",
        answer:
          "Yes. Arxon Enterprise is built for chains. One AI can route calls to the right location based on caller choice or geography, with separate calendars and per-location reporting.",
      },
      {
        question: "What's the typical ROI of Arxon?",
        answer:
          "Customers typically see 15–30 % increased booking rate because missed calls now get answered. A salon with 200 weekly calls that saves 10 % more customers earns ~15,000 NOK extra per month — more than the subscription itself.",
      },
      {
        question: "Does Arxon offer a demo?",
        answer:
          "Yes. Book a 20-minute demo at arxon.no and we'll walk you through the AI with examples from your industry. You can also call the live demo directly from the homepage — no signup needed.",
      },
    ],
    footerText: "Didn't find your answer?",
    footerCta: "Contact us",
  },
}
