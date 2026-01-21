"use client";

import React, { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ReadingArticle, ArticleHighlight } from "@/types/reading";

interface ArticleContentProps {
  article: ReadingArticle;
  highlights: {
    phrases: ArticleHighlight[];
    vocabulary: ArticleHighlight[];
    grammar: ArticleHighlight[];
    spelling: ArticleHighlight[];
  };
}

interface HoveredTerm {
  term: string;
  explanation?: string;
  grammarHighlight?: string;
  spelling?: { correct: string; incorrect: string };
  type: "standard" | "spelling" | "grammar";
  x: number;
  y: number;
}

export function ArticleContent({ article, highlights }: ArticleContentProps) {
  const [showPhrases, setShowPhrases] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);
  const [showSpelling, setShowSpelling] = useState(false);
  const [hoveredTerm, setHoveredTerm] = useState<HoveredTerm | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasHighlights =
    highlights.phrases.length > 0 ||
    highlights.vocabulary.length > 0 ||
    highlights.grammar.length > 0 ||
    highlights.spelling.length > 0;

  const formatExplanation = useCallback((text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const subParts = part.split(/(\*.*?\*)/g);
      return subParts.map((subPart, subIndex) => {
        if (subPart.startsWith("*") && subPart.endsWith("*") && subPart.length > 2) {
          return (
            <em key={`${index}-${subIndex}`} className="italic">
              {subPart.slice(1, -1)}
            </em>
          );
        }
        return <span key={`${index}-${subIndex}`}>{subPart}</span>;
      });
    });
  }, []);

  const highlightText = useCallback(
    (content: string) => {
      type HighlightMatch = {
        start: number;
        end: number;
        text: string;
        type: "phrase" | "vocabulary" | "grammar" | "spelling";
        explanation?: string | null;
        grammarHighlight?: string | null;
        spelling?: { correct: string; incorrect: string };
      };

      const matches: HighlightMatch[] = [];

      // Find phrase matches
      if (showPhrases) {
        highlights.phrases.forEach((phrase) => {
          const regex = new RegExp(escapeRegex(phrase.term), "gi");
          let match;
          while ((match = regex.exec(content)) !== null) {
            matches.push({
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              type: "phrase",
              explanation: phrase.explanation,
            });
          }
        });
      }

      // Find vocabulary matches
      if (showVocabulary) {
        highlights.vocabulary.forEach((vocab) => {
          const regex = new RegExp(escapeRegex(vocab.term), "gi");
          let match;
          while ((match = regex.exec(content)) !== null) {
            matches.push({
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              type: "vocabulary",
              explanation: vocab.explanation,
            });
          }
        });
      }

      // Find grammar matches
      if (showGrammar) {
        highlights.grammar.forEach((grammar) => {
          const regex = new RegExp(escapeRegex(grammar.term), "gi");
          let match;
          while ((match = regex.exec(content)) !== null) {
            matches.push({
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              type: "grammar",
              grammarHighlight: grammar.grammar_highlight,
              explanation: grammar.explanation,
            });
          }
        });
      }

      // Find spelling matches
      if (showSpelling) {
        highlights.spelling.forEach((spelling) => {
          const regex = new RegExp(escapeRegex(spelling.term), "gi");
          let match;
          while ((match = regex.exec(content)) !== null) {
            matches.push({
              start: match.index,
              end: match.index + match[0].length,
              text: match[0],
              type: "spelling",
              spelling: {
                correct: spelling.correct_spelling || spelling.term,
                incorrect: spelling.incorrect_spelling || "",
              },
            });
          }
        });
      }

      // If no highlights active, return plain content with markdown parsing
      if (matches.length === 0) {
        return <>{parseMarkdown(content)}</>;
      }

      // Sort matches by position
      matches.sort((a, b) => a.start - b.start);

      // Build highlighted content
      const parts: React.ReactElement[] = [];
      let lastIndex = 0;

      matches.forEach((match, index) => {
        // Add text before this match
        if (match.start > lastIndex) {
          parts.push(
            <span key={`text-${index}`}>{parseMarkdown(content.slice(lastIndex, match.start))}</span>
          );
        }

        // Determine highlight style
        let highlightClass = "";
        if (match.type === "phrase") {
          highlightClass = "bg-yellow-200/80 dark:bg-yellow-700/50";
        } else if (match.type === "vocabulary") {
          highlightClass = "bg-blue-200/80 dark:bg-blue-700/50";
        } else if (match.type === "grammar") {
          highlightClass = "bg-green-200/80 dark:bg-green-700/50";
        } else if (match.type === "spelling") {
          highlightClass = "bg-purple-200/80 dark:bg-purple-700/50";
        }

        // Add highlighted span
        parts.push(
          <span
            key={`highlight-${index}`}
            className={`${highlightClass} px-1 py-0.5 rounded cursor-help transition-all hover:shadow-md`}
            onMouseEnter={(e) => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
              const rect = e.currentTarget.getBoundingClientRect();
              if (match.type === "spelling" && match.spelling) {
                setHoveredTerm({
                  term: match.text,
                  spelling: match.spelling,
                  type: "spelling",
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                });
              } else if (match.type === "grammar") {
                setHoveredTerm({
                  term: match.text,
                  grammarHighlight: match.grammarHighlight || undefined,
                  explanation: match.explanation || undefined,
                  type: "grammar",
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                });
              } else if (match.explanation) {
                setHoveredTerm({
                  term: match.text,
                  explanation: match.explanation,
                  type: "standard",
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                });
              }
            }}
            onMouseLeave={() => {
              hoverTimeoutRef.current = setTimeout(() => setHoveredTerm(null), 300);
            }}
          >
            {match.text}
          </span>
        );

        lastIndex = match.end;
      });

      // Add remaining text
      if (lastIndex < content.length) {
        parts.push(<span key="text-end">{parseMarkdown(content.slice(lastIndex))}</span>);
      }

      return <>{parts}</>;
    },
    [showPhrases, showVocabulary, showGrammar, showSpelling, highlights]
  );

  return (
    <>
      {/* Highlight Toggle Buttons */}
      {hasHighlights && (
        <Card className="p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Toggle highlights to explore vocabulary, phrases, grammar, and spelling patterns
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {highlights.phrases.length > 0 && (
              <Button
                variant={showPhrases ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPhrases(!showPhrases)}
                className="gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                Phrases ({highlights.phrases.length})
              </Button>
            )}
            {highlights.vocabulary.length > 0 && (
              <Button
                variant={showVocabulary ? "default" : "outline"}
                size="sm"
                onClick={() => setShowVocabulary(!showVocabulary)}
                className="gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Vocabulary ({highlights.vocabulary.length})
              </Button>
            )}
            {highlights.grammar.length > 0 && (
              <Button
                variant={showGrammar ? "default" : "outline"}
                size="sm"
                onClick={() => setShowGrammar(!showGrammar)}
                className="gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Grammar ({highlights.grammar.length})
              </Button>
            )}
            {highlights.spelling.length > 0 && (
              <Button
                variant={showSpelling ? "default" : "outline"}
                size="sm"
                onClick={() => setShowSpelling(!showSpelling)}
                className="gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Spelling ({highlights.spelling.length})
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Article Content */}
      <Card className="p-6 md:p-8">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {highlightText(article.content)}
          </div>
        </article>
      </Card>

      {/* Tooltip for hovered terms */}
      {hoveredTerm && (
        <div
          className="fixed z-50 max-w-sm"
          style={{
            left: `${hoveredTerm.x}px`,
            top: `${hoveredTerm.y}px`,
            transform: "translate(-50%, -100%)",
            paddingBottom: "10px",
          }}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          }}
          onMouseLeave={() => {
            hoverTimeoutRef.current = setTimeout(() => setHoveredTerm(null), 300);
          }}
        >
          <Card className="p-3 shadow-xl border-primary/20 bg-card/95 backdrop-blur-sm">
            {hoveredTerm.type === "spelling" && hoveredTerm.spelling ? (
              <div className="grid grid-cols-[1fr,auto] gap-x-3 gap-y-1 text-sm">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {hoveredTerm.spelling.correct}
                </span>
                <span className="text-muted-foreground text-xs self-center">correct</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {hoveredTerm.spelling.incorrect}
                </span>
                <span className="text-muted-foreground text-xs self-center">incorrect</span>
              </div>
            ) : hoveredTerm.type === "grammar" ? (
              <>
                <div className="mb-2">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                    Grammar:
                  </p>
                  <p className="font-semibold text-base text-foreground leading-tight">
                    {hoveredTerm.grammarHighlight
                      ? formatExplanation(hoveredTerm.grammarHighlight)
                      : hoveredTerm.term}
                  </p>
                </div>
                {hoveredTerm.explanation && (
                  <div className="border-t border-border pt-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {formatExplanation(hoveredTerm.explanation)}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="font-semibold text-lg text-foreground leading-tight mb-1">
                  {hoveredTerm.term}
                </p>
                {hoveredTerm.explanation && (
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {formatExplanation(hoveredTerm.explanation)}
                  </p>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
}

// Helper to escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper to parse markdown-style bold/italic
function parseMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      parts.push(...parseItalic(before, partIndex++));
    }
    parts.push(<strong key={`bold-${partIndex++}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(...parseItalic(text.slice(lastIndex), partIndex++));
  }

  return parts.length > 0 ? parts : text;
}

function parseItalic(text: string, keyPrefix: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const italicRegex = /\*(.+?)\*/g;
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = italicRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`${keyPrefix}-text-${partIndex++}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(<em key={`${keyPrefix}-italic-${partIndex++}`}>{match[1]}</em>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`${keyPrefix}-text-${partIndex++}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key={`${keyPrefix}-plain`}>{text}</span>];
}
