export interface Question {
  id: string;
  type: string;
  question: string;
  correctAnswer: string | string[];
  explanation?: string;
  options?: string[];
  segments?: Array<{
    type: "text" | "choice";
    content?: string;
    options?: string[];
    correct?: number;
  }>;
  words?: string[];
}

export interface Answer {
  questionId: string;
  answer: string | string[];
}

export interface MultiGapCorrectAnswer {
  gaps: Array<{
    id: number;
    accepted: string[];
    caseSensitive?: boolean;
  }>;
}
