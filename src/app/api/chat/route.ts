import { NextRequest, NextResponse } from "next/server";
import { generateAnswer, consultUAV } from "@/lib/ai";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Authenticatie uitgeschakeld voor testen
    // Zorg dat test user bestaat
    let testUser = await prisma.user.findUnique({
      where: { email: "test@contractbot.nl" },
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          email: "test@contractbot.nl",
          name: "Test User",
          role: "ADMIN",
        },
      });
    }

    const mockUserId = testUser.id;

    const { message, conversationId, useUAV } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Bericht is verplicht" },
        { status: 400 }
      );
    }

    // Haal conversatie geschiedenis op
    let conversation = null;
    let conversationHistory: Array<{ role: string; content: string }> = [];

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            take: 10, // Laatste 10 berichten voor context
          },
        },
      });

      if (conversation) {
        conversationHistory = conversation.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));
      }
    }

    // Maak of update conversatie
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId: mockUserId,
          title: message.substring(0, 50),
        },
      });
    }

    // Sla gebruikersbericht op
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: message,
      },
    });

    // Genereer antwoord
    let answer: string;
    let sources: string[] = [];

    if (useUAV) {
      // Raadpleeg UAV indien nodig
      answer = await consultUAV(message);
    } else {
      // Gebruik documenten voor antwoord
      const result = await generateAnswer(message, conversationHistory);
      answer = result.answer;
      sources = result.sources;
    }

    // Sla assistent antwoord op
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: answer,
        sources: sources.length > 0 ? JSON.stringify(sources) : null,
      },
    });

    // Update conversatie timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      answer,
      sources,
      conversationId: conversation.id,
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Fout bij verwerken van bericht" },
      { status: 500 }
    );
  }
}

