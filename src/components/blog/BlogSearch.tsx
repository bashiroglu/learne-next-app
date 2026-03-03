"use client";

import { useState, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchBlogPosts } from "@/lib/actions/search";
import { BlogPostSearchItem } from "@/types/blog";
import Link from "next/link";

export function BlogSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BlogPostSearchItem[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length > 1) {
      startTransition(async () => {
        const posts = await searchBlogPosts(value);
        setResults(posts);
      });
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {isPending ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input placeholder="Search articles..." value={query} onChange={(e) => handleSearch(e.target.value)} className="pl-9" />
      {results.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-lg border bg-popover p-2 shadow-lg">
          {results.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block rounded px-3 py-2 text-sm hover:bg-accent" onClick={() => { setQuery(""); setResults([]); }}>
              {post.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
