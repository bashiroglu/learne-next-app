"use client"

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import QuestionRenderer from "@/components/QuestionRenderer";
import { grammarTests } from "@/frontend-data/grammar_tests";
import { grammarQuestions } from "@/frontend-data/grammar_questions";
import { Question, Answer } from "@/types";
import { cn } from "@/lib/utils";

// Helper to slugify text
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

export default function GrammarTestPage({ params }: { params: Promise<{ "topic-slug": string; "test-slug": string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const topicSlug = resolvedParams["topic-slug"];
  const testSlug = resolvedParams["test-slug"];

  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Find the test based on the slug
    const foundTest = grammarTests.find(t => {
      const generatedSlug = `${slugify(t.title)}-${t.level.toLowerCase()}`;
      return generatedSlug === testSlug && slugify(t.topic) === topicSlug;
    });

    if (foundTest) {
      setTest(foundTest);
      
      // Filter and transform questions
      const testQuestions = grammarQuestions
        .filter(q => q.test_id === foundTest.id)
        .sort((a, b) => a.question_order - b.question_order)
        .map(q => {
          let config: any = {};
          try {
            config = q.config ? JSON.parse(q.config) : {};
          } catch (e) {
            console.error("Error parsing config", e);
          }

          let correctAnswer: any = q.correct_answer;
          try {
             // Try to parse if it looks like a JSON array/object string
             if (typeof q.correct_answer === 'string' && (q.correct_answer.startsWith('[') || q.correct_answer.startsWith('{') || q.correct_answer.startsWith('"'))) {
                correctAnswer = JSON.parse(q.correct_answer);
             }
          } catch (e) {
            // Keep as string if parse fails
          }

          return {
            id: q.id,
            type: q.type,
            question: q.question_text,
            correctAnswer: correctAnswer,
            explanation: q.explanation,
            options: config.options,
            segments: config.segments,
            words: config.words,
          } as Question;
        });

      setQuestions(testQuestions);
    }
  }, [topicSlug, testSlug]);

  if (!test) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, answer });
    setAnswers(newAnswers);
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
    
    questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      let isCorrect = false;
      
      if (userAnswer) {
        if (question.type === "multiple-select") {
          if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
            const correctSet = new Set(question.correctAnswer.map(a => a.toLowerCase()));
            const userSet = new Set(userAnswer.answer.map(a => String(a).toLowerCase()));
            if (correctSet.size === userSet.size && 
                [...correctSet].every(a => userSet.has(a))) {
              isCorrect = true;
            }
          }
        } else if (question.type === "inline-conditional-choice") {
          if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
            const correctAnswers = question.correctAnswer
              .filter(a => a && String(a).trim())
              .map(a => String(a).toLowerCase().trim());
            const userAnswers = userAnswer.answer
              .filter(a => a && String(a).trim())
              .map(a => String(a).toLowerCase().trim());
            
            if (correctAnswers.length === userAnswers.length &&
                correctAnswers.every((ans, idx) => ans === userAnswers[idx])) {
              isCorrect = true;
            }
          }
        } else if (question.type === "fill-in-blank" && Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
          const correctAnswerObjects = question.correctAnswer as Array<{answers?: string[]} | string>;
          isCorrect = correctAnswerObjects.every((correctObj, idx) => {
            const userAns = (userAnswer.answer as string[])[idx]?.toLowerCase().trim() || "";
            if (typeof correctObj === "object" && correctObj.answers) {
              return correctObj.answers.some(a => a.toLowerCase().trim() === userAns);
            }
            return String(correctObj).toLowerCase().trim() === userAns;
          });
        } else if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
          const correct = question.correctAnswer.every((ans, idx) => 
            String(ans).toLowerCase() === (userAnswer.answer as string[])[idx]?.toLowerCase()
          );
          if (correct) isCorrect = true;
        } else if (
          String(userAnswer.answer).toLowerCase() === String(question.correctAnswer).toLowerCase()
        ) {
          isCorrect = true;
        }
        
        if (isCorrect) correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsSubmitting(false);
    setIsFinished(true);
  };

  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold">Test Completed!</h1>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                <p className="text-muted-foreground">You scored {score} out of 100</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Detailed Results</h2>
            {questions.map((question, index) => {
              const userAnswer = answers.find(a => a.questionId === question.id);
              let isCorrect = false;
              let userResponse = "No answer";
              let correctResponse = "";

              // Determine correctness and format responses based on question type
              if (userAnswer) {
                if (question.type === "multiple-select") {
                  const userArr = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer];
                  const correctArr = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
                  
                  userResponse = userArr.join(", ");
                  correctResponse = correctArr.join(", ");
                  
                  if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
                    const correctSet = new Set(question.correctAnswer.map(a => a.toLowerCase()));
                    const userSet = new Set(userAnswer.answer.map(a => String(a).toLowerCase()));
                    if (correctSet.size === userSet.size && [...correctSet].every(a => userSet.has(a))) {
                      isCorrect = true;
                    }
                  }
                } else if (question.type === "inline-conditional-choice") {
                  const userArr = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer];
                  const correctArr = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
                  
                  userResponse = userArr.join(" / ");
                  correctResponse = correctArr.join(" / ");

                  if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
                    const correctAnswers = question.correctAnswer
                      .filter(a => a && String(a).trim())
                      .map(a => String(a).toLowerCase().trim());
                    const userAnswers = userAnswer.answer
                      .filter(a => a && String(a).trim())
                      .map(a => String(a).toLowerCase().trim());
                    
                    if (correctAnswers.length === userAnswers.length &&
                        correctAnswers.every((ans, idx) => ans === userAnswers[idx])) {
                      isCorrect = true;
                    }
                  }
                } else if (question.type === "fill-in-blank") {
                   const userArr = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer];
                   userResponse = userArr.join(", ");
                   
                   // Format correct answer for display
                   if (Array.isArray(question.correctAnswer)) {
                      correctResponse = question.correctAnswer.map(ans => {
                        if (typeof ans === 'object' && ans !== null && 'answers' in ans) {
                          return (ans as { answers: string[] }).answers[0];
                        }
                        return String(ans);
                      }).join(", ");
                   } else {
                      correctResponse = String(question.correctAnswer);
                   }

                   if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
                      const correctAnswerObjects = question.correctAnswer as Array<{answers?: string[]} | string>;
                      isCorrect = correctAnswerObjects.every((correctObj, idx) => {
                        const userAns = (userAnswer.answer as string[])[idx]?.toLowerCase().trim() || "";
                        if (typeof correctObj === "object" && correctObj.answers) {
                          return correctObj.answers.some(a => a.toLowerCase().trim() === userAns);
                        }
                        return String(correctObj).toLowerCase().trim() === userAns;
                      });
                   }
                } else if (question.type === "drag-drop-sentence") {
                    const userArr = Array.isArray(userAnswer.answer) ? userAnswer.answer : [userAnswer.answer];
                    userResponse = userArr.join(" ");
                    
                    if (Array.isArray(question.correctAnswer)) {
                        correctResponse = question.correctAnswer.join(" ");
                    } else if (question.words) {
                        correctResponse = question.words.join(" ");
                    } else {
                        correctResponse = String(question.correctAnswer);
                    }

                    if (Array.isArray(question.correctAnswer) && Array.isArray(userAnswer.answer)) {
                        const correct = question.correctAnswer.every((ans, idx) => 
                            String(ans).toLowerCase() === (userAnswer.answer as string[])[idx]?.toLowerCase()
                        );
                        if (correct) isCorrect = true;
                    } else if (question.words && Array.isArray(userAnswer.answer)) {
                         const correct = question.words.every((ans, idx) => 
                            String(ans).toLowerCase() === (userAnswer.answer as string[])[idx]?.toLowerCase()
                        );
                        if (correct) isCorrect = true;
                    }
                } else {
                  userResponse = String(userAnswer.answer);
                  correctResponse = Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : String(question.correctAnswer);
                  
                  if (String(userAnswer.answer).toLowerCase() === String(correctResponse).toLowerCase()) {
                    isCorrect = true;
                  }
                }
              } else {
                 correctResponse = Array.isArray(question.correctAnswer) ? 
                    (typeof question.correctAnswer[0] === 'object' ? 'Complex Answer' : question.correctAnswer.join(", ")) 
                    : String(question.correctAnswer);
              }

              return (
                <Card key={index} className={cn("border-l-4", isCorrect ? "border-l-green-500" : "border-l-red-500")}>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">
                      Question {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-foreground mb-2">{question.question}</p>
                      {question.type === "fill-in-blank" && (
                         <div className="text-sm text-muted-foreground mb-2">
                            (Fill in the blanks)
                         </div>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Your Answer:</span>
                        <p className={cn("text-sm", isCorrect ? "text-green-600 font-medium" : "text-red-600")}>
                          {userResponse}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">Correct Answer:</span>
                        <p className="text-sm text-foreground font-medium">
                          {correctResponse}
                        </p>
                      </div>
                    </div>
                    
                    {question.explanation && (
                      <div className="pt-2 border-t mt-2">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Explanation: </span>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center pt-6 pb-12">
            <Button onClick={() => router.push('/grammar')} size="lg" className="cursor-pointer">Back to Grammar Library</Button>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
      <div className="container mx-auto px-4 py-6">
        <Link href="/grammar">
          <Button variant="ghost" className="mb-2 cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Grammar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground mb-4">{test.title}</h1>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Question {currentQuestionIndex + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <QuestionRenderer
              question={currentQuestion}
              answer={currentAnswer?.answer}
              onAnswer={handleAnswer}
            />

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
                    "Submit Test"
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">Question Overview</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => {
              const answered = answers.some(
                a => a.questionId === questions[index].id
              );
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={cn(
                    "w-10 h-10 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    index === currentQuestionIndex
                      ? "bg-primary text-primary-foreground"
                      : answered
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </div>
  );
}
