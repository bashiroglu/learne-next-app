import { blogCategories, blogPosts } from "@/frontend-data/blog_posts";
import { BlogCategory, BlogPost, BlogPostSearchItem } from "@/types/blog";

export function getSearchIndex(): BlogPostSearchItem[] {
  return blogPosts
    .filter((p) => p.is_published)
    .map(({ content, ...rest }) => rest)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

export function getAllCategories(): BlogCategory[] {
  return blogCategories.sort((a, b) => a.display_order - b.display_order);
}

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.is_published).sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((p) => p.is_featured);
}

export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category_slug === categorySlug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug && p.is_published);
}

export function getRelatedPosts(post: BlogPost, limit = 6): BlogPost[] {
  const allPosts = getAllPosts().filter((p) => p.id !== post.id);

  // Same topic posts first (highest priority)
  const sameTopic = post.topic
    ? allPosts.filter((p) => p.topic === post.topic)
    : [];

  // Same category posts (excluding same topic to avoid duplicates)
  const sameCategory = allPosts.filter(
    (p) => p.category_slug === post.category_slug && p.topic !== post.topic
  );

  return [...sameTopic, ...sameCategory].slice(0, limit);
}

export function searchPosts(query: string): BlogPost[] {
  const q = query.toLowerCase();
  return getAllPosts().filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
}

// Lightweight search for client components (excludes content)
export function searchPostsLightweight(query: string): BlogPostSearchItem[] {
  const q = query.toLowerCase();
  return getSearchIndex().filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q))
  );
}
