import { MetadataRoute } from "next"
import { posts } from "@/lib/blog-data"

/**
 * Sitemap for arxon.no.
 *
 * IMPORTANT: do NOT use `new Date()` for `lastModified` on static routes.
 * Every deploy would bump the timestamp and Google would see it as spammy
 * over-claiming of freshness, eventually lowering sitemap trust.
 *
 * Instead: hard-code the date the content actually changed. When you edit
 * copy on /om-oss, bump that specific entry's date.
 */
const STATIC_LAST_MODIFIED = {
  home: "2026-04-20",
  bransje: "2026-04-20",
  omOss: "2026-04-20",
  blogg: "2026-04-20",
  karriere: "2026-04-20",
  garanti: "2026-04-20",
  personvern: "2026-01-15",
  vilkar: "2026-01-15",
} as const

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://arxon.no"

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blogg/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const bransjer: MetadataRoute.Sitemap = [
    "frisor",
    "verksted",
    "tannlege",
    "legekontor",
    "hudpleie",
    "advokat",
    "regnskap",
    "eiendomsmegler",
    "rorlegger",
    "elektriker",
    "restaurant",
    "treningssenter",
  ].map((slug) => ({
    url: `${baseUrl}/ai-resepsjonist/${slug}`,
    lastModified: new Date(STATIC_LAST_MODIFIED.bransje),
    changeFrequency: "monthly",
    priority: 0.9,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(STATIC_LAST_MODIFIED.home),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...bransjer,
    {
      url: `${baseUrl}/om-oss`,
      lastModified: new Date(STATIC_LAST_MODIFIED.omOss),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogg`,
      lastModified: new Date(STATIC_LAST_MODIFIED.blogg),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogEntries,
    {
      url: `${baseUrl}/karriere`,
      lastModified: new Date(STATIC_LAST_MODIFIED.karriere),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/garanti`,
      lastModified: new Date(STATIC_LAST_MODIFIED.garanti),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/personvern`,
      lastModified: new Date(STATIC_LAST_MODIFIED.personvern),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/vilkar`,
      lastModified: new Date(STATIC_LAST_MODIFIED.vilkar),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
