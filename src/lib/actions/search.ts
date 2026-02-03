"use server";

import { searchPostsLightweight } from "@/lib/blog";
import { BlogPostSearchItem } from "@/types/blog";

export async function searchBlogPosts(query: string): Promise<BlogPostSearchItem[]> {
  if (query.length < 2) return [];
  return searchPostsLightweight(query).slice(0, 5);
}
