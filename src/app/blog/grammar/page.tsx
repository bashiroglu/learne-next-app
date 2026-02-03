import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookText } from "lucide-react";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogPost } from "@/types/blog";

export const metadata: Metadata = {
  title: "Grammar Articles | Learne Blog",
  description: "Master English grammar rules and usage with our comprehensive guides.",
};

const topicLabels: Record<string, string> = {
  conditionals: "Conditionals",
  adjectives: "Adjectives",
  adverbs: "Adverbs",
  verbs: "Verbs",
  articles: "Articles",
  nouns: "Nouns",
  modals: "Modals",
};

const topicOrder = ["conditionals", "adjectives", "adverbs", "verbs", "articles", "nouns", "modals"];

function groupPostsByTopic(posts: BlogPost[]) {
  const groups: Record<string, BlogPost[]> = {};
  const uncategorized: BlogPost[] = [];

  posts.forEach((post) => {
    if (post.topic) {
      if (!groups[post.topic]) {
        groups[post.topic] = [];
      }
      groups[post.topic].push(post);
    } else {
      uncategorized.push(post);
    }
  });

  // Sort groups by predefined order
  const sortedGroups = topicOrder
    .filter((topic) => groups[topic]?.length > 0)
    .map((topic) => ({
      topic,
      label: topicLabels[topic] || topic,
      posts: groups[topic],
    }));

  // Add any topics not in the predefined order
  Object.keys(groups).forEach((topic) => {
    if (!topicOrder.includes(topic)) {
      sortedGroups.push({
        topic,
        label: topicLabels[topic] || topic,
        posts: groups[topic],
      });
    }
  });

  return { sortedGroups, uncategorized };
}

export default function GrammarPage() {
  const category = getCategoryBySlug("grammar");
  const posts = getPostsByCategory("grammar");
  const { sortedGroups, uncategorized } = groupPostsByTopic(posts);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/20">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-100 p-4 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <BookText className="h-7 w-7" />
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
          <div className="space-y-12">
            {sortedGroups.map(({ topic, label, posts: topicPosts }) => (
              <section key={topic}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  <h2 className="text-xl font-bold text-foreground">{label}</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {topicPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ))}

            {uncategorized.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-7 w-1 rounded-full bg-primary" />
                  <h2 className="text-xl font-bold text-foreground">Other</h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {uncategorized.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
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
