"use client"

import React, { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { Question, MultiGapCorrectAnswer } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface QuestionRendererProps {
  question: Question;
  answer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
  showFeedback?: boolean;
  isValidated?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  externalLockedPositions?: boolean[];
  // Multi-gap-fill specific props
  gapStates?: ('correct' | 'incorrect' | 'unanswered' | 'revealed')[];
  attempts?: number;
  maxAttempts?: number;
}

const QuestionRenderer = ({
  question,
  answer,
  onAnswer,
  showFeedback = false,
  isValidated = false,
  isCorrect = false,
  disabled = false,
  externalLockedPositions,
  gapStates,
  attempts = 0,
  maxAttempts = 5
}: QuestionRendererProps) => {
  // Drag-drop state
  const [draggedWords, setDraggedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [lockedPositions, setLockedPositions] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Helper to parse correctAnswer into an array of words (for drag-drop-sentence)
  const getCorrectAnswerArray = (): string[] => {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer;
    } else if (typeof question.correctAnswer === 'string') {
      try {
        const parsed = JSON.parse(question.correctAnswer);
        return Array.isArray(parsed) ? parsed : question.correctAnswer.split(' ');
      } catch {
        return question.correctAnswer.split(' ');
      }
    }
    return [];
  };

  // Initialize drag-drop words when question changes
  // Derive available words from correctAnswer (not config.words)
  useEffect(() => {
    if (question.type === "drag-drop-sentence") {
      const correctWords = getCorrectAnswerArray();
      const shuffled = [...correctWords].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setDraggedWords([]);
      setLockedPositions([]);
      setFeedback("");
    }
  }, [question.id, question.type]);

  // Sync external locked positions for drag-drop-sentence
  useEffect(() => {
    if (question.type !== "drag-drop-sentence") return;
    if (!externalLockedPositions || externalLockedPositions.length === 0) return;

    const currentDragged = draggedWords.length > 0 ? draggedWords : (Array.isArray(answer) ? answer as string[] : []);

    if (currentDragged.length === 0) return;

    const wordsToReset: string[] = [];
    const newDraggedWords: string[] = [];
    const correctWords = getCorrectAnswerArray();

    for (let i = 0; i < correctWords.length; i++) {
      if (externalLockedPositions[i]) {
        newDraggedWords[i] = currentDragged[i] || '';
      } else {
        if (currentDragged[i] && currentDragged[i].trim() !== '') {
          wordsToReset.push(currentDragged[i]);
        }
        newDraggedWords[i] = '';
      }
    }

    setDraggedWords(newDraggedWords);
    setLockedPositions(externalLockedPositions);

    if (wordsToReset.length > 0) {
      setAvailableWords(prev => {
        const newAvailable = [...prev];
        wordsToReset.forEach(word => {
          if (!newAvailable.includes(word)) {
            newAvailable.push(word);
          }
        });
        return newAvailable;
      });
    }

    onAnswer(newDraggedWords);
  }, [externalLockedPositions, question.type]);

  // Helper to check if an option is the correct answer
  const isOptionCorrect = (option: string): boolean => {
    if (question.type === "multiple-choice" || question.type === "true-false") {
      return String(question.correctAnswer).toLowerCase() === option.toLowerCase();
    }
    if (question.type === "multiple-select" && Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.some(a => String(a).toLowerCase() === option.toLowerCase());
    }
    return false;
  };

  // Helper to check if an option was selected by user
  const isOptionSelected = (option: string): boolean => {
    if (question.type === "multiple-choice" || question.type === "true-false") {
      return String(answer).toLowerCase() === option.toLowerCase();
    }
    if (question.type === "multiple-select" && Array.isArray(answer)) {
      return answer.some(a => String(a).toLowerCase() === option.toLowerCase());
    }
    return false;
  };

  // Get option styling based on feedback state
  const getOptionStyles = (option: string): string => {
    if (!showFeedback || !isValidated) {
      return isOptionSelected(option)
        ? "border-primary bg-primary/5"
        : "hover:bg-accent/50";
    }

    const correct = isOptionCorrect(option);
    const selected = isOptionSelected(option);

    if (correct) {
      return "border-green-500 bg-green-50 dark:bg-green-900/20";
    }
    if (selected && !correct) {
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    }
    return "opacity-50";
  };

  if (question.type === "multiple-choice") {
    if (!question.question) {
      return <div className="text-red-500">Error: Question text is missing</div>;
    }

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <RadioGroup
          value={answer as string || ""}
          onValueChange={(value) => !disabled && onAnswer(value)}
          disabled={disabled}
        >
          <div className="space-y-3">
            {question.options?.map((option, index) => {
              const optionStyles = getOptionStyles(option);
              const correct = isOptionCorrect(option);
              const selected = isOptionSelected(option);

              return (
                <div
                  key={index}
                  onClick={() => !disabled && onAnswer(option)}
                  className={cn(
                    "flex items-center space-x-3 border rounded-lg p-4 transition-colors",
                    disabled ? "cursor-default" : "cursor-pointer",
                    optionStyles
                  )}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} disabled={disabled} />
                  <Label
                    htmlFor={`option-${index}`}
                    className={cn(
                      "flex-1 text-base",
                      disabled ? "cursor-default" : "cursor-pointer",
                      showFeedback && isValidated && correct && "font-medium text-green-700 dark:text-green-300",
                      showFeedback && isValidated && selected && !correct && "text-red-700 dark:text-red-300"
                    )}
                  >
                    {option}
                  </Label>
                  {showFeedback && isValidated && correct && (
                    <span className="text-green-600 text-sm font-medium">Correct</span>
                  )}
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </div>
    );
  }

  if (question.type === "fill-in-blank") {
    if (!question.question) {
      return <div className="text-red-500">Error: Question text is missing</div>;
    }

    const parts = question.question.split("[blank]");
    const blankAnswers = Array.isArray(answer) ? answer : [];

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground mb-4">
          Fill in the gaps with the correct answer:
        </p>
        <div className="space-y-6">
          {parts.map((part, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3">
              {part && <span className="text-base text-foreground">{part}</span>}
              {index < parts.length - 1 && (
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {index + 1}
                  </span>
                  <Input
                    type="text"
                    value={blankAnswers[index] || ""}
                    onChange={(e) => {
                      const newAnswers = [...blankAnswers];
                      newAnswers[index] = e.target.value;
                      onAnswer(newAnswers);
                    }}
                    className="w-48"
                    placeholder="Your answer"
                    disabled={disabled}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "multiple-select") {
    const selectedAnswers = Array.isArray(answer) ? answer : [];

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <p className="text-sm text-muted-foreground">Select all correct answers</p>
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isChecked = selectedAnswers.includes(option);
            const optionStyles = getOptionStyles(option);
            const correct = isOptionCorrect(option);
            const selected = isOptionSelected(option);

            return (
              <div
                key={index}
                onClick={() => {
                  if (disabled) return;
                  if (isChecked) {
                    onAnswer(selectedAnswers.filter(a => a !== option));
                  } else {
                    onAnswer([...selectedAnswers, option]);
                  }
                }}
                className={cn(
                  "flex items-center space-x-3 border rounded-lg p-4 transition-colors",
                  disabled ? "cursor-default" : "cursor-pointer",
                  optionStyles
                )}
              >
                <Checkbox
                  id={`option-${index}`}
                  checked={isChecked}
                  disabled={disabled}
                  className="pointer-events-none"
                />
                <Label
                  htmlFor={`option-${index}`}
                  className={cn(
                    "flex-1 text-base",
                    disabled ? "cursor-default" : "cursor-pointer",
                    showFeedback && isValidated && correct && "font-medium text-green-700 dark:text-green-300",
                    showFeedback && isValidated && selected && !correct && "text-red-700 dark:text-red-300"
                  )}
                >
                  {option}
                </Label>
                {showFeedback && isValidated && correct && (
                  <span className="text-green-600 text-sm font-medium">Correct</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === "true-false") {
    const trueCorrect = isOptionCorrect("true");
    const falseCorrect = isOptionCorrect("false");

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => !disabled && onAnswer("true")}
            disabled={disabled}
            className={cn(
              "flex-1 h-16 text-lg border-2 rounded-md font-medium transition-all",
              answer === "true" && !showFeedback && "border-primary bg-primary/5",
              answer !== "true" && !showFeedback && "border-border hover:bg-accent/50",
              showFeedback && isValidated && trueCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
              showFeedback && isValidated && answer === "true" && !trueCorrect && "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
              disabled && "cursor-default"
            )}
          >
            True
            {showFeedback && isValidated && trueCorrect && <span className="ml-2">Correct</span>}
          </button>
          <button
            type="button"
            onClick={() => !disabled && onAnswer("false")}
            disabled={disabled}
            className={cn(
              "flex-1 h-16 text-lg border-2 rounded-md font-medium transition-all",
              answer === "false" && !showFeedback && "border-primary bg-primary/5",
              answer !== "false" && !showFeedback && "border-border hover:bg-accent/50",
              showFeedback && isValidated && falseCorrect && "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
              showFeedback && isValidated && answer === "false" && !falseCorrect && "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
              disabled && "cursor-default"
            )}
          >
            False
            {showFeedback && isValidated && falseCorrect && <span className="ml-2">Correct</span>}
          </button>
        </div>
      </div>
    );
  }

  if (question.type === "short-answer") {
    const userAnswer = (answer as string) || "";

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here"
          className="text-base"
          disabled={disabled}
        />
      </div>
    );
  }

  if (question.type === "long-answer") {
    const userAnswer = (answer as string) || "";

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <Textarea
          value={userAnswer}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Type your answer here"
          className="text-base min-h-[120px]"
          disabled={disabled}
        />
      </div>
    );
  }

  if (question.type === "inline-conditional-choice") {
    const selectedChoices = Array.isArray(answer) ? answer : [];

    const handleChoiceClick = (segmentIndex: number, optionIndex: number) => {
      if (disabled) return;

      const segment = question.segments?.[segmentIndex];
      if (segment?.type !== "choice" || !segment.options) return;

      const selectedWord = segment.options[optionIndex];
      const newChoices = [...selectedChoices];
      newChoices[segmentIndex] = selectedWord;
      onAnswer(newChoices);
    };

    const isChoiceCorrect = (segmentIndex: number) => {
      const segment = question.segments?.[segmentIndex];
      if (segment?.type !== "choice") return false;

      const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      let choiceIndex = 0;

      for (let i = 0; i < segmentIndex; i++) {
        if (question.segments?.[i]?.type === "choice") {
          choiceIndex++;
        }
      }

      return selectedChoices[segmentIndex] === correctAnswers[choiceIndex];
    };

    const getCorrectChoice = (segmentIndex: number) => {
      const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      let choiceIndex = 0;

      for (let i = 0; i < segmentIndex; i++) {
        if (question.segments?.[i]?.type === "choice") {
          choiceIndex++;
        }
      }

      return correctAnswers[choiceIndex];
    };

    const isSelected = (segmentIndex: number, optionIndex: number) => {
      const segment = question.segments?.[segmentIndex];
      if (segment?.type !== "choice" || !segment.options) return false;
      return selectedChoices[segmentIndex] === segment.options[optionIndex];
    };

    return (
      <div className="space-y-6">
        <p className="text-lg font-medium text-foreground">{question.question}</p>

        <div className="text-base leading-relaxed">
          {question.segments?.map((segment, segmentIndex) => {
            if (segment.type === "text") {
              return (
                <span key={segmentIndex} className="text-foreground">
                  {segment.content}
                </span>
              );
            } else if (segment.options) {
              const correctChoice = getCorrectChoice(segmentIndex);
              return (
                <span key={segmentIndex} className="inline-flex gap-1 mx-1">
                  {segment.options.map((option, optionIndex) => {
                    const selected = isSelected(segmentIndex, optionIndex);
                    const correct = option === correctChoice;

                    return (
                      <React.Fragment key={optionIndex}>
                        <button
                          type="button"
                          onClick={() => handleChoiceClick(segmentIndex, optionIndex)}
                          disabled={disabled}
                          className={cn(
                            "px-2 py-0.5 rounded transition-all",
                            disabled ? "cursor-default" : "cursor-pointer",
                            !showFeedback && selected && "bg-primary text-primary-foreground font-semibold",
                            !showFeedback && !selected && "hover:bg-accent text-muted-foreground",
                            showFeedback && isValidated && correct && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 font-semibold",
                            showFeedback && isValidated && selected && !correct && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 font-semibold",
                            showFeedback && isValidated && !selected && !correct && "text-muted-foreground opacity-50"
                          )}
                        >
                          {option}
                        </button>
                        {optionIndex < (segment.options?.length || 0) - 1 && (
                          <span className="text-muted-foreground">/</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  if (question.type === "multi-gap-fill") {
    const correctAnswerData = question.correctAnswer as unknown as MultiGapCorrectAnswer;
    const gaps = correctAnswerData?.gaps || [];
    const parts = question.question.split(/\[gap\]/gi);
    const gapCount = parts.length - 1;
    const currentAnswers = Array.isArray(answer) ? answer as string[] : new Array(gapCount).fill("");

    const handleGapChange = (gapIndex: number, value: string) => {
      // Only allow changes if gap is not correct/revealed
      const gapState = gapStates?.[gapIndex];
      if (gapState === 'correct' || gapState === 'revealed') return;

      const newAnswers = [...currentAnswers];
      newAnswers[gapIndex] = value;
      onAnswer(newAnswers);
    };

    // Get the correct answer for a gap (first accepted answer)
    const getCorrectAnswer = (gapIndex: number): string => {
      const gap = gaps[gapIndex];
      return gap?.accepted?.[0] || "";
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium text-foreground">
            Fill in the gaps with the correct words:
          </p>
          {attempts > 0 && !isValidated && (
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
              Attempt {attempts}/{maxAttempts}
            </span>
          )}
          {isValidated && isCorrect && (
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
              All Correct!
            </span>
          )}
          {isValidated && !isCorrect && (
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
              Answers Revealed
            </span>
          )}
        </div>

        <div className="text-base leading-loose text-foreground">
          {parts.map((part, index) => {
            if (index >= gapCount) {
              return <span key={index}>{part}</span>;
            }

            const gapState = gapStates?.[index];
            const isGapCorrect = gapState === 'correct';
            const isGapIncorrect = gapState === 'incorrect';
            const isGapRevealed = gapState === 'revealed';
            const isGapLocked = isGapCorrect || isGapRevealed;

            // If revealed, show the correct answer
            const displayValue = isGapRevealed
              ? getCorrectAnswer(index)
              : (currentAnswers[index] || "");

            return (
              <React.Fragment key={index}>
                <span>{part}</span>
                <span className="inline-flex items-center mx-1 align-baseline">
                  <Input
                    type="text"
                    value={displayValue}
                    onChange={(e) => handleGapChange(index, e.target.value)}
                    disabled={isGapLocked}
                    className={cn(
                      "w-28 h-8 text-center inline-flex px-2 py-1 text-base transition-colors",
                      isGapCorrect && "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium",
                      isGapIncorrect && "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
                      isGapRevealed && "border-muted bg-muted/50 text-muted-foreground font-medium"
                    )}
                    placeholder={`(${index + 1})`}
                  />
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === "drag-drop-sentence") {
    const handleDragStart = (e: React.DragEvent, word: string, sourceIndex: number, isFromAvailable: boolean) => {
      if (disabled) return;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("word", word);
      e.dataTransfer.setData("sourceIndex", sourceIndex.toString());
      e.dataTransfer.setData("isFromAvailable", isFromAvailable.toString());
      setDraggedIndex(isFromAvailable ? -1 : sourceIndex);
    };

    const handleDragOver = (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };

    const handleDropOnSlot = (e: React.DragEvent, targetIndex: number) => {
      if (disabled) return;
      e.preventDefault();
      const word = e.dataTransfer.getData("word");
      const sourceIndex = parseInt(e.dataTransfer.getData("sourceIndex"));
      const isFromAvailable = e.dataTransfer.getData("isFromAvailable") === "true";

      if (lockedPositions[targetIndex]) return;

      const newDraggedWords = [...draggedWords];
      const newAvailableWords = [...availableWords];
      const newLockedPositions = [...lockedPositions];

      if (isFromAvailable) {
        if (newDraggedWords[targetIndex]) {
          newAvailableWords.push(newDraggedWords[targetIndex]);
        }
        newDraggedWords[targetIndex] = word;
        newAvailableWords.splice(sourceIndex, 1);
      } else {
        if (newDraggedWords[targetIndex] && !newLockedPositions[targetIndex]) {
          newAvailableWords.push(newDraggedWords[targetIndex]);
        }
        newDraggedWords[targetIndex] = word;
        newDraggedWords[sourceIndex] = "";
        newLockedPositions[sourceIndex] = false;
      }

      setDraggedWords(newDraggedWords);
      setAvailableWords(newAvailableWords);
      setLockedPositions(newLockedPositions);
      setFeedback("");
      setDraggedIndex(null);

      onAnswer(newDraggedWords);
    };

    const handleDropOnAvailable = (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      const word = e.dataTransfer.getData("word");
      const sourceIndex = parseInt(e.dataTransfer.getData("sourceIndex"));
      const isFromAvailable = e.dataTransfer.getData("isFromAvailable") === "true";

      if (isFromAvailable || lockedPositions[sourceIndex]) return;

      const newDraggedWords = [...draggedWords];
      const newAvailableWords = [...availableWords];
      const newLockedPositions = [...lockedPositions];

      newAvailableWords.push(word);
      newDraggedWords[sourceIndex] = "";
      newLockedPositions[sourceIndex] = false;

      setDraggedWords(newDraggedWords);
      setAvailableWords(newAvailableWords);
      setLockedPositions(newLockedPositions);
      setFeedback("");
      setDraggedIndex(null);

      onAnswer(newDraggedWords);
    };

    const correctAnswerArray = getCorrectAnswerArray();
    const normalizeWord = (w: string) => w?.toLowerCase().replace(/[.,!?;:'"]/g, '').trim() || '';

    return (
      <div className="space-y-6">
        <p className="text-lg font-medium text-foreground">{question.question}</p>

        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Build the sentence:</p>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border-2 border-dashed rounded-lg bg-accent/20">
            {correctAnswerArray.map((correctWord, idx) => {
              const userWord = draggedWords[idx];
              const isLockedCorrect = lockedPositions[idx] && userWord;
              const isCorrectWord = showFeedback && isValidated && userWord && normalizeWord(userWord) === normalizeWord(correctWord);
              const isIncorrectWord = showFeedback && isValidated && userWord && normalizeWord(userWord) !== normalizeWord(correctWord);
              const showGreenStyle = isLockedCorrect || isCorrectWord;

              return (
                <div
                  key={idx}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnSlot(e, idx)}
                  className={cn(
                    "min-w-[80px] h-12 flex items-center justify-center border-2 rounded-lg transition-all",
                    draggedWords[idx]
                      ? showGreenStyle
                        ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-700"
                        : isIncorrectWord
                          ? "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-700"
                          : "bg-background border-primary"
                      : draggedIndex === idx
                        ? "border-primary bg-primary/10"
                        : "border-dashed border-muted-foreground/30 bg-muted/30"
                  )}
                >
                  {draggedWords[idx] && (
                    <div
                      draggable={!disabled && !lockedPositions[idx]}
                      onDragStart={(e) => handleDragStart(e, draggedWords[idx], idx, false)}
                      className={cn(
                        "px-3 py-2 rounded flex items-center gap-2",
                        showGreenStyle && "text-green-800 dark:text-green-200",
                        disabled || lockedPositions[idx]
                          ? "cursor-not-allowed opacity-100"
                          : "cursor-move hover:bg-accent"
                      )}
                    >
                      {!disabled && !lockedPositions[idx] && <GripVertical className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-medium">{draggedWords[idx]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Available words:</p>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDropOnAvailable}
            className="flex flex-wrap gap-2 min-h-[60px] p-4 border-2 rounded-lg bg-muted/20"
          >
            {availableWords.map((word, idx) => (
              <div
                key={idx}
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(e, word, idx, true)}
                className={cn(
                  "px-4 py-2 bg-background border-2 border-border rounded-lg transition-colors flex items-center gap-2",
                  disabled ? "cursor-default" : "cursor-move hover:bg-accent"
                )}
              >
                {!disabled && <GripVertical className="w-4 h-4 text-muted-foreground" />}
                <span className="font-medium">{word}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default QuestionRenderer;
