"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Volume2,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VocabularyItem } from "@/types/listening";

interface VocabularySectionProps {
  vocabularyItems: VocabularyItem[];
  onSeekVideo?: (time: number) => void;
}

const formatTimestamp = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "word":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    case "phrase":
      return "bg-green-500/10 text-green-700 dark:text-green-300";
    case "collocation":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
  }
};

export default function VocabularySection({
  vocabularyItems,
  onSeekVideo,
}: VocabularySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  if (!vocabularyItems || vocabularyItems.length === 0) {
    return null;
  }

  const currentItem = vocabularyItems[currentIndex];
  const isFirstItem = currentIndex === 0;
  const isLastItem = currentIndex === vocabularyItems.length - 1;

  const handleListen = () => {
    if (onSeekVideo && currentItem.timestamp) {
      onSeekVideo(currentItem.timestamp);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAddToNotes = () => {
    setShowRegisterDialog(true);
  };

  const handleNext = () => {
    if (!isLastItem) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstItem) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Vocabulary</h2>
          <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted rounded-full">
            Word {currentIndex + 1} of {vocabularyItems.length}
          </span>
        </div>

        {/* Main Card */}
        <Card className="border-border shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-3xl font-bold">
                {currentItem.word}
              </CardTitle>
              <div className="flex gap-2">
                <Badge className={getTypeColor(currentItem.type)}>
                  {currentItem.type}
                </Badge>
                {currentItem.timestamp > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Volume2 className="w-3 h-3" />
                    {formatTimestamp(currentItem.timestamp)}
                  </Badge>
                )}
              </div>
            </div>
            {currentItem.context && (
              <p className="text-sm text-muted-foreground mt-2 italic">
                &quot;{currentItem.context}&quot;
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleListen}
                size="lg"
                className="h-16 bg-primary hover:bg-primary/90 cursor-pointer"
              >
                <Volume2 className="w-5 h-5 mr-2" />
                Listen
              </Button>
              <Button
                onClick={handleAddToNotes}
                size="lg"
                variant="outline"
                className="h-16 cursor-pointer"
              >
                <BookmarkPlus className="w-5 h-5 mr-2" />
                Add to my notes
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstItem}
                className="w-[120px] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLastItem}
                className="w-[120px] cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Register Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Save to Your Notes
            </DialogTitle>
            <DialogDescription>
              Create a free account to save vocabulary to your personal notes
              and practice them later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium text-foreground mb-1">
                {currentItem.word}
              </p>
              {currentItem.context && (
                <p className="text-sm text-muted-foreground italic">
                  &quot;{currentItem.context}&quot;
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Link href="https://app.learne.org/signup" className="w-full">
                <Button className="w-full cursor-pointer">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Free Account
                </Button>
              </Link>
              <Link href="https://app.learne.org/login" className="w-full">
                <Button variant="outline" className="w-full cursor-pointer">
                  Already have an account? Sign In
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
