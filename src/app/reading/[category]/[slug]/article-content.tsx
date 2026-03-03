"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Maximize, Minimize, BookOpen, BookMarked, Copy, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { DictionaryPopup } from "@/components/reading/DictionaryPopup";
import type { ReadingArticle, ArticleHighlight } from "@/types/reading";

interface ArticleContentProps {
  article: ReadingArticle;
  highlights: {
    phrases: ArticleHighlight[];
    vocabulary: ArticleHighlight[];
    grammar: ArticleHighlight[];
    spelling: ArticleHighlight[];
  };
  categoryName: string;
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

export function ArticleContent({ article, highlights, categoryName }: ArticleContentProps) {
  const [showPhrases, setShowPhrases] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);
  const [showSpelling, setShowSpelling] = useState(false);
  const [hoveredTerm, setHoveredTerm] = useState<HoveredTerm | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reading controls state
  const [fontSize, setFontSize] = useState(19);
  const [lineHeight, setLineHeight] = useState(1.75);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const lineHeightOptions = [1.6, 1.75, 1.9];

  // Selection popover state
  const [selectedText, setSelectedText] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  // Dictionary popup state
  const [showDictionary, setShowDictionary] = useState(false);
  const [dictionaryWord, setDictionaryWord] = useState<string | null>(null);
  const [dictionaryPosition, setDictionaryPosition] = useState({ x: 0, y: 0 });
  const articleRef = useRef<HTMLDivElement>(null);

  // Saved words state
  const [savedWords, setSavedWords] = useState<string[]>([]);

  // Login prompt dialog state
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Handle resize and keyboard events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setFontSize(18);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullScreen]);

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 1, 24));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 1, 16));
  const toggleLineHeight = () => {
    const currentIndex = lineHeightOptions.indexOf(lineHeight);
    const nextIndex = (currentIndex + 1) % lineHeightOptions.length;
    setLineHeight(lineHeightOptions[nextIndex]);
  };
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  // Handle text selection for desktop (mouse)
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    const selected = selection?.toString().trim();

    if (selected && selected.length > 0) {
      setSelectedText(selected);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        setPopoverPosition({
          x: rect.left + rect.width / 2,
          y: rect.bottom + 10,
        });
        justOpenedRef.current = true;
        setPopoverOpen(true);
      }
    } else {
      setPopoverOpen(false);
    }
  }, []);

  // Handle text selection for iOS/touch - clears selection to dismiss native menu
  const handleTouchSelection = useCallback(() => {
    setTimeout(() => {
      const selection = window.getSelection();
      const selected = selection?.toString().trim();

      if (selected && selected.length > 0) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          // Capture position before clearing selection
          const position = {
            x: rect.left + rect.width / 2,
            y: rect.bottom + 10,
          };

          // Clear selection immediately to dismiss iOS native menu
          selection?.removeAllRanges();

          // Show our custom popup with captured data
          setSelectedText(selected);
          setPopoverPosition(position);
          setPopoverOpen(true);
        }
      } else {
        setPopoverOpen(false);
      }
    }, 100);
  }, []);

  // Check if selected text is a single word (for dictionary lookup)
  const isSingleWord = (text: string) => {
    return text && !text.includes(" ") && /^[a-zA-Z'-]+$/.test(text);
  };

  // Show dictionary popup
  const handleShowDictionary = useCallback(() => {
    if (selectedText) {
      setDictionaryWord(selectedText.toLowerCase());
      setDictionaryPosition({
        x: popoverPosition.x,
        y: popoverPosition.y + 50,
      });
      setShowDictionary(true);
      setPopoverOpen(false);
      window.getSelection()?.removeAllRanges();
    }
  }, [selectedText, popoverPosition]);

  // Close dictionary popup
  const closeDictionary = useCallback(() => {
    setShowDictionary(false);
    setDictionaryWord(null);
  }, []);

  // Handle save word - adds to local list
  const handleSaveWord = useCallback(() => {
    if (selectedText && !savedWords.includes(selectedText)) {
      setSavedWords((prev) => [...prev, selectedText]);
      toast.success("Word saved!");
    }
    setPopoverOpen(false);
    window.getSelection()?.removeAllRanges();
  }, [selectedText, savedWords]);

  // Remove word from saved list
  const handleRemoveWord = useCallback((word: string) => {
    setSavedWords((prev) => prev.filter((w) => w !== word));
  }, []);

  // Copy all saved words to clipboard
  const handleCopyAll = useCallback(() => {
    const allWords = savedWords.join(", ");
    navigator.clipboard.writeText(allWords);
    toast.success("All words copied to clipboard!");
  }, [savedWords]);

  // Save to Notes - prompts login
  const handleSaveToNotes = useCallback(() => {
    setShowLoginDialog(true);
  }, []);

  // Track if we just opened the popover to prevent immediate close
  const justOpenedRef = useRef(false);

  // Close popover when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if we just opened it
      if (justOpenedRef.current) {
        justOpenedRef.current = false;
        return;
      }

      // Don't close if clicking inside the article (might be selecting more text)
      if (articleRef.current?.contains(e.target as Node)) {
        return;
      }

      if (popoverOpen) {
        setPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popoverOpen]);

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

  // Fullscreen container class
  const containerClass = isFullScreen
    ? "fixed inset-0 z-50 bg-background overflow-y-auto px-4 py-8"
    : "";

  const content = (
    <>
      {/* Reading Controls */}
      <div
        className={`flex items-center justify-center gap-3 mb-4 ${
          isFullScreen
            ? "sticky top-0 z-10 py-2 bg-background/80 backdrop-blur-sm px-4 rounded-full max-w-fit mx-auto"
            : ""
        }`}
      >
        <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={decreaseFontSize}
            disabled={fontSize <= 16}
            className="h-8 px-3"
          >
            <Minus className="w-4 h-4 mr-1" />
            A-
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={increaseFontSize}
            disabled={fontSize >= 24}
            className="h-8 px-3"
          >
            A+
            <Plus className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleLineHeight}
          className="h-8 bg-card"
        >
          Line: {lineHeight}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullScreen}
          className="h-8 bg-card px-3"
          title={isFullScreen ? "Exit Full Screen (Esc)" : "Full Screen"}
        >
          {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </Button>
      </div>

      {/* Header */}
      <div className={`flex items-center gap-4 mb-6 ${isFullScreen ? "max-w-3xl mx-auto w-full" : ""}`}>
        <Link href="/reading">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
              {categoryName}
            </span>
            {article.word_count && (
              <span className="text-xs text-muted-foreground">{article.word_count} words</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{article.title}</h1>
        </div>
      </div>

      {/* Article Content */}
      <Card className={`p-6 md:p-8 ${isFullScreen ? "max-w-3xl mx-auto" : ""}`}>
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <div
            ref={articleRef}
            className="whitespace-pre-wrap text-foreground no-callout"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              letterSpacing: "0.2px",
            }}
            onMouseUp={handleTextSelection}
            onTouchEnd={handleTouchSelection}
            onContextMenu={(e) => e.preventDefault()}
          >
            {highlightText(article.content)}
          </div>
        </article>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Select any word to see its definition and translation
        </p>
      </Card>

      {/* Highlight Toggle Buttons */}
      {hasHighlights && (
        <Card className={`p-4 mt-6 ${isFullScreen ? "max-w-3xl mx-auto" : ""}`}>
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

      {/* Selection Popover */}
      {popoverOpen && (
        <div
          className="fixed z-[70]"
          style={{
            left: `${popoverPosition.x}px`,
            top: `${popoverPosition.y}px`,
            transform: "translateX(-50%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="p-2 shadow-lg border-primary/20 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveWord}
              className="whitespace-nowrap gap-1"
            >
              <BookMarked className="h-3.5 w-3.5" />
              Save
            </Button>
            {isSingleWord(selectedText) && (
              <Button
                size="sm"
                variant="default"
                onClick={handleShowDictionary}
                className="whitespace-nowrap gap-1"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Definition
              </Button>
            )}
          </Card>
        </div>
      )}

      {/* Dictionary Popup */}
      {showDictionary && dictionaryWord && (
        <DictionaryPopup
          word={dictionaryWord}
          position={dictionaryPosition}
          onClose={closeDictionary}
        />
      )}

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-primary" />
              Save to Your Notes
            </DialogTitle>
            <DialogDescription>
              {savedWords.length > 0 && (
                <span className="block mt-2 mb-2">
                  Save {savedWords.length} word{savedWords.length > 1 ? "s" : ""} to your personal vocabulary list.
                </span>
              )}
              Sign in or create a free account to save words and track your learning progress.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Link href="https://app.learne.org/signup" className="w-full">
              <Button className="w-full">Create Free Account</Button>
            </Link>
            <Link href="https://app.learne.org/login" className="w-full">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Words List */}
      {savedWords.length > 0 && (
        <Card className={`p-4 sm:p-6 mt-6 ${isFullScreen ? "max-w-3xl mx-auto" : ""}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              Saved Words ({savedWords.length})
            </h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
                className="gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Copy</span> All
              </Button>
              <Button
                size="sm"
                onClick={handleSaveToNotes}
                className="gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Save to</span> Notes
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {savedWords.map((word, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 group"
              >
                <span>{word}</span>
                <button
                  onClick={() => handleRemoveWord(word)}
                  className="opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                  aria-label="Remove word"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tooltip for hovered terms */}
      {hoveredTerm && (
        <div
          className="fixed z-[60] max-w-sm"
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

  // Wrap in fullscreen container if active
  if (isFullScreen) {
    return <div className={containerClass}>{content}</div>;
  }

  return content;
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
