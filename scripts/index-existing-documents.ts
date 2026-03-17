/**
 * Indexeert bestaande documenten met content voor semantisch zoeken (OpenAI embeddings).
 * Run: npm run index-documents (of: npx tsx scripts/index-existing-documents.ts)
 * Vereist: OPENAI_API_KEY in .env
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { prisma } from "../src/lib/prisma";
import { indexDocumentChunks } from "../src/lib/documents";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  const content = readFileSync(path, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

loadEnv();

async function main() {
  const docs = await prisma.document.findMany({
    where: { isActive: true, content: { not: null } },
    select: { id: true, title: true, content: true },
  });

  if (docs.length === 0) {
    console.log("Geen documenten met content gevonden.");
    return;
  }

  console.log(`${docs.length} document(en) om te indexeren...`);

  for (const doc of docs) {
    if (!doc.content?.trim()) continue;
    try {
      await indexDocumentChunks(doc.id, doc.content);
      console.log(`  ✓ ${doc.title}`);
    } catch (err) {
      console.error(`  ✗ ${doc.title}:`, err);
    }
  }

  console.log("Klaar.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
