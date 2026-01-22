"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Check, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import QuestionRenderer from "@/components/QuestionRenderer";
import { ExplanationRenderer } from "@/components/ExplanationRenderer";
import type { GrammarTest, ParsedGrammarQuestion } from "@/types/grammar";
import type { Answer, MultiGapCorrectAnswer } from "@/types";
import { cn } from "@/lib/utils";

// Question types that allow two attempts (written-input questions)
const WRITTEN_QUESTION_TYPES = ["short-answer", "long-answer", "fill-in-blank"];
// Question types that allow unlimited attempts
const UNLIMITED_ATTEMPT_TYPES = ["drag-drop-sentence"];
// Multi-gap-fill has special 5-attempt handling
const MULTI_GAP_FILL_MAX_ATTEMPTS = 5;

interface QuestionState {
  attempts: number;
  isValidated: boolean;
  isCorrect: boolean;
  explanationSeen: boolean;
  showExplanation: boolean;
  lockedPositions?: boolean[];
  // Multi-gap-fill specific state
  gapStates?: ('correct' | 'incorrect' | 'unanswered' | 'revealed')[];
}

interface TestContentProps {
  test: GrammarTest;
  questions: ParsedGrammarQuestion[];
}

export function TestContent({ test, questions }: TestContentProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestionState = questionStates[currentQuestion?.id] || {
    attempts: 0,
    isValidated: false,
    isCorrect: false,
    explanationSeen: false,
    showExplanation: false,
  };
  const isWrittenQuestion = WRITTEN_QUESTION_TYPES.includes(currentQuestion?.type);
  const isUnlimitedAttemptType = UNLIMITED_ATTEMPT_TYPES.includes(currentQuestion?.type);
  const isMultiGapFill = currentQuestion?.type === "multi-gap-fill";
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id);

  const checkAnswerCorrectness = useCallback(
    (question: ParsedGrammarQuestion, userAnswer: Answer | undefined): boolean => {
      if (!userAnswer) return false;

      if (question.type === "multiple-select") {
        if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
          const correctSet = new Set(
            (question.correctAnswer as string[]).map((a) => String(a).toLowerCase())
          );
          const userSet = new Set(
            (userAnswer.answer as string[]).map((a) => String(a).toLowerCase())
          );
          return (
            correctSet.size === userSet.size &&
            Array.from(correctSet).every((a) => userSet.has(a))
          );
        }
      } else if (question.type === "inline-conditional-choice") {
        if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
          const correctAnswers = (question.correctAnswer as string[])
            .filter((a) => a && String(a).trim())
            .map((a) => String(a).toLowerCase().trim());
          const userAnswers = (userAnswer.answer as string[])
            .filter((a) => a && String(a).trim())
            .map((a) => String(a).toLowerCase().trim());
          return (
            correctAnswers.length === userAnswers.length &&
            correctAnswers.every((ans, idx) => ans === userAnswers[idx])
          );
        }
      } else if (
        question.type === "fill-in-blank" &&
        Array.isArray(question.correctAnswer) &&
        Array.isArray(userAnswer.answer)
      ) {
        const correctAnswerObjects = question.correctAnswer as Array<
          { answers?: string[] } | string
        >;
        return correctAnswerObjects.every((correctObj, idx) => {
          const userAns =
            (userAnswer.answer as string[])[idx]?.toLowerCase().trim() || "";
          if (typeof correctObj === "object" && correctObj.answers) {
            return correctObj.answers.some((a) => a.toLowerCase().trim() === userAns);
          }
          return String(correctObj).toLowerCase().trim() === userAns;
        });
      } else if (
        question.type === "multi-gap-fill" &&
        Array.isArray(userAnswer.answer)
      ) {
        const correctAnswerData = question.correctAnswer as unknown as MultiGapCorrectAnswer;
        const gaps = correctAnswerData?.gaps || [];
        const userAnswers = userAnswer.answer as string[];
        return gaps.every((gap, idx) => {
          const userAns = userAnswers[idx] || "";
          const caseSensitive = gap.caseSensitive ?? false;
          const normalizedUserAns = (caseSensitive ? userAns.trim() : userAns.trim().toLowerCase()).replace(/['']/g, "'");

          // Check if any accepted answer is empty (meaning empty is a valid answer)
          const acceptsEmpty = gap.accepted.some(accepted => accepted.trim() === "");

          // If user left it blank and empty is NOT accepted, it's incorrect
          if (!userAns.trim() && !acceptsEmpty) {
            return false;
          }

          return gap.accepted.some(accepted => {
            const normalizedAccepted = (caseSensitive ? accepted.trim() : accepted.trim().toLowerCase()).replace(/['']/g, "'");
            return normalizedUserAns === normalizedAccepted;
          });
        });
      } else if (
        question.type === "drag-drop-sentence" &&
        Array.isArray(userAnswer.answer)
      ) {
        const normalize = (str: string) =>
          str.toLowerCase().replace(/[.,!?;:'"]/g, "").trim();

        let correctSentence = "";
        if (typeof question.correctAnswer === "string") {
          try {
            const parsed = JSON.parse(question.correctAnswer);
            correctSentence = Array.isArray(parsed)
              ? parsed.join(" ")
              : question.correctAnswer;
          } catch {
            correctSentence = question.correctAnswer;
          }
        } else if (Array.isArray(question.correctAnswer)) {
          correctSentence = (question.correctAnswer as string[]).join(" ");
        }

        const userSentence = (userAnswer.answer as string[]).join(" ");
        return normalize(userSentence) === normalize(correctSentence);
      } else if (
        Array.isArray(question.correctAnswer) &&
        Array.isArray(userAnswer.answer)
      ) {
        return (question.correctAnswer as string[]).every(
          (ans, idx) =>
            String(ans).toLowerCase() ===
            (userAnswer.answer as string[])[idx]?.toLowerCase()
        );
      } else {
        return (
          String(userAnswer.answer).toLowerCase() ===
          String(question.correctAnswer).toLowerCase()
        );
      }

      return false;
    },
    []
  );

  const handleAnswer = (answer: string | string[]) => {
    // For unlimited attempt types, always allow answer changes
    // For multi-gap-fill, only allow changes to non-correct gaps (handled in renderer)
    // For other types, don't allow changes after final validation
    if (currentQuestionState.isValidated && !isUnlimitedAttemptType && !isMultiGapFill) return;

    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, answer });
    setAnswers(newAnswers);
  };

  const handleCheckAnswer = () => {
    const userAnswer = answers.find((a) => a.questionId === currentQuestion.id);

    if (!userAnswer) return;

    setIsCheckingAnswer(true);
    setTimeout(() => {
      setIsCheckingAnswer(false);
    }, 1500);

    const newAttempts = currentQuestionState.attempts + 1;

    // Special handling for drag-drop-sentence
    if (
      currentQuestion.type === "drag-drop-sentence" &&
      Array.isArray(userAnswer.answer)
    ) {
      const userWords = userAnswer.answer as string[];
      let correctWords: string[] = [];

      if (Array.isArray(currentQuestion.correctAnswer)) {
        correctWords = (currentQuestion.correctAnswer as string[]).map((w) => String(w));
      } else if (typeof currentQuestion.correctAnswer === "string") {
        try {
          const parsed = JSON.parse(currentQuestion.correctAnswer);
          correctWords = Array.isArray(parsed)
            ? parsed.map((w: unknown) => String(w))
            : currentQuestion.correctAnswer.split(" ");
        } catch {
          correctWords = currentQuestion.correctAnswer.split(" ");
        }
      }

      const normalize = (str: string) =>
        str?.toLowerCase().replace(/[.,!?;:'"]/g, "").trim() || "";

      const newLockedPositions: boolean[] = [];
      let allCorrect = true;

      for (let i = 0; i < correctWords.length; i++) {
        const isPositionCorrect =
          normalize(userWords[i]) === normalize(correctWords[i]);
        newLockedPositions[i] =
          currentQuestionState.lockedPositions?.[i] || isPositionCorrect;
        if (!newLockedPositions[i]) {
          allCorrect = false;
        }
      }

      setQuestionStates((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          attempts: newAttempts,
          isValidated: allCorrect,
          isCorrect: allCorrect,
          explanationSeen: allCorrect,
          showExplanation: allCorrect,
          lockedPositions: newLockedPositions,
        },
      }));
      return;
    }

    // Special handling for multi-gap-fill: per-gap validation with 5 attempts
    if (
      currentQuestion.type === "multi-gap-fill" &&
      Array.isArray(userAnswer.answer)
    ) {
      const correctAnswerData = currentQuestion.correctAnswer as unknown as MultiGapCorrectAnswer;
      const gaps = correctAnswerData?.gaps || [];
      const userAnswers = userAnswer.answer as string[];

      // Get existing gap states or initialize
      const existingGapStates = currentQuestionState.gapStates || [];
      const newGapStates: ('correct' | 'incorrect' | 'unanswered' | 'revealed')[] = [];

      let allCorrect = true;

      gaps.forEach((gap, idx) => {
        // If already correct, keep it correct
        if (existingGapStates[idx] === 'correct') {
          newGapStates[idx] = 'correct';
          return;
        }

        const userAns = userAnswers[idx] || "";
        const caseSensitive = gap.caseSensitive ?? false;
        const normalizedUserAns = (caseSensitive ? userAns.trim() : userAns.trim().toLowerCase()).replace(/['']/g, "'");

        // Check if any accepted answer is empty (meaning empty is a valid answer)
        const acceptsEmpty = gap.accepted.some(accepted => accepted.trim() === "");

        // If user left it blank and empty is NOT accepted, mark as unanswered
        if (!userAns.trim() && !acceptsEmpty) {
          newGapStates[idx] = 'unanswered';
          allCorrect = false;
          return;
        }

        const isGapCorrect = gap.accepted.some(accepted => {
          const normalizedAccepted = (caseSensitive ? accepted.trim() : accepted.trim().toLowerCase()).replace(/['']/g, "'");
          return normalizedUserAns === normalizedAccepted;
        });

        if (isGapCorrect) {
          newGapStates[idx] = 'correct';
        } else {
          newGapStates[idx] = 'incorrect';
          allCorrect = false;
        }
      });

      // Check if max attempts reached (5th attempt)
      const isFinalAttempt = newAttempts >= MULTI_GAP_FILL_MAX_ATTEMPTS;

      // If final attempt, mark all remaining incorrect as 'revealed'
      if (isFinalAttempt && !allCorrect) {
        newGapStates.forEach((state, idx) => {
          if (state !== 'correct') {
            newGapStates[idx] = 'revealed';
          }
        });
      }

      setQuestionStates((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          attempts: newAttempts,
          isValidated: allCorrect || isFinalAttempt,
          isCorrect: allCorrect,
          explanationSeen: allCorrect || isFinalAttempt,
          showExplanation: allCorrect || isFinalAttempt,
          gapStates: newGapStates,
        },
      }));
      return;
    }

    const isCorrect = checkAnswerCorrectness(currentQuestion, userAnswer);
    const maxAttemptsReached = isWrittenQuestion ? newAttempts >= 2 : true;
    const isFinalValidation = isCorrect || maxAttemptsReached;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        attempts: newAttempts,
        isValidated: isFinalValidation,
        isCorrect,
        explanationSeen: isFinalValidation,
        showExplanation: isFinalValidation,
      },
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    let correctCount = 0;

    questions.forEach((question) => {
      const state = questionStates[question.id];
      const isCorrect = state?.isCorrect || false;
      if (isCorrect) correctCount++;
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsSubmitting(false);
    setIsFinished(true);
  };

  // Get correct answer for display
  const getCorrectAnswerDisplay = () => {
    if (
      currentQuestion.type === "multiple-choice" ||
      currentQuestion.type === "true-false"
    ) {
      return String(currentQuestion.correctAnswer);
    }
    if (Array.isArray(currentQuestion.correctAnswer)) {
      return (currentQuestion.correctAnswer as string[]).join(", ");
    }
    return String(currentQuestion.correctAnswer);
  };

  const hasAnswer = !!currentAnswer;
  const canCheck =
    hasAnswer &&
    (isUnlimitedAttemptType || isMultiGapFill
      ? !currentQuestionState.isCorrect
      : !currentQuestionState.isValidated);
  const canTryAgain =
    !currentQuestionState.isCorrect &&
    isWrittenQuestion &&
    currentQuestionState.attempts === 1 &&
    !currentQuestionState.isValidated;
  const attemptsRemaining = isWrittenQuestion
    ? Math.max(0, 2 - currentQuestionState.attempts)
    : 0;

  if (isFinished) {
    return (
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Test Completed!</h1>
            <Card>
              <CardContent className="pt-6">
                <div
                  className={cn(
                    "text-5xl font-bold mb-2",
                    score >= 80
                      ? "text-green-600"
                      : score >= 60
                      ? "text-amber-600"
                      : "text-red-600"
                  )}
                >
                  {score}%
                </div>
                <p className="text-muted-foreground">
                  You got {Math.round((score / 100) * questions.length)} out of{" "}
                  {questions.length} questions correct
                </p>
              </CardContent>
            </Card>

            {/* Registration CTA */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">Save Your Progress</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Create a free account to track your learning journey, save your
                  test results, and access more practice materials.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg">
                    <Link href="https://app.learne.org/signup">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Free Account
                    </Link>
                  </Button>
                  <Button variant="outline" asChild size="lg">
                    <Link href="https://app.learne.org/login">
                      Already have an account? Sign In
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Detailed Results</h2>
            {questions.map((question, index) => {
              const state = questionStates[question.id];
              const isCorrect = state?.isCorrect || false;
              const userAnswer = answers.find((a) => a.questionId === question.id);

              let userResponse = "No answer";
              let correctResponse = "";

              if (userAnswer) {
                if (Array.isArray(userAnswer.answer)) {
                  userResponse = userAnswer.answer.join(", ");
                } else {
                  userResponse = String(userAnswer.answer);
                }
              }

              if (Array.isArray(question.correctAnswer)) {
                correctResponse = (question.correctAnswer as string[]).join(", ");
              } else {
                correctResponse = String(question.correctAnswer);
              }

              return (
                <Card
                  key={index}
                  className={cn(
                    "border-l-4",
                    isCorrect ? "border-l-green-500" : "border-l-red-500"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <span
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
                          isCorrect
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                        )}
                      >
                        {index + 1}
                      </span>
                      Question {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium text-foreground">{question.question}</p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Your Answer:
                        </span>
                        <p
                          className={cn(
                            "text-sm",
                            isCorrect
                              ? "text-green-600 font-medium"
                              : "text-red-600"
                          )}
                        >
                          {userResponse}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Correct Answer:
                        </span>
                        <p className="text-sm text-foreground font-medium">
                          {correctResponse}
                        </p>
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="pt-2 border-t mt-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Explanation:{" "}
                          </span>
                          <ExplanationRenderer text={question.explanation} />
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 pb-12">
            <Button
              onClick={() => router.push("/grammar")}
              variant="outline"
              size="lg"
              className="cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Grammar Library
            </Button>
            <Button
              onClick={() => {
                setIsFinished(false);
                setCurrentQuestionIndex(0);
                setAnswers([]);
                setQuestionStates({});
                setScore(0);
              }}
              size="lg"
              className="cursor-pointer"
            >
              Retake Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const questionForRenderer = {
    id: currentQuestion.id,
    type: currentQuestion.type,
    question: currentQuestion.question,
    correctAnswer: currentQuestion.correctAnswer as string | string[],
    explanation: currentQuestion.explanation,
    options: currentQuestion.options,
    segments: currentQuestion.segments,
    words: currentQuestion.words,
  };

  return (
    <div className="flex-1">
      {/* Progress Bar Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="mt-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between flex-wrap gap-2">
              <span>Question {currentQuestionIndex + 1}</span>
              {currentQuestionState.attempts > 0 && (
                <span
                  className={cn(
                    "text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1",
                    currentQuestionState.isCorrect
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                      : currentQuestionState.isValidated
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                  )}
                >
                  {currentQuestionState.isCorrect ? (
                    <>
                      <Check className="h-4 w-4" />
                      Correct
                    </>
                  ) : currentQuestionState.isValidated ? (
                    "Incorrect"
                  ) : isUnlimitedAttemptType ? (
                    `Attempt ${currentQuestionState.attempts}`
                  ) : isMultiGapFill ? (
                    `Attempt ${currentQuestionState.attempts}/${MULTI_GAP_FILL_MAX_ATTEMPTS}`
                  ) : (
                    `Attempt ${currentQuestionState.attempts}/2`
                  )}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <QuestionRenderer
              question={questionForRenderer}
              answer={currentAnswer?.answer}
              onAnswer={handleAnswer}
              showFeedback={currentQuestionState.attempts > 0}
              isValidated={currentQuestionState.isValidated}
              isCorrect={currentQuestionState.isCorrect}
              disabled={
                isUnlimitedAttemptType || isMultiGapFill
                  ? currentQuestionState.isCorrect
                  : currentQuestionState.isValidated
              }
              externalLockedPositions={currentQuestionState.lockedPositions}
              gapStates={currentQuestionState.gapStates}
              attempts={currentQuestionState.attempts}
              maxAttempts={MULTI_GAP_FILL_MAX_ATTEMPTS}
            />

            {/* Check Answer Button */}
            {canCheck && (
              <Button
                onClick={handleCheckAnswer}
                className={cn(
                  "w-full transition-all",
                  isCheckingAnswer && "animate-pulse"
                )}
                variant="default"
                disabled={isCheckingAnswer}
              >
                {isCheckingAnswer ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Check Answer
                  </>
                )}
              </Button>
            )}

            {/* Try Again message for written questions with 1 attempt */}
            {canTryAgain && (
              <div className="p-4 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                <p className="font-medium">
                  Incorrect. You have {attemptsRemaining} attempt remaining. Try
                  again!
                </p>
              </div>
            )}

            {/* Show correct answer for written questions after 2 failed attempts */}
            {currentQuestionState.isValidated &&
              !currentQuestionState.isCorrect &&
              isWrittenQuestion && (
                <div className="p-4 rounded-lg bg-muted border">
                  <p className="text-sm font-medium mb-2">Correct Answer:</p>
                  <p className="text-base text-foreground">
                    {getCorrectAnswerDisplay()}
                  </p>
                </div>
              )}

            {/* Explanation Section */}
            {currentQuestionState.showExplanation && currentQuestion.explanation && (
              <div className="p-4 bg-muted rounded-lg animate-in fade-in">
                <p className="text-sm font-medium mb-2">Explanation:</p>
                <p className="text-sm text-muted-foreground">
                  <ExplanationRenderer text={currentQuestion.explanation} />
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Finish Test
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="outline">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Overview */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            Question Overview
          </h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => {
              const state = questionStates[q.id];
              const isActive = index === currentQuestionIndex;
              const isComplete = state?.explanationSeen && state?.isValidated;

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={cn(
                    "w-10 h-10 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isComplete
                      ? "bg-green-500 text-white dark:bg-green-600"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Registration CTA Banner */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Want to save your progress?</p>
                  <p className="text-xs text-muted-foreground">
                    Create a free account to track your learning journey
                  </p>
                </div>
              </div>
              <Button asChild size="sm">
                <Link href="https://app.learne.org/signup">
                  Sign Up Free
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Loading component
export function TestLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
