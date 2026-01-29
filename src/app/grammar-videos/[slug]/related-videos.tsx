"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";
import type { GrammarVideo } from "@/lib/grammar-videos";

interface RelatedGrammarVideosProps {
  videos: GrammarVideo[];
  currentLevel: string | null;
}

export function RelatedGrammarVideos({ videos, currentLevel }: RelatedGrammarVideosProps) {
  if (!videos || videos.length === 0) return null;

  // Sort videos: same level first
  const sortedVideos = [...videos].sort((a, b) => {
    if (a.level === currentLevel && b.level !== currentLevel) return -1;
    if (a.level !== currentLevel && b.level === currentLevel) return 1;
    return 0;
  });

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">More Grammar Lessons</h3>
        <p className="text-xs text-muted-foreground hidden sm:block">
          Hold{" "}
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-muted border border-border rounded">
            Shift
          </kbd>{" "}
          + scroll to browse
        </p>
      </div>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {sortedVideos.map((video, index) => {
          const isLastVideo = index === sortedVideos.length - 1;
          const thumbnailUrl =
            video.thumbnail_url ||
            (video.youtube_id
              ? `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`
              : null);

          return (
            <Link
              key={video.id}
              href={isLastVideo ? "/grammar-videos" : `/grammar-videos/${video.slug}`}
              className="flex-shrink-0 w-[280px] bg-card border border-border rounded-[14px] overflow-hidden snap-start cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {thumbnailUrl ? (
                  <Image
                    src={thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="280px"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/5" />
                )}

                {/* See More Overlay for Last Video */}
                {isLastVideo && (
                  <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 space-y-3 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/20">
                      <ArrowRight className="w-8 h-8 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    <div className="space-y-1.5 drop-shadow-lg">
                      <h4 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                        See More Videos
                      </h4>
                      <p className="text-sm text-foreground/80 font-medium">
                        Browse all grammar lessons
                      </p>
                    </div>
                  </div>
                )}

                {/* Regular Play Button for Non-Last Videos */}
                {!isLastVideo && (
                  <>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                        <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    {video.level && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                        {video.level}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h4 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {video.short_title || video.title}
                </h4>
                {video.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
