"use client";

import { useRef, useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import {
  part1Topics,
  part1TabLabels,
  part2And3Topics,
  part2And3TabLabels,
} from "./speaking-data";

function ScrollableTabs({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 1);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollLeft = 0;
      checkScroll();
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 shadow-md hover:bg-primary/10 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 shadow-md hover:bg-primary/10 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
      {/* Use a plain div as the scroll container for full control */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
      >
        <TabsList className={`inline-flex h-auto w-max ${className}`}>
          {children}
        </TabsList>
      </div>
    </div>
  );
}

function Part1Content() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            IELTS Speaking Part 1: Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>• Duration: 4-5 minutes</p>
          <p>• General questions about yourself and familiar topics</p>
          <p>
            • Topics may include: home, family, work, studies, interests, and
            daily routines
          </p>
          <p>• Keep answers brief and natural (2-3 sentences per question)</p>
        </CardContent>
      </Card>

      <p className="text-muted-foreground mb-6">
        Practice the latest IELTS Speaking Part 1 questions from the January-April 2026 test period. Each topic includes 4-5 common interview questions with Band 9 model answers and useful vocabulary highlighted.
      </p>

      <Tabs defaultValue={Object.keys(part1Topics)[0]} className="space-y-6">
        <div className="sticky top-[140px] z-20 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4">
          <ScrollableTabs>
            {Object.keys(part1Topics).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="py-3 px-6 whitespace-nowrap"
              >
                {part1TabLabels[key]}
              </TabsTrigger>
            ))}
          </ScrollableTabs>
        </div>

        {Object.entries(part1Topics).map(([key, items], tabIndex) => (
          <TabsContent key={key} value={key}>
            <h3 className="text-xl font-semibold mb-4">
              {part1TabLabels[key]} - IELTS Part 1 Sample Questions & Answers
            </h3>
            <Accordion type="single" collapsible defaultValue={tabIndex === 0 ? "item-0" : undefined} className="space-y-4">
              {items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg shadow-sm hover:shadow-md transition-all bg-card"
                >
                  <AccordionTrigger className="px-6 py-4 text-lg font-medium hover:no-underline text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    {item.answer ? (
                      <p
                        className="text-muted-foreground leading-relaxed [&_u]:text-primary [&_u]:font-medium [&_u]:decoration-primary"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    ) : (
                      <p className="text-muted-foreground/60 italic">
                        Sample answer coming soon...
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function Part2Content() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="text-accent flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            IELTS Cue Cards (Part 2) & Discussion Questions (Part 3)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p className="font-medium text-foreground">Part 2 - Long Turn:</p>
          <p>
            • Duration: 3-4 minutes total (1 minute preparation + 1-2 minutes
            speaking)
          </p>
          <p>• You will receive a task card with a topic and points to cover</p>
          <p>• Use the preparation time to make notes</p>
          <p className="font-medium text-foreground mt-4">Part 3 - Discussion:</p>
          <p>• Duration: 4-5 minutes</p>
          <p>• The examiner will ask follow-up questions related to the Part 2 topic</p>
          <p>• Requires expressing and justifying opinions with examples</p>
        </CardContent>
      </Card>

      <p className="text-muted-foreground mb-6">
        Browse IELTS Speaking Part 2 cue card topics and Part 3 discussion questions from the January-April 2026 test period. Each topic includes the full cue card with bullet points, Band 9 sample answers, and related follow-up questions.
      </p>

      <Tabs defaultValue={Object.keys(part2And3TabLabels)[0]} className="space-y-6">
        <div className="sticky top-[140px] z-20 bg-background/95 backdrop-blur-sm pb-4">
          <ScrollableTabs>
            {Object.keys(part2And3TabLabels).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="py-3 px-6 whitespace-nowrap"
              >
                {part2And3TabLabels[key]}
              </TabsTrigger>
            ))}
          </ScrollableTabs>
        </div>

        {Object.keys(part2And3TabLabels).map((key, tabIndex) => {
          const categoryTopics = part2And3Topics.filter((topic) => topic.category === key);
          const firstTopicId = tabIndex === 0 ? categoryTopics[0]?.id : undefined;
          return (
          <TabsContent key={key} value={key}>
            <h3 className="text-xl font-semibold mb-4">
              {part2And3TabLabels[key]} - IELTS Cue Card Topics & Discussion Questions
            </h3>
            <Accordion type="single" collapsible defaultValue={firstTopicId} className="space-y-6">
              {categoryTopics.map((topic) => (
                  <AccordionItem
                    key={topic.id}
                    value={topic.id}
                    className="border rounded-lg shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-card to-secondary/20"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="text-left">
                        <h3 className="text-xl font-semibold">{topic.title}</h3>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      {/* Part 2 Section */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-lg text-primary">Part 2 - You should say:</h4>
                        </div>
                        <ul className="space-y-2 mb-4 pl-7">
                          {topic.points.map((point, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-primary mr-2">•</span>
                              <span className="text-muted-foreground">{point}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Part 2 Sample Answer */}
                        <Accordion type="single" collapsible className="mt-4">
                          <AccordionItem value="sample-answer" className="border rounded-lg bg-card/50">
                            <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline">
                              <span className="flex items-center gap-2">
                                📝 Sample Answer
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              {topic.answer ? (
                                <p
                                  className="text-muted-foreground leading-relaxed whitespace-pre-line [&_u]:text-primary [&_u]:font-medium [&_u]:decoration-primary"
                                  dangerouslySetInnerHTML={{ __html: topic.answer }}
                                />
                              ) : (
                                <p className="text-muted-foreground/60 italic">
                                  Sample answer coming soon...
                                </p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-border my-6" />

                      {/* Part 3 Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Users className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-lg text-primary">Part 3 - Related Discussion Questions:</h4>
                        </div>

                        <Accordion type="single" collapsible className="space-y-3">
                          {topic.part3Questions.map((q, idx) => (
                            <AccordionItem
                              key={idx}
                              value={`part3-${idx}`}
                              className="border rounded-lg bg-card/50"
                            >
                              <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline text-left">
                                <span className="flex items-start gap-2">
                                  <span className="text-primary font-semibold">{idx + 1}.</span>
                                  <span>{q.question}</span>
                                </span>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4">
                                {q.answer ? (
                                  <p
                                    className="text-muted-foreground leading-relaxed [&_u]:text-primary [&_u]:font-medium [&_u]:decoration-primary"
                                    dangerouslySetInnerHTML={{ __html: q.answer }}
                                  />
                                ) : (
                                  <p className="text-muted-foreground/60 italic">
                                    Sample answer coming soon...
                                  </p>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </TabsContent>
        );
        })}
      </Tabs>
    </div>
  );
}

export function SpeakingQuestionsContent() {
  const [activeTab, setActiveTab] = useState("part1");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article itemScope itemType="https://schema.org/Article">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1
                  itemProp="headline"
                  className="text-2xl font-bold text-foreground flex items-center gap-2"
                >
                  <MessageCircle className="w-6 h-6 text-primary" />
                  IELTS Speaking Test Questions 2026
                </h1>
                <p itemProp="description" className="text-muted-foreground mt-1">
                  Real exam questions with Band 9 sample answers for Part 1, 2 & 3
                </p>
                <meta itemProp="author" content="Learne" />
                <meta itemProp="publisher" content="Learne" />
              </div>

              {/* Part switcher tabs - Now only Part 1 and Part 2 */}
              <nav aria-label="Speaking test parts">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-auto"
                >
                  <TabsList className="grid grid-cols-2 w-[200px]">
                    <TabsTrigger
                      value="part1"
                      className="flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Part 1
                    </TabsTrigger>
                    <TabsTrigger
                      value="part2"
                      className="flex items-center gap-1.5"
                    >
                      <BookOpen className="w-4 h-4" />
                      Part 2 & 3
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-8 max-w-5xl" itemProp="articleBody">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="part1" className="mt-0">
              <section aria-labelledby="part1-heading">
                <h2 id="part1-heading" className="sr-only">
                  Part 1: Introduction and Interview Questions
                </h2>
                <Part1Content />
              </section>
            </TabsContent>
            <TabsContent value="part2" className="mt-0">
              <section aria-labelledby="part2-heading">
                <h2 id="part2-heading" className="sr-only">
                  Part 2 & Part 3: Long Turn Cue Cards and Discussion Questions
                </h2>
                <Part2Content />
              </section>
            </TabsContent>
          </Tabs>
        </main>
      </article>
    </div>
  );
}
