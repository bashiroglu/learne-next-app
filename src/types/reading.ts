export interface ReadingCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_special: boolean;
  color_class: string | null;
}

export interface ReadingArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  image_url: string | null;
  word_count: number | null;
  category_id: string | null;
  display_order: number;
  is_published: boolean;
  has_quiz: boolean;
  video_url: string | null;
  grammar_test_slug: string | null;
  grammar_topic_slug: string | null;
  reading_categories: {
    slug: string;
    name: string;
  } | null;
}

export interface ArticleHighlight {
  id: string;
  article_id: string;
  type: "phrase" | "vocabulary" | "grammar" | "spelling";
  term: string;
  explanation: string | null;
  correct_spelling: string | null;
  incorrect_spelling: string | null;
  grammar_highlight: string | null;
  display_order: number;
}
