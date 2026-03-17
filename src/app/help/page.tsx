"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileText,
  Shield,
  Zap,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  ExternalLink,
  Book,
  Video,
  MessageCircle,
  Lightbulb,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Hoe upload ik een contractdocument?",
    answer: "Ga naar de Documenten pagina en klik op 'Upload Document'. Selecteer je PDF bestand en geef het een duidelijke titel. Het document wordt automatisch geïndexeerd en is binnen minuten doorzoekbaar.",
    category: "Documenten"
  },
  {
    id: "2",
    question: "Hoe stel ik een vraag aan Contractbot?",
    answer: "Ga naar de Chat pagina en typ je vraag in natuurlijke taal. Contractbot begrijpt context en kan vragen beantwoorden over al je geüploade contracten. Voorbeeld: 'Wat zijn de opzegtermijnen in mijn arbeidscontract?'",
    category: "Chat"
  },
  {
    id: "3",
    question: "Is mijn data veilig bij Contractbot?",
    answer: "Ja, Contractbot is volledig AVG-compliant en enterprise-grade beveiligd. Al je documenten worden versleuteld opgeslagen en alleen jij hebt toegang tot je eigen data. We bewaren geen documenten langer dan nodig.",
    category: "Privacy"
  },
  {
    id: "4",
    question: "Welke bestandstypes worden ondersteund?",
    answer: "Momenteel ondersteunen we PDF bestanden. We werken aan ondersteuning voor meer formaten zoals Word documenten en andere contract formaten.",
    category: "Documenten"
  },
  {
    id: "5",
    question: "Hoe nauwkeurig zijn de antwoorden?",
    answer: "Contractbot geeft antwoorden gebaseerd op je daadwerkelijke documenten. De AI begrijpt context en nuance, maar we raden altijd aan om belangrijke beslissingen te laten controleren door een juridisch expert.",
    category: "Chat"
  },
  {
    id: "6",
    question: "Kan ik mijn account verwijderen?",
    answer: "Ja, je kunt je account op elk moment verwijderen via de Instellingen pagina. Alle je data wordt permanent verwijderd volgens onze privacy policy.",
    category: "Account"
  },
  {
    id: "7",
    question: "Wat gebeurt er als ik mijn wachtwoord vergeet?",
    answer: "Klik op 'Inloggen' en vervolgens op 'Wachtwoord vergeten'. Je ontvangt een e-mail met instructies om je wachtwoord te resetten.",
    category: "Account"
  },
  {
    id: "8",
    question: "Hoe kan ik feedback geven?",
    answer: "We waarderen je feedback! Gebruik de chat functie om vragen te stellen of stuur een e-mail naar support@contractbot.nl.",
    category: "Support"
  }
];

const categories = ["Alle", "Documenten", "Chat", "Privacy", "Account", "Support"];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Alle" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20">
            <HelpCircle className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Help & Support</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Hoe kunnen we helpen?</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Vind antwoorden op veelgestelde vragen of neem contact met ons op
          </p>
        </div>

        {/* Search and Categories */}
        <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Zoek in veelgestelde vragen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-400"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-400" />
                  Veelgestelde Vragen
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {filteredFAQs.length} van {faqs.length} vragen gevonden
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Geen vragen gevonden voor je zoekopdracht.</p>
                    <p className="text-sm">Probeer andere zoektermen of categorieën.</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <Card
                      key={faq.id}
                      className="border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                                {faq.category}
                              </Badge>
                            </div>
                            <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                            {expandedFAQ === faq.id && (
                              <p className="text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {expandedFAQ === faq.id ? (
                              <ChevronDown className="h-5 w-5 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Support Options */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-400" />
                  Contact Support
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Heb je nog vragen? Neem contact met ons op
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-white/10 text-white">
                  <MessageSquare className="h-4 w-4 mr-3" />
                  Start Chat Support
                </Button>

                <Button variant="outline" className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Mail className="h-4 w-4 mr-3" />
                  Stuur E-mail
                </Button>

                <Button variant="outline" className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Phone className="h-4 w-4 mr-3" />
                  Bel Support
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                  Snelle Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-white font-medium">Gebruik duidelijke taal</p>
                      <p className="text-xs text-slate-400">Stel vragen in natuurlijke taal voor de beste resultaten</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-white font-medium">Upload complete documenten</p>
                      <p className="text-xs text-slate-400">Zorg dat je contracten volledig zijn voor accurate antwoorden</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-2 w-2 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-white font-medium">Controleer belangrijke zaken</p>
                      <p className="text-xs text-slate-400">Laat cruciale beslissingen altijd controleren door een expert</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-400" />
                  Hulpmiddelen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Video className="h-4 w-4 mr-3" />
                  Video Tutorials
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>

                <Button variant="outline" className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Book className="h-4 w-4 mr-3" />
                  Gebruikershandleiding
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>

                <Button variant="outline" className="w-full justify-start border-white/20 bg-white/5 text-white hover:bg-white/10">
                  <Shield className="h-4 w-4 mr-3" />
                  Privacy Policy
                  <ExternalLink className="h-4 w-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="border-white/10 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <span className="text-sm text-white">Alle systemen operationeel</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    99.9% uptime
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

