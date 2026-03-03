import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Headphones, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VideoJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  getListeningVideoBySlug,
  getAllListeningVideoSlugs,
  getRelatedListeningVideos,
  getVideoVocabulary,
  getVideoQuizQuestions,
} from "@/lib/listening";
import { ListeningContent } from "./listening-content";
import { RelatedVideos } from "./related-videos";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all videos
export async function generateStaticParams() {
  const slugs = await getAllListeningVideoSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getListeningVideoBySlug(slug);

  if (!video) {
    return {
      title: "Video Not Found - Learne",
    };
  }

  const description =
    video.description ||
    `Practice your English listening skills with "${video.title}". ${video.level ? `Level: ${video.level}.` : ""} Watch with transcript, vocabulary, and comprehension quiz.`;

  const thumbnailUrl = video.thumbnail_url ||
    (video.youtube_id
      ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
      : undefined);

  return {
    title: `${video.title} - Listening Practice | Learne`,
    description,
    keywords: [
      `${video.title} listening practice`,
      `${video.level || "English"} listening exercise`,
      `learn English listening ${video.topic || ""}`.trim(),
      "English listening comprehension",
      "ESL listening practice",
      "improve English listening skills",
      "English audio practice",
      video.topic || "listening",
      video.level || "English",
    ],
    alternates: {
      canonical: `https://learne.org/listening/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${video.title} - Listening Practice`,
      description,
      images: thumbnailUrl ? [thumbnailUrl] : undefined,
    },
    openGraph: {
      title: video.title,
      description,
      type: "video.other",
      url: `https://learne.org/listening/${slug}`,
      siteName: "Learne",
      images: thumbnailUrl ? [thumbnailUrl] : undefined,
    },
  };
}

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

export default async function ListeningVideoPage({ params }: PageProps) {
  const { slug } = await params;
  const video = await getListeningVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const relatedVideos = await getRelatedListeningVideos(slug, video.level, 6);
  const vocabulary = await getVideoVocabulary(video.id);
  const questions = await getVideoQuizQuestions(video.id);
  const levelColor = video.level
    ? levelColors[video.level] || levelColors.B1
    : "";

  const thumbnailUrl = video.thumbnail_url ||
    (video.youtube_id
      ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
      : "");

  const videoDescription =
    video.description ||
    `Practice your English listening skills with "${video.title}". ${video.level ? `Level: ${video.level}.` : ""} Watch with transcript, vocabulary, and comprehension quiz.`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
      <VideoJsonLd
        name={video.title}
        description={videoDescription}
        thumbnailUrl={thumbnailUrl}
        uploadDate={new Date(video.created_at).toISOString()}
        contentUrl={video.youtube_id ? `https://www.youtube.com/watch?v=${video.youtube_id}` : undefined}
        embedUrl={video.youtube_id ? `https://www.youtube.com/embed/${video.youtube_id}` : undefined}
        educationalLevel={video.level || undefined}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://learne.org" },
          { name: "Listening Practice", url: "https://learne.org/listening" },
          { name: video.title, url: `https://learne.org/listening/${slug}` },
        ]}
      />
      <Navbar />

      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Headphones className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                {video.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
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
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={new Date(video.created_at).toISOString()}>
                    {new Date(video.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-6">
        {/* Back Link */}
        <div className="mb-4">
          <Link href="/listening">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Listening Practice
            </Button>
          </Link>
        </div>

        {/* Video Player with Transcript + Quiz/Vocabulary */}
        {video.video_type === "youtube" && video.youtube_id ? (
          <ListeningContent
            videoId={video.youtube_id}
            transcript={video.transcript}
            vocabulary={vocabulary}
            questions={questions}
          />
        ) : video.video_type === "file" && video.video_url ? (
          <div className="mb-8 aspect-video rounded-xl overflow-hidden shadow-lg bg-card border border-border">
            <video controls className="w-full h-full">
              <source src={video.video_url} />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="mb-8 aspect-video rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border">
            <p className="text-muted-foreground">No video available</p>
          </div>
        )}

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <RelatedVideos videos={relatedVideos} currentLevel={video.level} />
        )}

        {/* Description */}
        {video.description && (
          <div className="mb-8 p-6 bg-card rounded-xl border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              About this lesson
            </h2>
            <p className="text-muted-foreground">{video.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className="mb-8 p-6 bg-primary/5 rounded-xl border border-primary/10 text-center">
          <Headphones className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Want to track your progress?
          </h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Sign up to save vocabulary, take quizzes, and track your learning
            journey.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="https://app.learne.org/signup">
              <Button className="cursor-pointer">Create Free Account</Button>
            </Link>
            <Link href="https://app.learne.org/login">
              <Button variant="outline" className="cursor-pointer">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
