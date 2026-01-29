export interface ListeningVideo {
  id: string;
  type: "grammar" | "listening";
  slug: string;
  title: string;
  short_title: string | null;
  level: string | null;
  topic: string | null;
  description: string | null;
  thumbnail_url: string | null;
  video_type: string;
  youtube_id: string | null;
  video_url: string | null;
  transcript: TranscriptLine[] | null;
  quiz_key: string | null;
  display_order: number | null;
  created_at: string;
}

// Transcript line as stored in the database (JSON format)
export interface TranscriptLine {
  line: number;
  start: string; // Format: "HH:MM:SS,mmm"
  end: string;   // Format: "HH:MM:SS,mmm"
  text: string;
}

// Vocabulary item
export interface VocabularyItem {
  id: string;
  word: string;
  type: "word" | "phrase" | "collocation";
  timestamp: number; // in seconds
  context?: string;
}
