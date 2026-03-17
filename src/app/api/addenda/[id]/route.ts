import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const addendum = await prisma.addendum.findUnique({
      where: { id },
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

    if (!addendum) {
      return NextResponse.json(
        { error: "Addendum niet gevonden" },
        { status: 404 }
      );
    }

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
    console.error("Error fetching addendum:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen addendum" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, decisionDate } = body;

    const updateData: {
      title?: string;
      description?: string;
      decisionDate?: Date | null;
    } = {};
    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (decisionDate !== undefined) {
      updateData.decisionDate = decisionDate ? new Date(decisionDate) : null;
    }

    const addendum = await prisma.addendum.update({
      where: { id },
      data: updateData,
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
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json(
        { error: "Addendum niet gevonden" },
        { status: 404 }
      );
    }
    console.error("Error updating addendum:", error);
    return NextResponse.json(
      { error: "Fout bij bijwerken addendum" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.addendum.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as { code?: string })?.code === "P2025") {
      return NextResponse.json(
        { error: "Addendum niet gevonden" },
        { status: 404 }
      );
    }
    console.error("Error deleting addendum:", error);
    return NextResponse.json(
      { error: "Fout bij verwijderen addendum" },
      { status: 500 }
    );
  }
}
