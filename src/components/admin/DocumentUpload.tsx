"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setMessage({ type: "error", text: "Alleen PDF bestanden zijn toegestaan" });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage({ type: "error", text: "Bestand is te groot (max 10MB)" });
        return;
      }
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(".pdf", ""));
      }
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setMessage({ type: "error", text: "Vul alle velden in" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Upload mislukt";
        try {
          const errorBody = await response.json();
          errorMessage = errorBody?.error ?? errorMessage;
        } catch {
          errorMessage = `${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setMessage({ type: "success", text: "Document succesvol geüpload!" });
      setFile(null);
      setTitle("");
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Fout bij uploaden" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>
          Upload een PDF contractdocument dat gebruikt kan worden voor vragen
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Bijv. Algemeen Contract 2024"
            disabled={isUploading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-input">PDF Bestand</Label>
          <Input
            id="file-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Geselecteerd: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button onClick={handleUpload} disabled={isUploading || !file || !title.trim()}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploaden...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

