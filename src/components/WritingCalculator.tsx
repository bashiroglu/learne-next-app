import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BandScoreInput } from "./BandScoreInput";

interface TaskScores {
  taskAchievementOrResponse: string;
  coherence: string;
  lexical: string;
  grammar: string;
}

const calculateTaskScore = (scores: number[]): number | null => {
  if (scores.some(s => s === 0)) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  const base = Math.floor(avg);
  const dec = avg - base;

  return dec < 0.5 ? base : base + 0.5;
};

const calculateOverallScore = (task1: number | null, task2: number | null): number | null => {
  if (task1 === null || task2 === null) return null;

  // Task 1 is 1/3 weight, Task 2 is 2/3 weight
  const avg = (task1 + 2 * task2) / 3;
  const base = Math.floor(avg);
  const dec = avg - base;

  if (dec < 0.25) return base;
  if (dec < 0.75) return base + 0.5;
  return base + 1;
};

export const WritingCalculator = () => {
  const [task1, setTask1] = useState<TaskScores>({
    taskAchievementOrResponse: "0",
    coherence: "0",
    lexical: "0",
    grammar: "0"
  });

  const [task2, setTask2] = useState<TaskScores>({
    taskAchievementOrResponse: "0",
    coherence: "0",
    lexical: "0",
    grammar: "0"
  });

  const task1Score = useMemo(() => {
    const scores = [
      Number(task1.taskAchievementOrResponse),
      Number(task1.coherence),
      Number(task1.lexical),
      Number(task1.grammar)
    ];
    return calculateTaskScore(scores);
  }, [task1]);

  const task2Score = useMemo(() => {
    const scores = [
      Number(task2.taskAchievementOrResponse),
      Number(task2.coherence),
      Number(task2.lexical),
      Number(task2.grammar)
    ];
    return calculateTaskScore(scores);
  }, [task2]);

  const overallWriting = useMemo(
    () => calculateOverallScore(task1Score, task2Score),
    [task1Score, task2Score]
  );

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
            <BandScoreInput
              id="t1-task-achievement"
              value={task1.taskAchievementOrResponse}
              onChange={(val) => setTask1({ ...task1, taskAchievementOrResponse: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t1-coherence" className="text-sm font-medium text-foreground">
              Coherence & Cohesion
            </Label>
            <BandScoreInput
              id="t1-coherence"
              value={task1.coherence}
              onChange={(val) => setTask1({ ...task1, coherence: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t1-lexical" className="text-sm font-medium text-foreground">
              Lexical Resource
            </Label>
            <BandScoreInput
              id="t1-lexical"
              value={task1.lexical}
              onChange={(val) => setTask1({ ...task1, lexical: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t1-grammar" className="text-sm font-medium text-foreground">
              Grammatical Range & Accuracy
            </Label>
            <BandScoreInput
              id="t1-grammar"
              value={task1.grammar}
              onChange={(val) => setTask1({ ...task1, grammar: val })}
            />
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
            <BandScoreInput
              id="t2-task-response"
              value={task2.taskAchievementOrResponse}
              onChange={(val) => setTask2({ ...task2, taskAchievementOrResponse: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t2-coherence" className="text-sm font-medium text-foreground">
              Coherence & Cohesion
            </Label>
            <BandScoreInput
              id="t2-coherence"
              value={task2.coherence}
              onChange={(val) => setTask2({ ...task2, coherence: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t2-lexical" className="text-sm font-medium text-foreground">
              Lexical Resource
            </Label>
            <BandScoreInput
              id="t2-lexical"
              value={task2.lexical}
              onChange={(val) => setTask2({ ...task2, lexical: val })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="t2-grammar" className="text-sm font-medium text-foreground">
              Grammatical Range & Accuracy
            </Label>
            <BandScoreInput
              id="t2-grammar"
              value={task2.grammar}
              onChange={(val) => setTask2({ ...task2, grammar: val })}
            />
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
