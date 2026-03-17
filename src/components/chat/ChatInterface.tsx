"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Loader2, MessageSquare, Mail, Copy, ExternalLink } from "lucide-react";

interface Message {
  role: "USER" | "ASSISTANT";
  content: string;
  sources?: string[];
}

interface ChatInterfaceProps {
  conversationId?: string;
}

function buildVerduidelijkingEmail(userQuestion: string, assistantAnswer: string) {
  const subject = "Verduidelijking gevraagd - Contractbot antwoord";
  const body = `Beste,

Ik heb via Contractbot de volgende vraag gesteld:

${userQuestion}

Het antwoord dat ik ontving was:

${assistantAnswer}

Graag zou ik willen vragen om dit antwoord nader te verduidelijken.

Met vriendelijke groet,`;
  return { subject, body };
}

export function ChatInterface({ conversationId: initialConversationId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [useUAV, setUseUAV] = useState(false);
  const [emailVerduidelijkingIndex, setEmailVerduidelijkingIndex] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setIsLoading(true);

    // Voeg gebruikersbericht toe
    setMessages((prev) => [...prev, { role: "USER", content: userMessage }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          useUAV,
        }),
      });

      if (!response.ok) {
        throw new Error("Fout bij verzenden bericht");
      }

      const data = await response.json();
      setConversationId(data.conversationId);

      // Voeg assistent antwoord toe
      setMessages((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          content: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          content: "Sorry, er is een fout opgetreden. Probeer het opnieuw.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const openVerduidelijkingDialog = (messageIndex: number) => {
    setCopySuccess(false);
    setEmailVerduidelijkingIndex(messageIndex);
  };

  const handleCopyVerduidelijking = async () => {
    if (emailVerduidelijkingIndex == null) return;
    const prev = messages[emailVerduidelijkingIndex - 1];
    const msg = messages[emailVerduidelijkingIndex];
    const userQuestion = prev?.role === "USER" ? prev.content : "";
    const { body } = buildVerduidelijkingEmail(userQuestion, msg.content);
    await navigator.clipboard.writeText(body);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const verduidelijkingMailto = (): string => {
    if (emailVerduidelijkingIndex == null) return "#";
    const prev = messages[emailVerduidelijkingIndex - 1];
    const msg = messages[emailVerduidelijkingIndex];
    const userQuestion = prev?.role === "USER" ? prev.content : "";
    const { subject, body } = buildVerduidelijkingEmail(userQuestion, msg.content);
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-16 space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xl font-semibold text-foreground">Welkom bij Contractbot!</p>
            <p className="text-base">Stel een vraag over contracten of documenten om te beginnen.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "USER" ? "justify-end" : "justify-start"
            } animate-in fade-in slide-in-from-bottom-4 duration-300`}
          >
            <div className={`max-w-[80%] flex flex-col gap-2 ${
              message.role === "USER" ? "items-end" : "items-start"
            }`}>
              <Card
                className={`p-4 shadow-md ${
                  message.role === "USER"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                    : "bg-muted rounded-2xl rounded-tl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </Card>
              {message.sources && message.sources.length > 0 && (
                <p className={`text-xs px-2 ${
                  message.role === "USER" ? "text-muted-foreground" : "text-muted-foreground"
                }`}>
                  Gebaseerd op {message.sources.length} document{message.sources.length > 1 ? 'en' : ''}
                </p>
              )}
              {message.role === "ASSISTANT" && index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5 -ml-1"
                  onClick={() => openVerduidelijkingDialog(index)}
                >
                  <Mail className="h-3.5 w-3" />
                  Mail voor verduidelijking
                </Button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4">
            <Card className="bg-muted p-4 rounded-2xl rounded-tl-sm shadow-md">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Denken...</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-muted/30 p-4 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <input
            type="checkbox"
            id="useUAV"
            checked={useUAV}
            onChange={(e) => setUseUAV(e.target.checked)}
            className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
          />
          <label htmlFor="useUAV" className="text-sm text-muted-foreground cursor-pointer">
            Ook UAV raadplegen
          </label>
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Stel je vraag over contracten..."
            disabled={isLoading}
            className="flex-1 h-12 text-base"
          />
          <Button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            size="lg"
            className="h-12 px-6"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <Dialog open={emailVerduidelijkingIndex !== null} onOpenChange={(open) => !open && setEmailVerduidelijkingIndex(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>E-mail voor verduidelijking</DialogTitle>
            <DialogDescription>
              Gebruik onderstaande tekst om per e-mail om verduidelijking te vragen. Kopieer de tekst of open in je e-mailclient.
            </DialogDescription>
          </DialogHeader>
          {emailVerduidelijkingIndex !== null && (() => {
            const prev = messages[emailVerduidelijkingIndex - 1];
            const msg = messages[emailVerduidelijkingIndex];
            const userQuestion = prev?.role === "USER" ? prev.content : "";
            const { body } = buildVerduidelijkingEmail(userQuestion, msg.content);
            return (
              <textarea
                readOnly
                className="min-h-[200px] w-full rounded-md border bg-muted/50 p-3 text-sm font-mono resize-y"
                value={body}
                aria-label="E-mailtekst"
              />
            );
          })()}
          <DialogFooter className="flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCopyVerduidelijking} className="gap-2">
              <Copy className="h-4 w-4" />
              {copySuccess ? "Gekopieerd!" : "Kopiëren"}
            </Button>
            <Button asChild className="gap-2">
              <a href={verduidelijkingMailto()} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open in e-mailclient
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

