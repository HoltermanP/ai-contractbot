"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "./ChatInterface";

export function ChatPageWithMailAnalysis() {
  const [mailContent, setMailContent] = useState("");
  const [analysisResult, setAnalysisResult] = useState<{
    answer: string;
    sources: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const trimmed = mailContent.trim();
    if (!trimmed || trimmed.length < 50) {
      setError("Plak minimaal een korte mailwisseling (ongeveer 50 tekens).");
      return;
    }

    setError(null);
    setAnalysisResult(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/chat/analyze-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mailContent: trimmed }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Fout bij analyseren");
      }

      const data = await response.json();
      setAnalysisResult({ answer: data.answer, sources: data.sources ?? [] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Er is een fout opgetreden.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Tabs defaultValue="chat" className="w-full h-full flex flex-col min-h-0">
      <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 shrink-0">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="mail">Mailwisseling analyseren</TabsTrigger>
      </TabsList>

      <TabsContent value="chat" className="flex-1 mt-0 min-h-0 flex flex-col">
        <div className="flex-1 min-h-[400px]">
          <ChatInterface />
        </div>
      </TabsContent>

      <TabsContent value="mail" className="flex-1 mt-0 min-h-0 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            De mailwisseling wordt anoniem geanalyseerd. Er wordt geen inhoud opgeslagen of gekoppeld aan jouw account. Alleen de feitelijke case en het advies op basis van de kennis van de contractbot worden gebruikt.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="mail-paste" className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Plak hier de mailwisseling
          </label>
          <Textarea
            id="mail-paste"
            placeholder="Kopieer en plak de volledige e-mailwisseling (vanaf de eerste mail tot de laatste)..."
            value={mailContent}
            onChange={(e) => setMailContent(e.target.value)}
            className="min-h-[200px] resize-y font-mono text-sm"
            disabled={isAnalyzing}
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || mailContent.trim().length < 50}
          size="lg"
          className="gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyseren...
            </>
          ) : (
            "Analyseer anoniem"
          )}
        </Button>

        {error && (
          <Card className="p-4 border-destructive/50 bg-destructive/5">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}

        {analysisResult && (
          <Card className="p-5 border-2 shadow-lg space-y-3">
            <h3 className="font-semibold text-lg">Advies op basis van de case</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-foreground">
              {analysisResult.answer}
            </p>
            {analysisResult.sources.length > 0 && (
              <p className="text-xs text-muted-foreground pt-2 border-t">
                Gebaseerd op {analysisResult.sources.length} document
                {analysisResult.sources.length !== 1 ? "en" : ""} uit de kennisbank.
              </p>
            )}
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
