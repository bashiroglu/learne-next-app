import { Metadata } from "next";
import { getAllCategories, getFeaturedPosts, getAllPosts } from "@/lib/blog";
import { BlogSearch } from "@/components/blog/BlogSearch";
import { CategoryGrid } from "@/components/blog/CategoryGrid";
import { FeaturedPosts } from "@/components/blog/FeaturedPosts";
import { BlogCard } from "@/components/blog/BlogCard";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Learne",
  description: "Learn English with our tips on grammar, IELTS, vocabulary, and more.",
};

export default function BlogPage() {
  const categories = getAllCategories();
  const featured = getFeaturedPosts();
  const latest = getAllPosts().slice(0, 6);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Learne Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tips, guides, and lessons to help you improve your English skills
          </p>
          <div className="mt-8 flex justify-center">
            <BlogSearch />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Browse by Category</h2>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="text-2xl font-bold text-foreground">Featured Articles</h2>
            </div>
            <FeaturedPosts posts={featured} />
          </section>
        )}

        {/* Latest Articles Section */}
        {latest.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
