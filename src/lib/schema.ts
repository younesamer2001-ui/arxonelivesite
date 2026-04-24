/**
 * JSON-LD schema.org helpers for SEO + AEO.
 *
 * Why these matter:
 *   - Google uses schema to generate rich results (FAQ accordions, breadcrumbs, HowTo steps, ratings)
 *   - LLM crawlers (ChatGPT, Claude, Perplexity) prefer structured data when building answers
 *   - Validated schema is weighted higher in AEO answer synthesis than prose alone
 *
 * Always validate changes with https://search.google.com/test/rich-results before deploy.
 */

import { faqContent } from "./faq-data"

const BASE_URL = "https://arxon.no"

// ---------- Re-usable entities ----------

export const organizationSchema = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Arxon",
  legalName: "Arxon",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/og-arxon.jpg`,
    width: 1200,
    height: 630,
  },
  description:
    "Arxon er en norsk AI-plattform som leverer AI-resepsjonister til bedrifter. AI-en svarer på telefon, chat og e-post, booker timer og kvalifiserer leads — automatisk, 24/7, på norsk.",
  foundingDate: "2025",
  founder: {
    "@type": "Person",
    name: "Younes Amer",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+47-78-89-63-86",
      contactType: "customer service",
      email: "kontakt@arxon.no",
      areaServed: "NO",
      availableLanguage: ["Norwegian", "English"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+47-78-89-63-86",
      contactType: "sales",
      email: "salg@arxon.no",
      areaServed: "NO",
      availableLanguage: ["Norwegian", "English"],
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/arxon-ai",
  ],
}

export const localBusinessSchema = {
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#localbusiness`,
  name: "Arxon",
  image: `${BASE_URL}/images/og-arxon.jpg`,
  url: BASE_URL,
  telephone: "+47-78-89-63-86",
  email: "kontakt@arxon.no",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NO",
    addressLocality: "Oslo",
    addressRegion: "Oslo",
  },
  areaServed: {
    "@type": "Country",
    name: "Norway",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
}

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "Arxon",
  description:
    "Norsk AI-resepsjonist for bedrifter — svarer telefoner, booker timer og kvalifiserer leads automatisk.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "nb-NO",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/blogg?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export const servicesSchema = [
  {
    "@type": "Service",
    "@id": `${BASE_URL}/#service-resepsjonist`,
    name: "AI Resepsjonist — Arxon Starter",
    provider: { "@id": `${BASE_URL}/#organization` },
    description:
      "AI-drevet resepsjonist som svarer på telefon, chat og e-post 24/7. Håndterer booking og kundehenvendelser automatisk.",
    serviceType: "AI Kundeservice",
    areaServed: { "@type": "Country", name: "Norway" },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NOK",
        description: "Tilpasset pris — kontakt for tilbud",
      },
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@type": "Service",
    "@id": `${BASE_URL}/#service-pro`,
    name: "AI Resepsjonist — Arxon Pro",
    provider: { "@id": `${BASE_URL}/#organization` },
    description:
      "Full AI-resepsjonist med ubegrensede samtaler, 30+ språk, Stripe-betaling og avanserte integrasjoner.",
    serviceType: "AI Kundeservice",
    areaServed: { "@type": "Country", name: "Norway" },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NOK",
        description: "Tilpasset pris — kontakt for tilbud",
      },
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@type": "Service",
    "@id": `${BASE_URL}/#service-enterprise`,
    name: "AI Resepsjonist — Arxon Enterprise",
    provider: { "@id": `${BASE_URL}/#organization` },
    description:
      "Skreddersydd AI-plattform for kjeder og multi-lokasjon. Tilpasset integrasjon, rapportering og SLA.",
    serviceType: "AI Kundeservice",
    areaServed: { "@type": "Country", name: "Norway" },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NOK",
        description: "Tilpasset pris basert på antall lokasjoner og bruk",
      },
    },
  },
]

// ---------- Dynamic builders ----------

export function buildFAQSchema(lang: "no" | "en" = "no") {
  return {
    "@type": "FAQPage",
    "@id": `${BASE_URL}/#faq`,
    mainEntity: faqContent[lang].items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

export function buildArticleSchema(post: {
  slug: string
  title: string
  excerpt: string
  date: string
  author: string
  image?: string
  readTime?: string
}) {
  // Parse Norwegian date "25. mars 2026" to ISO
  const iso = norwegianDateToISO(post.date) ?? new Date().toISOString()
  return {
    "@type": "Article",
    "@id": `${BASE_URL}/blogg/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    image: post.image
      ? `${BASE_URL}${post.image}`
      : `${BASE_URL}/images/og-arxon.jpg`,
    datePublished: iso,
    dateModified: iso,
    author: {
      "@type": "Organization",
      name: post.author,
      url: BASE_URL,
    },
    publisher: { "@id": `${BASE_URL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blogg/${post.slug}`,
    },
    inLanguage: "nb-NO",
  }
}

export function buildHowToSchema() {
  return {
    "@type": "HowTo",
    "@id": `${BASE_URL}/#howto-komme-i-gang`,
    name: "Slik kommer du i gang med Arxon AI-resepsjonist",
    description:
      "Fra valgt pakke til live AI-resepsjonist på 5–10 arbeidsdager.",
    totalTime: "P10D",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Velg pakke",
        text: "Velg Arxon Starter, Pro eller Enterprise basert på bedriftens størrelse og behov.",
        url: `${BASE_URL}/#priser`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Kartleggingscall",
        text: "Vi booker 30 minutter for å gå gjennom åpningstider, tjenester og vanlige kundespørsmål.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Vi bygger AI-en din",
        text: "Arxon-teamet setter opp telefonnummer, integrerer med ditt booking- og CRM-system, og trener AI-en på dine tjenester.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Testperiode",
        text: "Du tester AI-en i 2–3 dager, gir tilbakemeldinger, og vi finjusterer.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Live",
        text: "AI-resepsjonisten går live, tar imot samtaler 24/7, og du ser alt i dashbordet.",
      },
    ],
  }
}

// ---------- Utilities ----------

function norwegianDateToISO(input: string): string | null {
  const months: Record<string, string> = {
    januar: "01",
    februar: "02",
    mars: "03",
    april: "04",
    mai: "05",
    juni: "06",
    juli: "07",
    august: "08",
    september: "09",
    oktober: "10",
    november: "11",
    desember: "12",
  }
  const m = input.match(/(\d{1,2})\.\s*([a-zæøå]+)\s+(\d{4})/i)
  if (!m) return null
  const day = m[1].padStart(2, "0")
  const month = months[m[2].toLowerCase()]
  if (!month) return null
  return `${m[3]}-${month}-${day}T00:00:00+02:00`
}

export function graph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  }
}
