import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDocumentWithContent } from "@/lib/documents";
import { generateELearningFromContract } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om een e-learning te genereren." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const documentId = body?.documentId;
    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json(
        { error: "documentId is verplicht" },
        { status: 400 }
      );
    }

    const doc = await getDocumentWithContent(documentId);
    if (!doc) {
      return NextResponse.json(
        { error: "Document niet gevonden" },
        { status: 404 }
      );
    }

    const content = doc.content?.trim();
    if (!content || content.length < 100) {
      return NextResponse.json(
        { error: "Document heeft te weinig tekst om een e-learning van te genereren. Zorg dat de PDF tekst bevat." },
        { status: 400 }
      );
    }

    const generated = await generateELearningFromContract(doc.title, content);

    const maxSort = await prisma.eLearningModule.aggregate({
      _max: { sortOrder: true },
      where: { isActive: true },
    });
    const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

    const created = await prisma.eLearningModule.create({
      data: {
        type: "CONTRACT",
        title: `E-learning: ${doc.title}`,
        description: `Diepgaande e-learning op basis van het contract "${doc.title}".`,
        paragraph: "Contract",
        duration: Math.min(60, Math.max(20, generated.sections.length * 8)),
        xpReward: 150,
        sortOrder: nextSort,
        contentJson: JSON.stringify(generated),
        documentId: doc.id,
        isActive: true,
      },
      include: {
        document: {
          select: { id: true, title: true, filename: true },
        },
      },
    });

    return NextResponse.json({
      id: created.id,
      type: created.type,
      title: created.title,
      description: created.description,
      paragraph: created.paragraph,
      duration: created.duration,
      xpReward: created.xpReward,
      content: generated,
      documentId: created.documentId,
      document: created.document,
      createdAt: created.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error generating e-learning from contract:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Fout bij genereren e-learning uit contract",
      },
      { status: 500 }
    );
  }
}
