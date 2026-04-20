import type { Metadata } from "next"
import { graph, buildBreadcrumbSchema, organizationSchema, websiteSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Blogg — Innsikt om AI, automasjon og norske SMB-er",
  description:
    "Arxon-bloggen: praktisk innsikt om AI-resepsjonist, automatisert kundeservice, ROI og bransjespesifikke guider for norske bedrifter.",
  alternates: { canonical: "https://arxon.no/blogg" },
  openGraph: {
    type: "website",
    url: "https://arxon.no/blogg",
    title: "Arxon-bloggen — AI for norske SMB-er",
    description:
      "Praktisk innsikt om AI-kundeservice, booking og automatisering for norske bedrifter.",
    siteName: "Arxon",
    locale: "nb_NO",
    images: [{ url: "/images/og-arxon.jpg", width: 1200, height: 630 }],
  },
}

const jsonLd = graph([
  organizationSchema,
  websiteSchema,
  {
    "@type": "Blog",
    "@id": "https://arxon.no/blogg#blog",
    url: "https://arxon.no/blogg",
    name: "Arxon-bloggen",
    description:
      "Innsikt om AI-resepsjonist, automatisert kundeservice og bransjespesifikke guider for norske SMB-er.",
    inLanguage: "nb-NO",
    publisher: { "@id": "https://arxon.no/#organization" },
  },
  buildBreadcrumbSchema([
    { name: "Hjem", url: "/" },
    { name: "Blogg", url: "/blogg" },
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
