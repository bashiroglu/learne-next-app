"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReadingArticle } from "@/types/reading";

interface RelatedArticlesProps {
  articles: ReadingArticle[];
  categoryName: string;
  categorySlug: string;
}

export function RelatedArticles({ articles, categoryName, categorySlug }: RelatedArticlesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (articles.length === 0) {
    return null;
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          More {categoryName} Articles
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
      >
        {articles.map((article) => {
          const articleCategorySlug = article.reading_categories?.slug || "general";
          return (
            <Link
              key={article.id}
              href={`/reading/${articleCategorySlug}/${article.slug}`}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-200">
                <div className="relative h-40 bg-muted">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="280px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <BookOpen className="w-12 h-12 text-primary/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  {article.word_count && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {article.word_count} words
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Show More Card */}
        <Link
          href={`/reading?category=${categorySlug}`}
          className="flex-shrink-0 w-[280px] snap-start"
        >
          <div className="group bg-primary/5 border border-primary/20 rounded-xl overflow-hidden hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 h-full flex flex-col items-center justify-center min-h-[240px]">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <ArrowRight className="w-8 h-8 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-semibold text-primary text-lg">Show More</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Browse all {categoryName}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
