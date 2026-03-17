import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** OpenAI model voor embeddings; geschikt voor semantisch zoeken */
const EMBEDDING_MODEL = "text-embedding-3-small";

/** Maximale chunkgrootte in tekens (~750 tokens); binnen 8191 tokenlimiet van het model */
const CHUNK_SIZE = 3000;
const CHUNK_OVERLAP = 200;

/**
 * Maakt één embedding voor de gegeven tekst via OpenAI API.
 */
export async function createEmbedding(text: string): Promise<number[]> {
  const normalized = text.trim().slice(0, 30000); // ruime limiet per chunk
  if (!normalized) return new Array(1536).fill(0);

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: normalized,
    encoding_format: "float",
  });
  const embedding = response.data[0]?.embedding;
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error("Geen embedding ontvangen van OpenAI");
  }
  return embedding;
}

/**
 * Maakt embeddings voor meerdere teksten in één API-call (efficiënter).
 */
export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const normalized = texts.map((t) => t.trim().slice(0, 30000)).filter(Boolean);
  if (normalized.length === 0) return [];

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: normalized,
    encoding_format: "float",
  });
  const sorted = [...response.data].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return sorted.map((d) => d.embedding ?? []);
}

/**
 * Splitst lange tekst in overlappende chunks voor embedding.
 */
export function chunkText(
  text: string,
  chunkSize: number = CHUNK_SIZE,
  overlap: number = CHUNK_OVERLAP
): string[] {
  const chunks: string[] = [];
  let start = 0;
  const step = chunkSize - overlap;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 0) chunks.push(chunk);
    if (end >= text.length) break;
    start += step;
  }

  return chunks.length > 0 ? chunks : [text.trim() || ""];
}

/**
 * Cosinus-similariteit tussen twee vectoren (0 = geen overeenkomst, 1 = identiek).
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
