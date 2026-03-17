"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Filter,
  Upload,
  Download,
  Eye,
  Calendar,
  User,
  FileType,
  Plus,
  Grid,
  List,
  MoreHorizontal,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
// import { useSession } from "next-auth/react"; // Uitgeschakeld

interface Document {
  id: string;
  title: string;
  filename: string;
  uploadedAt: string;
  fileSize: number;
  type: string;
  user?: {
    name: string | null;
    email: string;
  };
}

export default function DocumentsPage() {
  // Mock session data
  const session = {
    user: {
      role: "ADMIN"
    }
  };
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/documents");
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateELearning = async (documentId: string) => {
    setGeneratingId(documentId);
    try {
      const res = await fetch("/api/learning/lessons/generate-from-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId }),
      });
      if (res.ok) {
        window.location.href = "/learning";
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Genereren mislukt. Log in en probeer opnieuw.");
      }
    } catch (e) {
      console.error(e);
      alert("Fout bij genereren e-learning.");
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-slate-400">Documenten laden...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Documenten</h1>
            <p className="text-slate-400">
              Beheer je contractdocumenten en upload nieuwe bestanden
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            {session?.user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </Link>
            )}

            <div className="flex items-center border border-white/10 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Zoek documenten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents Grid/List */}
        {filteredDocuments.length === 0 ? (
          <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm ? "Geen documenten gevonden" : "Nog geen documenten"}
                </h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm
                    ? "Probeer een andere zoekterm"
                    : "Upload je eerste contractdocument om te beginnen"
                  }
                </p>
                {session?.user?.role === "ADMIN" && !searchTerm && (
                  <Link href="/admin">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDocuments.map((document) => (
              <Card
                key={document.id}
                className="group hover:shadow-2xl transition-all duration-300 border-white/10 hover:border-blue-500/30 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm hover:scale-105 cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                      <FileText className="h-6 w-6 text-blue-400" />
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-white text-lg leading-tight line-clamp-2">
                    {document.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm line-clamp-1">
                    {document.filename}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-slate-400">
                        <FileType className="h-3 w-3" />
                        <span className="uppercase text-xs">{document.type}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                        {formatFileSize(document.fileSize)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(document.uploadedAt)}
                      </div>
                      {document.user && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="truncate max-w-20">
                            {document.user.name || document.user.email}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        onClick={(e) => { e.stopPropagation(); handleGenerateELearning(document.id); }}
                        disabled={generatingId === document.id}
                      >
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {generatingId === document.id ? "Bezig..." : "E-learning"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                        <Eye className="h-3 w-3 mr-1" />
                        Bekijken
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-white/10">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{document.title}</h3>
                      <p className="text-sm text-slate-400 truncate">{document.filename}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-4 text-sm text-slate-400">
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                        {document.type.toUpperCase()}
                      </Badge>
                      <span>{formatFileSize(document.fileSize)}</span>
                      <span>{formatDate(document.uploadedAt)}</span>
                      {document.user && (
                        <span className="truncate max-w-24">
                          {document.user.name || document.user.email}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-white/10">
          <div className="text-sm text-slate-400">
            {filteredDocuments.length} van {documents.length} documenten weergegeven
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-slate-400">Actief</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <span className="text-slate-400">Verwerkt</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
