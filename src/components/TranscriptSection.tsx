"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TranscriptLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

interface TranscriptSectionProps {
  transcript: TranscriptLine[];
  currentTime: number;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function TranscriptSection({
  transcript,
  currentTime,
  onSeek,
}: TranscriptSectionProps) {
  const [isContentVisible, setIsContentVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLButtonElement>(null);

  const activeLineIndex = transcript.findIndex(
    (line) => currentTime >= line.startTime && currentTime < line.endTime
  );

  useEffect(() => {
    if (activeLineRef.current && containerRef.current && isContentVisible) {
      const container = containerRef.current;
      const activeLine = activeLineRef.current;

      const containerRect = container.getBoundingClientRect();
      const lineRect = activeLine.getBoundingClientRect();

      const scrollOffset =
        lineRect.top - containerRect.top - containerRect.height / 3;

      container.scrollTo({
        top: container.scrollTop + scrollOffset,
        behavior: "smooth",
      });
    }
  }, [activeLineIndex, isContentVisible]);

  if (transcript.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-2 border-b border-border bg-muted/30 shrink-0 flex items-center justify-between min-h-[44px]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              Transcript
            </h3>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Click any line to jump there
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsContentVisible(!isContentVisible)}
          className="h-6 px-2 text-xs gap-1 shrink-0"
        >
          {isContentVisible ? (
            <>
              <EyeOff className="w-3 h-3" />
              Hide
            </>
          ) : (
            <>
              <Eye className="w-3 h-3" />
              Show
            </>
          )}
        </Button>
      </div>

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-y-auto px-3 py-2 space-y-1 transition-all duration-200",
          !isContentVisible && "blur-md select-none"
        )}
      >
        {transcript.map((line, index) => {
          const isActive = index === activeLineIndex;
          const isPast = currentTime >= line.endTime;

          return (
            <button
              key={line.id}
              ref={isActive ? activeLineRef : null}
              onClick={() => onSeek(line.startTime)}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-primary/5 cursor-pointer",
                isActive && "bg-primary/10 border-l-3 border-primary",
                isPast && !isActive && "text-muted-foreground",
                !isPast && !isActive && "text-foreground"
              )}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums min-w-[42px] mt-0.5",
                    isActive ? "text-primary" : "text-muted-foreground/70"
                  )}
                >
                  {formatTime(line.startTime)}
                </span>
                <span
                  className={cn(
                    "flex-1 text-sm leading-relaxed",
                    isActive && "font-medium text-foreground"
                  )}
                >
                  {line.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
