import { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { getGrammarVideos } from "@/lib/grammar-videos";
import { GrammarVideosContent } from "./grammar-videos-content";

export const metadata: Metadata = {
  title: "Grammar Video Lessons - Learn English Grammar | Learne",
  description:
    "Watch video lessons to master English grammar. Learn with native speakers, transcripts, vocabulary, and quizzes at all levels from A1 to C1.",
  keywords: [
    "English grammar videos",
    "grammar video lessons",
    "learn English grammar online",
    "ESL grammar tutorials",
    "English grammar practice",
    "free grammar lessons",
    "English video lessons",
    "grammar for beginners",
  ],
  alternates: {
    canonical: "https://learne.org/grammar-videos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grammar Video Lessons - Learn English Grammar",
    description: "Watch video lessons to master English grammar. Learn with native speakers, transcripts, vocabulary, and quizzes at all levels from A1 to C1.",
  },
  openGraph: {
    title: "Grammar Video Lessons - Learn English Grammar",
    description: "Watch video lessons to master English grammar. Learn with native speakers, transcripts, vocabulary, and quizzes at all levels from A1 to C1.",
    url: "https://learne.org/grammar-videos",
    siteName: "Learne",
    type: "website",
  },
};

// Revalidate every hour
export const revalidate = 3600;

export default async function GrammarVideosPage() {
  const videos = await getGrammarVideos();

  const itemListItems = videos.map((video) => ({
    name: video.title,
    url: `https://learne.org/grammar-videos/${video.slug}`,
    thumbnailUrl: video.thumbnail_url ||
      (video.youtube_id
        ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
        : undefined),
    description: video.description || undefined,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
      <ItemListJsonLd
        name="Grammar Video Lessons"
        description="Watch video lessons to master English grammar. Learn with native speakers, transcripts, vocabulary, and quizzes at all levels from A1 to C1."
        items={itemListItems}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://learne.org" },
          { name: "Grammar Videos", url: "https://learne.org/grammar-videos" },
        ]}
      />
      <Navbar />

      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Grammar Video Lessons
              </h1>
              <p className="text-muted-foreground mt-1">
                Watch video lessons to master English grammar
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <GrammarVideosContent videos={videos} />
      </main>

      <Footer />
    </div>
  );
}
