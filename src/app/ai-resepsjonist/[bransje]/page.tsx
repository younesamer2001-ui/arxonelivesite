import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { bransjePages, type BransjePage } from "@/lib/bransje-data"
import {
  graph,
  buildBreadcrumbSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schema"
import BransjeClient from "./BransjeClient"

/**
 * AudienceType per bransje — brukes i Service-schemaets audience-felt
 * for å gi Google og LLM-crawlere eksakt hvilken bransje tjenesten er
 * skreddersydd for. Flat Record sikrer typecheck-feil hvis en ny slug
 * legges til i BransjePage-unionen uten et tilhørende navn her.
 */
const AUDIENCE_TYPE: Record<BransjePage["slug"], string> = {
  frisor: "Frisørsalonger",
  verksted: "Bilverksteder",
  tannlege: "Tannklinikker",
  legekontor: "Legekontor",
  hudpleie: "Hudpleieklinikker",
  advokat: "Advokatkontor",
  regnskap: "Regnskapsbyråer",
  eiendomsmegler: "Eiendomsmeglerkontor",
  rorlegger: "Rørleggerfirmaer",
  elektriker: "Elektrikerfirmaer",
  restaurant: "Restauranter",
  treningssenter: "Treningssentre",
}

/**
 * Server-rendered bransjespesifikk landing-page.
 *
 * Hvorfor server-komponent:
 *   - generateMetadata() krever det — per-side <title>, description, canonical og OG.
 *   - JSON-LD (Service + FAQPage + BreadcrumbList) må rendres serversidig for
 *     at Google og LLM-crawlere skal plukke det opp fra første paint.
 *   - generateStaticParams() gir statisk pre-rendering av alle tre bransjer
 *     på build-tid (raskere + mer SEO-vennlig).
 *
 * Visuell rendering skjer i <BransjeClient/> (client-komponent, trenger animasjoner
 * og language-context/NavBar).
 */

const BASE_URL = "https://arxon.no"

type Params = Promise<{ bransje: string }>

export async function generateStaticParams() {
  return Object.keys(bransjePages).map((slug) => ({ bransje: slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { bransje } = await params
  const page = bransjePages[bransje as keyof typeof bransjePages]
  if (!page) {
    return {
      title: "Bransje ikke funnet — Arxon",
      description: "Denne siden finnes ikke.",
    }
  }

  const canonical = `${BASE_URL}/ai-resepsjonist/${page.slug}`

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: page.metaTitle,
      description: page.metaDescription,
      siteName: "Arxon",
      locale: "nb_NO",
      images: [{ url: "/images/og-arxon.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: ["/images/og-arxon.jpg"],
    },
  }
}

export default async function BransjeLandingPage({
  params,
}: {
  params: Params
}) {
  const { bransje } = await params
  const page = bransjePages[bransje as keyof typeof bransjePages]
  if (!page) notFound()

  const canonical = `${BASE_URL}/ai-resepsjonist/${page.slug}`

  // Service-schema skreddersydd per bransje — gir Google riktig
  // kontekst ("dette er en AI-resepsjonist-tjeneste for frisører") og
  // forbedrer AEO-treffsikkerhet på long-tail-søk.
  const serviceSchema = {
    "@type": "Service",
    "@id": `${canonical}#service`,
    name: page.h1,
    url: canonical,
    provider: { "@id": `${BASE_URL}/#organization` },
    description: page.metaDescription,
    serviceType: "AI Resepsjonist",
    areaServed: { "@type": "Country", name: "Norway" },
    audience: {
      "@type": "BusinessAudience",
      audienceType: AUDIENCE_TYPE[page.slug],
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "NOK",
        description: "Tilpasset pris — kontakt for tilbud",
      },
      availability: "https://schema.org/InStock",
    },
  }

  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Hjem", url: "/" },
    { name: "AI-resepsjonist", url: "/#ai-resepsjonist" },
    {
      name: page.h1,
      url: `/ai-resepsjonist/${page.slug}`,
    },
  ])

  const jsonLd = graph([
    organizationSchema,
    websiteSchema,
    serviceSchema,
    faqSchema,
    breadcrumbSchema,
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BransjeClient page={page} />
    </>
  )
}
