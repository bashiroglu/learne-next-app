import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getGrammarTopics, getGrammarTests } from "@/lib/grammar";
import { GrammarPageContent, GrammarPageSkeleton } from "./grammar-content";

export const metadata: Metadata = {
  title: "Grammar Library - Learne",
  description:
    "Master English grammar with our comprehensive collection of tests and exercises. Practice grammar at all CEFR levels from A1 to C2.",
  openGraph: {
    title: "Grammar Library - Learne",
    description:
      "Master English grammar with our comprehensive collection of tests and exercises.",
    type: "website",
  },
};

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ level?: string }>;
}

export default async function GrammarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedLevel = params.level || null;

  // Fetch data server-side
  const [topics, tests] = await Promise.all([
    getGrammarTopics(),
    getGrammarTests(undefined, selectedLevel || undefined),
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<GrammarPageSkeleton />}>
          <GrammarPageContent
            topics={topics}
            tests={tests}
            selectedLevel={selectedLevel}
          />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
