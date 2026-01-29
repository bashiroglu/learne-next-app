import { supabase } from "./supabase";
import type { ListeningVideo, VocabularyItem } from "@/types/listening";
import type { Question } from "@/types";

// Database row type for quiz questions
interface QuizQuestionRow {
  id: string;
  video_id: string;
  video_type: string;
  question_type: string;
  question_text: string;
  correct_answer: string;
  explanation: string | null;
  config: string | Record<string, unknown> | null;
  question_order: number;
  created_at: string;
}

export async function getListeningVideos(): Promise<ListeningVideo[]> {
  const { data, error } = await supabase
    .from("trackable_videos")
    .select("*")
    .eq("type", "listening")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching listening videos:", error);
    return [];
  }

  return (data || []) as ListeningVideo[];
}

export async function getListeningVideoBySlug(
  slug: string
): Promise<ListeningVideo | null> {
  const { data, error } = await supabase
    .from("trackable_videos")
    .select("*")
    .eq("type", "listening")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching listening video:", error);
    return null;
  }

  return data as ListeningVideo | null;
}

export async function getAllListeningVideoSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("trackable_videos")
    .select("slug")
    .eq("type", "listening");

  if (error) {
    console.error("Error fetching listening video slugs:", error);
    return [];
  }

  return (data || []).map((v) => v.slug);
}

// Get related videos (same level, excluding current)
export async function getRelatedListeningVideos(
  currentSlug: string,
  level: string | null,
  limit: number = 6
): Promise<ListeningVideo[]> {
  let query = supabase
    .from("trackable_videos")
    .select("*")
    .eq("type", "listening")
    .neq("slug", currentSlug)
    .order("display_order", { ascending: true })
    .limit(limit);

  // If level is provided, prioritize same level
  if (level) {
    query = query.eq("level", level);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching related videos:", error);
    return [];
  }

  // If we didn't get enough videos with same level, fetch more
  if (data && data.length < limit && level) {
    const { data: moreData } = await supabase
      .from("trackable_videos")
      .select("*")
      .eq("type", "listening")
      .neq("slug", currentSlug)
      .neq("level", level)
      .order("display_order", { ascending: true })
      .limit(limit - data.length);

    if (moreData) {
      return [...data, ...moreData] as ListeningVideo[];
    }
  }

  return (data || []) as ListeningVideo[];
}

// Get vocabulary items for a video
export async function getVideoVocabulary(
  videoId: string
): Promise<VocabularyItem[]> {
  const { data, error } = await supabase
    .from("trackable_video_vocabulary")
    .select("*")
    .eq("video_id", videoId)
    .eq("video_type", "listening")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching vocabulary:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    word: item.word,
    type: item.item_type as "word" | "phrase" | "collocation",
    timestamp: item.timestamp_seconds ?? 0,
    context: item.context ?? undefined,
  }));
}

// Get quiz questions for a video
export async function getVideoQuizQuestions(
  videoId: string
): Promise<Question[]> {
  const { data, error } = await supabase
    .from("trackable_video_quiz_questions")
    .select("*")
    .eq("video_id", videoId)
    .eq("video_type", "listening")
    .order("question_order", { ascending: true });

  if (error) {
    console.error("Error fetching quiz questions:", error);
    return [];
  }

  return (data || []).map((row: QuizQuestionRow) => {
    // Handle config that might be string or already parsed object
    let config: Record<string, unknown> = {};
    if (row.config) {
      if (typeof row.config === "string") {
        try {
          config = JSON.parse(row.config);
        } catch {
          config = {};
        }
      } else if (typeof row.config === "object") {
        config = row.config as Record<string, unknown>;
      }
    }

    return {
      id: row.id,
      type: row.question_type,
      question: row.question_text,
      correctAnswer: row.correct_answer,
      explanation: row.explanation ?? undefined,
      options: (config.options as string[] | undefined) ?? undefined,
      segments: config.segments as Question["segments"] | undefined,
      words: (config.words as string[] | undefined) ?? undefined,
    };
  });
}
