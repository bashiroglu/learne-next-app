"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText } from "lucide-react";
import type { GrammarTopic, GrammarTest } from "@/types/grammar";
import { generateSlug } from "@/lib/grammar";

type Level = "A1" | "A2" | "B1" | "B2" | "C1";

const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

const levelDescriptions: Record<Level, string> = {
  A1: "Basic phrases and simple interactions",
  A2: "Everyday expressions and common topics",
  B1: "Familiar situations and personal topics",
  B2: "Complex texts and abstract topics",
  C1: "Sophisticated language and nuanced meanings",
};

interface GrammarPageContentProps {
  topics: GrammarTopic[];
  tests: GrammarTest[];
  selectedLevel: string | null;
}

export function GrammarPageContent({
  topics,
  tests,
}: GrammarPageContentProps) {
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = useMemo(() => {
    let filtered = tests;

    if (selectedLevel) {
      filtered = filtered.filter((test) => test.level === selectedLevel);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (test) =>
          test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          test.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (test.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [tests, selectedLevel, searchQuery]);

  // Helper to get topic slug for a test
  const getTopicSlug = (test: GrammarTest): string => {
    if (test.grammar_topics?.slug) {
      return test.grammar_topics.slug;
    }
    // Fallback: find topic from topics array
    const topic = topics.find((t) => t.id === test.topic_id);
    return topic?.slug || "general";
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pb-8">
      {/* Page Header */}
      <div className="py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Grammar Tests
        </h1>
        <p className="text-muted-foreground mt-1">
          Test your English grammar knowledge from A1 to C1 level
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search topics (e.g., Present Perfect, Conditionals...)"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Level Selection */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold text-foreground">
          Select Your Level
        </h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {levels.map((level) => (
            <Card
              key={level}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedLevel === level ? "ring-2 ring-primary" : ""
              }`}
              onClick={() =>
                setSelectedLevel(selectedLevel === level ? null : level)
              }
            >
              <CardHeader className="text-center p-4">
                <CardTitle className="text-2xl font-bold text-primary">
                  {level}
                </CardTitle>
                <CardDescription className="text-xs">
                  {levelDescriptions[level]}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        {selectedLevel && (
          <Button
            variant="outline"
            className="mt-4 cursor-pointer"
            onClick={() => setSelectedLevel(null)}
          >
            Clear Level Filter
          </Button>
        )}
      </section>

      {/* Tests Grid */}
      {filteredTests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => {
            const topicSlug = getTopicSlug(test);
            const testSlug = generateSlug(`${test.title}-${test.level}`);

            return (
              <Card
                key={test.id}
                className="transition-shadow hover:shadow-lg flex flex-col"
              >
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl line-clamp-2 min-h-[3.5rem]">
                      {test.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {test.level}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                        <FileText className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {test.question_count || 0}
                        </span>
                        <span>questions</span>
                      </div>
                      {test.duration && (
                        <span className="text-sm text-muted-foreground">
                          {test.duration} min
                        </span>
                      )}
                    </div>
                    <Link href={`/grammar/${topicSlug}/${testSlug}`}>
                      <Button className="w-full cursor-pointer">
                        Start Test
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No tests found. Try adjusting your search or level filter.
          </p>
        </div>
      )}
    </main>
  );
}

// Loading skeleton component
export function GrammarPageSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 pb-8">
      {/* Page Header Skeleton */}
      <div className="py-6">
        <div className="h-9 bg-muted rounded w-48 animate-pulse"></div>
        <div className="h-5 bg-muted rounded w-80 mt-2 animate-pulse"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-8">
        <div className="h-10 bg-muted rounded max-w-2xl animate-pulse"></div>
      </div>

      {/* Level Selection Skeleton */}
      <section className="mb-12">
        <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse"></div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="text-center p-4">
                <div className="h-8 bg-muted rounded w-12 mx-auto"></div>
                <div className="h-4 bg-muted rounded w-full mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Tests Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col animate-pulse">
            <CardHeader className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-10"></div>
              </div>
              <div className="h-4 bg-muted rounded w-full mt-2"></div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
