import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { posts, getPostBySlug } from "@/lib/blog-data"
import {
  graph,
  buildArticleSchema,
  buildBreadcrumbSchema,
  organizationSchema,
} from "@/lib/schema"
import BlogPostClient from "./BlogPostClient"

/**
 * Server component — provides:
 *   - Per-post metadata (title, description, OG, canonical) via generateMetadata
 *   - Per-post Article + BreadcrumbList JSON-LD
 *   - Static generation at build time via generateStaticParams
 *
 * This was previously a `'use client'` component. Next.js ignores
 * `generateMetadata` on client components, so Google saw the SAME title
 * ("Arxon — AI-drevet kundeservice...") on every blog post. Splitting into
 * server-wrapper + client-child is the fix.
 */

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) {
    return {
      title: "Artikkel ikke funnet",
      robots: { index: false, follow: false },
    }
  }

  const url = `https://arxon.no/blogg/${post.slug}`
  const imageUrl = post.image
    ? `https://arxon.no${post.image}`
    : "https://arxon.no/images/og-arxon.jpg"

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      siteName: "Arxon",
      locale: "nb_NO",
      publishedTime: post.date,
      authors: [post.author],
      tags: [post.tag, post.category],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = graph([
    organizationSchema,
    buildArticleSchema(post),
    buildBreadcrumbSchema([
      { name: "Hjem", url: "/" },
      { name: "Blogg", url: "/blogg" },
      { name: post.title, url: `/blogg/${post.slug}` },
    ]),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} />
    </>
  )
}
