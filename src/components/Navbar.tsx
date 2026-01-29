"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ChevronDown, PlayCircle, FileText, PenLine, Calculator, MessageCircle } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <BookOpen className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Learne</span>
        </Link>
        <div className="flex items-center gap-6">
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
      </div>
    </nav>
  );
};
