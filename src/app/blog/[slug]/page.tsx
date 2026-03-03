import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Tag, Play, FileText } from "lucide-react";
import { getPostBySlug, getRelatedPosts, getAllPosts, getCategoryBySlug } from "@/lib/blog";
import { RelatedPosts } from "@/components/blog/RelatedPosts";

const categoryColors: Record<string, string> = {
  grammar: "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  ielts: "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  vocabulary: "bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  reading: "bg-orange-50 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  writing: "bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  listening: "bg-teal-50 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const category = getCategoryBySlug(post.category_slug);

  return (
    <main className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      {/* Header Section */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/blog/${post.category_slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {category?.name || post.category_slug}
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <header className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/blog/${post.category_slug}`}
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium transition-colors hover:opacity-80 ${categoryColors[post.category_slug] || "bg-gray-100 text-gray-700"}`}
          >
            {category?.name || post.category_slug}
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{post.read_time} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <article className="mx-auto max-w-3xl">
          <div
            className="prose prose-slate dark:prose-invert max-w-none prose-lg
              prose-h2:text-[#1a1a4e] dark:prose-h2:text-slate-100 prose-h2:text-[1.75rem] prose-h2:font-extrabold prose-h2:mt-6 prose-h2:mb-2
              prose-h3:text-[#1a1a4e] dark:prose-h3:text-slate-100 prose-h3:text-[1.35rem] prose-h3:font-bold prose-h3:mt-5 prose-h3:mb-1.5
              prose-p:text-foreground/85 prose-p:leading-[1.8] prose-p:my-2
              prose-li:text-foreground/85 prose-li:my-0.5 prose-li:leading-[1.8]
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-2 prose-ol:my-2
              prose-a:text-primary
              prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-5 prose-blockquote:py-1 prose-blockquote:my-3 prose-blockquote:not-italic prose-blockquote:text-foreground/85
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-14 pt-8 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary/70 px-3.5 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Continue Learning */}
          <div className="mt-12 rounded-2xl bg-secondary/50 p-6 md:p-8 border border-border">
            <h3 className="text-xl font-bold text-foreground">Continue Learning</h3>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Reinforce what you've learned with videos and practice tests.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/grammar-videos"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <Play className="h-4 w-4" />
                Watch Grammar Video
              </Link>
              <Link
                href="/grammar"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Take Grammar Test
              </Link>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <div className="mx-auto max-w-3xl">
          <RelatedPosts posts={related} currentPost={post} />
        </div>
      </div>
    </main>
  );
}
