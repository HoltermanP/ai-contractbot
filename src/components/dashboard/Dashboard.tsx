"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  ArrowRight,
  Clock,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Library,
  ShieldCheck,
  Server,
  Lock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface FrequentQuestion {
  query: string;
  count: number;
}

interface Ambiguity {
  id: string;
  title: string;
  description: string;
  snippet: string | null;
  document: { id: string; title: string };
  createdAt: string;
}

interface ComplexTopic {
  id: string;
  name: string;
  description: string | null;
  complexity: string;
  questionCount: number;
}

interface RecentConversation {
  id: string;
  title: string | null;
  updatedAt: string;
  messages: Array<{ content: string; createdAt: string }>;
}

interface RecentDocument {
  id: string;
  title: string;
  filename: string;
  uploadedAt: string;
  user?: { name: string | null; email: string };
}

interface DashboardData {
  frequentQuestions: FrequentQuestion[];
  ambiguities: Ambiguity[];
  complexTopics: ComplexTopic[];
  documentCount: number;
  recentConversations: RecentConversation[];
  recentDocuments: RecentDocument[];
}

export function Dashboard() {
  const session = {
    user: { name: "Demo Admin", email: "admin@contractbot.nl", role: "ADMIN" },
  };
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const dashboardData = await response.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Laden...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          Fout bij het laden van dashboard gegevens
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Zojuist";
    if (diffInHours < 24) return `${diffInHours} uur geleden`;
    if (diffInHours < 48) return "Gisteren";
    return date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-10 max-w-[100vw] overflow-x-hidden">
        {/* Hero: Contractbot – contracten begrijpen */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-card p-5 sm:p-6 md:p-8 lg:p-10 border border-border/60 shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <div className="absolute inset-0 bg-grid-contract bg-[size:24px_24px] opacity-40" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded-lg px-2.5 py-0.5">
                Contractbot
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-foreground tracking-tight">
              Welkom terug
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              Overzicht van veelgestelde vragen, complexe onderwerpen en onduidelijkheden in je contracten. Alles om het contract beter te begrijpen.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/chat">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-xl">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Vraag stellen over een contract
                </Button>
              </Link>
              <Link href="/documents">
                <Button size="lg" variant="outline" className="border-border hover:bg-muted/50 rounded-xl">
                  <FileText className="h-4 w-4 mr-2" />
                  Contracten bekijken
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Veilige omgeving – EU & afgeschermde server */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-950/40 p-6 md:p-7 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
                <span className="font-semibold">Veilige omgeving</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
                <span className="flex items-center gap-1.5 text-emerald-700/90 dark:text-emerald-400/90">
                  <Server className="h-4 w-4" />
                  Europese server
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5 text-emerald-700/90 dark:text-emerald-400/90">
                  <Lock className="h-4 w-4" />
                  Afgeschermde infrastructuur
                </span>
              </div>
            </div>
            <Link href="/privacy">
              <Button variant="outline" size="sm" className="border-emerald-400 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-900/50">
                Privacy &amp; Security
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Uw gegevens worden uitsluitend verwerkt op Europese, afgeschermde servers. AVG-compliant en zonder data buiten de EU.
          </p>
        </div>

        {/* Inzichten: veelgestelde vragen, complexe onderwerpen, onduidelijkheden */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-card-hover hover:border-emerald-200/80 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Veelgestelde vragen
              </CardTitle>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-700">
                {data.frequentQuestions.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Vragen die het vaakst worden gesteld over de contracten
              </p>
              {data.frequentQuestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nog geen vragen gesteld. Start een chat om vragen te stellen.</p>
              ) : (
                <ul className="space-y-2">
                  {data.frequentQuestions.slice(0, 4).map((q, i) => (
                    <li key={i} className="text-sm text-foreground truncate" title={q.query}>
                      {q.query.length > 50 ? `${q.query.slice(0, 50)}…` : q.query}
                      <span className="text-muted-foreground ml-1">({q.count}x)</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/analytics" className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline">
                Alle inzichten <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card-hover hover:border-amber-200/80 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Complexe onderwerpen
              </CardTitle>
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:border-amber-700">
                {data.complexTopics.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Onderwerpen die vaak extra toelichting behoeven
              </p>
              {data.complexTopics.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nog geen complexe onderwerpen geïdentificeerd.</p>
              ) : (
                <ul className="space-y-2">
                  {data.complexTopics.slice(0, 4).map((t) => (
                    <li key={t.id} className="text-sm text-foreground flex items-center justify-between gap-2">
                      <span className="truncate">{t.name}</span>
                      <Badge variant="outline" className="text-xs shrink-0">{t.complexity}</Badge>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/analytics" className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline">
                Alle inzichten <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card-hover hover:border-red-200/80 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                Onduidelijkheden in contracten
              </CardTitle>
              <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-700">
                {data.ambiguities.length}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">
                Geïdentificeerde onduidelijke of dubbelzinnige passages
              </p>
              {data.ambiguities.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen onduidelijkheden gemeld.</p>
              ) : (
                <ul className="space-y-2">
                  {data.ambiguities.slice(0, 4).map((a) => (
                    <li key={a.id} className="text-sm text-foreground truncate" title={a.title}>
                      {a.title} — <span className="text-muted-foreground">{a.document.title}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/analytics" className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline">
                Alle inzichten <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Contracten in bibliotheek + Snelle acties */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          <Card className="lg:col-span-1 hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Library className="h-5 w-5 text-primary" />
                Contracten in bibliotheek
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {data.documentCount} documenten beschikbaar om te raadplegen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold text-foreground">{data.documentCount}</div>
              <Link href="/documents" className="block">
                <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground">
                  <FileText className="h-4 w-4 mr-3" />
                  Documenten bekijken
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
              <Link href="/chat" className="block">
                <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50">
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Vraag stellen
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
              {session?.user?.role === "ADMIN" && (
                <Link href="/analytics" className="block">
                  <Button variant="outline" className="w-full justify-start border-border hover:bg-muted/50">
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Inzichten rapportage
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recente conversaties */}
          <Card className="lg:col-span-2 hover:shadow-card-hover transition-all duration-200 min-w-0">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Recente gesprekken
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Ga verder waar je gebleven was
                </CardDescription>
              </div>
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Alle bekijken <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data.recentConversations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50 text-primary" />
                  <p className="mb-4">Nog geen gesprekken gestart</p>
                  <Link href="/chat">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Eerste vraag stellen
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.recentConversations.slice(0, 4).map((conversation) => (
                    <Link
                      key={conversation.id}
                      href={`/chat?conversation=${conversation.id}`}
                      className="block"
                    >
                      <div className="flex items-start gap-3 p-4 rounded-2xl border border-border/60 hover:border-primary/20 bg-muted/20 hover:bg-muted/40 transition-all duration-200 group">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-foreground truncate">
                              {conversation.title || "Contractvraag"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(conversation.updatedAt)}
                            </div>
                          </div>
                          {conversation.messages.length > 0 && (
                            <p className="text-sm text-muted-foreground truncate line-clamp-2">
                              {conversation.messages[0].content.substring(0, 80)}
                              {conversation.messages[0].content.length > 80 ? "…" : ""}
                            </p>
                          )}
                          <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-700 mt-2">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Doorgaan
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recente documenten (admin) */}
        {session?.user?.role === "ADMIN" && (
          <Card className="hover:shadow-card-hover transition-all duration-200">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Recent toegevoegde contracten
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Laatst geüploade documenten om te raadplegen
                </CardDescription>
              </div>
              <Link href="/documents">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  Alle bekijken <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {data.recentDocuments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50 text-primary" />
                  <p>Nog geen documenten in de bibliotheek</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {data.recentDocuments.slice(0, 4).map((document) => (
                    <div
                      key={document.id}
                      className="flex items-start gap-3 p-4 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-all duration-200"
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate mb-1">{document.title}</p>
                        <p className="text-sm text-muted-foreground truncate mb-2">{document.filename}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(document.uploadedAt)}
                            </div>
                            {document.user && (
                              <div className="flex items-center gap-1">
                                {document.user.name || document.user.email}
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-700">
                            PDF
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
