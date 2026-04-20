import type { Metadata } from "next"
import { graph, buildBreadcrumbSchema, organizationSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Karriere — Jobb hos Arxon",
  description:
    "Arxon ansetter folk som vil bygge Nordens ledende AI-resepsjonist-plattform. Se åpne stillinger, kultur og søkeprosess.",
  alternates: { canonical: "https://arxon.no/karriere" },
  openGraph: {
    type: "website",
    url: "https://arxon.no/karriere",
    title: "Karriere hos Arxon — bygg fremtidens AI-kundeservice",
    description:
      "Vi bygger Nordens ledende AI-resepsjonist-plattform. Se åpne stillinger hos Arxon.",
    siteName: "Arxon",
    locale: "nb_NO",
    images: [{ url: "/images/og-arxon.jpg", width: 1200, height: 630 }],
  },
}

const jsonLd = graph([
  organizationSchema,
  buildBreadcrumbSchema([
    { name: "Hjem", url: "/" },
    { name: "Karriere", url: "/karriere" },
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
