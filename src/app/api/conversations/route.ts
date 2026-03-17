import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    const conversations = await prisma.conversation.findMany({
      where: {
        userId: testUser.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen conversaties" },
      { status: 500 }
    );
  }
}

