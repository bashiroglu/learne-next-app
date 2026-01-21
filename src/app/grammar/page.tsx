"use client"

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { grammarTests } from "@/frontend-data/grammar_tests";
import { grammarTopics } from "@/frontend-data/grammar_topics";

// Helper to slugify text
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function GrammarOverviewPage() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Group tests by topic
  const testsByTopic = grammarTopics.map(topic => {
    const topicTests = grammarTests.filter(test => {
      const matchesTopic = test.topic_id === topic.id;
      const matchesLevel = selectedLevel ? test.level === selectedLevel : true;
      return matchesTopic && matchesLevel;
    });
    return {
      topic,
      tests: topicTests
    };
  }).filter(group => group.tests.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Grammar Library</h1>
          <p className="text-muted-foreground text-lg">
            Master English grammar with our comprehensive collection of tests and exercises.
          </p>
          
          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              variant={selectedLevel === null ? "default" : "outline"}
              onClick={() => setSelectedLevel(null)}
              className="rounded-full"
            >
              All Levels
            </Button>
            {levels.map(level => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                className="rounded-full"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testsByTopic.map(({ topic, tests }) => (
            <Card key={topic.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>{topic.name}</CardTitle>
                {topic.description && (
                  <CardDescription>{topic.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {tests.map(test => {
                    const topicSlug = slugify(topic.name); // Using topic name for slug as per data structure
                    const testSlug = `${slugify(test.title)}-${test.level.toLowerCase()}`;
                    
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
      </div>
      <Footer />
    </div>
  );
}
