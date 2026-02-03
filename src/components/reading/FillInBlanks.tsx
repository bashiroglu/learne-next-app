"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, Trophy, BookOpen, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FillInBlankItem {
  id: string;
  sentence: string;
  answer: string;
  display_order: number;
}

interface FillInBlanksProps {
  items: FillInBlankItem[];
  onComplete: () => void;
  onBack: () => void;
}

export const FillInBlanks = ({ items, onComplete, onBack }: FillInBlanksProps) => {
  const [filledGaps, setFilledGaps] = useState<Record<string, string>>({});
  const [correctGaps, setCorrectGaps] = useState<Set<string>>(new Set());
  const [draggingWord, setDraggingWord] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [shakingId, setShakingId] = useState<string | null>(null);

  // Create word bank from answers
  const wordBank = useMemo(() => {
    return items.map((item) => item.answer);
  }, [items]);

  // Track which words are used (locked in correct answers)
  const usedWords = useMemo(() => {
    return new Set(Array.from(correctGaps).map((id) => filledGaps[id]));
  }, [correctGaps, filledGaps]);

  // Available words (not yet correctly placed)
  const availableWords = useMemo(() => {
    return wordBank.filter((word) => !usedWords.has(word));
  }, [wordBank, usedWords]);

  const handleDragStart = useCallback((e: React.DragEvent, word: string) => {
    e.dataTransfer.setData("word", word);
    setDraggingWord(word);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingWord(null);
    setDragOverId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent, id: string) => {
      e.preventDefault();
      if (!correctGaps.has(id)) {
        setDragOverId(id);
      }
    },
    [correctGaps]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, gapId: string) => {
      e.preventDefault();
      const word = e.dataTransfer.getData("word");

      setDraggingWord(null);
      setDragOverId(null);

      // Can't drop on already correct gaps
      if (correctGaps.has(gapId)) return;

      if (word) {
        const item = items.find((d) => d.id === gapId);
        if (item && word === item.answer) {
          // Correct answer - lock it in
          setFilledGaps((prev) => ({ ...prev, [gapId]: word }));
          setCorrectGaps((prev) => new Set([...prev, gapId]));
        } else {
          // Wrong answer - shake animation
          setShakingId(gapId);
          setTimeout(() => setShakingId(null), 500);
        }
      }
    },
    [correctGaps, items]
  );

  const handleReset = useCallback(() => {
    setFilledGaps({});
    setCorrectGaps(new Set());
    setDraggingWord(null);
    setDragOverId(null);
    setShakingId(null);
  }, []);

  const progress = correctGaps.size;
  const total = items.length;
  const isComplete = progress === total;

  // Render sentence with gap
  const renderSentence = (sentence: string, gapId: string) => {
    const parts = sentence.split("__________");
    const isCorrect = correctGaps.has(gapId);
    const filledWord = filledGaps[gapId];
    const isDragOver = dragOverId === gapId;
    const isShaking = shakingId === gapId;

    return (
      <span>
        {parts[0]}
        <span
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, gapId)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, gapId)}
          className={cn(
            "inline-flex items-center justify-center min-w-[120px] px-3 py-1 mx-1 rounded-lg border-2 border-dashed transition-all duration-200",
            isCorrect
              ? "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400 font-bold"
              : isDragOver
                ? "bg-primary/20 border-primary scale-105"
                : "bg-muted/50 border-muted-foreground/30",
            isShaking && "animate-shake"
          )}
        >
          {filledWord ? (
            <span className="flex items-center gap-1">
              {filledWord}
              {isCorrect && <CheckCircle className="w-4 h-4" />}
            </span>
          ) : (
            <span className="text-muted-foreground">___</span>
          )}
        </span>
        {parts[1]}
      </span>
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          No fill-in-the-blank items available for this article.
        </p>
        <Button onClick={onComplete} className="mt-4">
          Finish Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
          <BookOpen className="w-6 h-6 text-primary" />
          Fill in the Blanks
          <BookOpen className="w-6 h-6 text-primary" />
        </h2>
        <p className="text-muted-foreground">Drag each word to its correct sentence</p>
      </div>

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
              Perfect Score!
            </h3>
            <Trophy className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-green-600 dark:text-green-400 mb-4">
            You completed all {total} sentences correctly!
          </p>
          <Button onClick={onComplete}>Finish Quiz</Button>
        </div>
      )}

      {/* Main Content - Two Columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Words Column */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {availableWords.length}
            </span>
            Word Bank
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, index) => (
              <div
                key={`${word}-${index}`}
                draggable
                onDragStart={(e) => handleDragStart(e, word)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 select-none cursor-grab active:cursor-grabbing",
                  "bg-primary/10 hover:bg-primary/20 hover:shadow-md hover:-translate-y-0.5",
                  draggingWord === word && "opacity-50 scale-95"
                )}
              >
                {word}
              </div>
            ))}
          </div>
          {availableWords.length === 0 && !isComplete && (
            <p className="text-center text-muted-foreground py-4">All words placed!</p>
          )}
        </div>

        {/* Sentences Column */}
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex flex-col max-h-[60vh]">
          <h3 className="text-lg font-bold text-foreground mb-4">Sentences</h3>
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {items.map((item) => {
                const isCompleted = correctGaps.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200",
                      isCompleted
                        ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                        : dragOverId === item.id
                          ? "bg-primary/10 border-primary"
                          : "bg-muted/30 border-border",
                      shakingId === item.id && "animate-shake"
                    )}
                  >
                    <p className="text-foreground leading-relaxed">
                      {renderSentence(item.sentence, item.id)}
                    </p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={onBack} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Vocabulary
        </Button>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FillInBlanks;
