import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    const addenda = await prisma.addendum.findMany({
      where: documentId ? { documentId } : undefined,
      orderBy: [{ decisionDate: "desc" }, { createdAt: "desc" }],
      include: {
        document: {
          select: {
            id: true,
            title: true,
            filename: true,
          },
        },
      },
    });

    const transformed = addenda.map((a) => ({
      id: a.id,
      documentId: a.documentId,
      title: a.title,
      description: a.description,
      decisionDate: a.decisionDate?.toISOString() ?? null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
      document: a.document,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching addenda:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen addenda" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, title, description, decisionDate } = body;

    if (!documentId || !title || !description) {
      return NextResponse.json(
        { error: "documentId, title en description zijn verplicht" },
        { status: 400 }
      );
    }

    const addendum = await prisma.addendum.create({
      data: {
        documentId,
        title: String(title).trim(),
        description: String(description).trim(),
        decisionDate: decisionDate ? new Date(decisionDate) : null,
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            filename: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: addendum.id,
      documentId: addendum.documentId,
      title: addendum.title,
      description: addendum.description,
      decisionDate: addendum.decisionDate?.toISOString() ?? null,
      createdAt: addendum.createdAt.toISOString(),
      updatedAt: addendum.updatedAt.toISOString(),
      document: addendum.document,
    });
  } catch (error) {
    console.error("Error creating addendum:", error);
    return NextResponse.json(
      { error: "Fout bij aanmaken addendum" },
      { status: 500 }
    );
  }
}
