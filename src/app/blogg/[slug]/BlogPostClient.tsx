"use client"

import { NavBar } from "@/components/ui/tube-light-navbar"
import { Footer } from "@/components/ui/footer-section"
import { navItems } from "@/lib/nav-items"
import { useLang } from "@/lib/lang-context"
import BlogPost from "@/components/BlogPost"
import type { BlogPost as BlogPostType } from "@/lib/blog-data"

/**
 * Client wrapper for blog post rendering. The server component
 * (./page.tsx) handles metadata, JSON-LD, and static param generation;
 * this one owns language context + interactive UI.
 */
export default function BlogPostClient({ post }: { post: BlogPostType }) {
  const { lang: currentLang, setLang: setCurrentLang } = useLang()
  const items = navItems[currentLang]

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
