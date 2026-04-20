import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import SmoothScroll from "@/components/SmoothScroll"
import ChatbotWidgetClient from "@/components/ChatbotWidgetClient"
import { LangProvider } from "@/lib/lang-context"
import {
  graph,
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  servicesSchema,
  buildFAQSchema,
  buildHowToSchema,
} from "@/lib/schema"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const grift = localFont({
  src: [
    { path: "../../public/fonts/Grift-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Grift-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Grift-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Grift-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Grift-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "../../public/fonts/Grift-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-grift",
  display: "swap",
})

/**
 * GA4 measurement ID. Set NEXT_PUBLIC_GA4_ID in Vercel envs.
 * Graceful: we only emit the gtag script if the ID is present and not placeholder.
 */
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID
const gaEnabled = GA4_ID && GA4_ID.startsWith("G-") && !GA4_ID.includes("XXXX")

export const metadata: Metadata = {
  metadataBase: new URL("https://arxon.no"),
  title: {
    default:
      "Arxon — AI-resepsjonist for norske bedrifter | Svarer 24/7, booker timer, mister aldri en kunde",
    template: "%s | Arxon",
  },
  description:
    "Arxon er Norges AI-resepsjonist for SMB-er. Svarer på telefon, chat og e-post 24/7, booker timer og kvalifiserer leads automatisk — på norsk. Fra 2 990 kr/mnd. Prøv gratis i dag.",
  // `keywords` is ignored by Google (since 2009) and signals outdated SEO.
  // We omit it deliberately. Target keywords live in page copy, H1/H2 and URL slugs.
  authors: [{ name: "Arxon", url: "https://arxon.no" }],
  creator: "Arxon",
  publisher: "Arxon",
  category: "Technology",
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
    languages: {
      "nb-NO": "https://arxon.no",
      "en-GB": "https://arxon.no?lang=en",
      "x-default": "https://arxon.no",
    },
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    alternateLocale: ["en_GB"],
    url: "https://arxon.no",
    siteName: "Arxon",
    title: "Arxon — AI-resepsjonist for norske bedrifter",
    description:
      "AI som svarer på telefon, booker timer og kvalifiserer leads — 24/7, på norsk. Fra 2 990 kr/mnd.",
    images: [
      {
        url: "/images/og-arxon.jpg",
        width: 1200,
        height: 630,
        alt: "Arxon — AI-resepsjonist for norske bedrifter",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arxon — AI-resepsjonist for norske bedrifter",
    description:
      "AI som svarer på telefon, booker timer og kvalifiserer leads — 24/7, på norsk. Fra 2 990 kr/mnd.",
    images: ["/images/og-arxon.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Fyll inn fra Google Search Console når tilgjengelig.
    // google: "xxxxxxxxxxxxxxxxx",
  },
}

const jsonLd = graph([
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  {
    "@type": "WebPage",
    "@id": "https://arxon.no/#webpage",
    url: "https://arxon.no",
    name: "Arxon — AI-resepsjonist for norske bedrifter",
    isPartOf: { "@id": "https://arxon.no/#website" },
    about: { "@id": "https://arxon.no/#organization" },
    description:
      "Arxon leverer AI-resepsjonister som automatiserer kundeservice, booking og salg for norske bedrifter.",
    inLanguage: "nb-NO",
    primaryImageOfPage: { "@id": "https://arxon.no/#logo" },
  },
  ...servicesSchema,
  buildFAQSchema("no"),
  buildHowToSchema(),
])

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nb" className={`${inter.variable} ${grift.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Google Analytics — only emit when a real GA4 ID is configured */}
        {gaEnabled && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA4_ID}', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
        <link rel="preconnect" href="https://stream.mux.com" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        {/* Vapi voice agent — pre-warm DNS + TLS so click-to-call is faster */}
        <link rel="preconnect" href="https://api.vapi.ai" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.vapi.ai" />
        <link rel="preconnect" href="https://daily.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://daily.co" />
        <link rel="dns-prefetch" href="https://c.daily.co" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-screen bg-black text-white overflow-x-hidden"
        style={{ isolation: "isolate" }}
        suppressHydrationWarning
      >
        <LangProvider>
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <ChatbotWidgetClient />
        </LangProvider>
      </body>
    </html>
  )
}
