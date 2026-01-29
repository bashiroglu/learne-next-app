import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Headphones, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ItemListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { getListeningVideos } from "@/lib/listening";
import type { ListeningVideo } from "@/types/listening";

export const metadata: Metadata = {
  title: "Listening Practice - Learn English with Videos | Learne",
  description:
    "Improve your English listening skills with video lessons. Practice with native speakers, transcripts, and quizzes at all levels from A1 to C1.",
  keywords: [
    "English listening practice",
    "listening comprehension exercises",
    "learn English listening online",
    "ESL listening videos",
    "improve listening skills",
    "English audio lessons",
    "listening practice for beginners",
    "English comprehension practice",
  ],
  alternates: {
    canonical: "https://learne.org/listening",
  },
  twitter: {
    card: "summary_large_image",
    title: "Listening Practice - Learn English with Videos",
    description: "Improve your English listening skills with video lessons. Practice with native speakers, transcripts, and quizzes at all levels from A1 to C1.",
  },
  openGraph: {
    title: "Listening Practice - Learn English with Videos",
    description: "Improve your English listening skills with video lessons. Practice with native speakers, transcripts, and quizzes at all levels from A1 to C1.",
    url: "https://learne.org/listening",
    siteName: "Learne",
    type: "website",
  },
};

// Revalidate every hour
export const revalidate = 3600;

const levelColors: Record<string, string> = {
  A1: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  A2: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  B1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  C1: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  C2: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

const levelTitles: Record<string, string> = {
  A1: "A1 - Beginner",
  A2: "A2 - Elementary",
  B1: "B1 - Intermediate",
  B2: "B2 - Upper Intermediate",
  C1: "C1 - Advanced",
  C2: "C2 - Proficiency",
};

function groupVideosByLevel(videos: ListeningVideo[]) {
  const grouped = videos.reduce(
    (acc, video) => {
      const level = video.level || "Other";
      if (!acc[level]) acc[level] = [];
      acc[level].push(video);
      return acc;
    },
    {} as Record<string, ListeningVideo[]>
  );

  // Sort by level order
  const levelOrder: Record<string, number> = {
    A1: 1,
    A2: 2,
    B1: 3,
    B2: 4,
    C1: 5,
    C2: 6,
    Other: 999,
  };

  return Object.entries(grouped).sort(([a], [b]) => {
    return (levelOrder[a] || 999) - (levelOrder[b] || 999);
  });
}

function VideoCard({ video }: { video: ListeningVideo }) {
  const thumbnailUrl =
    video.thumbnail_url ||
    (video.youtube_id
      ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
      : null);

  const levelColor = video.level
    ? levelColors[video.level] || levelColors.B1
    : "";

  return (
    <Link href={`/listening/${video.slug}`} className="block group">
      <div className="h-full bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-video w-full bg-muted">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
              <Headphones className="w-12 h-12 text-primary/30" />
            </div>
          )}
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
              <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {video.short_title || video.title}
            </h3>
            <Headphones className="w-5 h-5 text-primary shrink-0" />
          </div>

          <div className="flex flex-wrap gap-2">
            {video.level && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColor}`}
              >
                {video.level}
              </span>
            )}
            {video.topic && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {video.topic}
              </span>
            )}
          </div>

          {video.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {video.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default async function ListeningPage() {
  const videos = await getListeningVideos();
  const groupedVideos = groupVideosByLevel(videos);

  const itemListItems = videos.map((video) => ({
    name: video.title,
    url: `https://learne.org/listening/${video.slug}`,
    thumbnailUrl: video.thumbnail_url ||
      (video.youtube_id
        ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
        : undefined),
    description: video.description || undefined,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
      <ItemListJsonLd
        name="Listening Practice"
        description="Improve your English listening skills with video lessons. Practice with native speakers, transcripts, and quizzes at all levels from A1 to C1."
        items={itemListItems}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://learne.org" },
          { name: "Listening Practice", url: "https://learne.org/listening" },
        ]}
      />
      <Navbar />

      {/* Header */}
      <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Listening Practice
              </h1>
              <p className="text-muted-foreground mt-1">
                Improve your listening skills with video lessons
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        {groupedVideos.length > 0 ? (
          <div className="space-y-12">
            {groupedVideos.map(([level, levelVideos]) => (
              <section key={level} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground pl-3 border-l-4 border-primary/80">
                  {levelTitles[level] || level}
                  <span className="ml-3 text-sm font-normal text-muted-foreground">
                    ({levelVideos.length}{" "}
                    {levelVideos.length === 1 ? "lesson" : "lessons"})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {levelVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <Headphones className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              No lessons available yet
            </h3>
            <p className="text-muted-foreground">
              Check back soon for new listening content!
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
