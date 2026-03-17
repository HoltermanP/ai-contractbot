import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Helper function to generate random date within last 6 months
function randomDateWithinLast6Months() {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime);
}

// Helper function to generate random recent date (last 30 days)
function randomRecentDate() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime());
  return new Date(randomTime);
}

// Netbeheerders
const netbeheerders = [
  { name: "Liander", domain: "liander.nl" },
  { name: "Stedin", domain: "stedin.net" },
  { name: "Enexis", domain: "enexis.nl" },
  { name: "Westland Infra", domain: "westlandinfra.nl" },
  { name: "Coteq", domain: "coteq.nl" },
  { name: "Rendo", domain: "rendo.nl" },
];

// Waterbedrijven
const waterbedrijven = [
  { name: "Vitens", domain: "vitens.nl" },
  { name: "Evides", domain: "evides.nl" },
  { name: "PWN", domain: "pwn.nl" },
  { name: "Brabant Water", domain: "brabantwater.nl" },
  { name: "Waternet", domain: "waternet.nl" },
  { name: "Oasen", domain: "oasen.nl" },
  { name: "WMD", domain: "wmd.nl" },
  { name: "Dunea", domain: "dunea.nl" },
];

// Aannemers
const aannemers = [
  { name: "BAM Infra", domain: "bam.nl" },
  { name: "VolkerWessels", domain: "volkerwessels.com" },
  { name: "Heijmans Infra", domain: "heijmans.nl" },
  { name: "Van Gelder", domain: "vangelder.com" },
  { name: "Strukton", domain: "strukton.nl" },
  { name: "Dura Vermeer", domain: "duravermeer.nl" },
  { name: "Visser & Smit Hanab", domain: "vshanab.nl" },
  { name: "Joulz", domain: "joulz.nl" },
  { name: "Circet", domain: "circet.nl" },
  { name: "Den Ouden", domain: "denouden.nl" },
  { name: "KWS Infra", domain: "kws.nl" },
  { name: "Croonwolter&dros", domain: "croonwolterendros.nl" },
];

// Medewerkers per organisatietype
const functies = {
  netbeheerder: ["Contractmanager", "Inkoper", "Projectleider", "Technisch Manager", "Juridisch Adviseur", "Asset Manager"],
  waterbedrijf: ["Contractmanager", "Inkoper", "Projectleider", "Technisch Manager", "Juridisch Adviseur", "Beheerder Netwerk"],
  aannemer: ["Projectmanager", "Calculator", "Werkvoorbereider", "Uitvoerder", "Contractbeheerder", "Tendermanager"],
};

// Contract document templates - Infrastructuur sector
const contractTemplates = [
  { 
    title: "UAV 2012 - Uniforme Administratieve Voorwaarden", 
    filename: "uav-2012.pdf", 
    content: `UAV 2012 - Uniforme Administratieve Voorwaarden voor de uitvoering van werken en van technische installatiewerken.

Paragraaf 1 - Aanduidingen, begripsbepalingen
Art. 1. Aanduidingen: In deze UAV worden de volgende begrippen gehanteerd:
- Opdrachtgever: de natuurlijke of rechtspersoon die het werk opdraagt
- Aannemer: de natuurlijke of rechtspersoon aan wie het werk is opgedragen
- Directie: degene die door de opdrachtgever is belast met het toezicht op de uitvoering
- Besteksomschrijving: de beschrijving van het uit te voeren werk
- Werk: het uit hoofde van de overeenkomst door de aannemer te verrichten werk

Paragraaf 5 - Verplichtingen van de aannemer
Art. 5. De aannemer is verplicht het werk naar de bepalingen van de overeenkomst uit te voeren.
Art. 6. De aannemer voert het werk uit volgens de regelen van goed vakmanschap.

Paragraaf 8 - Termijnen
Art. 8. Het werk wordt uitgevoerd binnen de in de overeenkomst gestelde termijnen.
Korting wegens te late oplevering: 0,5% van de aanneemsom per werkdag, max 10%.

Paragraaf 12 - Betaling
Art. 12. Betaling geschiedt binnen 30 dagen na ontvangst factuur.

Paragraaf 14 - Aansprakelijkheid
Art. 14. De aannemer is aansprakelijk voor schade aan het werk tot de oplevering.
De aannemer vrijwaart de opdrachtgever voor aanspraken van derden.` 
  },
  { 
    title: "UAV-GC 2005 - Geïntegreerde Contracten", 
    filename: "uav-gc-2005.pdf", 
    content: `UAV-GC 2005 - Uniforme Administratieve Voorwaarden voor Geïntegreerde Contractvormen.

Hoofdstuk 1 - Definities en algemene bepalingen
1.1 Opdrachtnemer: partij die ontwerp en uitvoering op zich neemt
1.2 Opdrachtgever: partij die het geïntegreerde contract opdraagt
1.3 Vraagspecificatie: de door opdrachtgever opgestelde eisen en wensen

Hoofdstuk 2 - Ontwerp
2.1 De opdrachtnemer is verantwoordelijk voor het ontwerp
2.2 Het ontwerp voldoet aan de vraagspecificatie
2.3 Toetsing ontwerp door opdrachtgever binnen 4 weken

Hoofdstuk 3 - Uitvoering
3.1 Uitvoering conform goedgekeurd ontwerp
3.2 Kwaliteitsborging door opdrachtnemer
3.3 Systems Engineering methodiek van toepassing

Hoofdstuk 4 - Risicoverdeling
4.1 Opdrachtnemer draagt ontwerprisico
4.2 Opdrachtgever draagt risico wijziging wet- en regelgeving
4.3 Bodemrisico conform Bouwbesluit bij opdrachtgever

Hoofdstuk 5 - Meerwerk en minderwerk
5.1 Wijzigingen uitsluitend schriftelijk
5.2 Verrekening tegen eenheidsprijzen of nacalculatie` 
  },
  { 
    title: "Raamovereenkomst Aanleg Leidingwerk", 
    filename: "raamovereenkomst-leidingwerk.pdf", 
    content: `RAAMOVEREENKOMST AANLEG EN ONDERHOUD LEIDINGWERK

Partijen:
- [Netbeheerder/Waterbedrijf], hierna "Opdrachtgever"
- [Aannemer], hierna "Opdrachtnemer"

Artikel 1 - Scope
1.1 Aanleg, vervanging en onderhoud van ondergrondse infrastructuur
1.2 Werkzaamheden aan gas-, water- en elektriciteitsleidingen
1.3 Huisaansluitingen en storingsdienst

Artikel 2 - Looptijd
2.1 Contractduur: 4 jaar met optie tot 2x 1 jaar verlenging
2.2 Opzegtermijn: 6 maanden voor einde contractperiode

Artikel 3 - Prijsafspraken
3.1 Eenheidsprijzen conform prijzenboek (bijlage A)
3.2 Jaarlijkse indexering conform CBS-index
3.3 Nacalculatie voor niet-genormeerde werkzaamheden

Artikel 4 - Kwaliteitseisen
4.1 VCA** certificering verplicht
4.2 BEI/VIAG bevoegdheden voor medewerkers
4.3 Naleving CROW-richtlijnen

Artikel 5 - Aansprakelijkheid en verzekeringen
5.1 CAR-verzekering minimaal €2.500.000
5.2 Aansprakelijkheidsverzekering minimaal €5.000.000` 
  },
  { 
    title: "Bestek Reconstructie Waterleidingnet", 
    filename: "bestek-reconstructie-waterleiding.pdf", 
    content: `BESTEK RECONSTRUCTIE WATERLEIDINGNET

Project: Vervanging transportleiding DN400
Locatie: [Gemeente]
Besteksnummer: WL-2024-001

Hoofdstuk 1 - Werkbeschrijving
1.1 Verwijderen bestaande gietijzeren leiding (2.400 m1)
1.2 Aanleg nieuwe PE-leiding DN400 SDR17
1.3 Realisatie 12 afsluiterknooppunten
1.4 Aansluiting op bestaand net middels oversteekkoppelingen

Hoofdstuk 2 - Uitvoeringsvoorwaarden
2.1 Werkzaamheden in bebouwd gebied
2.2 Bereikbaarheid woningen te allen tijde gewaarborgd
2.3 Maximale onderbreking waterlevering: 4 uur
2.4 Nachtwerk toegestaan mits vergunning

Hoofdstuk 3 - Materiaalspecificaties
3.1 PE100 RC conform NEN 7200
3.2 Afsluiters conform KIWA-BRL
3.3 Koppelstukken van erkende fabrikanten

Hoofdstuk 4 - Keuringen en opleveringseisen
4.1 Drukproef conform NEN 3650
4.2 Spoelen en desinfecteren conform VEWIN
4.3 Revisietekeningen in GIS-formaat` 
  },
  { 
    title: "Bestek Kabeltracé Middenspanning", 
    filename: "bestek-kabeltrace-ms.pdf", 
    content: `BESTEK AANLEG KABELTRACÉ MIDDENSPANNING

Project: MS-kabelverbinding Station Noord - Station Zuid
Besteksnummer: MS-2024-042

Hoofdstuk 1 - Technische specificaties
1.1 Kabeltype: 3x1x630 Al XLPE 10kV
1.2 Tracélengte: 4.200 meter
1.3 Mantelbuizen HDPE 160mm
1.4 Gestuurde boring onder N-weg (180m)

Hoofdstuk 2 - Grondwerk
2.1 Sleufbreedte minimaal 0,50m
2.2 Dekvloer conform CROW 500
2.3 Zandbed 0,10m onder en boven kabel
2.4 Waarschuwingsband op 0,30m boven kabel

Hoofdstuk 3 - Veiligheid
3.1 BEI-bevoegdheid vereist
3.2 Werkvergunning netbeheerder
3.3 KLIC-melding en proefsleuven
3.4 Gasdetectie bij graafwerk nabij gasleidingen

Hoofdstuk 4 - Planning
4.1 Uitvoeringstermijn: 16 weken
4.2 Mijlpalen: boring week 6, moffen week 14
4.3 Korting bij overschrijding: €2.500 per werkdag` 
  },
  { 
    title: "SLA Storingsdienst Gas", 
    filename: "sla-storingsdienst-gas.pdf", 
    content: `SERVICE LEVEL AGREEMENT STORINGSDIENST GAS

Artikel 1 - Dienstbeschrijving
1.1 24/7 beschikbaarheid voor gasgerelateerde storingen
1.2 Eerste lijn respons en veiligstelling
1.3 Reparatie en herstel gasleidingen
1.4 Lekdetectie en -lokalisatie

Artikel 2 - Responstijden
2.1 Prioriteit 1 (gaslucht/gevaar): aankomst binnen 30 minuten
2.2 Prioriteit 2 (storing zonder gevaar): aankomst binnen 2 uur
2.3 Prioriteit 3 (geplande reparatie): binnen 24 uur

Artikel 3 - KPI's en rapportage
3.1 Minimaal 98% binnen responstijd P1
3.2 Minimaal 95% binnen responstijd P2
3.3 Maandelijkse rapportage aan opdrachtgever
3.4 Kwartaal review prestaties

Artikel 4 - Boeteregeling
4.1 Per P1 overschrijding: €500
4.2 Per P2 overschrijding: €100
4.3 Maximale boete per maand: €10.000

Artikel 5 - Personeel
5.1 Minimaal 2 storingsteams beschikbaar
5.2 Erkende gasbekwaamheid (SCIOS scope 10)
5.3 Jaarlijkse hercertificering` 
  },
  { 
    title: "Inkoopvoorwaarden Nutsbedrijven", 
    filename: "inkoopvoorwaarden-nutsbedrijven.pdf", 
    content: `ALGEMENE INKOOPVOORWAARDEN NUTSBEDRIJVEN (AIVN)

Hoofdstuk 1 - Toepasselijkheid
1.1 Deze voorwaarden zijn van toepassing op alle opdrachten
1.2 Afwijkingen uitsluitend schriftelijk overeengekomen
1.3 Voorwaarden opdrachtnemer worden uitdrukkelijk afgewezen

Hoofdstuk 2 - Prijzen en betaling
2.1 Prijzen zijn vast gedurende contractperiode
2.2 Betaling binnen 30 dagen na goedkeuring factuur
2.3 Facturering per termijn of na oplevering deelwerk

Hoofdstuk 3 - Uitvoering
3.1 Opdrachtnemer handelt als goed opdrachtnemer
3.2 Inzet onderaannemers na schriftelijke goedkeuring
3.3 Naleving wet- en regelgeving en veiligheidsvoorschriften

Hoofdstuk 4 - Aansprakelijkheid
4.1 Opdrachtnemer aansprakelijk voor alle schade
4.2 Vrijwaring voor aanspraken derden
4.3 Verborgen gebreken: aansprakelijkheid 10 jaar na oplevering

Hoofdstuk 5 - Intellectueel eigendom
5.1 Alle documenten eigendom opdrachtgever
5.2 Hergebruik door opdrachtnemer niet toegestaan

Hoofdstuk 6 - Geheimhouding
6.1 Strikte geheimhouding bedrijfsinformatie
6.2 Boete bij schending: €50.000 per overtreding` 
  },
  { 
    title: "Deelopdracht Huisaansluitingen", 
    filename: "deelopdracht-huisaansluitingen.pdf", 
    content: `DEELOPDRACHT HUISAANSLUITINGEN

Opdrachtnummer: HA-2024-156
Raamovereenkomst: RO-2022-001

Omschrijving werkzaamheden:
- Realisatie 45 nieuwe wateraansluitingen
- Locatie: Nieuwbouwwijk De Bongerd, [Gemeente]
- Aansluiting op bestaande hoofdleiding DN150

Specificaties per aansluiting:
- Materiaal: PE40 SDR11
- Watermeter in meterput
- Doorvoer conform bouwkundig bestek

Planning:
- Start: week 12
- Oplevering: week 18
- Coördinatie met hoofdaannemer woningbouw

Financieel:
- Eenheidsprijs conform raamovereenkomst: €1.250 per aansluiting
- Totaal: €56.250 excl. BTW
- Meerwerk: graafwerk in verharding +€180 per aansluiting

Kwaliteit:
- Drukproef per aansluiting
- Bacteriologisch onderzoek steekproefsgewijs
- Revisie in GIS binnen 5 werkdagen na oplevering` 
  },
  { 
    title: "Overeenkomst Netuitbreiding Elektriciteit", 
    filename: "overeenkomst-netuitbreiding-elektra.pdf", 
    content: `OVEREENKOMST NETUITBREIDING ELEKTRICITEIT

Partijen:
- [Netbeheerder]
- [Aannemer]

Project: Netuitbreiding industrieterrein [Naam]

Artikel 1 - Scope
1.1 Aanleg 2 nieuwe MS-stations (10/0,4 kV)
1.2 MS-kabelverbindingen (2x 1.800m)
1.3 LS-distributienetten per station
1.4 Openbare verlichting (48 masten)

Artikel 2 - Technische eisen
2.1 MS-stations prefab, type compactstation
2.2 Transformatoren 630 kVA, oliegekoeld
2.3 Kabels conform NEN 3620
2.4 Aarding conform NEN 1010

Artikel 3 - Vergunningen
3.1 Opdrachtgever verzorgt netbeheerdersvergunning
3.2 Opdrachtnemer verzorgt WIOR-melding
3.3 Opdrachtnemer verzorgt kabel- en leidingoverleg

Artikel 4 - Contractprijs
4.1 Aanneemsom: €890.000 excl. BTW
4.2 Stelpost grondwerk: €45.000
4.3 Betalingsschema: 30% start, 40% ruwbouw, 30% oplevering

Artikel 5 - Garantie
5.1 Garantietermijn: 2 jaar na oplevering
5.2 Onderhoudsperiode: 10 jaar (separaat contract)` 
  },
  { 
    title: "Raamcontract Rioolrenovatie", 
    filename: "raamcontract-rioolrenovatie.pdf", 
    content: `RAAMCONTRACT RIOOLRENOVATIE EN -INSPECTIE

Looptijd: 2024-2028

Artikel 1 - Werkzaamheden
1.1 Rioolinspectie met camera (CCTV)
1.2 Relining en renovatie bestaand riool
1.3 Reparaties en deelrenovaties
1.4 Wortelverwijdering en reiniging

Artikel 2 - Eenheidsprijzen
2.1 Inspectie: €4,50 per meter
2.2 Kous-relining DN300: €185 per meter
2.3 Robotreparatie: €650 per stuk
2.4 Hogedruk reiniging: €3,20 per meter

Artikel 3 - Capaciteit
3.1 Minimale afname: 15.000 meter inspectie per jaar
3.2 Maximale afname: 45.000 meter inspectie per jaar
3.3 Responstijd deelopdrachten: 5 werkdagen

Artikel 4 - Kwaliteitseisen
4.1 Inspectie conform NEN-EN 13508-2
4.2 Relining conform BRL SIKB 2100
4.3 Rapportage in GWSW-formaat

Artikel 5 - Duurzaamheid
5.1 CO2-prestatieladder niveau 3 vereist
5.2 Emissieloos materieel waar mogelijk
5.3 Circulair materiaalgebruik` 
  },
  { 
    title: "Bestek Glasvezelaanleg", 
    filename: "bestek-glasvezel.pdf", 
    content: `BESTEK AANLEG GLASVEZELNETWERK

Project: FttH uitrol [Gemeente]
Fase: 1 (3.500 aansluitingen)

Hoofdstuk 1 - Werkbeschrijving
1.1 Aanleg backbone glasvezel (12km)
1.2 Distributie naar wijkkasten (45 stuks)
1.3 Dropkabels naar woningen
1.4 Binneninstallatie tot eerste wandcontactdoos

Hoofdstuk 2 - Materialen
2.1 Backbone: 96-vezel single mode
2.2 Distributie: 24-vezel single mode
2.3 Drop: 2-vezel single mode
2.4 Alle kabels geblazen in HDPE-buizen

Hoofdstuk 3 - Graafwerk
3.1 Minimale gronddekking 0,60m
3.2 Sleufbreedte max 0,30m (microtrenching toegestaan)
3.3 Herstel verhardingen conform CROW 500

Hoofdstuk 4 - Testen
4.1 OTDR-meting alle vezels
4.2 Maximale demping: 0,35 dB/km
4.3 Meetprotocollen per adres

Hoofdstuk 5 - Oplevering
5.1 As-built documentatie in GIS
5.2 Overdracht aan beheerorganisatie
5.3 Garantie: 15 jaar op passieve infrastructuur` 
  },
  { 
    title: "Onderhoudscontract Pompstations", 
    filename: "onderhoudscontract-pompstations.pdf", 
    content: `ONDERHOUDSCONTRACT POMPSTATIONS EN GEMALEN

Artikel 1 - Objecten
1.1 12 rioolgemalen (capaciteit 50-500 m³/uur)
1.2 4 drinkwaterpompstations
1.3 2 drukverhogingsinstallaties

Artikel 2 - Onderhoudswerkzaamheden
2.1 Preventief onderhoud conform onderhoudsschema
2.2 Correctief onderhoud bij storingen
2.3 Revisie pompen en motoren
2.4 Elektrotechnisch onderhoud en keuring

Artikel 3 - Beschikbaarheid
3.1 Gemalen: minimaal 99% beschikbaarheid
3.2 Drinkwaterpompstations: minimaal 99,9%
3.3 24/7 storingsdienst met responstijd 2 uur

Artikel 4 - Vergoeding
4.1 Vaste vergoeding preventief: €145.000 per jaar
4.2 Correctief onderhoud: nacalculatie
4.3 Revisies: separate offertes

Artikel 5 - Rapportage
5.1 Maandelijkse storingsrapportage
5.2 Jaarlijkse conditiemeting (NEN 2767)
5.3 Advies vervangingsinvesteringen` 
  },
  { 
    title: "Veiligheidsprotocol Werken aan Infrastructuur", 
    filename: "veiligheidsprotocol-infrastructuur.pdf", 
    content: `VEILIGHEIDSPROTOCOL WERKEN AAN ONDERGRONDSE INFRASTRUCTUUR

Hoofdstuk 1 - Algemeen
1.1 Dit protocol is van toepassing op alle werkzaamheden
1.2 Naleving is verplicht voor alle medewerkers en onderaannemers
1.3 Afwijkingen uitsluitend met schriftelijke toestemming

Hoofdstuk 2 - KLIC en proefsleuven
2.1 KLIC-melding minimaal 3 werkdagen voor start
2.2 Proefsleuven bij onduidelijke ligging
2.3 Handmatig graven binnen 1,5m van kabels/leidingen

Hoofdstuk 3 - Werken aan gasleidingen
3.1 BEI-bevoegdheid verplicht
3.2 Gasdetectie voor aanvang werkzaamheden
3.3 Ontstekingsbronnen verwijderen binnen 25m
3.4 Persoonlijke beschermingsmiddelen: vlamvertragende kleding

Hoofdstuk 4 - Werken aan elektriciteitskabels
4.1 VIAG-bevoegdheid verplicht
4.2 Spanningsloos werken, tenzij anders vergund
4.3 Aarding en kortsluiting aanbrengen

Hoofdstuk 5 - Incidentmelding
5.1 Directe melding bij schade aan kabels/leidingen
5.2 Evacuatie bij gaslekkage
5.3 Registratie in incidentensysteem` 
  },
  { 
    title: "Prestatiecontract Wegbeheer", 
    filename: "prestatiecontract-wegbeheer.pdf", 
    content: `PRESTATIECONTRACT WEGBEHEER

Contractgebied: Buitengebied [Gemeente]
Areaal: 180 km verharde wegen, 45 km fietspaden

Artikel 1 - Prestatie-eisen
1.1 Stroefheid: minimaal 0,45 (CROW)
1.2 Vlakheid: IRI maximaal 3,0 mm/m
1.3 Scheurvorming: maximaal CROW-klasse 3
1.4 Belijning: reflectiewaarde minimaal 100 mcd/lux/m²

Artikel 2 - Werkzaamheden
2.1 Groot onderhoud: asfalteren, frezen, profileren
2.2 Klein onderhoud: reparaties, vullen scheuren
2.3 Bermonderhoud: maaien, egaliseren
2.4 Gladheidsbestrijding: strooien en ruimen

Artikel 3 - Vergoeding
3.1 Vaste vergoeding: €420.000 per jaar
3.2 Indexering: jaarlijks conform CROW-index
3.3 Bonus bij overpresteren: max 5%
3.4 Malus bij onderpresteren: max 10%

Artikel 4 - Monitoring
4.1 Jaarlijkse weginspectie door opdrachtgever
4.2 Kwartaalrapportage door opdrachtnemer
4.3 Tussentijdse schouwen op verzoek` 
  },
  { 
    title: "Samenwerkingsovereenkomst Combi-Uitvoering", 
    filename: "samenwerkingsovereenkomst-combi.pdf", 
    content: `SAMENWERKINGSOVEREENKOMST GECOMBINEERDE UITVOERING

Partijen:
- [Netbeheerder elektriciteit]
- [Netbeheerder gas]
- [Waterbedrijf]
- [Gemeente]

Artikel 1 - Doel
1.1 Efficiënte uitvoering door combineren werkzaamheden
1.2 Beperken overlast voor bewoners en verkeer
1.3 Kostenbesparing door gezamenlijke aanbesteding

Artikel 2 - Projectgebied
2.1 Wijk [Naam], circa 1.200 woningen
2.2 Vervanging gas-, water- en elektriciteitsnetten
2.3 Herinrichting openbare ruimte door gemeente

Artikel 3 - Kostenverdeling
3.1 Grondwerk: naar rato van sleufgebruik
3.2 Verkeersmaatregelen: gelijk verdeeld
3.3 Projectmanagement: naar rato van investeringssom

Artikel 4 - Organisatie
4.1 Gezamenlijke projectgroep met vertegenwoordigers
4.2 Maandelijks voortgangsoverleg
4.3 Eén aanspreekpunt voor bewoners

Artikel 5 - Planning
5.1 Voorbereiding: Q1-Q2 2024
5. Uitvoering: Q3 2024 - Q2 2025
5.3 Oplevering en evaluatie: Q3 2025` 
  },
];

// Gesprekken en vragen specifiek voor netbeheerders/waterbedrijven/aannemers
const conversationTopics = [
  "UAV 2012 bepalingen",
  "Opzegtermijnen raamcontract",
  "Boeteclausules bij vertraging",
  "Meerwerk verrekening",
  "KLIC-procedure",
  "VCA-certificering eisen",
  "Aansprakelijkheid graafschade",
  "Garantietermijnen",
  "Indexering eenheidsprijzen",
  "Onderaanneming voorwaarden",
  "BEI/VIAG bevoegdheden",
  "Storingsdienst SLA",
  "Kwaliteitseisen materialen",
  "Opleveringsprocedure",
  "Verzekeringseisen CAR",
  "Retentieregeling",
  "Geschillenbeslechting",
  "Force majeure bepalingen",
  "Geheimhoudingsplicht",
  "Duurzaamheidseisen CO2",
  "Veiligheidsvoorschriften",
  "Responstijden storingen",
  "Revisietekeningen eisen",
  "Proefsleuven verplichting",
];

// Specifieke vragen voor de sector
const userQuestions = [
  "Wat zijn de opzegtermijnen in ons raamcontract met de aannemer?",
  "Welke boeteclausules gelden bij te late oplevering volgens de UAV 2012?",
  "Hoe wordt meerwerk verrekend bij afwijkingen van het bestek?",
  "Wat zijn de VCA-eisen voor onderaannemers?",
  "Wie is aansprakelijk bij graafschade aan kabels en leidingen?",
  "Wat is de garantietermijn voor verborgen gebreken?",
  "Hoe werkt de jaarlijkse indexering van de eenheidsprijzen?",
  "Mag de aannemer onderaannemers inschakelen zonder toestemming?",
  "Welke BEI-bevoegdheden zijn vereist voor werken aan gasleidingen?",
  "Wat zijn de responstijden in de SLA voor storingsdienst?",
  "Aan welke kwaliteitseisen moeten de PE-leidingen voldoen?",
  "Hoe verloopt de opleveringsprocedure volgens UAV?",
  "Welke verzekeringen moet de aannemer afsluiten?",
  "Hoeveel procent mag worden ingehouden als retentie?",
  "Hoe worden geschillen opgelost volgens het contract?",
  "Wanneer kan een beroep worden gedaan op overmacht?",
  "Wat valt onder de geheimhoudingsplicht?",
  "Welke CO2-prestatieladder niveau is vereist?",
  "Wat zijn de veiligheidsvoorschriften bij graafwerk?",
  "Binnen welke termijn moeten revisietekeningen worden aangeleverd?",
  "Wanneer zijn proefsleuven verplicht?",
  "Wat is de korting per dag bij termijnoverschrijding?",
  "Hoe wordt de aanneemsom betaald (betalingsschema)?",
  "Welke CROW-richtlijnen zijn van toepassing?",
  "Wat zijn de eisen voor drukproeven op waterleidingen?",
];

// Specifieke antwoorden voor de sector
const assistantResponses = [
  "Volgens artikel 2.2 van de raamovereenkomst bedraagt de opzegtermijn 6 maanden voor het einde van de contractperiode. De overeenkomst heeft een looptijd van 4 jaar met een optie tot verlenging van 2x 1 jaar.",
  "De UAV 2012 bepaalt in paragraaf 42 dat de korting wegens te late oplevering 0,5% van de aanneemsom per werkdag bedraagt, met een maximum van 10% van de aanneemsom.",
  "Meerwerk wordt verrekend volgens artikel 35 UAV 2012. Bij afwijkingen tot 10% van de aanneemsom gelden de eenheidsprijzen uit het contract. Bij grotere afwijkingen kan heronderhandeling plaatsvinden.",
  "Alle onderaannemers moeten beschikken over een geldig VCA** certificaat (Veiligheid, Gezondheid en Milieu Checklist Aannemers). Dit is vastgelegd in artikel 4.1 van de raamovereenkomst.",
  "Volgens paragraaf 6 lid 14 UAV 2012 is de aannemer aansprakelijk voor schade aan kabels en leidingen, tenzij deze niet op de KLIC-tekening stonden vermeld of de ligging meer dan 1 meter afweek.",
  "De garantietermijn voor verborgen gebreken is 10 jaar na oplevering, conform artikel 4.4 van de Algemene Inkoopvoorwaarden Nutsbedrijven (AIVN).",
  "De eenheidsprijzen worden jaarlijks geïndexeerd conform de CBS-index voor grond-, water- en wegenbouw (GWW). De indexering vindt plaats per 1 januari van elk kalenderjaar.",
  "Inschakeling van onderaannemers is uitsluitend toegestaan na schriftelijke goedkeuring van de opdrachtgever, conform artikel 3.2 van de inkoopvoorwaarden.",
  "Voor werkzaamheden aan gasleidingen is minimaal BEI-bevoegdheid vereist. Daarnaast moet de medewerker beschikken over een geldige SCIOS scope 10 erkenning voor gasbekwaamheid.",
  "De SLA voor storingsdienst gas hanteert de volgende responstijden: Prioriteit 1 (gaslucht/gevaar): 30 minuten, Prioriteit 2 (storing zonder gevaar): 2 uur, Prioriteit 3 (gepland): 24 uur.",
  "PE-leidingen moeten voldoen aan NEN 7200 en PE100 RC kwaliteit. Daarnaast is KIWA-certificering vereist conform de BRL-K17301.",
  "De oplevering verloopt volgens paragraaf 9 en 10 UAV 2012: de aannemer meldt het werk gereed, waarna de directie binnen 8 dagen keurt. Bij goedkeuring volgt het proces-verbaal van oplevering.",
  "De aannemer moet beschikken over een CAR-verzekering (minimaal €2.500.000) en een aansprakelijkheidsverzekering (minimaal €5.000.000), conform artikel 5 van de raamovereenkomst.",
  "De retentie bedraagt 5% van de aanneemsom en wordt 6 maanden na oplevering vrijgegeven, mits alle opleverpunten zijn afgehandeld en de revisiedocumentatie is goedgekeurd.",
  "Geschillen worden eerst voorgelegd aan de Raad van Arbitrage voor de Bouw. Indien partijen hier niet uitkomen, is de rechtbank bevoegd conform artikel 6.1 van de inkoopvoorwaarden.",
  "Een beroep op overmacht (force majeure) kan worden gedaan bij onvoorziene omstandigheden buiten de macht van partijen, zoals natuurrampen, oorlog of pandemieën. Dit is geregeld in paragraaf 47 UAV 2012.",
  "De geheimhoudingsplicht omvat alle bedrijfsgevoelige informatie, technische specificaties en prijsafspraken. Schending leidt tot een boete van €50.000 per overtreding.",
  "Voor dit contract is CO2-prestatieladder niveau 3 vereist. Dit betekent dat de aannemer aantoonbaar werkt aan CO2-reductie op project- en bedrijfsniveau.",
  "Bij graafwerk in de nabijheid van kabels en leidingen geldt: KLIC-melding 3 werkdagen vooraf, proefsleuven bij onduidelijke ligging, handmatig graven binnen 1,5 meter van de leiding.",
  "Revisietekeningen moeten binnen 5 werkdagen na oplevering worden aangeleverd in GIS-formaat (Shape of GML), inclusief alle x,y,z coördinaten van de aangelegde leidingen.",
  "Proefsleuven zijn verplicht wanneer de ligging van bestaande kabels en leidingen onvoldoende duidelijk is uit de KLIC-tekeningen, of bij gestuurde boringen en kruisingen.",
  "De korting bij termijnoverschrijding bedraagt €2.500 per werkdag voor dit project, met een maximum van 10% van de aanneemsom conform de UAV 2012.",
  "Het betalingsschema is: 30% bij opdracht/start werk, 40% bij afronding ruwbouw/hoofdwerk, 30% na goedgekeurde oplevering en ontvangst revisiedocumentatie.",
  "De volgende CROW-richtlijnen zijn van toepassing: CROW 500 voor grondwerk en verhardingen, CROW 400 voor verkeersmaatregelen, en de CROW-publicaties voor kabels en leidingen.",
  "Drukproeven op waterleidingen worden uitgevoerd conform NEN 3650. De testdruk bedraagt 1,5x de bedrijfsdruk, gedurende minimaal 1 uur. Acceptatiecriterium: geen drukval.",
];

async function main() {
  console.log("🌱 Seeding demo data voor netbeheerders, waterbedrijven en aannemers...");

  // Create admin user
  const hashedPassword = await hash("password123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@contractbot.nl" },
    update: {},
    create: {
      name: "Admin Contractbot",
      email: "admin@contractbot.nl",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created/updated");

  // Create users from different organizations
  console.log("📝 Creating users from netbeheerders, waterbedrijven en aannemers...");
  const users = [adminUser];

  // Netbeheerder medewerkers
  for (const nb of netbeheerders) {
    for (const functie of functies.netbeheerder) {
      const name = `${functie} ${nb.name}`;
      const email = `${functie.toLowerCase().replace(/\s+/g, '.')}@${nb.domain}`;
      
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });
      users.push(user);
    }
  }

  // Waterbedrijf medewerkers
  for (const wb of waterbedrijven) {
    for (const functie of functies.waterbedrijf) {
      const name = `${functie} ${wb.name}`;
      const email = `${functie.toLowerCase().replace(/\s+/g, '.')}@${wb.domain}`;
      
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });
      users.push(user);
    }
  }

  // Aannemer medewerkers
  for (const an of aannemers) {
    for (const functie of functies.aannemer) {
      const name = `${functie} ${an.name}`;
      const email = `${functie.toLowerCase().replace(/\s+/g, '.')}@${an.domain}`;
      
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          name,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });
      users.push(user);
    }
  }

  console.log(`✅ Created/Updated ${users.length} users`);

  // Create documents
  console.log("📄 Creating contract documents...");
  const documents = [];

  for (let i = 0; i < contractTemplates.length; i++) {
    const template = contractTemplates[i];
    const uploader = users[Math.floor(Math.random() * users.length)];
    const uploadDate = randomDateWithinLast6Months();
    const fileSize = Math.floor(Math.random() * 500000) + 100000;

    const document = await prisma.document.upsert({
      where: { id: `doc-${i + 1}` },
      update: {},
      create: {
        id: `doc-${i + 1}`,
        title: template.title,
        filename: template.filename,
        filePath: `/uploads/${template.filename}`,
        fileSize,
        mimeType: "application/pdf",
        content: template.content,
        uploadedBy: uploader.id,
        uploadedAt: uploadDate,
      },
    });
    documents.push(document);
  }

  // Create multiple versions of key documents
  const keyDocs = [0, 1, 2, 6]; // UAV, UAV-GC, Raamovereenkomst, Inkoopvoorwaarden
  let docCounter = documents.length;
  for (let version = 2; version <= 10; version++) {
    for (const docIndex of keyDocs) {
      const template = contractTemplates[docIndex];
      const uploader = users[Math.floor(Math.random() * users.length)];
      const uploadDate = randomDateWithinLast6Months();
      const fileSize = Math.floor(Math.random() * 500000) + 100000;
      docCounter++;
      const docId: string = `doc-${docCounter}`;

      const doc = await prisma.document.upsert({
        where: { id: docId },
        update: {},
        create: {
          id: docId,
          title: `${template.title} v${version}`,
          filename: template.filename.replace('.pdf', `-v${version}.pdf`),
          filePath: `/uploads/${template.filename.replace('.pdf', `-v${version}.pdf`)}`,
          fileSize,
          mimeType: "application/pdf",
          content: template.content,
          uploadedBy: uploader.id,
          uploadedAt: uploadDate,
        },
      });
      documents.push(doc);
    }
  }

  console.log(`✅ Created/Updated ${documents.length} documents`);

  // Create conversations and messages
  console.log("💬 Creating conversations and messages...");
  const totalConversations = 200;
  const conversationsCreated = [];

  for (let i = 0; i < totalConversations; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const topic = conversationTopics[i % conversationTopics.length];
    const conversationDate = randomDateWithinLast6Months();
    const title = `${topic} ${i >= conversationTopics.length ? `(${Math.floor(i / conversationTopics.length) + 1})` : ''}`.trim();

    const conversation = await prisma.conversation.upsert({
      where: { id: `conv-${i + 1}` },
      update: {},
      create: {
        id: `conv-${i + 1}`,
        userId: user.id,
        title,
        updatedAt: conversationDate,
      },
    });
    conversationsCreated.push(conversation);

    // Create 2-8 messages per conversation
    const messageCount = Math.floor(Math.random() * 7) + 2;
    const messages = [];

    for (let j = 0; j < messageCount; j++) {
      const isUser = j % 2 === 0;
      const messageTime = new Date(conversationDate.getTime() + j * 5 * 60 * 1000);

      let content = "";
      if (isUser) {
        content = userQuestions[Math.floor(Math.random() * userQuestions.length)];
      } else {
        content = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      }

      messages.push({
        conversationId: conversation.id,
        role: isUser ? "USER" : "ASSISTANT",
        content,
        createdAt: messageTime,
      });
    }

    await prisma.message.createMany({
      data: messages,
    });
  }

  console.log("✅ Created conversations and messages");

  console.log("\n🎉 Demo data seeding completed!");
  console.log(`\n📊 Summary:`);
  console.log(`   Users: ${users.length}`);
  console.log(`   Documents: ${documents.length}`);
  console.log(`   Conversations: ${conversationsCreated.length}`);
  console.log(`   Data focus: Netbeheerders, Waterbedrijven, Aannemers`);
  console.log(`   Contract types: UAV 2012, UAV-GC, Raamovereenkomsten, SLA's`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding demo data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
