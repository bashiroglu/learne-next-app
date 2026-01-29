import { Metadata } from "next";
import { WritingPracticeProvider } from "@/contexts/WritingPracticeContext";
import { WritingPracticeContent } from "./writing-practice-content";

export const metadata: Metadata = {
  title: "IELTS Writing Practice - Timed Essay Practice | Learne",
  description:
    "Practice IELTS Academic Writing Task 1 and Task 2 with timed conditions. Upload charts and graphs, write essays, and track your word count.",
  keywords: [
    "IELTS writing practice",
    "IELTS Task 1",
    "IELTS Task 2",
    "IELTS essay practice",
    "academic writing practice",
    "timed writing practice",
  ],
  openGraph: {
    title: "IELTS Writing Practice - Timed Essay Practice | Learne",
    description:
      "Practice IELTS Academic Writing Task 1 and Task 2 with timed conditions. Upload charts and graphs, write essays, and track your word count.",
    type: "website",
  },
};

export default function WritingPracticePage() {
  return (
    <WritingPracticeProvider>
      <WritingPracticeContent />
    </WritingPracticeProvider>
  );
}
