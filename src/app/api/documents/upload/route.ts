import { NextRequest, NextResponse } from "next/server";
import {
  saveDocument,
  extractTextFromPDF,
  indexDocumentChunks,
} from "@/lib/documents";
import { storeFile } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Authenticatie uitgeschakeld voor testen
    // Zorg dat test user bestaat
    let testUser = await prisma.user.findUnique({
      where: { email: "test@contractbot.nl" },
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: "test@contractbot.nl",
          name: "Test User",
          role: "ADMIN",
        },
      });
    }

    const mockUserId = testUser.id;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: "Bestand en titel zijn verplicht" },
        { status: 400 }
      );
    }

    // Valideer bestandstype
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Alleen PDF bestanden zijn toegestaan" },
        { status: 400 }
      );
    }

    // Valideer bestandsgrootte (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Bestand is te groot (max 10MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extraheer eerst tekst uit PDF (uit buffer)
    const content = await extractTextFromPDF(buffer);

    // Sla bestand op: lokaal in uploads/, in productie in Vercel Blob
    const filePath = await storeFile(buffer, file.name);

    // Sla document op in database
    const documentId = await saveDocument(
      {
        title,
        filename: file.name,
        filePath,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: mockUserId,
      },
      content
    );

    // Indexeer voor semantisch zoeken (OpenAI embeddings)
    if (content?.trim()) {
      try {
        await indexDocumentChunks(documentId, content);
      } catch (indexErr) {
        console.error("Indexeren voor semantisch zoeken mislukt:", indexErr);
        // Upload blijft geslaagd; zoeken valt terug op trefwoorden
      }
    }

    return NextResponse.json({
      success: true,
      documentId,
      message: "Document succesvol geüpload",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fout bij uploaden document";
    console.error("Error uploading document:", error);
    const isConfigError = message.includes("BLOB_READ_WRITE_TOKEN");
    return NextResponse.json(
      { error: message },
      { status: isConfigError ? 503 : 500 }
    );
  }
}

