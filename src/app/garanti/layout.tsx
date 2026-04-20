import type { Metadata } from "next"
import { graph, buildBreadcrumbSchema, organizationSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "30 dagers full refusjon — Arxon garanti",
  description:
    "Arxon gir deg 30 dagers full pengene-tilbake-garanti. Hvis AI-resepsjonisten ikke leverer innen 30 dager, betaler vi alt tilbake. Ingen spørsmål stilt.",
  alternates: { canonical: "https://arxon.no/garanti" },
  openGraph: {
    type: "website",
    url: "https://arxon.no/garanti",
    title: "30 dagers full refusjon — Arxon garanti",
    description:
      "Full refusjon innen 30 dager hvis du ikke er fornøyd med Arxon AI-resepsjonist.",
    siteName: "Arxon",
    locale: "nb_NO",
    images: [{ url: "/images/og-arxon.jpg", width: 1200, height: 630 }],
  },
}

const jsonLd = graph([
  organizationSchema,
  buildBreadcrumbSchema([
    { name: "Hjem", url: "/" },
    { name: "Garanti", url: "/garanti" },
  ]),
])

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
