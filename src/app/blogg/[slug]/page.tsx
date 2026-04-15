'use client'

import { useParams, notFound } from 'next/navigation'
import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import { navItems } from "@/lib/nav-items"
import { useLang } from "@/lib/lang-context"
import BlogPost from "@/components/BlogPost"
import { getPostBySlug } from "@/lib/blog-data"

export default function BlogPostPage() {
  const { lang: currentLang, setLang: setCurrentLang } = useLang()
  const items = navItems[currentLang]
  const { slug } = useParams<{ slug: string }>()
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar
        items={items}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
      />
      <div className="pt-32">
        <BlogPost post={post} />
      </div>
      <Footer />
    </main>
  )
}