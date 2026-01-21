import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  getGrammarTestBySlug,
  getGrammarQuestions,
  parseQuestion,
  getAllTestIds,
} from "@/lib/grammar";
import { TestContent, TestLoading } from "./test-content";
import { Suspense } from "react";

// Generate static params for ISR
export async function generateStaticParams() {
  const testIds = await getAllTestIds();
  return testIds.map((item) => ({
    "topic-slug": item.topicSlug,
    "test-slug": item.testSlug,
  }));
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ "topic-slug": string; "test-slug": string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const topicSlug = resolvedParams["topic-slug"];
  const testSlug = resolvedParams["test-slug"];

  const test = await getGrammarTestBySlug(topicSlug, testSlug);

  if (!test) {
    return {
      title: "Test Not Found - Learne",
    };
  }

  const topicName = test.grammar_topics?.name || "Grammar";

  return {
    title: `${test.title} - ${topicName} | Learne`,
    description:
      test.description ||
      `Practice ${test.title} grammar at ${test.level} level. Test your English grammar skills with interactive exercises.`,
    openGraph: {
      title: `${test.title} - ${topicName} | Learne`,
      description:
        test.description ||
        `Practice ${test.title} grammar at ${test.level} level.`,
      type: "website",
    },
  };
}

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ "topic-slug": string; "test-slug": string }>;
}

export default async function GrammarTestPage({ params }: PageProps) {
  const resolvedParams = await params;
  const topicSlug = resolvedParams["topic-slug"];
  const testSlug = resolvedParams["test-slug"];

  // Fetch test data server-side
  const test = await getGrammarTestBySlug(topicSlug, testSlug);

  if (!test) {
    notFound();
  }

  // Fetch questions for this test
  const rawQuestions = await getGrammarQuestions(test.id);
  const questions = rawQuestions.map(parseQuestion);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <Suspense fallback={<TestLoading />}>
        <TestContent test={test} questions={questions} />
      </Suspense>
      <Footer />
    </div>
  );
}
