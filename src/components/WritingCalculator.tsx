import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BandScoreInput } from "./BandScoreInput";

const calculateWritingScore = (scores: number[]): number | null => {
  if (scores.some(s => s === 0)) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  
  // Apply downgrade rounding
  const base = Math.floor(avg);
  const dec = avg - base;
  
  if (dec < 0.5) {
    return base;
  } else {
    return base + 0.5;
  }
};

export const WritingCalculator = () => {
  // Writing Task 1
  const [task1TaskAchievement, setTask1TaskAchievement] = useState<string>("0");
  const [task1Coherence, setTask1Coherence] = useState<string>("0");
  const [task1Lexical, setTask1Lexical] = useState<string>("0");
  const [task1Grammar, setTask1Grammar] = useState<string>("0");
  const [task1Score, setTask1Score] = useState<number | null>(null);

  // Writing Task 2
  const [task2TaskResponse, setTask2TaskResponse] = useState<string>("0");
  const [task2Coherence, setTask2Coherence] = useState<string>("0");
  const [task2Lexical, setTask2Lexical] = useState<string>("0");
  const [task2Grammar, setTask2Grammar] = useState<string>("0");
  const [task2Score, setTask2Score] = useState<number | null>(null);

  // Overall Writing Score
  const [overallWriting, setOverallWriting] = useState<number | null>(null);

  useEffect(() => {
    const t1Scores = [
      Number(task1TaskAchievement),
      Number(task1Coherence),
      Number(task1Lexical),
      Number(task1Grammar)
    ];
    setTask1Score(calculateWritingScore(t1Scores));

    const t2Scores = [
      Number(task2TaskResponse),
      Number(task2Coherence),
      Number(task2Lexical),
      Number(task2Grammar)
    ];
    setTask2Score(calculateWritingScore(t2Scores));
  }, [
    task1TaskAchievement, task1Coherence, task1Lexical, task1Grammar,
    task2TaskResponse, task2Coherence, task2Lexical, task2Grammar
  ]);

  useEffect(() => {
    if (task1Score !== null && task2Score !== null) {
      // Task 1 is 1/3 weight, Task 2 is 2/3 weight (2:1 ratio)
      const avg = (task1Score + 2 * task2Score) / 3;
      
      // Apply standard IELTS rounding to nearest 0.5
      const base = Math.floor(avg);
      const dec = avg - base;
      
      if (dec < 0.25) {
        setOverallWriting(base);
      } else if (dec < 0.75) {
        setOverallWriting(base + 0.5);
      } else {
        setOverallWriting(base + 1);
      }
    } else {
      setOverallWriting(null);
    }
  }, [task1Score, task2Score]);

  return (
    <div className="space-y-6">
      {/* Writing Task 1 */}
      <Card className="p-6 shadow-xl border-border/50 bg-gradient-to-br from-card to-card/80">
        <h3 className="text-xl font-semibold text-foreground mb-4">Writing Task 1 Calculator</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="t1-task-achievement" className="text-sm font-medium text-foreground">
              Task Achievement
            </Label>
            <BandScoreInput id="t1-task-achievement" value={task1TaskAchievement} onChange={setTask1TaskAchievement} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t1-coherence" className="text-sm font-medium text-foreground">
              Coherence & Cohesion
            </Label>
            <BandScoreInput id="t1-coherence" value={task1Coherence} onChange={setTask1Coherence} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t1-lexical" className="text-sm font-medium text-foreground">
              Lexical Resource
            </Label>
            <BandScoreInput id="t1-lexical" value={task1Lexical} onChange={setTask1Lexical} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t1-grammar" className="text-sm font-medium text-foreground">
              Grammatical Range & Accuracy
            </Label>
            <BandScoreInput id="t1-grammar" value={task1Grammar} onChange={setTask1Grammar} />
          </div>
        </div>
        {task1Score !== null && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm font-medium opacity-90 mb-1">Writing Task 1 Score</div>
            <div className="text-3xl font-bold">{task1Score.toFixed(1)}</div>
          </div>
        )}
      </Card>

      {/* Writing Task 2 */}
      <Card className="p-6 shadow-xl border-border/50 bg-gradient-to-br from-card to-card/80">
        <h3 className="text-xl font-semibold text-foreground mb-4">Writing Task 2 Calculator</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="t2-task-response" className="text-sm font-medium text-foreground">
              Task Response
            </Label>
            <BandScoreInput id="t2-task-response" value={task2TaskResponse} onChange={setTask2TaskResponse} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t2-coherence" className="text-sm font-medium text-foreground">
              Coherence & Cohesion
            </Label>
            <BandScoreInput id="t2-coherence" value={task2Coherence} onChange={setTask2Coherence} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t2-lexical" className="text-sm font-medium text-foreground">
              Lexical Resource
            </Label>
            <BandScoreInput id="t2-lexical" value={task2Lexical} onChange={setTask2Lexical} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t2-grammar" className="text-sm font-medium text-foreground">
              Grammatical Range & Accuracy
            </Label>
            <BandScoreInput id="t2-grammar" value={task2Grammar} onChange={setTask2Grammar} />
          </div>
        </div>
        {task2Score !== null && (
          <div className="p-4 rounded-lg bg-muted">
            <div className="text-sm font-medium opacity-90 mb-1">Writing Task 2 Score</div>
            <div className="text-3xl font-bold">{task2Score.toFixed(1)}</div>
          </div>
        )}
      </Card>

      {/* Overall Writing Score */}
      {overallWriting !== null && (
        <Card className="p-6 shadow-xl border-border/50 bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <h3 className="text-xl font-semibold mb-2">Overall Writing Band Score</h3>
          <div className="text-4xl font-bold">{overallWriting.toFixed(1)}</div>
          <p className="text-sm opacity-90 mt-2">
            Calculated using Task 1 (33%) and Task 2 (67%) weighting
          </p>
        </Card>
      )}
    </div>
  );
};
