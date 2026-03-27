import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://arxon.no"),
  title: {
    default: "Arxon \u2014 AI-drevet kundeservice, booking og salg for norske bedrifter",
    template: "%s | Arxon",
  },
  description:
    "Arxon leverer AI-agenter som automatiserer kundeservice, booking og salg for norske bedrifter. Spar tid, kutt kostnader og gi kundene raskere svar \u2014 24/7. Fra 4 990 kr/mnd.",
  keywords: [
    "AI kundeservice",
    "AI agent Norge",
    "automatisert kundeservice",
    "AI booking",
    "AI salg",
    "norsk AI",
    "chatbot Norge",
    "AI resepsjonist",
    "kundeservice automatisering",
    "Arxon",
    "AI-l\u00f8sning for bedrifter",
    "kunstig intelligens bedrift",
  ],
  authors: [{ name: "Arxon", url: "https://arxon.no" }],
  creator: "Arxon",
  publisher: "Arxon",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://arxon.no",
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: "https://arxon.no",
    siteName: "Arxon",
    title: "Arxon \u2014 AI som jobber for deg",
    description:
      "Automatiser kundeservice, booking og salg med norsk AI. Spar tid og kutt kostnader med intelligente AI-agenter. Fra 4 990 kr/mnd.",
    images: [
      {
        url: "/images/og-arxon.jpg",
        width: 1200,
        height: 630,
        alt: "Arxon \u2014 AI-drevet kundeservice for norske bedrifter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arxon \u2014 AI som jobber for deg",
    description:
      "Automatiser kundeservice, booking og salg med norsk AI. Fra 4 990 kr/mnd.",
    images: ["/images/og-arxon.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://arxon.no/#organization",
      name: "Arxon",
      url: "https://arxon.no",
      logo: {
        "@type": "ImageObject",
        url: "https://arxon.no/images/og-arxon.jpg",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+47-993-53-596",
        contactType: "customer service",
        email: "kontakt@arxon.no",
        availableLanguage: ["Norwegian", "English"],
      },
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": "https://arxon.no/#website",
      url: "https://arxon.no",
      name: "Arxon",
      publisher: { "@id": "https://arxon.no/#organization" },
      inLanguage: "nb-NO",
    },
    {
      "@type": "WebPage",
      "@id": "https://arxon.no/#webpage",
      url: "https://arxon.no",
      name: "Arxon \u2014 AI-drevet kundeservice, booking og salg for norske bedrifter",
      isPartOf: { "@id": "https://arxon.no/#website" },
      about: { "@id": "https://arxon.no/#organization" },
      description:
        "Arxon leverer AI-agenter som automatiserer kundeservice, booking og salg for norske bedrifter.",
      inLanguage: "nb-NO",
    },
    {
      "@type": "Service",
      "@id": "https://arxon.no/#service-resepsjonist",
      name: "AI Resepsjonist",
      provider: { "@id": "https://arxon.no/#organization" },
      description:
        "AI-drevet resepsjonist som svarer p\u00e5 telefon, chat og e-post 24/7. H\u00e5ndterer booking, kundehenvendelser og salg automatisk.",
      offers: {
        "@type": "Offer",
        price: "4990",
        priceCurrency: "NOK",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "4990",
          priceCurrency: "NOK",
          unitText: "mnd",
        },
      },
      areaServed: {
        "@type": "Country",
        name: "Norway",
      },
      serviceType: "AI Kundeservice",
    },
    {
      "@type": "FAQPage",
      "@id": "https://arxon.no/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Hva er Arxon?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arxon er en norsk AI-plattform som automatiserer kundeservice, booking og salg for bedrifter. Vi leverer AI-agenter som svarer kunder 24/7 via telefon, chat og e-post.",
          },
        },
        {
          "@type": "Question",
          name: "Hva koster Arxon?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Arxon starter fra 4 990 kr per m\u00e5ned for AI Resepsjonist-pakken. Vi tilbyr ogs\u00e5 Custom AI og Enterprise-l\u00f8sninger for st\u00f8rre behov.",
          },
        },
        {
          "@type": "Question",
          name: "Hvordan fungerer AI-resepsjonisten?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AI-resepsjonisten h\u00e5ndterer innkommende henvendelser via telefon, chat og e-post. Den kan svare p\u00e5 sp\u00f8rsm\u00e5l, booke avtaler og kvalifisere leads \u2014 helt automatisk, 24 timer i d\u00f8gnet.",
          },
        },
        {
          "@type": "Question",
          name: "Kan Arxon integreres med eksisterende systemer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja, Arxon kan integreres med de fleste CRM-systemer, bookingsystemer og kommunikasjonsplattformer som norske bedrifter bruker i dag.",
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="no" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-black text-white overflow-x-hidden"
        style={{ isolation: "isolate" }}
      >
        {children}
      </body>
    </html>
  )
}
