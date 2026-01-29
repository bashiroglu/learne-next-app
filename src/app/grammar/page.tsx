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
  keywords: [
    "English grammar",
    "grammar practice",
    "grammar tests",
    "grammar exercises",
    "CEFR grammar",
    "English learning",
    "ESL grammar",
  ],
  openGraph: {
    title: "Grammar Library - Learne",
    description:
      "Master English grammar with our comprehensive collection of tests and exercises.",
    type: "website",
  },
};

// Revalidate every hour
export const revalidate = 3600;

export default async function GrammarPage() {
  // Fetch all data server-side - filtering happens client-side
  const [topics, tests] = await Promise.all([
    getGrammarTopics(),
    getGrammarTests(),
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<GrammarPageSkeleton />}>
          <GrammarPageContent
            topics={topics}
            tests={tests}
            selectedLevel={null}
          />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
