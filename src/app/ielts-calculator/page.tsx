"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScoreInput } from "@/components/ScoreInput";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { ConversionTable } from "@/components/ConversionTable";
import { AssessmentCriteria } from "@/components/AssessmentCriteria";
import { SpeakingCalculator } from "@/components/SpeakingCalculator";
import { WritingCalculator } from "@/components/WritingCalculator";
import { convertListeningScore, convertReadingScore, calculateOverallBand } from "@/utils/ieltsConversion";
import { Calculator } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const IELTSCalculatorPage = () => {
  const [testType, setTestType] = useState<'academic' | 'general'>('academic');
  const [listeningRaw, setListeningRaw] = useState("");
  const [readingRaw, setReadingRaw] = useState("");
  const [writingBand, setWritingBand] = useState("");
  const [speakingBand, setSpeakingBand] = useState("");

  const [listeningScore, setListeningScore] = useState<number | null>(null);
  const [readingScore, setReadingScore] = useState<number | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  useEffect(() => {
    // Convert raw scores to band scores
    const listening = listeningRaw ? convertListeningScore(Number(listeningRaw)) : null;
    const reading = readingRaw ? convertReadingScore(Number(readingRaw), testType) : null;
    
    setListeningScore(listening);
    setReadingScore(reading);

    // Calculate overall band if all scores are available
    if (listening !== null && listening > 0 && reading !== null && reading > 0 && writingBand && speakingBand) {
      const overall = calculateOverallBand(
        listening,
        reading,
        Number(writingBand),
        Number(speakingBand)
      );
      setOverallScore(overall);
    } else {
      setOverallScore(null);
    }
  }, [listeningRaw, readingRaw, writingBand, speakingBand, testType]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4 shadow-lg">
            <Calculator className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
            IELTS Score Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your overall IELTS band score instantly. Enter your raw scores for Listening and Reading, 
            and your band scores for Writing and Speaking.
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 sm:p-8 mb-6 shadow-xl border-border/50 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Enter Your Scores</h2>
            <div className="flex gap-2">
              <Button
                variant={testType === 'academic' ? 'default' : 'outline'}
                onClick={() => setTestType('academic')}
                size="sm"
                className="cursor-pointer"
              >
                Academic
              </Button>
              <Button
                variant={testType === 'general' ? 'default' : 'outline'}
                onClick={() => setTestType('general')}
                size="sm"
                className="cursor-pointer"
              >
                General
              </Button>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <ScoreInput
              label="Listening (Raw Score)"
              value={listeningRaw}
              onChange={setListeningRaw}
              min={0}
              max={40}
              placeholder="0-40"
            />
            <ScoreInput
              label="Reading (Raw Score)"
              value={readingRaw}
              onChange={setReadingRaw}
              min={0}
              max={40}
              placeholder="0-40"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <ScoreInput
              label="Writing (Band Score)"
              value={writingBand}
              onChange={setWritingBand}
              min={0}
              max={9}
              placeholder="e.g., 7.5"
              allowHalfScores={true}
            />
            <ScoreInput
              label="Speaking (Band Score)"
              value={speakingBand}
              onChange={setSpeakingBand}
              min={0}
              max={9}
              placeholder="e.g., 6.5"
              allowHalfScores={true}
            />
          </div>
        </Card>

        {/* Results Section */}
        <Card className="p-6 sm:p-8 shadow-xl border-border/50 animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Your Band Scores</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ScoreDisplay label="Listening" score={listeningScore} />
            <ScoreDisplay label="Reading" score={readingScore} />
            <ScoreDisplay label="Writing" score={writingBand ? Number(writingBand) : null} />
            <ScoreDisplay label="Speaking" score={speakingBand ? Number(speakingBand) : null} />
          </div>

          <div className="mt-8">
            <ScoreDisplay label="Overall Band Score" score={overallScore} isOverall />
          </div>

          {overallScore === null && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Complete all four sections to see your overall band score
            </p>
          )}
        </Card>

        {/* Score Conversion Tables */}
        <Card className="mt-6 p-6 shadow-xl border-border/50 animate-in fade-in duration-1000 delay-150">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full group cursor-pointer">
              <h2 className="text-2xl font-semibold text-foreground">Score Conversion Tables</h2>
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <ConversionTable />
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Assessment Criteria */}
        <Card className="mt-6 p-6 shadow-xl border-border/50 animate-in fade-in duration-1000 delay-200">
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center justify-between w-full group cursor-pointer">
              <h2 className="text-2xl font-semibold text-foreground">Assessment Criteria</h2>
              <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6">
              <AssessmentCriteria />
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Info Section */}
        <div className="mt-6 text-center text-sm text-muted-foreground animate-in fade-in duration-1000 delay-300">
          <p>The overall band score is calculated as the average of all four skills, rounded to the nearest 0.5.</p>
        </div>

        {/* Additional Calculators */}
        <div className="mt-8 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Additional Calculators</h2>
            <p className="text-muted-foreground">Calculate detailed scores for Speaking and Writing tasks</p>
          </div>

          <SpeakingCalculator />
          <WritingCalculator />
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default IELTSCalculatorPage;
