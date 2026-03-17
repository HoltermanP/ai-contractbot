import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AVG_MODULE_CONTENT, AVG_MODULE_META } from "@/lib/avg-module-content";

/** Zorgt dat de AVG-module in de database staat (eenmalig). */
async function ensureAvgModule() {
  const existing = await prisma.eLearningModule.findFirst({
    where: { type: "AVG", isActive: true },
  });
  if (existing) return existing.id;

  const created = await prisma.eLearningModule.create({
    data: {
      type: "AVG",
      title: AVG_MODULE_META.title,
      description: AVG_MODULE_META.description,
      paragraph: AVG_MODULE_META.paragraph,
      duration: AVG_MODULE_META.duration,
      xpReward: AVG_MODULE_META.xpReward,
      sortOrder: AVG_MODULE_META.sortOrder,
      contentJson: JSON.stringify(AVG_MODULE_CONTENT),
      isActive: true,
    },
  });
  return created.id;
}

export async function GET() {
  try {
    await ensureAvgModule();

    const modules = await prisma.eLearningModule.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      include: {
        document: {
          select: { id: true, title: true, filename: true },
        },
        addendum: {
          select: { id: true, title: true, documentId: true },
        },
      },
    });

    const transformed = modules.map((m) => ({
      id: m.id,
      type: m.type,
      title: m.title,
      description: m.description,
      paragraph: m.paragraph ?? m.type,
      duration: m.duration,
      xpReward: m.xpReward,
      sortOrder: m.sortOrder,
      content: JSON.parse(m.contentJson) as { sections: unknown[]; quiz: unknown[] },
      documentId: m.documentId,
      addendumId: m.addendumId,
      document: m.document ?? undefined,
      addendum: m.addendum ?? undefined,
      createdAt: m.createdAt.toISOString(),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching learning lessons:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen e-learning modules" },
      { status: 500 }
    );
  }
}
