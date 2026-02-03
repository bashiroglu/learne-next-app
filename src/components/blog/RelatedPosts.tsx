"use client";

import { BlogPost } from "@/types/blog";
import { BlogCard } from "./BlogCard";

const topicLabels: Record<string, string> = {
  conditionals: "Conditionals",
  adjectives: "Adjectives",
  verbs: "Verbs",
  articles: "Articles",
  "ielts-tips": "IELTS Tips",
};

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPost?: BlogPost;
}

export function RelatedPosts({ posts, currentPost }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  // Check if there are same-topic articles
  const hasSameTopicPosts =
    currentPost?.topic && posts.some((p) => p.topic === currentPost.topic);

  const topicLabel = currentPost?.topic
    ? topicLabels[currentPost.topic] || currentPost.topic
    : null;

  const header =
    hasSameTopicPosts && topicLabel
      ? `More on ${topicLabel}`
      : "Related Articles";

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h2 className="text-xl font-bold text-foreground">{header}</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
