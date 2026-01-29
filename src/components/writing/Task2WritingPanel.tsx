"use client";

import React, { useCallback, useRef, useState } from "react";
import { useWritingPractice, formatTime, countWords } from "@/contexts/WritingPracticeContext";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_WORDS = 250;
const PASTE_WORD_LIMIT = 10;

export function Task2WritingPanel() {
  const {
    task2Text,
    setTask2Text,
    task2Seconds,
    task2TimerStarted,
    startTask2Timer,
    resetTask2,
  } = useWritingPractice();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedWordCount, setSelectedWordCount] = useState(0);
  const [pasteBlocked, setPasteBlocked] = useState(false);

  const wordCount = countWords(task2Text);
  const isWordCountMet = wordCount >= MIN_WORDS;
  const isTimeUp = task2Seconds === 0;

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // Start timer on first keystroke
      if (!task2TimerStarted && e.target.value.length > 0) {
        startTask2Timer();
      }
      setTask2Text(e.target.value);
    },
    [task2TimerStarted, startTask2Timer, setTask2Text]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedText = e.clipboardData.getData("text");
      const pastedWordCount = countWords(pastedText);

      if (pastedWordCount > PASTE_WORD_LIMIT) {
        e.preventDefault();
        setPasteBlocked(true);
        setTimeout(() => setPasteBlocked(false), 3000);
      }
    },
    []
  );

  const handleSelect = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectedText = textarea.value.substring(
      textarea.selectionStart,
      textarea.selectionEnd
    );
    setSelectedWordCount(countWords(selectedText));
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to reset? This will clear your text and restart the timer.")) {
      resetTask2();
    }
  }, [resetTask2]);

  return (
    <div className="panel-card h-full flex flex-col">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Task 2 Essay</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              isTimeUp
                ? "bg-destructive/10 text-destructive"
                : task2TimerStarted
                ? "bg-warning/10 text-warning"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTime(task2Seconds)}
          </div>
          {/* Reset button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-2"
            title="Reset timer and text"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="editor-frame h-full relative">
          <textarea
            ref={textareaRef}
            value={task2Text}
            onChange={handleTextChange}
            onPaste={handlePaste}
            onSelect={handleSelect}
            onMouseUp={handleSelect}
            onKeyUp={handleSelect}
            placeholder="Start typing your Task 2 essay here. The timer will begin when you start writing..."
            className="editor-textarea"
            disabled={isTimeUp}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />

          {/* Paste blocked notification */}
          {pasteBlocked && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Pasting more than {PASTE_WORD_LIMIT} words is not allowed
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="panel-footer flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Word count */}
          <div
            className={cn(
              "status-badge",
              isWordCountMet && "status-badge-success"
            )}
          >
            <span>{wordCount}</span>
            <span className="text-muted-foreground">/</span>
            <span>{MIN_WORDS}+ words</span>
          </div>

          {/* Selected word count */}
          {selectedWordCount > 0 && (
            <div className="status-badge">
              <span>{selectedWordCount} selected</span>
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="text-xs text-muted-foreground">
          {!task2TimerStarted && "Timer starts when you begin typing"}
          {task2TimerStarted && !isTimeUp && "Writing in progress..."}
          {isTimeUp && "Time is up!"}
        </div>
      </div>
    </div>
  );
}
