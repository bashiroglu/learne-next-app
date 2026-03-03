"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ChevronDown, PlayCircle, FileText, PenLine, Calculator, MessageCircle, Menu, Newspaper, BookText, GraduationCap, Languages, Headphones } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Learne</span>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/reading"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Reading
          </Link>
          <Link
            href="/listening"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Listening
          </Link>

          {/* Grammar Dropdown - CSS hover based */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Grammar
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown menu */}
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-popover border border-border rounded-md shadow-md py-1 min-w-[180px]">
                <Link
                  href="/grammar-videos"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Grammar Videos
                </Link>
                <Link
                  href="/grammar"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Grammar Tests
                </Link>
              </div>
            </div>
          </div>

          {/* IELTS Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              IELTS
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown menu */}
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-popover border border-border rounded-md shadow-md py-1 min-w-[180px]">
                <Link
                  href="/speaking-questions"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Speaking Questions
                </Link>
                <Link
                  href="/writing-practice"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <PenLine className="w-4 h-4" />
                  Writing Practice
                </Link>
                <Link
                  href="/ielts-calculator"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  <Calculator className="w-4 h-4" />
                  Calculator
                </Link>
              </div>
            </div>
          </div>

          {/* Blog Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              Blog
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-popover border border-border rounded-md shadow-md py-1 min-w-[180px]">
                <Link href="/blog" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <Newspaper className="w-4 h-4" />All Posts
                </Link>
                <div className="border-t border-border my-1" />
                <Link href="/blog/grammar" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <BookText className="w-4 h-4" />Grammar
                </Link>
                <Link href="/blog/ielts" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <GraduationCap className="w-4 h-4" />IELTS
                </Link>
                <Link href="/blog/vocabulary" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <Languages className="w-4 h-4" />Vocabulary
                </Link>
                <Link href="/blog/reading" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <BookOpen className="w-4 h-4" />Reading
                </Link>
                <Link href="/blog/writing" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <PenLine className="w-4 h-4" />Writing
                </Link>
                <Link href="/blog/listening" className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                  <Headphones className="w-4 h-4" />Listening
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Link href="https://app.learne.org/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="https://app.learne.org/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">Learne</span>
              </SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            <nav className="flex flex-col gap-2">
              <Link
                href="/reading"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Reading
              </Link>
              <Link
                href="/listening"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
              >
                Listening
              </Link>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="grammar" className="border-none">
                  <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md hover:no-underline">
                    Grammar
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 pb-0">
                    <Link
                      href="/grammar-videos"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Grammar Videos
                    </Link>
                    <Link
                      href="/grammar"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Grammar Tests
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ielts" className="border-none">
                  <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md hover:no-underline">
                    IELTS
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 pb-0">
                    <Link href="/speaking-questions" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <MessageCircle className="w-4 h-4" />Speaking Questions
                    </Link>
                    <Link href="/writing-practice" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <PenLine className="w-4 h-4" />Writing Practice
                    </Link>
                    <Link href="/ielts-calculator" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <Calculator className="w-4 h-4" />Calculator
                    </Link>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="blog" className="border-none">
                  <AccordionTrigger className="px-3 py-2 text-sm font-medium hover:bg-accent rounded-md hover:no-underline">
                    Blog
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 pb-0">
                    <Link href="/blog" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <Newspaper className="w-4 h-4" />All Posts
                    </Link>
                    <Link href="/blog/grammar" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <BookText className="w-4 h-4" />Grammar
                    </Link>
                    <Link href="/blog/ielts" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <GraduationCap className="w-4 h-4" />IELTS
                    </Link>
                    <Link href="/blog/vocabulary" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <Languages className="w-4 h-4" />Vocabulary
                    </Link>
                    <Link href="/blog/reading" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <BookOpen className="w-4 h-4" />Reading
                    </Link>
                    <Link href="/blog/writing" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <PenLine className="w-4 h-4" />Writing
                    </Link>
                    <Link href="/blog/listening" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors">
                      <Headphones className="w-4 h-4" />Listening
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </nav>

            <Separator className="my-4" />

            <div className="flex flex-col gap-2">
              <Link href="https://app.learne.org/login" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link href="https://app.learne.org/signup" onClick={() => setIsOpen(false)} className="w-full">
                <Button className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
