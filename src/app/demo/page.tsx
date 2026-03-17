"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

interface DemoMessage {
  role: "USER" | "ASSISTANT";
  content: string;
  sources?: number;
}

const demoMessages: DemoMessage[] = [
  {
    role: "ASSISTANT",
    content: "Welkom bij Contractbot! Ik ben je AI-assistent voor contractvragen. Stel gerust een vraag over je contracten.",
  },
  {
    role: "USER",
    content: "Wat zijn de belangrijkste bepalingen in ons arbeidscontract?",
  },
  {
    role: "ASSISTANT",
    content: "Op basis van je arbeidscontract bevat het document de volgende belangrijke bepalingen:\n\n1. **Arbeidsvoorwaarden**: Een proeftijd van 2 maanden, gevolgd door een contract voor onbepaalde tijd.\n2. **Salaris**: Het startsalaris bedraagt €3.500 per maand, met jaarlijkse evaluatie en mogelijke salarisverhoging.\n3. **Werkuren**: 40 uur per week, met flexibele werktijden tussen 08:00 en 18:00.\n4. **Vakantiedagen**: 25 vakantiedagen per jaar, plus 8 ADV-dagen.\n5. **Opzegtermijn**: 1 maand opzegtermijn voor beide partijen na de proeftijd.\n6. **Geheimhouding**: Een geheimhoudingsbeding voor bedrijfsvertrouwelijke informatie.\n\nDeze informatie is gebaseerd op het arbeidscontract dat in het systeem staat.",
    sources: 1,
  },
  {
    role: "USER",
    content: "Wat is de opzegtermijn als ik ontslag wil nemen?",
  },
  {
    role: "ASSISTANT",
    content: "Volgens je arbeidscontract is de opzegtermijn **1 maand** voor beide partijen. Dit betekent dat je minimaal 1 maand van tevoren je ontslag moet indienen.\n\nBelangrijke punten:\n- De opzegtermijn gaat in vanaf de eerste dag van de maand volgend op de dag van opzegging\n- Tijdens de proeftijd (eerste 2 maanden) kan het contract zonder opzegtermijn worden beëindigd\n- Na de proeftijd geldt de standaard opzegtermijn van 1 maand\n\nZorg ervoor dat je je ontslag schriftelijk indient bij je werkgever.",
    sources: 1,
  },
  {
    role: "USER",
    content: "Kan ik mijn contract aanpassen voor meer flexibele werktijden?",
  },
  {
    role: "ASSISTANT",
    content: "Je huidige contract bevat al flexibele werktijden (tussen 08:00 en 18:00). Voor verdere aanpassingen zou je het volgende kunnen overwegen:\n\n1. **Overleg met je werkgever**: Contractwijzigingen moeten in overleg met beide partijen worden doorgevoerd\n2. **Schriftelijke wijziging**: Eventuele wijzigingen moeten schriftelijk worden vastgelegd als addendum bij het contract\n3. **Huidige bepalingen**: Je contract staat al flexibele werktijden toe, dus je kunt binnen de gestelde kaders (08:00-18:00) je uren indelen\n\nVoor specifieke wijzigingen zoals thuiswerken of andere werktijden, raad ik aan om dit te bespreken met HR of je leidinggevende. Zij kunnen je helpen met het opstellen van een contractwijziging.",
    sources: 1,
  },
  {
    role: "USER",
    content: "Wat staat er in ons servicecontract over de garantieperiode?",
  },
  {
    role: "ASSISTANT",
    content: "In je servicecontract staat het volgende over de garantieperiode:\n\n**Garantieperiode**: 12 maanden vanaf de datum van oplevering van de dienst\n\n**Garantievoorwaarden**:\n- Alle defecten en gebreken die het gevolg zijn van materiaal- of fabricagefouten worden kosteloos hersteld\n- De garantie dekt geen schade veroorzaakt door verkeerd gebruik, ongelukken of normale slijtage\n- Voor software geldt een garantieperiode van 6 maanden op bugs en fouten\n- Onderhoud en updates vallen buiten de garantie, tenzij anders overeengekomen\n\n**Procedure**: Bij garantieclaims moet je binnen 48 uur na ontdekking van het probleem contact opnemen met de serviceafdeling.\n\nDeze informatie is gebaseerd op het servicecontract in je documenten.",
    sources: 1,
  },
  {
    role: "USER",
    content: "Wat zijn de betalingsvoorwaarden in ons leverancierscontract?",
  },
  {
    role: "ASSISTANT",
    content: "Volgens je leverancierscontract gelden de volgende betalingsvoorwaarden:\n\n**Betalingstermijn**: 30 dagen na factuurdatum\n\n**Betalingswijze**:\n- Facturen worden per e-mail verzonden\n- Betaling dient te geschieden via bankoverschrijving naar het opgegeven rekeningnummer\n- Betalingen moeten worden gedaan in EUR\n\n**Rente bij laattijdige betaling**:\n- Bij betaling na de vervaldatum wordt automatisch 1,5% rente per maand in rekening gebracht\n- Na 60 dagen kan de leverancier de levering opschorten\n\n**Kortingen**:\n- 2% korting bij betaling binnen 14 dagen\n- Geen korting bij betaling na 30 dagen\n\n**Disputes**: Bij geschillen over facturen moet je binnen 14 dagen na ontvangst bezwaar indienen.",
    sources: 1,
  },
];

export default function DemoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contractbot Demo</h1>
            <p className="text-muted-foreground">
              Bekijk hoe Contractbot je helpt met contractvragen
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug naar Home
            </Button>
          </Link>
        </div>

        {/* Demo Chat Interface */}
        <Card className="h-[700px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {demoMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "USER"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </p>
                  {message.sources && (
                    <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/50">
                      <FileText className="h-3 w-3 opacity-70" />
                      <p className="text-xs opacity-70">
                        Gebaseerd op {message.sources} document(en)
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>

          {/* Demo Footer */}
          <div className="border-t p-4 bg-muted/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Dit is een demo. Log in om zelf vragen te stellen.
              </p>
              <Link href="/auth/signin">
                <Button>Probeer Nu</Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Snel & Accuraat</h3>
            <p className="text-sm text-muted-foreground">
              Krijg direct antwoorden op je contractvragen zonder door documenten te hoeven zoeken.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">AVG-Compliant</h3>
            <p className="text-sm text-muted-foreground">
              Je documenten blijven veilig en privé. Geen data-lekken, volledig AVG-proof.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Altijd Beschikbaar</h3>
            <p className="text-sm text-muted-foreground">
              Stel vragen wanneer het jou uitkomt, 24/7 beschikbaar voor al je contractvragen.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}


