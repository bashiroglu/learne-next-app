"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePanel } from "@/components/writing/ImagePanel";
import { WritingPanel } from "@/components/writing/WritingPanel";
import { TaskPromptPanel } from "@/components/writing/TaskPromptPanel";
import { Task2WritingPanel } from "@/components/writing/Task2WritingPanel";
import { PenLine, BarChart3, FileText } from "lucide-react";

export function WritingPracticeContent() {
  const [activeTab, setActiveTab] = useState("task1");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <PenLine className="w-6 h-6 text-primary" />
                IELTS Writing Practice
              </h1>
              <p className="text-muted-foreground mt-1">
                Practice under timed exam conditions with auto-start timer and
                word count tracking
              </p>
            </div>

            {/* Task switcher tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList className="grid grid-cols-2 w-[240px]">
                <TabsTrigger value="task1" className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4" />
                  Task 1
                </TabsTrigger>
                <TabsTrigger value="task2" className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Task 2
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Task 1: 50/50 split - Image panel + Writing panel */}
          <TabsContent value="task1" className="mt-0 h-[calc(100vh-160px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              <ImagePanel />
              <WritingPanel />
            </div>
          </TabsContent>

          {/* Task 2: 33/67 split - Prompt panel + Writing panel */}
          <TabsContent value="task2" className="mt-0 h-[calc(100vh-160px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              <div className="lg:col-span-1 h-full">
                <TaskPromptPanel />
              </div>
              <div className="lg:col-span-2 h-full">
                <Task2WritingPanel />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
