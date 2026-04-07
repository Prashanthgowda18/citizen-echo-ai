import { useState, useEffect, useCallback } from "react";
import { useAppState } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fallbackAnalysisResult } from "@/data/fallbackAnalysis";
import { toast } from "@/hooks/use-toast";
import type { Submission, PolicyDomain, UrgencyLevel, SubmissionType } from "@/data/demoData";

const analysisSteps = [
  "Reading submission...",
  "Detecting policy domain...",
  "Scoring urgency level...",
  "Analyzing sentiment...",
  "Extracting keywords...",
  "Analysis complete ✓",
];

interface AnalysisResult {
  domain: PolicyDomain;
  coreIssue: string;
  urgency: UrgencyLevel;
  sentiment: number;
  emotionalIntensity: number;
  type: SubmissionType;
  keywords: string[];
  language: string;
}

export default function SubmitFeedback() {
  const { addSubmission } = useAppState();
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const runAnalysisAnimation = useCallback(() => {
    setCurrentStep(0);
    for (let i = 1; i < analysisSteps.length; i++) {
      setTimeout(() => setCurrentStep(i), i * 800);
    }
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setSubmitted(false);
    runAnalysisAnimation();

    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));

    try {
      const aiPromise = supabase.functions.invoke("analyze-feedback", {
        body: { text: text.trim(), location: location.trim() || "Not specified" },
      });

      const response = await Promise.race([aiPromise, timeoutPromise]);

      if (response && "data" in response && response.data && !response.error) {
        setResult(response.data as AnalysisResult);
      } else {
        // Fallback
        setResult({
          ...fallbackAnalysisResult,
          coreIssue: text.trim().slice(0, 80),
        });
      }
    } catch {
      setResult({
        ...fallbackAnalysisResult,
        coreIssue: text.trim().slice(0, 80),
      });
      toast({ title: "Using cached analysis", description: "AI service temporarily unavailable. Showing example analysis.", variant: "destructive" });
    } finally {
      // Wait for animation to finish
      setTimeout(() => setAnalyzing(false), Math.max(0, (analysisSteps.length - currentStep) * 800));
    }
  };

  const handleAddToSystem = () => {
    if (!result) return;
    const submission: Submission = {
      id: `s-${Date.now()}`,
      text: text.trim(),
      domain: result.domain,
      coreIssue: result.coreIssue,
      location: location.trim() || "Not specified",
      urgency: result.urgency,
      sentiment: result.sentiment,
      emotionalIntensity: result.emotionalIntensity,
      type: result.type,
      keywords: result.keywords,
      date: new Date().toISOString().split("T")[0],
      language: result.language,
    };
    addSubmission(submission);
    setSubmitted(true);
    toast({ title: "Feedback added", description: "Your submission has been added to the system." });
  };

  const handleReset = () => {
    setText("");
    setLocation("");
    setResult(null);
    setSubmitted(false);
    setCurrentStep(-1);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submit Feedback</h1>
        <p className="text-muted-foreground mt-1">Share your experience — AI will analyze it in real-time</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Citizen Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your experience, concern, or suggestion about government services..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px]"
            disabled={analyzing || submitted}
          />
          <Input
            placeholder="Location (optional) — e.g., Koramangala, Bengaluru"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={analyzing || submitted}
          />
          {!result && !submitted && (
            <Button onClick={handleSubmit} disabled={!text.trim() || analyzing} className="gap-2">
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {analyzing ? "Analyzing..." : "Analyze Feedback"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Analysis Steps Animation */}
      {analyzing && currentStep >= 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {analysisSteps.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                    i <= currentStep ? "opacity-100" : "opacity-0"
                  } ${i === currentStep && i < analysisSteps.length - 1 ? "text-accent font-medium" : i < currentStep ? "text-muted-foreground" : ""} ${
                    i === analysisSteps.length - 1 && i <= currentStep ? "text-success font-semibold" : ""
                  }`}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : i === currentStep && i < analysisSteps.length - 1 ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" />
                  ) : i === analysisSteps.length - 1 && i <= currentStep ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <div className="h-4 w-4 shrink-0" />
                  )}
                  {step}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Result */}
      {result && !analyzing && (
        <Card className="border-accent/30 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-base">AI Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Detected Domain</p>
                <Badge className="mt-1">{result.domain}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Urgency Level</p>
                <Badge variant={result.urgency === "Critical" ? "destructive" : "outline"} className="mt-1">{result.urgency}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sentiment Score</p>
                <p className="font-mono font-bold mt-1">{result.sentiment.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submission Type</p>
                <p className="font-medium mt-1">{result.type}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Core Issue</p>
              <p className="text-sm mt-1">{result.coreIssue}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Keywords</p>
              <div className="flex gap-1 flex-wrap">
                {result.keywords.map(k => <Badge key={k} variant="outline" className="text-[10px]">{k}</Badge>)}
              </div>
            </div>

            {!submitted ? (
              <div className="flex gap-2">
                <Button onClick={handleAddToSystem} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Add to System
                </Button>
                <Button variant="outline" onClick={handleReset}>Reset</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Added to system successfully</span>
                <Button variant="outline" className="ml-auto" onClick={handleReset}>Submit Another</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
