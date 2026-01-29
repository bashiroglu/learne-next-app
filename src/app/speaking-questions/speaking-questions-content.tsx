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
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  part1Topics,
  part2Topics,
  part3Topics,
  part1TabLabels,
  part2TabLabels,
  part3TabLabels,
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
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
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
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
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
      <TabsList
        ref={scrollContainerRef}
        className={`w-full inline-flex h-auto overflow-x-auto overflow-y-hidden scrollbar-hide ${className}`}
      >
        {children}
      </TabsList>
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
            About Part 1
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

      <Tabs defaultValue="general" className="space-y-6">
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

        {Object.entries(part1Topics).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            <Accordion type="single" collapsible className="space-y-4">
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
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
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
            About Part 2
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>
            • Duration: 3-4 minutes total (1 minute preparation + 1-2 minutes
            speaking)
          </p>
          <p>• You will receive a task card with a topic and points to cover</p>
          <p>• Use the preparation time to make notes</p>
          <p>• Speak continuously for 1-2 minutes on the topic</p>
          <p>• The examiner may ask 1-2 follow-up questions</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="people" className="space-y-6">
        <div className="sticky top-[140px] z-20 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4">
          <ScrollableTabs>
            {Object.keys(part2Topics).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="py-3 px-6 whitespace-nowrap"
              >
                {part2TabLabels[key]}
              </TabsTrigger>
            ))}
          </ScrollableTabs>
        </div>

        {Object.entries(part2Topics).map(([key, topics]) => (
          <TabsContent key={key} value={key}>
            <Accordion type="single" collapsible className="space-y-6">
              {topics.map((topic, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-card to-secondary/20"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="text-left">
                      <h3 className="text-xl font-semibold">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        You should say:
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <ul className="space-y-2 mb-4">
                      {topic.points.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-4 mt-4">
                      <p className="font-semibold mb-2 text-primary">
                        Sample Answer:
                      </p>
                      {topic.answer ? (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {topic.answer}
                        </p>
                      ) : (
                        <p className="text-muted-foreground/60 italic">
                          Sample answer coming soon...
                        </p>
                      )}
                    </div>
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

function Part3Content() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2">
            <Users className="w-5 h-5" />
            About Part 3
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-muted-foreground">
          <p>• Duration: 4-5 minutes</p>
          <p>• Two-way discussion with the examiner on abstract topics</p>
          <p>
            • Questions related to the theme of Part 2 but more general and
            analytical
          </p>
          <p>
            • Requires expressing and justifying opinions, analyzing, and
            speculating
          </p>
          <p>• Give detailed, well-developed answers with examples</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="education" className="space-y-6">
        <div className="sticky top-[140px] z-20 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4">
          <ScrollableTabs>
            {Object.keys(part3Topics).map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="py-3 px-6 whitespace-nowrap"
              >
                {part3TabLabels[key]}
              </TabsTrigger>
            ))}
          </ScrollableTabs>
        </div>

        {Object.entries(part3Topics).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            <Accordion type="single" collapsible className="space-y-4">
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
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
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
                  IELTS Speaking Questions
                </h1>
                <p itemProp="description" className="text-muted-foreground mt-1">
                  Practice questions and sample answers for all three parts of the
                  IELTS speaking test
                </p>
                <meta itemProp="author" content="Learne" />
                <meta itemProp="publisher" content="Learne" />
              </div>

              {/* Part switcher tabs */}
              <nav aria-label="Speaking test parts">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-auto"
                >
                  <TabsList className="grid grid-cols-3 w-[300px]">
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
                      Part 2
                    </TabsTrigger>
                    <TabsTrigger
                      value="part3"
                      className="flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" />
                      Part 3
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
                  Part 2: Long Turn Cue Cards
                </h2>
                <Part2Content />
              </section>
            </TabsContent>
            <TabsContent value="part3" className="mt-0">
              <section aria-labelledby="part3-heading">
                <h2 id="part3-heading" className="sr-only">
                  Part 3: Discussion Questions
                </h2>
                <Part3Content />
              </section>
            </TabsContent>
          </Tabs>
        </main>
      </article>
    </div>
  );
}
