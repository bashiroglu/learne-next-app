"use client";

import { useRef, useState, useMemo } from "react";
import { GrammarVideoPlayer, GrammarVideoPlayerHandle } from "./video-player";
import VocabularySection from "@/components/VocabularySection";
import QuizSection from "@/components/QuizSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TranscriptLine, VocabularyItem } from "@/types/listening";
import type { Question } from "@/types";

interface GrammarVideoContentProps {
  videoId: string;
  transcript: TranscriptLine[] | null;
  vocabulary: VocabularyItem[];
  questions: Question[];
}

export function GrammarVideoContent({
  videoId,
  transcript,
  vocabulary,
  questions,
}: GrammarVideoContentProps) {
  const videoRef = useRef<GrammarVideoPlayerHandle>(null);

  const hasQuiz = questions.length > 0;
  const hasVocabulary = vocabulary.length > 0;
  const defaultTab = useMemo(
    () => (hasQuiz ? "quiz" : hasVocabulary ? "vocabulary" : "quiz"),
    [hasQuiz, hasVocabulary]
  );
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSeekVideo = (time: number) => {
    videoRef.current?.seekToAndPlay(time);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Video Player with Transcript */}
      <div className="mb-8">
        <GrammarVideoPlayer ref={videoRef} videoId={videoId} transcript={transcript} />
      </div>

      {/* Quiz and Vocabulary Tabs */}
      {(hasQuiz || hasVocabulary) && (
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className={`grid w-full max-w-md ${
                hasQuiz && hasVocabulary ? "grid-cols-2" : "grid-cols-1"
              } mb-6`}
            >
              {hasQuiz && <TabsTrigger value="quiz">Quiz</TabsTrigger>}
              {hasVocabulary && <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>}
            </TabsList>
            {hasQuiz && (
              <TabsContent value="quiz">
                <QuizSection questions={questions} onSeekVideo={handleSeekVideo} />
              </TabsContent>
            )}
            {hasVocabulary && (
              <TabsContent value="vocabulary">
                <VocabularySection
                  vocabularyItems={vocabulary}
                  onSeekVideo={handleSeekVideo}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </>
  );
}
