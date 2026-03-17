import { prisma } from "./prisma";
import pdfParse from "pdf-parse";
import fs from "fs/promises";
import path from "path";
import {
  createEmbedding,
  createEmbeddings,
  chunkText,
  cosineSimilarity,
} from "./embeddings";

export interface DocumentUpload {
  title: string;
  filename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
}

/**
 * Extraheert tekst uit een PDF (buffer of lokaal bestandspad).
 * In productie wordt de buffer uit de upload gebruikt; lokaal kan ook een pad worden doorgegeven.
 */
export async function extractTextFromPDF(
  input: Buffer | string
): Promise<string> {
  try {
    const dataBuffer =
      typeof input === "string" ? await fs.readFile(input) : input;
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
}

/**
 * Slaat een document op in de database
 */
export async function saveDocument(
  upload: DocumentUpload,
  content?: string
): Promise<string> {
  const document = await prisma.document.create({
    data: {
      title: upload.title,
      filename: upload.filename,
      filePath: upload.filePath,
      fileSize: upload.fileSize,
      mimeType: upload.mimeType,
      uploadedBy: upload.uploadedBy,
      content: content || null,
    },
  });

  return document.id;
}

/**
 * Haalt alle actieve documenten op
 */
export async function getActiveDocuments() {
  return prisma.document.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      uploadedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      filename: true,
      uploadedAt: true,
      fileSize: true,
    },
  });
}

/**
 * Haalt een document op met content
 */
export async function getDocumentWithContent(documentId: string) {
  return prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });
}

/** Resultaattype voor documentzoekopdrachten */
export type DocumentSearchResult = {
  id: string;
  title: string;
  content: string | null;
};

/**
 * Indexeert de content van een document in chunks met embeddings (OpenAI).
 * Wordt na upload aangeroepen zodat semantisch zoeken mogelijk is.
 */
export async function indexDocumentChunks(
  documentId: string,
  content: string
): Promise<void> {
  if (!content?.trim()) return;

  const chunks = chunkText(content);
  if (chunks.length === 0) return;

  const embeddings = await createEmbeddings(chunks);

  await prisma.documentChunk.deleteMany({ where: { documentId } });

  await prisma.documentChunk.createMany({
    data: chunks.map((content, chunkIndex) => ({
      documentId,
      chunkIndex,
      content,
      embedding: JSON.stringify(embeddings[chunkIndex] ?? []),
    })),
  });
}

/**
 * Zoekt in documenten met AI (semantisch): interpreteert de vraag en vindt
 * relevante documenten op betekenis. Valt terug op trefwoord-zoeken als er
 * geen embeddings zijn of de API faalt.
 */
export async function searchDocuments(
  query: string
): Promise<DocumentSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    const allDocs = await prisma.document.findMany({
      where: { isActive: true, content: { not: null } },
      select: { id: true, title: true, content: true },
      orderBy: { uploadedAt: "desc" },
      take: 5,
    });
    return allDocs;
  }

  try {
    const chunkCount = await prisma.documentChunk.count({
      where: {
        document: { isActive: true },
      },
    });
    if (chunkCount === 0) return keywordSearch(trimmed);

    const queryEmbedding = await createEmbedding(trimmed);

    const chunks = await prisma.documentChunk.findMany({
      where: { document: { isActive: true } },
      select: { id: true, documentId: true, embedding: true },
    });

    const scored = chunks.map((c) => ({
      documentId: c.documentId,
      score: cosineSimilarity(
        queryEmbedding,
        JSON.parse(c.embedding) as number[]
      ),
    }));

    scored.sort((a, b) => b.score - a.score);

    const seen = new Set<string>();
    const topDocumentIds: string[] = [];
    for (const { documentId } of scored) {
      if (seen.has(documentId)) continue;
      seen.add(documentId);
      topDocumentIds.push(documentId);
      if (topDocumentIds.length >= 10) break;
    }

    if (topDocumentIds.length === 0) return keywordSearch(trimmed);

    const documents = await prisma.document.findMany({
      where: {
        id: { in: topDocumentIds },
        isActive: true,
        content: { not: null },
      },
      select: { id: true, title: true, content: true },
    });

    const order = new Map(topDocumentIds.map((id, i) => [id, i]));
    documents.sort((a, b) => (order.get(a.id) ?? 99) - (order.get(b.id) ?? 99));
    return documents;
  } catch (err) {
    console.error("Semantisch zoeken mislukt, val terug op trefwoorden:", err);
    return keywordSearch(trimmed);
  }
}

/**
 * Letterlijke zoekfunctie op trefwoorden (fallback als er geen embeddings zijn).
 */
function keywordSearch(query: string): Promise<DocumentSearchResult[]> {
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const found = new Map<string, DocumentSearchResult>();

  return (async () => {
    for (const keyword of keywords) {
      const results = await prisma.document.findMany({
        where: {
          isActive: true,
          content: { not: null, contains: keyword },
        },
        select: { id: true, title: true, content: true },
      });
      for (const doc of results) {
        if (!found.has(doc.id)) found.set(doc.id, doc);
      }
    }

    if (found.size === 0) {
      const allDocs = await prisma.document.findMany({
        where: { isActive: true, content: { not: null } },
        select: { id: true, title: true, content: true },
        orderBy: { uploadedAt: "desc" },
        take: 5,
      });
      return allDocs;
    }

    return Array.from(found.values());
  })();
}

