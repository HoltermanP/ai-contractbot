"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Server, Lock, FileText, Scale, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Terug naar dashboard
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Privacy &amp; Security
          </h1>
          <p className="text-muted-foreground">
            Hoe wij omgaan met uw gegevens, waar deze worden verwerkt en welke voorwaarden van toepassing zijn.
          </p>
        </div>

        {/* Veilige omgeving – EU & afgeschermde server */}
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Veilige omgeving
            </CardTitle>
            <CardDescription className="text-slate-400">
              U werkt in een beveiligde, Europese omgeving
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300 text-sm">
            <div className="flex items-start gap-3">
              <Server className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Europese server</p>
                <p>
                  Alle verwerking van uw gegevens vindt plaats op servers binnen de Europese Unie. Er wordt geen data naar landen buiten de EU (of EER) doorgegeven. Hiermee voldoen we aan de eisen voor gegevensbescherming en voorkomt u onnodige risico&apos;s.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Afgeschermde infrastructuur</p>
                <p>
                  Onze infrastructuur is afgeschermd en alleen toegankelijk via beveiligde verbindingen. Toegang tot systemen en data is gelogd en beperkt tot geautoriseerd personeel. Back-ups worden eveneens binnen de EU bewaard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beveiliging */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Lock className="h-5 w-5 text-blue-400" />
              Beveiliging
            </CardTitle>
            <CardDescription className="text-slate-400">
              Technische en organisatorische maatregelen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-300 text-sm">
            <ul className="list-disc list-inside space-y-2">
              <li>Versleuteling van data in transit (TLS) en in rust waar van toepassing</li>
              <li>Toegangsbeheer op basis van rollen; alleen bevoegden hebben inzicht in uw data</li>
              <li>Logging van toegang en wijzigingen voor controle en beveiliging</li>
              <li>Regelmatige beveiligingsupdates en -evaluaties</li>
              <li>Geen doorverkoop of gedeeld gebruik van uw data met derden voor eigen doeleinden</li>
            </ul>
          </CardContent>
        </Card>

        {/* Privacy (AVG) */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-purple-400" />
              Privacy en AVG
            </CardTitle>
            <CardDescription className="text-slate-400">
              Verwerking van persoonsgegevens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-slate-300 text-sm">
            <p>
              Wij verwerken persoonsgegevens uitsluitend voor het leveren van de Contractbot-dienst: accountbeheer, opslag en doorzoekbaar maken van door u geüploade documenten, en het beantwoorden van vragen via de chat. De verwerking gebeurt op grond van de uitvoering van de overeenkomst en, waar van toepassing, op basis van uw toestemming.
            </p>
            <p>
              U heeft het recht op inzage, rectificatie, verwijdering en beperking van verwerking, alsmede het recht op dataportabiliteit en bezwaar. Voor vragen of het uitoefenen van rechten kunt u contact met ons opnemen. U heeft het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens.
            </p>
            <p>
              We bewaren gegevens niet langer dan nodig voor het doel waarvoor ze zijn verwerkt, tenzij de wet een langere bewaartermijn verplicht.
            </p>
          </CardContent>
        </Card>

        {/* Algemene voorwaarden */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Scale className="h-5 w-5 text-amber-400" />
              Algemene voorwaarden
            </CardTitle>
            <CardDescription className="text-slate-400">
              Gebruik van de dienst en aansprakelijkheid
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300 text-sm">
            <section>
              <h4 className="font-medium text-white mb-2">Toepasselijkheid</h4>
              <p>
                Deze voorwaarden zijn van toepassing op het gebruik van Contractbot (de &quot;dienst&quot;). Door de dienst te gebruiken, gaat u akkoord met deze voorwaarden. Afwijkingen zijn alleen geldig indien schriftelijk overeengekomen.
              </p>
            </section>
            <section>
              <h4 className="font-medium text-white mb-2">Gebruik van de dienst</h4>
              <p>
                U gebruikt de dienst voor contractbeheer en het stellen van vragen over uw documenten. U bent verantwoordelijk voor de inhoud van de door u geüploade documenten en voor het correct en rechtmatig gebruik van de dienst. Het is niet toegestaan de dienst te gebruiken voor onrechtmatige doeleinden of om rechten van derden te schenden.
              </p>
            </section>
            <section>
              <h4 className="font-medium text-white mb-2">Intellectueel eigendom</h4>
              <p>
                De dienst, inclusief de software en het ontwerp, blijft eigendom van de aanbieder. U behoudt alle rechten op uw eigen geüploade documenten. De aanbieder verkrijgt alleen de rechten die nodig zijn om de dienst te leveren (opslag, indexering, verwerking voor de chat).
              </p>
            </section>
            <section>
              <h4 className="font-medium text-white mb-2">Aansprakelijkheid</h4>
              <p>
                De dienst wordt geleverd &quot;as is&quot;. Antwoorden van de AI zijn bedoeld als ondersteuning en vormen geen juridisch advies. Voor beslissingen met juridische gevolgen raden we aan een bevoegd adviseur te raadplegen. De aansprakelijkheid van de aanbieder is beperkt tot het bedrag dat in de overeenkomst is overeengekomen of, bij gebrek daaraan, tot het door de gebruiker in het desbetreffende jaar betaalde bedrag, tenzij sprake is van opzet of grove schuld.
              </p>
            </section>
            <section>
              <h4 className="font-medium text-white mb-2">Opzegging en beëindiging</h4>
              <p>
                U kunt uw account en gebruik van de dienst opzeggen volgens de in de overeenkomst opgenomen termijnen. Na beëindiging worden uw gegevens in overeenstemming met ons privacybeleid verwijderd of geanonimiseerd, tenzij we verplicht zijn ze langer te bewaren.
              </p>
            </section>
            <section>
              <h4 className="font-medium text-white mb-2">Wijzigingen</h4>
              <p>
                Wij kunnen deze voorwaarden en het privacy- en securitybeleid wijzigen. Essentiële wijzigingen worden tijdig gecommuniceerd. Voortgezet gebruik na inwerkingtreding geldt als aanvaarding van de gewijzigde voorwaarden.
              </p>
            </section>
            <p className="text-xs text-slate-500 pt-2">
              Laatste update: maart 2025. Voor vragen: neem contact op via de contactgegevens in de applicatie of op de website.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-center pt-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
              Terug naar dashboard
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
