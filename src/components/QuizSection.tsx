"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  UserPlus,
  Trophy,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuestionRenderer from "@/components/QuestionRenderer";
import type { Question, Answer } from "@/types";

interface QuizSectionProps {
  questions: Question[];
  onSeekVideo?: (time: number) => void;
}

// Component to render explanations with clickable timestamps
interface ExplanationWithTimestampsProps {
  explanation: string;
  onSeekVideo?: (time: number) => void;
}

function ExplanationWithTimestamps({ explanation, onSeekVideo }: ExplanationWithTimestampsProps) {
  // Parse timestamps in format @mm:ss or @hh:mm:ss
  const parseExplanation = (text: string) => {
    const timestampRegex = /@(\d{1,2}):(\d{2})(?::(\d{2}))?/g;
    const parts: Array<{ type: "text" | "timestamp"; content: string; time?: number }> = [];
    let lastIndex = 0;
    let match;

    while ((match = timestampRegex.exec(text)) !== null) {
      // Add text before the timestamp
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
      }

      // Calculate seconds
      const p1 = parseInt(match[1], 10);
      const p2 = parseInt(match[2], 10);
      const p3 = match[3] ? parseInt(match[3], 10) : undefined;

      let totalSeconds = 0;
      if (p3 !== undefined) {
        // Format HH:MM:SS -> p1: Hours, p2: Mins, p3: Secs
        totalSeconds = p1 * 3600 + p2 * 60 + p3;
      } else {
        // Format MM:SS -> p1: Mins, p2: Secs
        totalSeconds = p1 * 60 + p2;
      }

      parts.push({
        type: "timestamp",
        content: match[0],
        time: totalSeconds,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: "text" as const, content: text }];
  };

  const parts = parseExplanation(explanation);

  return (
    <span className="leading-relaxed">
      {parts.map((part, index) => {
        if (part.type === "timestamp" && part.time !== undefined && onSeekVideo) {
          return (
            <button
              key={index}
              onClick={() => {
                onSeekVideo(part.time!);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded bg-primary/20 hover:bg-primary/30 text-primary font-medium transition-colors cursor-pointer border border-primary/30"
              title={`Jump to ${part.content.slice(1)}`}
            >
              <Clock className="w-3 h-3" />
              {part.content.slice(1)}
            </button>
          );
        }
        // Handle bold text within regular text parts
        const boldRegex = /\*\*(.+?)\*\*/g;
        const textParts: React.ReactNode[] = [];
        let textLastIndex = 0;
        let boldMatch;

        while ((boldMatch = boldRegex.exec(part.content)) !== null) {
          if (boldMatch.index > textLastIndex) {
            textParts.push(part.content.slice(textLastIndex, boldMatch.index));
          }
          textParts.push(
            <strong key={`bold-${boldMatch.index}`} className="font-semibold text-foreground">
              {boldMatch[1]}
            </strong>
          );
          textLastIndex = boldMatch.index + boldMatch[0].length;
        }

        if (textLastIndex < part.content.length) {
          textParts.push(part.content.slice(textLastIndex));
        }

        return <span key={index}>{textParts.length > 0 ? textParts : part.content}</span>;
      })}
    </span>
  );
}

export default function QuizSection({ questions, onSeekVideo }: QuizSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleAnswer = (answer: string | string[]) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === currentQuestion.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { questionId: currentQuestion.id, answer };
        return updated;
      }
      return [...prev, { questionId: currentQuestion.id, answer }];
    });
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const isAnswerCorrect = (question: Question, answer: Answer | undefined): boolean => {
    if (!answer) return false;

    const correctAnswer = question.correctAnswer;
    const userAnswer = answer.answer;

    if (Array.isArray(correctAnswer) && Array.isArray(userAnswer)) {
      if (correctAnswer.length !== userAnswer.length) return false;
      return correctAnswer.every((val, idx) =>
        val.toLowerCase().trim() === userAnswer[idx]?.toLowerCase().trim()
      );
    }

    if (typeof correctAnswer === "string" && typeof userAnswer === "string") {
      return correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();
    }

    return false;
  };

  const isCurrentCorrect = isAnswerCorrect(currentQuestion, currentAnswer);

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentIndex((prev) => prev - 1);
      setShowFeedback(false);
    }
  };

  const handleFinish = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setAnswers([]);
    setCurrentIndex(0);
    setShowFeedback(false);
    setShowResults(false);
  };

  const handleSaveProgress = () => {
    setShowRegisterDialog(true);
  };

  // Calculate results
  const correctAnswers = questions.filter((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    return isAnswerCorrect(q, answer);
  });
  const scorePercentage = Math.round((correctAnswers.length / questions.length) * 100);

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Quiz Results</h2>
        </div>

        <Card className="border-border shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
              <div>
                <p className="text-4xl font-bold text-foreground">
                  {correctAnswers.length}/{questions.length}
                </p>
                <p className="text-lg text-muted-foreground">
                  {scorePercentage}% Correct
                </p>
              </div>

              <div className="flex justify-center gap-2 pt-4">
                {questions.map((q, idx) => {
                  const answer = answers.find((a) => a.questionId === q.id);
                  const correct = isAnswerCorrect(q, answer);
                  return (
                    <div
                      key={q.id}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        correct
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center">
                <Button onClick={handleRestart} variant="outline" className="cursor-pointer">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={handleSaveProgress} className="cursor-pointer">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Quiz</h2>
          <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted rounded-full">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question Card */}
        <Card className="border-border shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Renderer */}
            <QuestionRenderer
              question={currentQuestion}
              answer={currentAnswer?.answer}
              onAnswer={handleAnswer}
              showFeedback={showFeedback}
              isValidated={showFeedback}
              isCorrect={isCurrentCorrect}
              disabled={showFeedback}
            />

            {/* Feedback */}
            {showFeedback && (
              <div
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  isCurrentCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                {isCurrentCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p
                    className={`font-medium ${
                      isCurrentCorrect
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {isCurrentCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  {currentQuestion.explanation && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <ExplanationWithTimestamps
                        explanation={currentQuestion.explanation}
                        onSeekVideo={onSeekVideo}
                      />
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Check Answer Button */}
            {!showFeedback && currentAnswer && (
              <Button
                onClick={checkAnswer}
                className="w-full cursor-pointer"
                size="lg"
              >
                Check Answer
              </Button>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className="w-[120px] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {isLastQuestion && showFeedback ? (
                <Button onClick={handleFinish} className="w-[120px] cursor-pointer">
                  Finish
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isLastQuestion}
                  className="w-[120px] cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2">
          {questions.map((q, idx) => {
            const answer = answers.find((a) => a.questionId === q.id);
            const answered = !!answer;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setShowFeedback(false);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : answered
                      ? "bg-muted text-foreground"
                      : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Register Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Save Your Progress
            </DialogTitle>
            <DialogDescription>
              Create a free account to save your quiz results and track your
              learning progress over time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">
                {correctAnswers.length}/{questions.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {scorePercentage}% Correct
              </p>
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
