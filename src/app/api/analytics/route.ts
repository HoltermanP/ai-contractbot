import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Alleen contentinzichten voor de begrijker (geen gebruikers- of gebruikersmetrics)

    const [userMessages, ambiguities, topics, documentCount, uavParagraphs, contractCategories] = await Promise.all([
      prisma.message.findMany({
        where: { role: "USER" },
        select: { content: true },
      }),
      prisma.documentAmbiguity.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          document: { select: { id: true, title: true } },
        },
      }),
      prisma.contractTopic.findMany({
        orderBy: { questionCount: "desc" },
      }),
      prisma.document.count({ where: { isActive: true } }),
      // Meest geraadpleegde onderdelen (voorbeelddata tot we koppeling met paragrafen hebben)
      Promise.resolve([
        { paragraph: "§42 - Korting", count: 89, description: "Boeteclausules bij vertraging" },
        { paragraph: "§35 - Meerwerk", count: 76, description: "Verrekening wijzigingen" },
        { paragraph: "§6 - Aansprakelijkheid", count: 64, description: "Schade en verzekering" },
        { paragraph: "§8 - Termijnen", count: 58, description: "Uitvoeringstermijnen" },
        { paragraph: "§9/10 - Oplevering", count: 52, description: "Opleveringsprocedure" },
        { paragraph: "§47 - Overmacht", count: 41, description: "Force majeure" },
        { paragraph: "§12 - Betaling", count: 38, description: "Betalingsvoorwaarden" },
        { paragraph: "§5 - Verplichtingen", count: 35, description: "Verplichtingen aannemer" },
      ]),
      Promise.resolve([
        { category: "UAV 2012", count: 45, percentage: 35 },
        { category: "UAV-GC 2005", count: 28, percentage: 22 },
        { category: "Raamovereenkomsten", count: 32, percentage: 25 },
        { category: "SLA's", count: 15, percentage: 12 },
        { category: "Overige", count: 8, percentage: 6 },
      ]),
    ]);

    const questionCounts = new Map<string, number>();
    for (const m of userMessages) {
      const trimmed = m.content.trim();
      if (trimmed.length > 0) {
        questionCounts.set(trimmed, (questionCounts.get(trimmed) ?? 0) + 1);
      }
    }
    const frequentQuestions = Array.from(questionCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      documentCount,
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
      uavParagraphs,
      contractCategories,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen inzichten" },
      { status: 500 }
    );
  }
}
