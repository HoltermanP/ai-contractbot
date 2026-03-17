import OpenAI from "openai";
import { getDocumentWithContent, searchDocuments } from "./documents";

/** E-learning module content (sections + quiz) zoals opgeslagen in ELearningModule.contentJson */
export interface ELearningContentJson {
  sections: Array<{
    title: string;
    content: string;
    keyPoints: string[];
    examples?: Array<{
      title: string;
      scenario: string;
      solution: string;
      calculation?: string;
    }>;
  }>;
  quiz: Array<{
    question: string;
    type: "multiple" | "scenario" | "calculation";
    options: string[];
    correct: number;
    explanation: string;
    scenario?: string;
  }>;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Haalt relevante documenten op voor een vraag
 */
async function getRelevantDocuments(query: string, limit: number = 3) {
  const documents = await searchDocuments(query);
  return documents.slice(0, limit);
}

/**
 * Genereert een antwoord op basis van de vraag en relevante documenten
 */
export async function generateAnswer(
  question: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<{ answer: string; sources: string[] }> {
  // Zoek relevante documenten
  const relevantDocs = await getRelevantDocuments(question, 3);

  // Bouw context op basis van documenten
  const context = relevantDocs
    .map((doc) => `Document: ${doc.title}\n${doc.content?.substring(0, 2000) || ""}`)
    .join("\n\n---\n\n");

  // System prompt met privacy instructies
  const systemPrompt = `Je bent een contractbot assistent die helpt met vragen over contracten. 
Belangrijke regels:
- Gebruik alleen informatie uit de beschikbare documenten
- Geef geen bedrijfsvertrouwelijke informatie door
- Verwijs naar specifieke documenten wanneer je informatie gebruikt
- Als je het antwoord niet weet, zeg dat duidelijk
- Wees beknopt en duidelijk`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    {
      role: "user",
      content: `Context uit documenten:\n${context}\n\nVraag: ${question}`,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || "Sorry, ik kan geen antwoord genereren.";

    return {
      answer,
      sources: relevantDocs.map((doc) => doc.id),
    };
  } catch (error) {
    console.error("Error generating answer:", error);
    throw new Error("Fout bij het genereren van antwoord");
  }
}

/**
 * Analyseert een geplakte mailwisseling anoniem en geeft advies op basis van de kennis van de contractbot.
 * De inhoud wordt niet aan een conversatie gekoppeld; alleen de analyse wordt teruggegeven.
 */
export async function analyzeMailCase(
  mailContent: string
): Promise<{ answer: string; sources: string[] }> {
  // Zoek relevante documenten op basis van de mailinhoud (eerste ~500 tekens als zoekcontext)
  const searchQuery = mailContent.substring(0, 500).replace(/\s+/g, " ").trim();
  const relevantDocs = await getRelevantDocuments(searchQuery || "contract overeenkomst", 4);

  const context = relevantDocs
    .map((doc) => `Document: ${doc.title}\n${doc.content?.substring(0, 2500) || ""}`)
    .join("\n\n---\n\n");

  const systemPrompt = `Je bent een contractbot assistent. Je krijgt een geplakte mailwisseling (e-mailthread).
Je taak:
1. Analyseer de case anoniem: ga uit van de feiten en de contractuele/ juridische kwestie, niet van namen of persoonsgegevens.
2. Geef een helder advies op basis uitsluitend van de hieronder aangeleverde documentenkennis van de contractbot.
3. Verwijs waar mogelijk naar specifieke documenten.
4. Noem geen namen, e-mailadressen of andere identificerende gegevens uit de mails in je antwoord.
5. Wees beknopt en concreet.`;

  const userContent = `Context uit de kennisbank van de contractbot:\n${context}\n\n---\n\nGeplakte mailwisseling (analyseer anoniem en geef advies):\n\n${mailContent}`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userContent },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.5,
      max_tokens: 1500,
    });

    const answer =
      completion.choices[0]?.message?.content ||
      "Sorry, ik kon geen analyse genereren.";

    return {
      answer,
      sources: relevantDocs.map((doc) => doc.id),
    };
  } catch (error) {
    console.error("Error analyzing mail case:", error);
    throw new Error("Fout bij het analyseren van de mailwisseling");
  }
}

/**
 * Raadpleegt UAV informatie (online)
 * Dit is een placeholder - in productie zou dit een echte API call zijn
 */
export async function consultUAV(query: string): Promise<string> {
  // Placeholder: In productie zou dit een API call naar UAV zijn
  // Voor nu retourneren we een placeholder bericht
  return `UAV informatie voor "${query}" zou hier worden opgehaald. 
In productie wordt dit geïmplementeerd via de UAV API.`;
}

const ELEARNING_JSON_SCHEMA = `
Je antwoord moet één geldig JSON-object zijn, zonder markdown of extra tekst. Structuur:
{
  "sections": [
    {
      "title": "string",
      "content": "string (uitgebreide tekst, meerdere alinea's mogelijk)",
      "keyPoints": ["string", "..."],
      "examples": [
        {
          "title": "string",
          "scenario": "string",
          "solution": "string",
          "calculation": "string (optioneel)"
        }
      ]
    }
  ],
  "quiz": [
    {
      "question": "string",
      "type": "multiple" | "scenario" | "calculation",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "string",
      "scenario": "string (alleen bij type scenario)"
    }
  ]
}
- sections: minimaal 4, liefst 5-6. Elke section: uitgebreide content (flinke diepgang), 4-6 keyPoints, waar relevant 1-2 examples.
- quiz: minimaal 8 vragen, liefst 10-12. Mix van multiple choice, scenario en eventueel calculation. correct is de index (0-based) van het juiste antwoord.
`;

/**
 * Genereert diepgaande e-learning inhoud op basis van een contract (document).
 * Gebruikt de geëxtraheerde tekst van het document voor secties en quizvragen.
 */
export async function generateELearningFromContract(
  documentTitle: string,
  documentContent: string
): Promise<ELearningContentJson> {
  const truncated = documentContent.slice(0, 28000);
  const systemPrompt = `Je bent een expert in contracten en e-learning. Je maakt een uitgebreide, diepgaande e-learning module op basis van het gegeven contract.
Eisen:
- Flinke diepgang: behandel de belangrijkste bepalingen, rechten/plichten, termijnen, aansprakelijkheid, betaling, geschillen.
- Praktische voorbeelden en scenario's waar mogelijk.
- Geef alleen geldig JSON terug, geen uitleg ervoor of erna.${ELEARNING_JSON_SCHEMA}`;

  const userContent = `Contracttitel: ${documentTitle}\n\nContracttekst (extract):\n\n${truncated}\n\nGenereer de e-learning module als één JSON-object.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.5,
    max_tokens: 4000,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "{}";
  const jsonStr = raw.replace(/^```json?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  try {
    return JSON.parse(jsonStr) as ELearningContentJson;
  } catch {
    throw new Error("E-learning content kon niet worden geparsed. Probeer opnieuw.");
  }
}

/**
 * Genereert diepgaande e-learning inhoud op basis van één of meerdere addenda.
 */
export async function generateELearningFromAddendum(
  addenda: Array<{ title: string; description: string; decisionDate?: string | null; documentTitle?: string }>
): Promise<ELearningContentJson> {
  const context = addenda
    .map(
      (a, i) =>
        `Addendum ${i + 1}: ${a.title}\nDocument: ${a.documentTitle ?? "—"}\nDatum: ${a.decisionDate ?? "—"}\nBeschrijving:\n${a.description}`
    )
    .join("\n\n---\n\n");

  const systemPrompt = `Je bent een expert in contracten en addenda. Je maakt een uitgebreide, diepgaande e-learning module over de gegeven addenda (aanvullingen/besluiten op contracten).
Eisen:
- Leg uit wat addenda zijn en hoe ze zich verhouden tot het hoofdcontract.
- Behandel elke toevoeging/aanvulling met diepgang: wat betekent het, welke gevolgen, praktische voorbeelden.
- Flinke diepgang: juridische en praktische aspecten, communicatie met opdrachtgever, documentatie.
- Geef alleen geldig JSON terug.${ELEARNING_JSON_SCHEMA}`;

  const userContent = `Addenda:\n\n${context}\n\nGenereer de e-learning module als één JSON-object.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.5,
    max_tokens: 4000,
  });

  const raw = completion.choices[0]?.message?.content?.trim() || "{}";
  const jsonStr = raw.replace(/^```json?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  try {
    return JSON.parse(jsonStr) as ELearningContentJson;
  } catch {
    throw new Error("E-learning content kon niet worden geparsed. Probeer opnieuw.");
  }
}

