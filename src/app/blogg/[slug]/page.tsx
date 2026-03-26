import BlogPostComponent from '@/components/BlogPost';
import { NavBar } from '@/components/ui/tube-light-navbar';
import { Footer } from '@/components/ui/footer-section';
import { getPostBySlug, getAllPosts } from '@/lib/blog-data';
import { Home, Briefcase, Users, FileText, Mail } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Hjem', url: '/', icon: Home },
  { name: 'Tjenester', url: '/#ai-resepsjonister', icon: Briefcase },
  { name: 'Prosess', url: '/#prosess', icon: FileText },
  { name: 'Priser', url: '/#priser', icon: Users },
  { name: 'Kontakt', url: '/#kontakt', icon: Mail },
];

// Generate static params for all blog posts
export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogSlugPageProps {
  params: {
    slug: string;
  };
}

export default function BlogSlugPage({ params }: BlogSlugPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <main className="bg-black min-h-screen text-white">
        <NavBar items={navItems} currentLang="no" onLangChange={() => {}} />
        <div className="pt-32 max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold mb-4">Innlegget ble ikke funnet</h1>
          <p className="text-white/50 mb-8">Denne artikkelen finnes ikke enna.</p>
          <Link href="/blogg" className="text-sm text-white/40 hover:text-white/60 transition-colors">
            Tilbake til bloggen
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-black min-h-screen text-white">
      <NavBar items={navItems} currentLang="no" onLangChange={() => {}} />
      <div className="pt-32">
        <BlogPostComponent post={post} />
      </div>
      <Footer />
    </main>
  );
}
