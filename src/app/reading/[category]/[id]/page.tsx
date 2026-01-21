import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getArticleById, getArticleHighlights, getAllArticleIds } from "@/lib/reading";
import { ArticleContent } from "./article-content";

interface PageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
  const articles = await getAllArticleIds();
  return articles.map((article) => ({
    category: article.categorySlug,
    id: article.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {
      title: "Article Not Found - Learne",
    };
  }

  const description = article.content.slice(0, 160).replace(/\n/g, " ").trim() + "...";

  return {
    title: `${article.title} - Reading Practice | Learne`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

export default async function ArticlePage({ params }: PageProps) {
  const { category, id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const highlights = await getArticleHighlights(id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
      <Navbar />

      <div className="flex-1 container max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/reading">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                {article.reading_categories?.name || category}
              </span>
              {article.word_count && (
                <span className="text-xs text-muted-foreground">{article.word_count} words</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{article.title}</h1>
          </div>
        </div>

        {/* Article Content */}
        <ArticleContent article={article} highlights={highlights} />

        {/* Call to Action */}
        <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10 text-center">
          <BookOpen className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Want to track your reading progress?
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Sign up to measure your reading speed, save vocabulary, and track your improvement over
            time.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="https://app.learne.org/signup">
              <Button className="cursor-pointer">Create Free Account</Button>
            </Link>
            <Link href="https://app.learne.org/login">
              <Button variant="outline" className="cursor-pointer">Sign In</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
