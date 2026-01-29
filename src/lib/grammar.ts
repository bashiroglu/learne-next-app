import { supabase } from "./supabase";
import type { GrammarTopic, GrammarTest, GrammarQuestion, ParsedGrammarQuestion } from "@/types/grammar";

export async function getGrammarTopics(): Promise<GrammarTopic[]> {
  const { data, error } = await supabase
    .from("grammar_topics")
    .select("id, name, slug, description, display_order, created_at")
    .order("display_order");

  if (error) {
    console.error("Error fetching grammar topics:", error);
    return [];
  }

  return data || [];
}

// Helper to transform Supabase test data to our GrammarTest type
function transformTest(test: Record<string, unknown>): GrammarTest {
  // Handle grammar_topics - Supabase returns it as an array or object depending on the query
  let topics: { id: string; name: string; slug: string } | null = null;
  const rawTopics = test.grammar_topics;

  if (Array.isArray(rawTopics) && rawTopics.length > 0) {
    topics = rawTopics[0] as { id: string; name: string; slug: string };
  } else if (rawTopics && typeof rawTopics === "object") {
    topics = rawTopics as { id: string; name: string; slug: string };
  }

  return {
    id: test.id as string,
    topic_id: test.topic_id as string | null,
    title: test.title as string,
    description: test.description as string | null,
    level: test.level as string,
    topic: test.topic as string,
    duration: test.duration as number | null,
    is_published: test.is_published as boolean,
    created_at: test.created_at as string,
    grammar_topics: topics,
  };
}

export async function getGrammarTests(topicSlug?: string, level?: string): Promise<GrammarTest[]> {
  let query = supabase
    .from("grammar_tests")
    .select(
      "id, topic_id, title, description, level, topic, duration, is_published, created_at, grammar_topics:grammar_topics!fk_grammar_tests_topic(id, name, slug), grammar_questions!fk_grammar_questions_test(count)"
    )
    .eq("is_published", true)
    .order("level");

  if (topicSlug && topicSlug !== "all") {
    // First get the topic ID
    const { data: topic } = await supabase
      .from("grammar_topics")
      .select("id")
      .eq("slug", topicSlug)
      .single();

    if (topic) {
      query = query.eq("topic_id", topic.id);
    }
  }

  if (level && level !== "all") {
    query = query.eq("level", level);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching grammar tests:", error);
    return [];
  }

  return (data || []).map((test) => {
    const transformed = transformTest(test);
    // Extract question count from the aggregated result
    const questionData = test.grammar_questions as unknown;
    if (Array.isArray(questionData) && questionData.length > 0) {
      transformed.question_count = (questionData[0] as { count: number }).count;
    } else {
      transformed.question_count = 0;
    }
    return transformed;
  });
}

export async function getGrammarTestBySlug(
  topicSlug: string,
  testSlug: string
): Promise<GrammarTest | null> {
  // First, find the topic by slug
  const { data: topic, error: topicError } = await supabase
    .from("grammar_topics")
    .select("id, name, slug")
    .eq("slug", topicSlug)
    .single();

  if (topicError || !topic) {
    console.error("Error fetching topic:", topicError);
    return null;
  }

  // Get all published tests for this topic
  const { data: tests, error: testsError } = await supabase
    .from("grammar_tests")
    .select(
      "id, topic_id, title, description, level, topic, duration, is_published, created_at, grammar_topics:grammar_topics!fk_grammar_tests_topic(id, name, slug)"
    )
    .eq("topic_id", topic.id)
    .eq("is_published", true);

  if (testsError || !tests) {
    console.error("Error fetching tests:", testsError);
    return null;
  }

  // Find the test that matches the slug pattern
  const matchingTest = tests.find((test) => {
    const generatedSlug = generateSlug(`${test.title}-${test.level}`);
    return generatedSlug === testSlug;
  });

  if (!matchingTest) {
    return null;
  }

  return transformTest(matchingTest);
}

export async function getGrammarTestById(testId: string): Promise<GrammarTest | null> {
  const { data, error } = await supabase
    .from("grammar_tests")
    .select(
      "id, topic_id, title, description, level, topic, duration, is_published, created_at, grammar_topics:grammar_topics!fk_grammar_tests_topic(id, name, slug)"
    )
    .eq("id", testId)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching grammar test:", error);
    return null;
  }

  return transformTest(data);
}

export async function getGrammarQuestions(testId: string): Promise<GrammarQuestion[]> {
  const { data, error } = await supabase
    .from("grammar_questions")
    .select("*")
    .eq("test_id", testId)
    .order("question_order", { ascending: true });

  if (error) {
    console.error("Error fetching grammar questions:", error);
    return [];
  }

  return data || [];
}

// Parse raw question data into runtime format
export function parseQuestion(q: GrammarQuestion): ParsedGrammarQuestion {
  // Config is already JSONB from Supabase, no need to parse
  const config = q.config || {};

  // correct_answer is already JSONB from Supabase, no need to parse
  const correctAnswer = q.correct_answer as string | string[] | Array<{ answers: string[] }>;

  return {
    id: q.id,
    type: q.type,
    question: q.question_text,
    correctAnswer: correctAnswer,
    explanation: q.explanation || "",
    options: config.options,
    segments: config.segments,
    words: config.words,
    blanks: config.blanks,
  };
}

export async function getAllTestIds(): Promise<{ topicSlug: string; testSlug: string }[]> {
  const { data: tests, error } = await supabase
    .from("grammar_tests")
    .select(
      "id, title, level, grammar_topics:grammar_topics!fk_grammar_tests_topic(slug)"
    )
    .eq("is_published", true);

  if (error) {
    console.error("Error fetching test IDs:", error);
    return [];
  }

  return (tests || []).map((test) => {
    // Handle grammar_topics - may be array or object
    let topicSlug = "general";
    const rawTopics = test.grammar_topics as unknown;

    if (Array.isArray(rawTopics) && rawTopics.length > 0) {
      topicSlug = (rawTopics[0] as { slug: string }).slug;
    } else if (rawTopics && typeof rawTopics === "object" && "slug" in rawTopics) {
      topicSlug = (rawTopics as { slug: string }).slug;
    }

    const testSlug = generateSlug(`${test.title}-${test.level}`);

    return {
      topicSlug,
      testSlug,
    };
  });
}

// Get related tests by level (excluding current test)
export async function getRelatedTests(
  level: string,
  currentTestId: string,
  limit: number = 10
): Promise<GrammarTest[]> {
  const { data, error } = await supabase
    .from("grammar_tests")
    .select(
      "id, topic_id, title, description, level, topic, duration, is_published, created_at, grammar_topics:grammar_topics!fk_grammar_tests_topic(id, name, slug), grammar_questions!fk_grammar_questions_test(count)"
    )
    .eq("is_published", true)
    .eq("level", level)
    .neq("id", currentTestId)
    .limit(limit);

  if (error) {
    console.error("Error fetching related tests:", error);
    return [];
  }

  return (data || []).map((test) => {
    const transformed = transformTest(test);
    const questionData = test.grammar_questions as unknown;
    if (Array.isArray(questionData) && questionData.length > 0) {
      transformed.question_count = (questionData[0] as { count: number }).count;
    } else {
      transformed.question_count = 0;
    }
    return transformed;
  });
}

// Helper to generate URL-friendly slug from title
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
