import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Geen auth check meer - altijd toegestaan

    const documents = await prisma.document.findMany({
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
        mimeType: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Transform documents to include type
    const transformedDocuments = documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      filename: doc.filename,
      uploadedAt: doc.uploadedAt.toISOString(),
      fileSize: doc.fileSize,
      type: (doc.mimeType?.split("/")[1] ?? "file").toUpperCase(),
      user: doc.user,
    }));

    return NextResponse.json(transformedDocuments);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen documenten" },
      { status: 500 }
    );
  }
}

