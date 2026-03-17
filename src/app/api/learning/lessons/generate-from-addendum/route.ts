import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateELearningFromAddendum } from "@/lib/ai";

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
    const addendumId = body?.addendumId as string | undefined;
    const addendumIds = body?.addendumIds as string[] | undefined;

    const ids: string[] = addendumIds?.length
      ? addendumIds
      : addendumId
        ? [addendumId]
        : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "addendumId of addendumIds (array) is verplicht" },
        { status: 400 }
      );
    }

    const addenda = await prisma.addendum.findMany({
      where: { id: { in: ids } },
      include: {
        document: {
          select: { id: true, title: true },
        },
      },
    });

    if (addenda.length === 0) {
      return NextResponse.json(
        { error: "Geen addenda gevonden voor de opgegeven id(s)" },
        { status: 404 }
      );
    }

    const input = addenda.map((a) => ({
      title: a.title,
      description: a.description,
      decisionDate: a.decisionDate?.toISOString() ?? null,
      documentTitle: a.document?.title,
    }));

    const generated = await generateELearningFromAddendum(input);

    const maxSort = await prisma.eLearningModule.aggregate({
      _max: { sortOrder: true },
      where: { isActive: true },
    });
    const nextSort = (maxSort._max.sortOrder ?? 0) + 1;

    const title =
      addenda.length === 1
        ? `E-learning: Addendum – ${addenda[0].title}`
        : `E-learning: Addenda (${addenda.length} items)`;
    const description =
      addenda.length === 1
        ? `Diepgaande e-learning over het addendum "${addenda[0].title}".`
        : `Diepgaande e-learning over ${addenda.length} addenda.`;

    const created = await prisma.eLearningModule.create({
      data: {
        type: "ADDENDUM",
        title,
        description,
        paragraph: "Addendum",
        duration: Math.min(45, Math.max(15, generated.sections.length * 6)),
        xpReward: 120,
        sortOrder: nextSort,
        contentJson: JSON.stringify(generated),
        addendumId: addenda.length === 1 ? addenda[0].id : null,
        documentId: addenda.length === 1 ? addenda[0].documentId : null,
        isActive: true,
      },
      include: {
        addendum: {
          select: { id: true, title: true, documentId: true },
        },
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
      addendumId: created.addendumId,
      documentId: created.documentId,
      addendum: created.addendum ?? undefined,
      document: created.document ?? undefined,
      createdAt: created.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error generating e-learning from addendum:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Fout bij genereren e-learning uit addendum",
      },
      { status: 500 }
    );
  }
}
