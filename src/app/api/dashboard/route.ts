import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const userId = "demo-user";
    const userRole = "ADMIN";

    // Contentinzichten voor de begrijker (geen gebruikersmetrics)
    const [userMessages, ambiguities, topics, recentConversations, recentDocuments, documentCount] = await Promise.all([
      // Alle gebruikersvragen (role USER) voor veelgestelde vragen
      prisma.message.findMany({
        where: { role: "USER" },
        select: { content: true },
      }),
      // Onduidelijkheden in contracten
      prisma.documentAmbiguity.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          document: { select: { id: true, title: true } },
        },
      }),
      // Complexe onderwerpen
      prisma.contractTopic.findMany({
        orderBy: { questionCount: "desc" },
        take: 10,
      }),
      // Recente conversaties (functioneel: verder lezen)
      prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      // Recente documenten (functioneel: contracten raadplegen)
      userRole === "ADMIN"
        ? prisma.document.findMany({
            where: { isActive: true },
            orderBy: { uploadedAt: "desc" },
            take: 5,
            include: {
              user: { select: { name: true, email: true } },
            },
          })
        : prisma.document.findMany({
            where: { isActive: true },
            orderBy: { uploadedAt: "desc" },
            take: 5,
          }),
      prisma.document.count({ where: { isActive: true } }),
    ]);

    // Veelgestelde vragen: groepeer identieke vragen en sorteer op frequentie
    const questionCounts = new Map<string, number>();
    for (const m of userMessages) {
      const trimmed = m.content.trim();
      if (trimmed.length > 0) {
        questionCounts.set(trimmed, (questionCounts.get(trimmed) ?? 0) + 1);
      }
    }
    const frequentQuestions = Array.from(questionCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({
      // Inzichten voor de begrijker
      frequentQuestions,
      ambiguities: ambiguities.map((a: { id: string; title: string; description: string; snippet: string | null; document: { id: string; title: string }; createdAt: Date }) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        snippet: a.snippet,
        document: a.document,
        createdAt: a.createdAt,
      })),
      complexTopics: topics.map((t: { id: string; name: string; description: string | null; complexity: string; questionCount: number }) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        complexity: t.complexity,
        questionCount: t.questionCount,
      })),
      // Functioneel: contracten in bibliotheek
      documentCount,
      recentConversations,
      recentDocuments,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen dashboard gegevens" },
      { status: 500 }
    );
  }
}
