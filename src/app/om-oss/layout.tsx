import type { Metadata } from "next"
import { graph, buildBreadcrumbSchema, organizationSchema } from "@/lib/schema"

export const metadata: Metadata = {
  title: "Om oss — Arxon",
  description:
    "Arxon ble grunnlagt i 2025 for å gi norske SMB-er en AI-resepsjonist som faktisk virker. Vi bygger på norsk, hoster i EU og jobber kun med bedrifter som mister kunder hver dag fordi telefonen ikke blir besvart.",
  alternates: { canonical: "https://arxon.no/om-oss" },
  openGraph: {
    type: "website",
    url: "https://arxon.no/om-oss",
    title: "Om Arxon — norsk AI-resepsjonist for SMB-er",
    description:
      "Bygget i Norge, hostet i EU. Vi hjelper norske bedrifter med å slutte å miste kunder.",
    siteName: "Arxon",
    locale: "nb_NO",
    images: [{ url: "/images/og-arxon.jpg", width: 1200, height: 630 }],
  },
}

const jsonLd = graph([
  organizationSchema,
  buildBreadcrumbSchema([
    { name: "Hjem", url: "/" },
    { name: "Om oss", url: "/om-oss" },
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
