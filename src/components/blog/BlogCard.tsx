"use client";

import Link from "next/link";
import { BlogPost } from "@/types/blog";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  grammar: "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  ielts: "bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  vocabulary: "bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  reading: "bg-orange-50 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  writing: "bg-pink-50 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  listening: "bg-teal-50 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
};

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
            categoryColors[post.category_slug] || "bg-gray-100 text-gray-700"
          }`}
        >
          {post.category_slug.charAt(0).toUpperCase() + post.category_slug.slice(1)}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {post.read_time} min
        </span>
      </div>

      <h3 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
        {post.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed flex-grow">
        {post.excerpt}
      </p>

      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(post.published_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Read more
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
