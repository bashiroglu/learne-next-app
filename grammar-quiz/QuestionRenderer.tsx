"use client"

import React, { useState, useEffect } from "react";
import { GripVertical } from "lucide-react";
import { Question } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface QuestionRendererProps {
  question: Question;
  answer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
}

const QuestionRenderer = ({ question, answer, onAnswer }: QuestionRendererProps) => {
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Drag-drop state
  const [draggedWords, setDraggedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [lockedPositions, setLockedPositions] = useState<boolean[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Inline conditional choice state
  const [checkedState, setCheckedState] = useState<"none" | "checked">("none");

  // Initialize drag-drop words when question changes
  useEffect(() => {
    if (question.type === "drag-drop-sentence" && question.words) {
      const shuffled = [...question.words].sort(() => Math.random() - 0.5);
      setAvailableWords(shuffled);
      setDraggedWords([]);
      setLockedPositions([]);
      setFeedback("");
    }
    
    // Reset checked state when question changes
    if (question.type === "inline-conditional-choice") {
      setCheckedState("none");
    }
    
    setShowFeedback(false);
  }, [question.id, question.type, question.words]);

  const compareAnswers = (userAnswer: string, correctAnswer: string) => {
    const userWords = userAnswer.trim().toLowerCase().split(/\s+/);
    const correctWords = correctAnswer.trim().toLowerCase().split(/\s+/);
    
    const result = userWords.map((word, index) => ({
      word: userAnswer.trim().split(/\s+/)[index],
      isCorrect: word === correctWords[index],
      position: index
    }));

    const missingWords = correctWords.slice(userWords.length).map((word, index) => ({
      word: correctAnswer.trim().split(/\s+/)[userWords.length + index],
      isMissing: true,
      position: userWords.length + index
    }));

    return { result, missingWords };
  };

  const handleCheck = () => {
    setShowFeedback(true);
  };

  const resetFeedback = () => {
    setShowFeedback(false);
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
          onValueChange={(value) => onAnswer(value)}
        >
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                onClick={() => onAnswer(option)}
                className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
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
            return (
              <div
                key={index}
                className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={`option-${index}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onAnswer([...selectedAnswers, option]);
                    } else {
                      onAnswer(selectedAnswers.filter(a => a !== option));
                    }
                  }}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-base"
                >
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (question.type === "true-false") {
    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={answer === "true" ? "default" : "outline"}
            onClick={() => onAnswer("true")}
            className="flex-1 h-16 text-lg"
          >
            True
          </Button>
          <Button
            type="button"
            variant={answer === "false" ? "default" : "outline"}
            onClick={() => onAnswer("false")}
            className="flex-1 h-16 text-lg"
          >
            False
          </Button>
        </div>
      </div>
    );
  }

  if (question.type === "short-answer") {
    const userAnswer = (answer as string) || "";
    const correctAnswer = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer[0] 
      : question.correctAnswer;
    const comparison = showFeedback && userAnswer ? compareAnswers(userAnswer, correctAnswer) : null;

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => {
            onAnswer(e.target.value);
            resetFeedback();
          }}
          placeholder="Type your answer here"
          className="text-base"
        />
        <Button 
          type="button"
          onClick={handleCheck}
          variant="outline"
          className="w-full"
        >
          Check Answer
        </Button>
        
        {showFeedback && comparison && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <p className="text-sm font-medium">Your answer:</p>
              <div className="flex flex-wrap gap-1">
                {comparison.result.map((item, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "px-2 py-1 rounded",
                      item.isCorrect
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 line-through"
                    )}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            </div>
            
            {comparison.missingWords.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Missing words:
                </p>
                <div className="flex flex-wrap gap-1">
                  {comparison.missingWords.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    >
                      {item.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-2">
              Correct the red words and add the missing words to complete your answer.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (question.type === "long-answer") {
    const userAnswer = (answer as string) || "";
    const correctAnswer = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer[0] 
      : question.correctAnswer;
    const comparison = showFeedback && userAnswer ? compareAnswers(userAnswer, correctAnswer) : null;

    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        <Textarea
          value={userAnswer}
          onChange={(e) => {
            onAnswer(e.target.value);
            resetFeedback();
          }}
          placeholder="Type your answer here"
          className="text-base min-h-[120px]"
        />
        <Button 
          type="button"
          onClick={handleCheck}
          variant="outline"
          className="w-full"
        >
          Check Answer
        </Button>
        
        {showFeedback && comparison && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <p className="text-sm font-medium">Your answer:</p>
              <div className="flex flex-wrap gap-1">
                {comparison.result.map((item, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "px-2 py-1 rounded",
                      item.isCorrect
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 line-through"
                    )}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            </div>
            
            {comparison.missingWords.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  Missing words:
                </p>
                <div className="flex flex-wrap gap-1">
                  {comparison.missingWords.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    >
                      {item.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-2">
              Correct the red words and add the missing words to complete your answer.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (question.type === "inline-conditional-choice") {
    const selectedChoices = Array.isArray(answer) ? answer : [];

    const handleChoiceClick = (segmentIndex: number, optionIndex: number) => {
      if (checkedState === "checked") return; // Don't allow changes after checking
      
      const segment = question.segments?.[segmentIndex];
      if (segment?.type !== "choice" || !segment.options) return;
      
      const selectedWord = segment.options[optionIndex];
      const newChoices = [...selectedChoices];
      newChoices[segmentIndex] = selectedWord;
      onAnswer(newChoices);
    };

    const handleCheck = () => {
      setCheckedState("checked");
    };

    const handleTryAgain = () => {
      if (!question.segments) return;
      
      const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      const newChoices = [...selectedChoices];
      
      let choiceIndex = 0;
      question.segments.forEach((segment, index) => {
        if (segment.type === "choice") {
          const userChoice = selectedChoices[index];
          const correctChoice = correctAnswers[choiceIndex];
          if (userChoice !== correctChoice) {
            newChoices[index] = "";
          }
          choiceIndex++;
        }
      });
      onAnswer(newChoices);
      setCheckedState("none");
    };

    const isCorrect = (segmentIndex: number) => {
      const segment = question.segments?.[segmentIndex];
      if (segment?.type !== "choice") return false;
      
      const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
      let choiceIndex = 0;
      
      // Find which choice index this segment is
      for (let i = 0; i < segmentIndex; i++) {
        if (question.segments?.[i]?.type === "choice") {
          choiceIndex++;
        }
      }
      
      return selectedChoices[segmentIndex] === correctAnswers[choiceIndex];
    };

    const isSelected = (segmentIndex: number, optionIndex: number) => {
      const segment = question.segments?.[segmentIndex];
      if (segment?.type !== "choice" || !segment.options) return false;
      return selectedChoices[segmentIndex] === segment.options[optionIndex];
    };

    const getChoiceStatus = (segmentIndex: number, optionIndex: number) => {
      if (checkedState !== "checked") return "normal";
      if (!isSelected(segmentIndex, optionIndex)) return "normal";
      return isCorrect(segmentIndex) ? "correct" : "incorrect";
    };

    let choiceIndex = 0;

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
              const currentChoiceIndex = choiceIndex++;
              return (
                <span key={segmentIndex} className="inline-flex gap-1 mx-1">
                  {segment.options.map((option, optionIndex) => {
                    const status = getChoiceStatus(segmentIndex, optionIndex);
                    const selected = isSelected(segmentIndex, optionIndex);
                    
                    return (
                      <React.Fragment key={optionIndex}>
                        <button
                          type="button"
                          onClick={() => handleChoiceClick(segmentIndex, optionIndex)}
                          disabled={checkedState === "checked"}
                          className={cn(
                            "px-2 py-0.5 rounded transition-all",
                            status === "correct"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 font-semibold"
                              : status === "incorrect"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 font-semibold"
                              : selected
                              ? "bg-primary text-primary-foreground font-semibold"
                              : "hover:bg-accent text-muted-foreground",
                            checkedState === "checked" ? "cursor-default" : "cursor-pointer"
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

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleCheck}
            variant="default"
            className="flex-1"
            disabled={checkedState === "checked"}
          >
            Check Answer
          </Button>
          {checkedState === "checked" && (
            <Button
              type="button"
              onClick={handleTryAgain}
              variant="outline"
              className="flex-1"
            >
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (question.type === "drag-drop-sentence") {

    const handleDragStart = (e: React.DragEvent, word: string, sourceIndex: number, isFromAvailable: boolean) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("word", word);
      e.dataTransfer.setData("sourceIndex", sourceIndex.toString());
      e.dataTransfer.setData("isFromAvailable", isFromAvailable.toString());
      setDraggedIndex(isFromAvailable ? -1 : sourceIndex);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };

    const handleDropOnSlot = (e: React.DragEvent, targetIndex: number) => {
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

    const checkAnswer = () => {
      const correctWords = question.words || [];
      const newLockedPositions = draggedWords.map((word, idx) => word === correctWords[idx]);
      setLockedPositions(newLockedPositions);

      const allCorrect = newLockedPositions.every((locked, idx) => locked && draggedWords[idx]);
      const hasAnyCorrect = newLockedPositions.some((locked) => locked);

      if (allCorrect && draggedWords.filter(w => w).length === correctWords.length) {
        setFeedback("Correct! 🎉");
      } else if (hasAnyCorrect) {
        setFeedback("Some parts are incorrect. Correct words are locked in place.");
        const incorrectWords = draggedWords
          .map((word, idx) => (!newLockedPositions[idx] && word ? word : null))
          .filter(Boolean) as string[];
        setAvailableWords([...availableWords, ...incorrectWords]);
        
        const newDraggedWords = draggedWords.map((word, idx) => 
          newLockedPositions[idx] ? word : ""
        );
        setDraggedWords(newDraggedWords);
      } else {
        setFeedback("All parts are incorrect. Try again!");
      }
    };

    return (
      <div className="space-y-6">
        <p className="text-lg font-medium text-foreground">{question.question}</p>
        
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Build the sentence:</p>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border-2 border-dashed rounded-lg bg-accent/20">
            {(question.words || []).map((_, idx) => (
              <div
                key={idx}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, idx)}
                className={cn(
                  "min-w-[80px] h-12 flex items-center justify-center border-2 rounded-lg transition-all",
                  draggedWords[idx]
                    ? lockedPositions[idx]
                      ? "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-700"
                      : "bg-background border-primary"
                    : draggedIndex === idx
                    ? "border-primary bg-primary/10"
                    : "border-dashed border-muted-foreground/30 bg-muted/30"
                )}
              >
                {draggedWords[idx] && (
                  <div
                    draggable={!lockedPositions[idx]}
                    onDragStart={(e) => handleDragStart(e, draggedWords[idx], idx, false)}
                    className={cn(
                      "px-3 py-2 rounded flex items-center gap-2",
                      lockedPositions[idx]
                        ? "cursor-not-allowed opacity-100"
                        : "cursor-move hover:bg-accent"
                    )}
                  >
                    {!lockedPositions[idx] && <GripVertical className="w-4 h-4 text-muted-foreground" />}
                    <span className="font-medium">{draggedWords[idx]}</span>
                  </div>
                )}
              </div>
            ))}
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
                draggable
                onDragStart={(e) => handleDragStart(e, word, idx, true)}
                className="px-4 py-2 bg-background border-2 border-border rounded-lg cursor-move hover:bg-accent transition-colors flex items-center gap-2"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{word}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          onClick={checkAnswer}
          variant="default"
          className="w-full"
          disabled={draggedWords.filter(w => w).length !== (question.words || []).length}
        >
          Check Answer
        </Button>

        {feedback && (
          <div
            className={cn(
              "p-4 rounded-lg",
              feedback.includes("Correct")
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
            )}
          >
            <p className="font-medium">{feedback}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default QuestionRenderer;
