export interface GrammarTopic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface GrammarTest {
  id: string;
  topic_id: string | null;
  title: string;
  description: string | null;
  level: string;
  topic: string; // Topic name as text
  duration: number | null;
  is_published: boolean;
  created_at: string;
  grammar_topics: {
    id: string;
    name: string;
    slug: string;
  } | null;
  question_count?: number;
}

export interface GrammarQuestion {
  id: string;
  test_id: string;
  type: string;
  question_text: string;
  correct_answer: unknown; // JSONB - can be string, array, or object
  explanation: string | null;
  config: {
    options?: string[];
    segments?: Array<{
      type: "text" | "choice";
      content?: string;
      options?: string[];
      correct?: number;
    }>;
    words?: string[];
    blanks?: number;
  } | null; // JSONB
  question_order: number;
  created_at: string;
}

// Parsed/transformed types for runtime use
export interface ParsedGrammarQuestion {
  id: string;
  type: string;
  question: string;
  correctAnswer: string | string[] | Array<{ answers: string[] }>;
  explanation: string;
  options?: string[];
  segments?: Array<{
    type: "text" | "choice";
    content?: string;
    options?: string[];
    correct?: number;
  }>;
  words?: string[];
  blanks?: number;
}
