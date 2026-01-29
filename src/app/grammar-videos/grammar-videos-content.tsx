"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Play, Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { GrammarVideo } from "@/lib/grammar-videos";

const VIDEOS_PER_TOPIC = 3;

const levelColors: Record<string, string> = {
  A1: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  A2: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  B1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  C1: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  C2: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

function VideoCard({ video }: { video: GrammarVideo }) {
  const thumbnailUrl =
    video.thumbnail_url ||
    (video.youtube_id
      ? `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
      : null);

  const levelColor = video.level
    ? levelColors[video.level] || levelColors.B1
    : "";

  return (
    <Link href={`/grammar-videos/${video.slug}`} className="block group">
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
              <BookOpen className="w-12 h-12 text-primary/30" />
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
            <BookOpen className="w-5 h-5 text-primary shrink-0" />
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

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
            <BookOpen className="w-4 h-4" />
            <span>Video • Transcript • Quiz</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface GrammarVideosContentProps {
  videos: GrammarVideo[];
}

export function GrammarVideosContent({ videos }: GrammarVideosContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;

    const query = searchQuery.toLowerCase().trim();
    return videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query) ||
        video.topic?.toLowerCase().includes(query) ||
        video.level?.toLowerCase().includes(query)
    );
  }, [videos, searchQuery]);

  // Group videos by topic
  const groupedVideos = useMemo(() => {
    const grouped = filteredVideos.reduce(
      (acc, video) => {
        const topic = video.topic || "Other Lessons";
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(video);
        return acc;
      },
      {} as Record<string, GrammarVideo[]>
    );

    return Object.entries(grouped);
  }, [filteredVideos]);

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  const getVisibleVideos = (topic: string, topicVideos: GrammarVideo[]) => {
    if (expandedTopics[topic] || topicVideos.length <= VIDEOS_PER_TOPIC) {
      return topicVideos;
    }
    return topicVideos.slice(0, VIDEOS_PER_TOPIC);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <Input
            type="text"
            placeholder="Search lessons (e.g., 'Conditionals')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 bg-background/50 border-border focus:bg-background transition-colors rounded-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-muted cursor-pointer"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>

      {/* Lessons Grid */}
      {groupedVideos.length > 0 ? (
        <div className="space-y-12">
          {groupedVideos.map(([topic, topicVideos]) => {
            const visibleVideos = getVisibleVideos(topic, topicVideos);
            const hasMore = topicVideos.length > VIDEOS_PER_TOPIC;
            const isExpanded = expandedTopics[topic];
            const hiddenCount = topicVideos.length - VIDEOS_PER_TOPIC;

            return (
              <section key={topic} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground pl-3 border-l-4 border-primary/80">
                  {topic}
                  <span className="ml-3 text-sm font-normal text-muted-foreground">
                    ({topicVideos.length}{" "}
                    {topicVideos.length === 1 ? "lesson" : "lessons"})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => toggleTopic(topic)}
                      className="group px-6 py-2 h-auto rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                    >
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        {isExpanded ? (
                          <>
                            Show less
                            <ChevronUp className="inline-block ml-2 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Show {hiddenCount} more{" "}
                            {hiddenCount === 1 ? "lesson" : "lessons"}
                            <ChevronDown className="inline-block ml-2 w-4 h-4" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
          <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No lessons found
          </h3>
          <p className="text-muted-foreground">
            Try searching for something else like &quot;Conditionals&quot; or &quot;Past&quot;
          </p>
          <Button
            variant="link"
            onClick={() => setSearchQuery("")}
            className="mt-2 text-primary cursor-pointer"
          >
            Clear search
          </Button>
        </div>
      )}
    </>
  );
}
