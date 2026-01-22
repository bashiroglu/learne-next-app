import { supabase } from "./supabase";
import type { ReadingCategory, ReadingArticle, ArticleHighlight } from "@/types/reading";

export async function getReadingCategories(): Promise<ReadingCategory[]> {
  const { data, error } = await supabase
    .from("reading_categories")
    .select("id, name, slug, description, display_order, is_special, color_class")
    .order("display_order");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

// Helper to transform Supabase article data to our ReadingArticle type
function transformArticle(article: Record<string, unknown>): ReadingArticle {
  // Handle reading_categories - Supabase returns it as an array or object depending on the query
  let categories: { slug: string; name: string } | null = null;
  const rawCategories = article.reading_categories;

  if (Array.isArray(rawCategories) && rawCategories.length > 0) {
    categories = rawCategories[0] as { slug: string; name: string };
  } else if (rawCategories && typeof rawCategories === "object") {
    categories = rawCategories as { slug: string; name: string };
  }

  return {
    id: article.id as string,
    slug: article.slug as string,
    title: article.title as string,
    content: article.content as string,
    image_url: article.image_url as string | null,
    word_count: article.word_count as number | null,
    category_id: article.category_id as string | null,
    display_order: article.display_order as number,
    is_published: article.is_published as boolean,
    has_quiz: article.has_quiz as boolean,
    reading_categories: categories,
  };
}

export async function getReadingArticles(categorySlug?: string): Promise<ReadingArticle[]> {
  let query = supabase
    .from("reading_articles")
    .select(
      "id, slug, title, content, image_url, word_count, category_id, display_order, is_published, has_quiz, reading_categories:reading_categories!fk_reading_articles_category(slug, name)"
    )
    .eq("is_published", true)
    .is("cambridge_number", null)
    .order("display_order");

  if (categorySlug && categorySlug !== "all") {
    // First get the category ID
    const { data: category } = await supabase
      .from("reading_categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (category) {
      query = query.eq("category_id", category.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return [];
  }

  return (data || []).map(transformArticle);
}

export async function getArticleById(id: string): Promise<ReadingArticle | null> {
  const { data, error } = await supabase
    .from("reading_articles")
    .select(
      "id, slug, title, content, image_url, word_count, category_id, display_order, is_published, has_quiz, reading_categories:reading_categories!fk_reading_articles_category(slug, name)"
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching article:", error);
    return null;
  }

  return transformArticle(data);
}

export async function getArticleBySlug(slug: string): Promise<ReadingArticle | null> {
  const { data, error } = await supabase
    .from("reading_articles")
    .select(
      "id, slug, title, content, image_url, word_count, category_id, display_order, is_published, has_quiz, reading_categories:reading_categories!fk_reading_articles_category(slug, name)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }

  return transformArticle(data);
}

export async function getArticleHighlights(articleId: string): Promise<{
  phrases: ArticleHighlight[];
  vocabulary: ArticleHighlight[];
  grammar: ArticleHighlight[];
  spelling: ArticleHighlight[];
}> {
  const { data, error } = await supabase
    .from("reading_article_highlights")
    .select("*")
    .eq("article_id", articleId)
    .order("display_order");

  if (error) {
    console.error("Error fetching highlights:", error);
    return { phrases: [], vocabulary: [], grammar: [], spelling: [] };
  }

  const highlights = (data || []) as ArticleHighlight[];

  return {
    phrases: highlights.filter((h) => h.type === "phrase"),
    vocabulary: highlights.filter((h) => h.type === "vocabulary"),
    grammar: highlights.filter((h) => h.type === "grammar"),
    spelling: highlights.filter((h) => h.type === "spelling"),
  };
}

export async function getAllArticleSlugs(): Promise<{ slug: string; categorySlug: string }[]> {
  const { data, error } = await supabase
    .from("reading_articles")
    .select("slug, reading_categories:reading_categories!fk_reading_articles_category(slug)")
    .eq("is_published", true)
    .is("cambridge_number", null);

  if (error) {
    console.error("Error fetching article slugs:", error);
    return [];
  }

  return (data || []).map((article) => {
    // Handle reading_categories - may be array or object
    let categorySlug = "general";
    const rawCategories = article.reading_categories as unknown;

    if (Array.isArray(rawCategories) && rawCategories.length > 0) {
      categorySlug = (rawCategories[0] as { slug: string }).slug;
    } else if (rawCategories && typeof rawCategories === "object" && "slug" in rawCategories) {
      categorySlug = (rawCategories as { slug: string }).slug;
    }

    return {
      slug: article.slug,
      categorySlug,
    };
  });
}

// Keep old function for backwards compatibility
export async function getAllArticleIds(): Promise<{ id: string; categorySlug: string }[]> {
  const { data, error } = await supabase
    .from("reading_articles")
    .select("id, reading_categories:reading_categories!fk_reading_articles_category(slug)")
    .eq("is_published", true)
    .is("cambridge_number", null);

  if (error) {
    console.error("Error fetching article IDs:", error);
    return [];
  }

  return (data || []).map((article) => {
    let slug = "general";
    const rawCategories = article.reading_categories as unknown;

    if (Array.isArray(rawCategories) && rawCategories.length > 0) {
      slug = (rawCategories[0] as { slug: string }).slug;
    } else if (rawCategories && typeof rawCategories === "object" && "slug" in rawCategories) {
      slug = (rawCategories as { slug: string }).slug;
    }

    return {
      id: article.id,
      categorySlug: slug,
    };
  });
}

// Helper to generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
