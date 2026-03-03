export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  display_order: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  category_id: string;
  category_slug: string;
  author: string;
  published_at: string;
  updated_at: string | null;
  read_time: number;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  topic?: string;
}

// Lightweight version for search (no content field)
export type BlogPostSearchItem = Omit<BlogPost, "content">;
