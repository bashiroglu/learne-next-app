import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "Reading Articles | Learne Blog",
  description: "Improve your English reading skills with our guides and tips.",
};

export default function ReadingPage() {
  const category = getCategoryBySlug("reading");
  const posts = getPostsByCategory("reading");

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-b from-orange-50/50 to-background dark:from-orange-950/20">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-100 p-4 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {category?.name}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {category?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        {posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No articles yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
