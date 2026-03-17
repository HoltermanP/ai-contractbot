"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  BookOpen,
  AlertTriangle,
  FileText,
  RefreshCw,
  MessageSquare,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface AnalyticsData {
  documentCount: number;
  frequentQuestions: Array<{ query: string; count: number }>;
  ambiguities: Array<{
    id: string;
    title: string;
    description: string;
    snippet: string | null;
    document: { id: string; title: string };
    createdAt: string;
  }>;
  complexTopics: Array<{
    id: string;
    name: string;
    description: string | null;
    complexity: string;
    questionCount: number;
  }>;
  uavParagraphs: Array<{
    paragraph: string;
    count: number;
    description: string;
  }>;
  contractCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = ["#3b82f6", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6"];

export default function AnalyticsPage() {
  const session = { user: { role: "ADMIN" } };
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetch("/api/analytics");
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-slate-400">Inzichten laden...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center text-slate-400">
            Fout bij het laden van inzichten
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Inzichten voor de begrijker</h1>
            <p className="text-slate-400">
              Veelgestelde vragen, complexe onderwerpen, onduidelijkheden in contracten en meest geraadpleegde onderdelen
            </p>
          </div>
          <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Vernieuwen
          </Button>
        </div>

        {/* Context: contracten in bibliotheek */}
        <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:border-blue-500/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Contracten in bibliotheek</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{data.documentCount}</div>
            <p className="text-xs text-slate-400">Documenten beschikbaar om te raadplegen</p>
          </CardContent>
        </Card>

        {/* Veelgestelde vragen */}
        <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-green-400" />
              Veelgestelde contractvragen
            </CardTitle>
            <CardDescription className="text-slate-400">
              Vragen die het vaakst worden gesteld over de contracten
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.frequentQuestions.length === 0 ? (
              <p className="text-slate-500">Nog geen vragen gesteld. Vragen verschijnen hier zodra gebruikers chatten.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {data.frequentQuestions.map((q, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 text-sm font-semibold text-green-400">
                        {index + 1}
                      </div>
                      <p className="text-white text-sm line-clamp-2">{q.query}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 ml-2 shrink-0">
                      {q.count}x
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Twee kolommen: Meest geraadpleegde paragrafen + Verdeling contracttypes */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                Meest geraadpleegde contractonderdelen
              </CardTitle>
              <CardDescription className="text-slate-400">
                Onderdelen waar het vaakst vragen over worden gesteld
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.uavParagraphs} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis type="number" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis
                      type="category"
                      dataKey="paragraph"
                      stroke="#64748b"
                      tick={{ fill: "#64748b", fontSize: 10 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                      formatter={(value, _name, props) => [
                        `${value ?? 0} vragen`,
                        (props?.payload as { description?: string })?.description ?? "",
                      ]}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" />
                Vragen per contracttype
              </CardTitle>
              <CardDescription className="text-slate-400">
                Verdeling van vragen over type contract/voorwaarden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.contractCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="category"
                    >
                      {data.contractCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                        color: "#f8fafc",
                      }}
                      formatter={(value, name) => [`${value ?? 0} vragen`, name]}
                    />
                    <Legend
                      wrapperStyle={{ color: "#94a3b8" }}
                      formatter={(value) => <span style={{ color: "#94a3b8" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Complexe onderwerpen */}
        <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-400" />
              Complexe onderwerpen
            </CardTitle>
            <CardDescription className="text-slate-400">
              Onderwerpen die vaak extra toelichting behoeven
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.complexTopics.length === 0 ? (
              <p className="text-slate-500">Nog geen complexe onderwerpen geïdentificeerd. Deze worden gevuld op basis van vraaganalyse.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.complexTopics.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-white/10 bg-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{t.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {t.complexity}
                      </Badge>
                    </div>
                    {t.description && (
                      <p className="text-sm text-slate-400 mb-2">{t.description}</p>
                    )}
                    <p className="text-xs text-slate-500">{t.questionCount} gerelateerde vragen</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Onduidelijkheden in contracten */}
        <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Onduidelijkheden in contracten
            </CardTitle>
            <CardDescription className="text-slate-400">
              Geïdentificeerde onduidelijke of dubbelzinnige passages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.ambiguities.length === 0 ? (
              <p className="text-slate-500">Geen onduidelijkheden gemeld. Deze kunnen worden toegevoegd bij contractanalyse.</p>
            ) : (
              <div className="space-y-4">
                {data.ambiguities.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-white/10 bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">{a.title}</span>
                      <Badge variant="secondary" className="text-xs">{a.document.title}</Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{a.description}</p>
                    {a.snippet && (
                      <blockquote className="text-sm text-slate-500 border-l-2 border-slate-600 pl-3 italic">
                        {a.snippet}
                      </blockquote>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
