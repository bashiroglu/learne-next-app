import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BandScoreInput } from "./BandScoreInput";

const calculateSpeakingScore = (scores: number[]): number | null => {
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

export const SpeakingCalculator = () => {
  const [fluency, setFluency] = useState<string>("0");
  const [lexical, setLexical] = useState<string>("0");
  const [grammar, setGrammar] = useState<string>("0");
  const [pronunciation, setPronunciation] = useState<string>("0");
  const [overallScore, setOverallScore] = useState<number | null>(null);

  useEffect(() => {
    const scores = [
      Number(fluency),
      Number(lexical),
      Number(grammar),
      Number(pronunciation)
    ];
    setOverallScore(calculateSpeakingScore(scores));
  }, [fluency, lexical, grammar, pronunciation]);

  return (
    <Card className="p-6 shadow-xl border-border/50 bg-gradient-to-br from-card to-card/80">
      <h3 className="text-xl font-semibold text-foreground mb-4">Speaking Calculator</h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="speaking-fluency" className="text-sm font-medium text-foreground">
            Fluency and Coherence
          </Label>
          <BandScoreInput id="speaking-fluency" value={fluency} onChange={setFluency} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="speaking-lexical" className="text-sm font-medium text-foreground">
            Lexical Resource
          </Label>
          <BandScoreInput id="speaking-lexical" value={lexical} onChange={setLexical} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="speaking-grammar" className="text-sm font-medium text-foreground">
            Grammatical Range and Accuracy
          </Label>
          <BandScoreInput id="speaking-grammar" value={grammar} onChange={setGrammar} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="speaking-pronunciation" className="text-sm font-medium text-foreground">
            Pronunciation
          </Label>
          <BandScoreInput id="speaking-pronunciation" value={pronunciation} onChange={setPronunciation} />
        </div>
      </div>
      {overallScore !== null && (
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
          <div className="text-sm font-medium opacity-90 mb-1">Overall Speaking Band Score</div>
          <div className="text-3xl font-bold">{overallScore.toFixed(1)}</div>
        </div>
      )}
    </Card>
  );
};
