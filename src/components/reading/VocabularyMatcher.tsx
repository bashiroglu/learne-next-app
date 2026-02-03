"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Trophy, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VocabularyItem {
  id: string;
  term: string;
  explanation: string;
}

interface VocabularyMatcherProps {
  phrases: VocabularyItem[];
  onComplete: () => void;
}

export const VocabularyMatcher = ({ phrases, onComplete }: VocabularyMatcherProps) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [matchedWords, setMatchedWords] = useState<Set<string>>(new Set());

  // Shuffle definitions on mount
  const shuffledDefinitions = useMemo(() => {
    return [...phrases].sort(() => Math.random() - 0.5);
  }, [phrases]);

  // Filter out matched words from the word list
  const availableWords = useMemo(() => {
    return phrases.filter((item) => !matchedWords.has(item.id));
  }, [phrases, matchedWords]);

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("wordId", id);
    setDraggingId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, definitionId: string) => {
    e.preventDefault();
    setDragOverId(definitionId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, definitionId: string) => {
      e.preventDefault();
      const wordId = e.dataTransfer.getData("wordId");

      setDraggingId(null);
      setDragOverId(null);

      // Check if already matched
      if (matches[definitionId]) return;

      // Check if correct match
      if (wordId === definitionId) {
        const word = phrases.find((item) => item.id === wordId)?.term;
        if (word) {
          setMatches((prev) => ({ ...prev, [definitionId]: word }));
          setMatchedWords((prev) => new Set([...prev, wordId]));
        }
      } else {
        // Wrong match - shake animation
        setShakingId(definitionId);
        setTimeout(() => setShakingId(null), 500);
      }
    },
    [matches, phrases]
  );

  const handleReset = useCallback(() => {
    setMatches({});
    setMatchedWords(new Set());
    setDraggingId(null);
    setDragOverId(null);
    setShakingId(null);
  }, []);

  const progress = matchedWords.size;
  const total = phrases.length;
  const isComplete = progress === total;

  if (phrases.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No vocabulary items available for this article.
        </p>
        <Button onClick={onComplete} className="mt-4 gap-2">
          Skip to Fill Blanks <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Progress Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
          <span className="text-sm font-bold text-primary">
            {progress} / {total}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Completion Message */}
      {isComplete && (
        <div className="mb-6 p-6 bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-xl text-center animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
              Excellent Work!
            </h3>
            <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-green-600 dark:text-green-400 mb-4">
            You matched all {total} vocabulary items correctly!
          </p>
          <Button onClick={onComplete} className="gap-2">
            Continue to Fill Blanks <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Vocabulary Words Column */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {availableWords.length}
            </span>
            Phrases
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableWords.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 select-none cursor-grab active:cursor-grabbing",
                  "bg-primary/10 hover:bg-primary/20 hover:shadow-md hover:-translate-y-0.5",
                  draggingId === item.id && "opacity-50 scale-95"
                )}
              >
                {item.term}
              </div>
            ))}
          </div>
          {availableWords.length === 0 && !isComplete && (
            <p className="text-center text-muted-foreground py-4">
              All phrases matched!
            </p>
          )}
        </div>

        {/* Definitions Column */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex flex-col max-h-[60vh]">
          <h3 className="text-lg font-bold text-foreground mb-4">Explanations</h3>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {shuffledDefinitions.map((item) => (
                <div
                  key={item.id}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, item.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, item.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200",
                    matches[item.id]
                      ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                      : dragOverId === item.id
                        ? "bg-primary/10 border-primary scale-[1.02]"
                        : "bg-muted/30 border-border hover:border-muted-foreground/50",
                    shakingId === item.id && "animate-shake"
                  )}
                >
                  {matches[item.id] ? (
                    <div className="flex items-start gap-3 animate-in fade-in duration-300">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-green-600 dark:text-green-400 mb-1">
                          {matches[item.id]}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.explanation}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        {!isComplete && (
          <Button onClick={onComplete} variant="ghost" className="gap-2">
            Skip <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default VocabularyMatcher;
