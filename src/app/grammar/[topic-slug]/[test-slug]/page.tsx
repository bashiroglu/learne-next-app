import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  EducationalContentJsonLd,
  BreadcrumbJsonLd,
} from "@/components/JsonLd";
import {
  getGrammarTestBySlug,
  getGrammarQuestions,
  parseQuestion,
  getAllTestIds,
  getRelatedTests,
} from "@/lib/grammar";
import { RelatedQuizzes } from "@/components/RelatedQuizzes";
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
  const description =
    test.description ||
    `Practice ${test.title} grammar at ${test.level} level. Test your English grammar skills with interactive exercises.`;

  return {
    title: `${test.title} - ${topicName}`,
    description,
    keywords: [
      test.title,
      topicName,
      `${test.level} grammar`,
      `${test.level} English`,
      "English grammar",
      "grammar test",
      "grammar practice",
    ],
    alternates: {
      canonical: `https://learne.org/grammar/${topicSlug}/${testSlug}`,
    },
    openGraph: {
      title: `${test.title} - ${topicName} | Learne`,
      description,
      url: `https://learne.org/grammar/${topicSlug}/${testSlug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${test.title} - ${topicName} | Learne`,
      description,
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

  // Fetch related tests by level
  const relatedTests = await getRelatedTests(test.level, test.id, 10);

  const topicName = test.grammar_topics?.name || "Grammar";
  const description =
    test.description ||
    `Practice ${test.title} grammar at ${test.level} level.`;

  const breadcrumbItems = [
    { name: "Home", url: "https://learne.org" },
    { name: "Grammar", url: "https://learne.org/grammar" },
    { name: topicName, url: `https://learne.org/grammar?topic=${topicSlug}` },
    {
      name: test.title,
      url: `https://learne.org/grammar/${topicSlug}/${testSlug}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EducationalContentJsonLd
        name={`${test.title} - ${topicName}`}
        description={description}
        url={`https://learne.org/grammar/${topicSlug}/${testSlug}`}
        educationalLevel={test.level}
        about={topicName}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Navbar />
      <Suspense fallback={<TestLoading />}>
        <TestContent test={test} questions={questions} />
      </Suspense>

      {/* Related Quizzes */}
      <div className="container mx-auto px-4 pb-8 max-w-3xl">
        <RelatedQuizzes tests={relatedTests} level={test.level} />
      </div>

      <Footer />
    </div>
  );
}
