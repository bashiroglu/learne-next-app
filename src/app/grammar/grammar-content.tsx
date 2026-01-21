"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { GrammarTopic, GrammarTest } from "@/types/grammar";
import { generateSlug } from "@/lib/grammar";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface GrammarPageContentProps {
  topics: GrammarTopic[];
  tests: GrammarTest[];
  selectedLevel: string | null;
}

export function GrammarPageContent({
  topics,
  tests,
  selectedLevel,
}: GrammarPageContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLevelChange = (level: string | null) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (level) params.set("level", level);
      router.push(`/grammar${params.toString() ? `?${params.toString()}` : ""}`);
    });
  };

  // Group tests by topic
  const testsByTopic = topics
    .map((topic) => {
      const topicTests = tests.filter((test) => test.topic_id === topic.id);
      return {
        topic,
        tests: topicTests,
      };
    })
    .filter((group) => group.tests.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Grammar Library</h1>
        <p className="text-muted-foreground text-lg">
          Master English grammar with our comprehensive collection of tests and exercises.
        </p>

        <div className="flex flex-wrap gap-2 pt-4">
          <Button
            variant={selectedLevel === null ? "default" : "outline"}
            onClick={() => handleLevelChange(null)}
            className="rounded-full cursor-pointer"
            disabled={isPending}
          >
            {isPending && selectedLevel === null && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            All Levels
          </Button>
          {levels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              onClick={() => handleLevelChange(selectedLevel === level ? null : level)}
              className="rounded-full cursor-pointer"
              disabled={isPending}
            >
              {isPending && selectedLevel === level && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {level}
            </Button>
          ))}
        </div>
      </div>

      {isPending ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col h-full animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full mt-2"></div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <div className="h-8 bg-muted rounded w-24"></div>
                  <div className="h-8 bg-muted rounded w-32"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testsByTopic.map(({ topic, tests }) => (
            <Card key={topic.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
                {topic.description && <CardDescription>{topic.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {tests.map((test) => {
                    const topicSlug = topic.slug;
                    const testSlug = generateSlug(`${test.title}-${test.level}`);

                    return (
                      <Link
                        key={test.id}
                        href={`/grammar/${topicSlug}/${testSlug}`}
                        className="no-underline"
                      >
                        <Badge
                          variant="secondary"
                          className="hover:bg-secondary/80 cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors"
                        >
                          {test.title}
                          <span className="ml-2 text-xs text-muted-foreground border-l pl-2 border-muted-foreground/30">
                            {test.level}
                          </span>
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {testsByTopic.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No tests found for the selected level.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Loading skeleton component
export function GrammarPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="h-9 bg-muted rounded w-48 animate-pulse"></div>
        <div className="h-6 bg-muted rounded w-96 animate-pulse"></div>
        <div className="flex flex-wrap gap-2 pt-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 bg-muted rounded-full w-20 animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="flex flex-col h-full animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-full mt-2"></div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
