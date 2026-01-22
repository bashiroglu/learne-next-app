import { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReadingPageContent } from "./reading-content";
import { getReadingCategories, getReadingArticlesPaginated } from "@/lib/reading";

export const metadata: Metadata = {
  title: "Reading Practice - Learne",
  description:
    "Improve your English reading skills with articles across different topics and levels. Practice reading comprehension with curated content.",
  openGraph: {
    title: "Reading Practice - Learne",
    description:
      "Improve your English reading skills with articles across different topics and levels.",
    type: "website",
  },
};

// Revalidate every 12 hours (ISR - Incremental Static Regeneration)
export const revalidate = 43200;

const DEFAULT_LIMIT = 9;
const VALID_LIMITS = [9, 18, 27, 36];

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string; limit?: string }>;
}

export default async function ReadingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const requestedLimit = parseInt(params.limit || String(DEFAULT_LIMIT), 10);
  const limit = VALID_LIMITS.includes(requestedLimit) ? requestedLimit : DEFAULT_LIMIT;

  // Fetch data server-side with pagination
  const [categories, { articles, totalCount }] = await Promise.all([
    getReadingCategories(),
    getReadingArticlesPaginated(selectedCategory, page, limit),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-3">Reading Practice</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Improve your reading skills with articles across different topics and levels
          </p>
        </div>
      </div>

      <div className="flex-1">
        <Suspense fallback={<ReadingPageSkeleton />}>
          <ReadingPageContent
            categories={categories}
            articles={articles}
            selectedCategory={selectedCategory}
            currentPage={page}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={limit}
          />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

function ReadingPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-8 pt-6">
      <div className="h-10 bg-muted rounded-md mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card overflow-hidden">
            <div className="aspect-[4/3] bg-muted animate-pulse" />
            <div className="p-4">
              <div className="h-5 bg-muted rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
            </div>
            <div className="p-4 pt-0">
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
