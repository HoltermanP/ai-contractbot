import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om voortgang te zien." },
        { status: 401 }
      );
    }

    const progress = await prisma.userLessonProgress.findMany({
      where: { userId: session.user.id },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            type: true,
            xpReward: true,
          },
        },
      },
    });

    const transformed = progress.map((p) => ({
      userId: p.userId,
      moduleId: p.moduleId,
      completed: p.completed,
      completedAt: p.completedAt?.toISOString() ?? null,
      score: p.score,
      xpEarned: p.xpEarned,
      module: p.module,
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Error fetching learning progress:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen voortgang" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om voortgang op te slaan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { moduleId, completed, score, xpEarned } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json(
        { error: "moduleId is verplicht" },
        { status: 400 }
      );
    }

    const module_ = await prisma.eLearningModule.findFirst({
      where: { id: moduleId, isActive: true },
    });
    if (!module_) {
      return NextResponse.json(
        { error: "E-learning module niet gevonden" },
        { status: 404 }
      );
    }

    const progress = await prisma.userLessonProgress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId,
        },
      },
      create: {
        userId: session.user.id,
        moduleId,
        completed: Boolean(completed),
        completedAt: completed ? new Date() : null,
        score: typeof score === "number" ? score : null,
        xpEarned: typeof xpEarned === "number" ? xpEarned : 0,
      },
      update: {
        completed: Boolean(completed),
        completedAt: completed ? new Date() : undefined,
        score: typeof score === "number" ? score : undefined,
        xpEarned: typeof xpEarned === "number" ? xpEarned : undefined,
      },
    });

    return NextResponse.json({
      userId: progress.userId,
      moduleId: progress.moduleId,
      completed: progress.completed,
      completedAt: progress.completedAt?.toISOString() ?? null,
      score: progress.score,
      xpEarned: progress.xpEarned,
    });
  } catch (error) {
    console.error("Error saving learning progress:", error);
    return NextResponse.json(
      { error: "Fout bij opslaan voortgang" },
      { status: 500 }
    );
  }
}
