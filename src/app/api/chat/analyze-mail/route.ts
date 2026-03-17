import { NextRequest, NextResponse } from "next/server";
import { analyzeMailCase } from "@/lib/ai";

/**
 * POST /api/chat/analyze-mail
 * Ontvangt geplakte mailwisseling als tekst, analyseert de case anoniem
 * en geeft advies op basis van de kennis van de contractbot.
 * Er wordt geen conversatie of mailinhoud opgeslagen.
 */
export async function POST(request: NextRequest) {
  try {
    const { mailContent } = await request.json();

    if (!mailContent || typeof mailContent !== "string") {
      return NextResponse.json(
        { error: "Mailwisseling (mailContent) is verplicht en moet tekst zijn" },
        { status: 400 }
      );
    }

    const trimmed = mailContent.trim();
    if (trimmed.length < 50) {
      return NextResponse.json(
        { error: "Plak minimaal een korte mailwisseling (ongeveer 50 tekens)" },
        { status: 400 }
      );
    }

    const { answer, sources } = await analyzeMailCase(trimmed);

    return NextResponse.json({
      answer,
      sources,
    });
  } catch (error) {
    console.error("Error in analyze-mail:", error);
    return NextResponse.json(
      { error: "Fout bij het analyseren van de mailwisseling" },
      { status: 500 }
    );
  }
}
