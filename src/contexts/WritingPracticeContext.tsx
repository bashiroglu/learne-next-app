"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

// Timer constants
const TASK_1_DURATION = 20 * 60; // 20 minutes in seconds
const TASK_2_DURATION = 40 * 60; // 40 minutes in seconds

interface WritingPracticeState {
  // Task 1
  task1Images: string[];
  task1Text: string;
  task1Seconds: number;
  task1TimerStarted: boolean;

  // Task 2
  task2Prompt: string;
  task2IsPromptLocked: boolean;
  task2Text: string;
  task2Seconds: number;
  task2TimerStarted: boolean;

  // Actions
  setTask1Images: (images: string[]) => void;
  addTask1Image: (image: string) => void;
  removeTask1Image: (index: number) => void;
  setTask1Text: (text: string) => void;
  startTask1Timer: () => void;
  resetTask1: () => void;

  setTask2Prompt: (prompt: string) => void;
  setTask2IsPromptLocked: (locked: boolean) => void;
  setTask2Text: (text: string) => void;
  startTask2Timer: () => void;
  resetTask2: () => void;
}

const WritingPracticeContext = createContext<WritingPracticeState | undefined>(undefined);

export function WritingPracticeProvider({ children }: { children: React.ReactNode }) {
  // Task 1 state
  const [task1Images, setTask1Images] = useState<string[]>([]);
  const [task1Text, setTask1Text] = useState("");
  const [task1Seconds, setTask1Seconds] = useState(TASK_1_DURATION);
  const [task1TimerStarted, setTask1TimerStarted] = useState(false);

  // Task 2 state
  const [task2Prompt, setTask2Prompt] = useState("");
  const [task2IsPromptLocked, setTask2IsPromptLocked] = useState(false);
  const [task2Text, setTask2Text] = useState("");
  const [task2Seconds, setTask2Seconds] = useState(TASK_2_DURATION);
  const [task2TimerStarted, setTask2TimerStarted] = useState(false);

  // Timer intervals
  const task1IntervalRef = useRef<NodeJS.Timeout | null>(null);
  const task2IntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Task 1 timer effect
  useEffect(() => {
    if (task1TimerStarted && task1Seconds > 0) {
      task1IntervalRef.current = setInterval(() => {
        setTask1Seconds((prev) => {
          if (prev <= 1) {
            if (task1IntervalRef.current) {
              clearInterval(task1IntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (task1IntervalRef.current) {
        clearInterval(task1IntervalRef.current);
      }
    };
  }, [task1TimerStarted, task1Seconds]);

  // Task 2 timer effect
  useEffect(() => {
    if (task2TimerStarted && task2Seconds > 0) {
      task2IntervalRef.current = setInterval(() => {
        setTask2Seconds((prev) => {
          if (prev <= 1) {
            if (task2IntervalRef.current) {
              clearInterval(task2IntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (task2IntervalRef.current) {
        clearInterval(task2IntervalRef.current);
      }
    };
  }, [task2TimerStarted, task2Seconds]);

  // Task 1 actions
  const addTask1Image = useCallback((image: string) => {
    setTask1Images((prev) => [...prev, image]);
  }, []);

  const removeTask1Image = useCallback((index: number) => {
    setTask1Images((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const startTask1Timer = useCallback(() => {
    if (!task1TimerStarted) {
      setTask1TimerStarted(true);
    }
  }, [task1TimerStarted]);

  const resetTask1 = useCallback(() => {
    if (task1IntervalRef.current) {
      clearInterval(task1IntervalRef.current);
    }
    setTask1Text("");
    setTask1Seconds(TASK_1_DURATION);
    setTask1TimerStarted(false);
  }, []);

  // Task 2 actions
  const startTask2Timer = useCallback(() => {
    if (!task2TimerStarted) {
      setTask2TimerStarted(true);
    }
  }, [task2TimerStarted]);

  const resetTask2 = useCallback(() => {
    if (task2IntervalRef.current) {
      clearInterval(task2IntervalRef.current);
    }
    setTask2Text("");
    setTask2Seconds(TASK_2_DURATION);
    setTask2TimerStarted(false);
  }, []);

  const value: WritingPracticeState = {
    // Task 1
    task1Images,
    task1Text,
    task1Seconds,
    task1TimerStarted,
    setTask1Images,
    addTask1Image,
    removeTask1Image,
    setTask1Text,
    startTask1Timer,
    resetTask1,

    // Task 2
    task2Prompt,
    task2IsPromptLocked,
    task2Text,
    task2Seconds,
    task2TimerStarted,
    setTask2Prompt,
    setTask2IsPromptLocked,
    setTask2Text,
    startTask2Timer,
    resetTask2,
  };

  return (
    <WritingPracticeContext.Provider value={value}>
      {children}
    </WritingPracticeContext.Provider>
  );
}

export function useWritingPractice() {
  const context = useContext(WritingPracticeContext);
  if (context === undefined) {
    throw new Error("useWritingPractice must be used within a WritingPracticeProvider");
  }
  return context;
}

// Helper to format seconds as MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Helper to count words
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
