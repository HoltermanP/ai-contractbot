import { ChatPageWithMailAnalysis } from "@/components/chat/MailAnalysisTab";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default async function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">AI Chat Assistent</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Contractbot Chat</h1>
            <p className="text-muted-foreground text-lg">
              Stel vragen over je contracten of analyseer een mailwisseling anoniem
            </p>
          </div>
          <Card className="h-[calc(100vh-280px)] min-h-[600px] shadow-xl border-2 p-6">
            <ChatPageWithMailAnalysis />
          </Card>
        </div>
      </div>
    </div>
  );
}

