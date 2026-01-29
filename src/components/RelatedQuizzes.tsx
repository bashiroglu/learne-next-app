"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GrammarTest } from "@/types/grammar";
import { generateSlug } from "@/lib/grammar";

interface RelatedQuizzesProps {
  tests: GrammarTest[];
  level: string;
}

const levelColors: Record<string, string> = {
  A1: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  A2: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  B1: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  B2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  C1: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  C2: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

export function RelatedQuizzes({ tests, level }: RelatedQuizzesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (tests.length === 0) {
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
          More {level} Quizzes
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
        {tests.map((test) => {
          const topicSlug = test.grammar_topics?.slug || "general";
          const testSlug = generateSlug(`${test.title}-${test.level}`);
          const levelColor = levelColors[test.level] || levelColors.B1;

          return (
            <Link
              key={test.id}
              href={`/grammar/${topicSlug}/${testSlug}`}
              className="flex-shrink-0 w-[280px] snap-start"
            >
              <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-200 h-full">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelColor}`}>
                      {test.level}
                    </span>
                    {test.question_count !== undefined && test.question_count > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {test.question_count} questions
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {test.title}
                  </h4>
                  {test.grammar_topics?.name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {test.grammar_topics.name}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Show More Card */}
        <Link
          href={`/grammar?level=${level}`}
          className="flex-shrink-0 w-[280px] snap-start"
        >
          <div className="group bg-primary/5 border border-primary/20 rounded-xl overflow-hidden hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 h-full flex flex-col items-center justify-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-semibold text-primary">Show More</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Browse all {level} quizzes
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
