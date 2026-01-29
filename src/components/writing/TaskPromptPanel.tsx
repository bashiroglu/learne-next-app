"use client";

import React, { useCallback } from "react";
import { useWritingPractice } from "@/contexts/WritingPracticeContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Lock, Unlock, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskPromptPanel() {
  const {
    task2Prompt,
    setTask2Prompt,
    task2IsPromptLocked,
    setTask2IsPromptLocked,
  } = useWritingPractice();

  const handlePromptChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTask2Prompt(e.target.value);
    },
    [setTask2Prompt]
  );

  const handleLockToggle = useCallback(() => {
    setTask2IsPromptLocked(!task2IsPromptLocked);
  }, [task2IsPromptLocked, setTask2IsPromptLocked]);

  return (
    <div className="panel-card h-full flex flex-col">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Task 2 Prompt</span>
        </div>
        <Button
          variant={task2IsPromptLocked ? "outline" : "ghost"}
          size="sm"
          onClick={handleLockToggle}
          className={cn(
            "h-8",
            task2IsPromptLocked && "border-success text-success hover:text-success hover:bg-success/10"
          )}
        >
          {task2IsPromptLocked ? (
            <>
              <Lock className="w-4 h-4 mr-1" />
              Locked
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4 mr-1" />
              Lock Prompt
            </>
          )}
        </Button>
      </div>

      {/* Prompt area */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="editor-frame h-full relative">
          {task2IsPromptLocked ? (
            <div className="h-full p-4 overflow-y-auto">
              <div className="prose prose-sm max-w-none text-foreground">
                {task2Prompt || (
                  <span className="text-muted-foreground italic">
                    No prompt entered
                  </span>
                )}
              </div>
              {/* Edit hint */}
              <button
                onClick={handleLockToggle}
                className="absolute top-2 right-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
            </div>
          ) : (
            <textarea
              value={task2Prompt}
              onChange={handlePromptChange}
              placeholder="Paste or type your Task 2 essay prompt here, then lock it to begin writing..."
              className="editor-textarea"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="panel-footer">
        <div className="text-xs text-muted-foreground">
          {!task2Prompt && "Enter your essay prompt above"}
          {task2Prompt && !task2IsPromptLocked && "Lock the prompt when ready to start writing"}
          {task2Prompt && task2IsPromptLocked && "Prompt locked - focus on your essay"}
        </div>
      </div>
    </div>
  );
}
