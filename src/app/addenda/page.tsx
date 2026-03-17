"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Calendar,
  Search,
  ScrollText,
  Pencil,
  Trash2,
  FileStack,
  GraduationCap,
} from "lucide-react";

interface DocumentOption {
  id: string;
  title: string;
  filename: string;
}

interface AddendumItem {
  id: string;
  documentId: string;
  title: string;
  description: string;
  decisionDate: string | null;
  createdAt: string;
  document: {
    id: string;
    title: string;
    filename: string;
  };
}

export default function AddendaPage() {
  const [addenda, setAddenda] = useState<AddendumItem[]>([]);
  const [documents, setDocuments] = useState<DocumentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDocumentId, setFilterDocumentId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDocumentId, setFormDocumentId] = useState("");
  const [formDecisionDate, setFormDecisionDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const fetchAddenda = useCallback(async () => {
    try {
      const url =
        filterDocumentId && filterDocumentId !== "all"
          ? `/api/addenda?documentId=${encodeURIComponent(filterDocumentId)}`
          : "/api/addenda";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAddenda(data);
      }
    } catch (e) {
      console.error("Error fetching addenda:", e);
    } finally {
      setLoading(false);
    }
  }, [filterDocumentId]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (e) {
      console.error("Error fetching documents:", e);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAddenda();
  }, [fetchAddenda]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleGenerateELearning = async (addendumId: string) => {
    setGeneratingId(addendumId);
    try {
      const res = await fetch("/api/learning/lessons/generate-from-addendum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addendumId }),
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

  const openCreateDialog = () => {
    setEditId(null);
    setFormTitle("");
    setFormDescription("");
    setFormDocumentId(documents[0]?.id ?? "");
    setFormDecisionDate("");
    setDialogOpen(true);
  };

  const openEditDialog = (item: AddendumItem) => {
    setEditId(item.id);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormDocumentId(item.documentId);
    setFormDecisionDate(item.decisionDate ? item.decisionDate.slice(0, 10) : "");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;
    setSubmitting(true);
    try {
      if (editId) {
        const res = await fetch(`/api/addenda/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDescription.trim(),
            decisionDate: formDecisionDate || null,
          }),
        });
        if (res.ok) {
          setDialogOpen(false);
          fetchAddenda();
        } else {
          const err = await res.json();
          alert(err.error || "Bijwerken mislukt");
        }
      } else {
        if (!formDocumentId) {
          alert("Selecteer een contract.");
          setSubmitting(false);
          return;
        }
        const res = await fetch("/api/addenda", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: formDocumentId,
            title: formTitle.trim(),
            description: formDescription.trim(),
            decisionDate: formDecisionDate || null,
          }),
        });
        if (res.ok) {
          setDialogOpen(false);
          fetchAddenda();
        } else {
          const err = await res.json();
          alert(err.error || "Aanmaken mislukt");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Er ging iets mis.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit addendum wilt verwijderen?")) return;
    try {
      const res = await fetch(`/api/addenda/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAddenda();
      } else {
        const err = await res.json();
        alert(err.error || "Verwijderen mislukt");
      }
    } catch (e) {
      console.error(e);
      alert("Er ging iets mis.");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredAddenda = addenda.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.document.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Addenda</h1>
            <p className="text-slate-400">
              Aanvullende afspraken en besluiten bij contracten. Voeg addendum-items toe en vind ze hier terug.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Addendum toevoegen
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 bg-card text-white sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editId ? "Addendum bewerken" : "Nieuw addendum"}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {editId
                    ? "Pas de gegevens van dit addendum-item aan."
                    : "Voeg een aanvullende afspraak of besluit toe aan een contract."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editId && (
                  <div className="space-y-2">
                    <Label htmlFor="document">Contract</Label>
                    <Select
                      value={formDocumentId}
                      onValueChange={setFormDocumentId}
                      required={!editId}
                    >
                      <SelectTrigger
                        id="document"
                        className="bg-white/5 border-white/10 text-white"
                      >
                        <SelectValue placeholder="Kies een contract" />
                      </SelectTrigger>
                      <SelectContent>
                        {documents.map((doc) => (
                          <SelectItem
                            key={doc.id}
                            value={doc.id}
                            className="text-white focus:bg-white/10"
                          >
                            {doc.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="title">Titel / korte omschrijving</Label>
                  <Input
                    id="title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Bijv. Aanpassing betalingstermijn"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Toelichting / afspraak</Label>
                  <Textarea
                    id="description"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Volledige tekst van de aanvullende afspraak of het besluit..."
                    rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-400 resize-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decisionDate">Datum besluit (optioneel)</Label>
                  <Input
                    id="decisionDate"
                    type="date"
                    value={formDecisionDate}
                    onChange={(e) => setFormDecisionDate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Annuleren
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  >
                    {submitting ? "Bezig..." : editId ? "Opslaan" : "Toevoegen"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Zoek in addenda..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                />
              </div>
              <Select
                value={filterDocumentId}
                onValueChange={setFilterDocumentId}
              >
                <SelectTrigger className="w-full sm:w-[240px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Filter op contract" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-white focus:bg-white/10">
                    Alle contracten
                  </SelectItem>
                  {documents.map((doc) => (
                    <SelectItem
                      key={doc.id}
                      value={doc.id}
                      className="text-white focus:bg-white/10"
                    >
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center min-h-[300px] text-slate-400">
            Addenda laden...
          </div>
        ) : filteredAddenda.length === 0 ? (
          <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="text-center">
                <ScrollText className="h-16 w-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchTerm || filterDocumentId !== "all"
                    ? "Geen addenda gevonden"
                    : "Nog geen addenda"}
                </h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm || filterDocumentId !== "all"
                    ? "Pas je zoekterm of filter aan."
                    : "Voeg je eerste aanvullende afspraak of besluit toe aan een contract."}
                </p>
                {!searchTerm && filterDocumentId === "all" && (
                  <Button
                    onClick={() => {
                      openCreateDialog();
                      setDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Addendum toevoegen
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAddenda.map((item) => (
              <Card
                key={item.id}
                className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm hover:border-blue-500/20 transition-colors"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 text-xs font-normal"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {item.document.title}
                        </Badge>
                        {item.decisionDate && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.decisionDate)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-white text-lg">
                        {item.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400"
                        onClick={() => handleGenerateELearning(item.id)}
                        disabled={generatingId === item.id}
                        title="E-learning genereren"
                      >
                        <GraduationCap className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={() => openEditDialog(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-4">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-white/10 text-sm text-slate-400">
          <div>
            {filteredAddenda.length} van {addenda.length} addendum-items
            {filterDocumentId !== "all" && " (gefilterd)"}
          </div>
          <div className="flex items-center gap-2">
            <FileStack className="h-4 w-4" />
            <span>Addenda zijn gekoppeld aan contractdocumenten</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
