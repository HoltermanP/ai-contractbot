import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const module_ = await prisma.eLearningModule.findFirst({
      where: { id, isActive: true },
      include: {
        document: {
          select: { id: true, title: true, filename: true },
        },
        addendum: {
          select: { id: true, title: true, documentId: true },
        },
      },
    });

    if (!module_) {
      return NextResponse.json(
        { error: "E-learning module niet gevonden" },
        { status: 404 }
      );
    }

    const content = JSON.parse(module_.contentJson) as { sections: unknown[]; quiz: unknown[] };

    return NextResponse.json({
      id: module_.id,
      type: module_.type,
      title: module_.title,
      description: module_.description,
      paragraph: module_.paragraph ?? module_.type,
      duration: module_.duration,
      xpReward: module_.xpReward,
      sortOrder: module_.sortOrder,
      content,
      documentId: module_.documentId ?? undefined,
      addendumId: module_.addendumId ?? undefined,
      document: module_.document ?? undefined,
      addendum: module_.addendum ?? undefined,
      createdAt: module_.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching learning lesson:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen e-learning module" },
      { status: 500 }
    );
  }
}
