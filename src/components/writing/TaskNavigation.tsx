"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TaskNavigationProps {
  activeTask: "task1" | "task2";
  onTaskChange: (task: "task1" | "task2") => void;
}

export function TaskNavigation({ activeTask, onTaskChange }: TaskNavigationProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-muted rounded-lg">
      <button
        onClick={() => onTaskChange("task1")}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all",
          activeTask === "task1"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Task 1
      </button>
      <button
        onClick={() => onTaskChange("task2")}
        className={cn(
          "px-4 py-2 text-sm font-medium rounded-md transition-all",
          activeTask === "task2"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Task 2
      </button>
    </div>
  );
}
