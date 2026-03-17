import type { ELearningContentJson } from "./ai";

/** Vaste e-learning module AVG (Algemene Verordening Gegevensbescherming) – diepgaande inhoud */
export const AVG_MODULE_CONTENT: ELearningContentJson = {
  sections: [
    {
      title: "Wat is de AVG en waarom is het belangrijk?",
      content: `De Algemene Verordening Gegevensbescherming (AVG), in het Engels General Data Protection Regulation (GDPR), is sinds 25 mei 2018 van toepassing in de hele Europese Unie. De AVG vervangt de oude Wet bescherming persoonsgegevens (Wbp) en versterkt de rechten van betrokkenen (de personen van wie je gegevens verwerkt).

De AVG is een verordening: dat betekent dat deze rechtstreeks geldt in alle lidstaten, zonder dat elke lidstaat aparte wetten hoeft te maken. Nederland heeft wel de Uitvoeringswet AVG (UAVG) aangenomen voor onderwerpen die de verordening aan de lidstaten overlaten (bijv. verwerking in het kader van werkgever-werknemer, journalistiek, strafrecht).

Belangrijke doelen van de AVG:
- **Bescherming van persoonsgegevens** als grondrecht
- **Vrije verkeer van gegevens** binnen de EU onder gelijke bescherming
- **Harmonisatie** van regels zodat bedrijven in de hele EU met één set regels te maken hebben
- **Verantwoording** (accountability): organisaties moeten kunnen aantonen dat ze compliant zijn

Voor contracten en zakelijke relaties is de AVG relevant omdat je vaak persoonsgegevens verwerkt: namen, e-mailadressen, contactgegevens van opdrachtgevers, aannemers, onderaannemers, en personeel. Ook gegevens in contracten (handtekeningen, BSN waar relevant, salaris- of betalingsgegevens) kunnen persoonsgegevens zijn.`,
      keyPoints: [
        "AVG geldt sinds 25 mei 2018 in de hele EU",
        "Vervangt de oude Wbp; UAVG vult aan waar de AVG ruimte laat",
        "Doel: bescherming persoonsgegevens als grondrecht en vrije verkeer van gegevens",
        "Relevant voor contracten: namen, contactgegevens, handtekeningen, betalingsgegevens",
        "Accountability: je moet compliance kunnen aantonen",
      ],
      examples: [
        {
          title: "Praktijk: Netbeheerder en aannemers",
          scenario: "Een netbeheerder sluit contracten met tientallen aannemers. In de contracten staan namen, adressen, KVK-nummers en contactpersonen. Bij oplevering worden handtekeningen en soms BSN van toezichthouders verwerkt.",
          solution: "Dit zijn allemaal persoonsgegevens. De netbeheerder is verwerkingsverantwoordelijke voor deze gegevens en moet voldoen aan de AVG: rechtsgrond, doeleinden, bewaartermijnen, beveiliging en rechten van betrokkenen.",
        },
      ],
    },
    {
      title: "Rechtsgronden voor verwerking",
      content: `Je mag persoonsgegevens alleen verwerken als er een **rechtsgrond** is (art. 6 AVG). De belangrijkste in een contractencontext:

**Uitvoering van een overeenkomst (art. 6 lid 1 onder b)**  
Als de verwerking noodzakelijk is voor de uitvoering van het contract met de betrokkene, is dit de meest logische grond. Bijvoorbeeld: naam en contactgegevens van de contactpersoon van de aannemer om het project te kunnen uitvoeren.

**Rechtmatig belang (art. 6 lid 1 onder f)**  
Verwerking is toegestaan als noodzakelijk voor je gerechtvaardigde belang, tenzij het belang van de betrokkene zwaarder weegt. Denk aan: fraude-preventie, beveiliging, archivering van contracten. Je moet een belangenafweging documenteren.

**Wettelijke verplichting (art. 6 lid 1 onder c)**  
Als een wet je verplicht gegevens te bewaren (bijv. fiscaal 7 jaar), is dat een rechtsgrond.

**Toestemming (art. 6 lid 1 onder a)**  
Soms wordt toestemming gebruikt, maar voor contractuitvoering is dat vaak niet nodig of zelfs onwenselijk (toestemming kan worden ingetrokken). Gebruik toestemming alleen als er geen andere grond past.

Let op: voor **bijzondere persoonsgegevens** (gezondheid, ras, politieke opvattingen, etc.) gelden strengere regels (art. 9 AVG); in de meeste contracten kom je die niet tegen.`,
      keyPoints: [
        "Zonder rechtsgrond mag je niet verwerken",
        "Uitvoering overeenkomst: meest gebruikte grond bij contracten",
        "Rechtmatig belang: documenteer belangenafweging",
        "Wettelijke verplichting: bijv. fiscale bewaarplicht",
        "Toestemming: niet altijd nodig en kan worden ingetrokken",
      ],
      examples: [
        {
          title: "Welke grond voor contactgegevens in een UAV-contract?",
          scenario: "Je sluit een UAV-contract. Je verwerkt naam, e-mail en telefoon van de contactpersoon van de aannemer voor communicatie over het project.",
          solution: "Uitvoering van de overeenkomst (art. 6 onder b) is de passende grond: zonder deze gegevens kun je het contract niet uitvoeren. Geen toestemming nodig.",
        },
      ],
    },
    {
      title: "Rechten van betrokkenen",
      content: `De AVG geeft betrokkenen (de personen van wie je gegevens verwerkt) duidelijke rechten. Je moet deze kunnen honoreren binnen de gestelde termijnen.

**Recht op inzage (art. 15)**  
De betrokkene mag weten of je zijn gegevens verwerkt en zo ja, welke, met welk doel, hoe lang je ze bewaart, en aan wie je ze doorgeeft. Je moet een kopie van de gegevens verstrekken (meestal binnen één maand).

**Recht op rectificatie (art. 16)**  
Onjuiste gegevens moet je corrigeren op verzoek.

**Recht op wissing / 'recht om vergeten te worden' (art. 17)**  
In bepaalde gevallen moet je gegevens wissen: als ze niet meer nodig zijn, als toestemming wordt ingetrokken, als verwerking onrechtmatig was, of als de betrokkene bezwaar maakt (en er geen zwaarwegende gerechtvaardigde gronden zijn). Let op: voor contract- en fiscale gegevens geldt vaak een **wettelijke bewaarplicht**; dan mag je niet zomaar wissen vóór het einde van die termijn.

**Recht op beperking van verwerking (art. 18)**  
In sommige situaties hoeft je de gegevens niet te wissen maar wel de verwerking te beperken (alleen bewaren, niet actief gebruiken) tot een geschil is opgelost of een verzoek is beoordeeld.

**Recht op overdraagbaarheid (art. 20)**  
Als de verwerking op toestemming of op een overeenkomst is gebaseerd en geautomatiseerd gebeurt, kan de betrokkene vragen zijn gegevens in een gestructureerd formaat te ontvangen (bijv. JSON/CSV) om door te geven aan een andere dienstverlener.

**Recht van bezwaar (art. 21)**  
De betrokkene kan bezwaar maken tegen verwerking op grond van rechtmatig belang of voor direct marketing. Je moet dan stoppen tenzij je dwingende gerechtvaardigde gronden hebt.

Praktisch: zorg voor een duidelijke procedure (wie handelt verzoeken af, binnen welke termijn) en documenteer je reacties.`,
      keyPoints: [
        "Inzage: binnen ca. één maand, kopie van gegevens",
        "Rectificatie: onjuiste gegevens corrigeren",
        "Wissing: alleen als geen uitzondering (bijv. bewaarplicht)",
        "Beperking: verwerking pauzeren in bepaalde gevallen",
        "Overdraagbaarheid: bij toestemming/overeenkomst en geautomatiseerde verwerking",
        "Bezwaar: bij rechtmatig belang of direct marketing",
      ],
    },
    {
      title: "Verwerkers en verwerkersovereenkomsten",
      content: `Als je een **verwerker** inschakelt (een partij die namens jou persoonsgegevens verwerkt), moet je een **verwerkersovereenkomst** sluiten (art. 28 AVG). In die overeenkomst moeten in ieder geval staan:

- Onderwerp en duur van de verwerking
- Doel en middelen van de verwerking
- Soort persoonsgegevens en categorieën van betrokkenen
- Rechten en plichten van de verantwoordelijke (jij)
- Dat de verwerker alleen op jouw schriftelijke instructie verwerkt
- Geheimhouding
- Passende technische en organisatorische maatregelen (beveiliging)
- Of er subverwerkers zijn en hoe daarmee wordt omgegaan
- Ondersteuning bij het voldoen aan rechten van betrokkenen en bij datalekken
- Vernietiging of terugzending van gegevens na afloop

Voorbeelden van verwerkers: cloudopslag (SharePoint, Google Workspace), een extern facturatiesysteem, een partij die namens jou mailings doet. Een aannemer die alleen zijn eigen personeelsgegevens verwerkt voor jouw project is vaak geen verwerker van jouw persoonsgegevens; hij verwerkt dan zijn eigen gegevens. Maar als jij een CRM-tool deelt met een partner die namens jou contactgegevens van opdrachtgevers bijwerkt, is die partner wel verwerker.

Zonder geldige verwerkersovereenkomst mag je de verwerking niet uitbesteden.`,
      keyPoints: [
        "Verwerker = partij die namens jou persoonsgegevens verwerkt",
        "Verwerkersovereenkomst is verplicht (art. 28 AVG)",
        "Bevat o.a. onderwerp, duur, doeleinden, beveiliging, subverwerkers",
        "Verwerker mag alleen op jouw instructie verwerken",
        "Geen overeenkomst = niet uitbesteden",
      ],
      examples: [
        {
          title: "Is een aannemer een verwerker?",
          scenario: "Een aannemer krijgt van jou een lijst met contactpersonen van de opdrachtgever om afspraken te plannen. Hij slaat die lijst op in zijn eigen systeem.",
          solution: "De aannemer verwerkt dan persoonsgegevens die jij hem hebt gegeven, namens jou (voor het project). Dat kan als verwerker worden gezien. Afhankelijk van de omvang en duur is een (korte) verwerkersovereenkomst of verwerkersclausule in het hoofdcontract verstandig.",
        },
      ],
    },
    {
      title: "Datalekken en meldplicht",
      content: `Een **datalek** is een inbreuk op de beveiliging die per ongeluk of onrechtmatig leidt tot vernietiging, verlies, wijziging of ongeautoriseerde verstrekking van of toegang tot doorgegeven, opgeslagen of anderszins verwerkte persoonsgegevens (art. 4 sub 12 AVG).

**Meldplicht aan de toezichthouder (art. 33 AVG)**  
Binnen **72 uur** na ontdekking van een lek moet je het melden bij de Autoriteit Persoonsgegevens (AP), tenzij het lek geen risico vormt voor de rechten en vrijheden van personen. De melding bevat o.a. aard van het lek, categorieën betrokkenen, gevolgen, genomen maatregelen.

**Meldplicht aan betrokkenen (art. 34 AVG)**  
Als het lek een **hoog risico** oplevert voor de rechten en vrijheden van betrokkenen, moet je hen ook informeren, zonder onredelijke vertraging. Je hoeft niet te melden als je passende technische/organisatorische maatregelen hebt getroffen (bijv. versleuteling), of als de melding onevenredige inspanning vergt (dan volstaat openbare communicatie).

**Documentatie**  
Elk datalek moet intern worden gedocumenteerd: wat is er gebeurd, wanneer, welke gegevens, welke maatregelen, of er gemeld is. De AP kan hierom vragen.

In een contractenomgeving: denk aan per ongeluk e-mailen naar verkeerde ontvanger, verlies van een laptop met contracten, of een inbraak in een archief. Voorkomen door toegangsbeheer, versleuteling en duidelijke procedures.`,
      keyPoints: [
        "Datalek = inbreuk op beveiliging die leidt tot verlies/onrechtmatige toegang",
        "Melden bij AP binnen 72 uur (tenzij geen risico)",
        "Melden aan betrokkenen bij hoog risico, zonder onredelijke vertraging",
        "Uitzonderingen: o.a. versleuteling of onevenredige inspanning",
        "Documenteer elk lek intern",
      ],
    },
    {
      title: "Bewaartermijnen en documentatie",
      content: `Persoonsgegevens mag je niet langer bewaren dan nodig voor het doel (art. 5 lid 1 onder e AVG). Je moet **bewaartermijnen** vastleggen en kunnen onderbouwen.

Voor contracten: vaak geldt een **wettelijke bewaarplicht** (bijv. 7 jaar fiscaal, of 5 jaar voor bepaalde civiele vorderingen). Binnen die termijn mag je niet zomaar wissen vanwege het recht op wissing. Na afloop van de bewaarplicht moet je gegevens wel verwijderen of anonimiseren, tenzij je een andere rechtsgrond hebt (bijv. archivering in het algemeen belang).

**Documentatie (accountability)**  
Je moet kunnen aantonen dat je compliant bent. Dat betekent o.a.:
- **Register van verwerkingsactiviteiten** (art. 30 AVG): welke gegevens, doel, rechtsgrond, bewaartermijn, ontvangers, doorgiften buiten EU, beveiligingsmaatregelen. Verplicht voor verantwoordelijken en verwerkers (behalve kleine ondernemingen onder bepaalde voorwaarden).
- **Privacyverklaring** voor betrokkenen: transparant over wat je doet met hun gegevens.
- **Functionaris voor gegevensbescherming (FG)** verplicht in bepaalde gevallen (overheid, grootschalige verwerking, bijzondere gegevens).

In de praktijk: koppel bewaartermijnen aan je contract- en archiefbeleid. Vermeld in je verwerkersovereenkomsten hoe lang verwerkers gegevens bewaren en wat er daarna mee gebeurt.`,
      keyPoints: [
        "Bewaren niet langer dan nodig; bewaartermijnen vastleggen",
        "Wettelijke bewaarplicht gaat vóór recht op wissing tijdens die termijn",
        "Register van verwerkingsactiviteiten: verplicht (met uitzonderingen)",
        "Privacyverklaring: transparantie naar betrokkenen",
        "FG verplicht in bepaalde situaties",
      ],
    },
  ],
  quiz: [
    {
      question: "Sinds wanneer is de AVG van toepassing in de EU?",
      type: "multiple",
      options: [
        "1 januari 2016",
        "25 mei 2018",
        "1 januari 2020",
        "Bij de invoering van de UAVG",
      ],
      correct: 1,
      explanation: "De AVG is op 25 mei 2018 in werking getreden en is sindsdien rechtstreeks van toepassing in alle EU-lidstaten.",
    },
    {
      question: "Welke rechtsgrond is het meest passend voor het verwerken van naam en contactgegevens van de contactpersoon van een aannemer in het kader van een UAV-contract?",
      type: "multiple",
      options: [
        "Toestemming",
        "Uitvoering van een overeenkomst",
        "Rechtmatig belang",
        "Wettelijke verplichting",
      ],
      correct: 1,
      explanation: "De verwerking is noodzakelijk voor de uitvoering van het contract (art. 6 lid 1 onder b AVG). Zonder deze gegevens kan het project niet worden uitgevoerd.",
    },
    {
      question: "Binnen welke termijn moet een datalek bij de Autoriteit Persoonsgegevens worden gemeld?",
      type: "multiple",
      options: [
        "24 uur",
        "72 uur",
        "1 week",
        "30 dagen",
      ],
      correct: 1,
      explanation: "Volgens art. 33 AVG moet een inbreuk bij de toezichthouder worden gemeld binnen 72 uur na ontdekking, tenzij het geen risico vormt voor de rechten en vrijheden van personen.",
    },
    {
      question: "Een betrokkene vraagt om wissing van zijn gegevens. Je bewaart die gegevens nog vanwege de fiscale bewaarplicht van 7 jaar. Wat doe je?",
      type: "scenario",
      scenario: "De betrokkene was contactpersoon bij een afgerond project. De 7 jaar is nog niet verstreken.",
      options: [
        "Je wist de gegevens direct vanwege het recht op wissing",
        "Je weigert wissing tot na afloop van de bewaarplicht en legt dit uit",
        "Je vraagt toestemming aan de Belastingdienst",
        "Je wist alleen de e-mail maar niet de naam",
      ],
      correct: 1,
      explanation: "Het recht op wissing kent uitzonderingen. Een wettelijke bewaarplicht (zoals de fiscale 7 jaar) gaat voor. Je moet de betrokkene informeren dat je niet kunt wissen zolang die plicht geldt.",
    },
    {
      question: "Wat moet in een verwerkersovereenkomst volgens de AVG in ieder geval staan?",
      type: "multiple",
      options: [
        "Alleen de naam van de verwerker",
        "Onderwerp en duur, doeleinden, beveiliging, instructies, geheimhouding en ondersteuning bij rechten en datalekken",
        "Alleen de bewaartermijn",
        "Alleen het soort persoonsgegevens",
      ],
      correct: 1,
      explanation: "Art. 28 AVG noemt een verplichte lijst van onderwerpen die in de verwerkersovereenkomst moeten staan, waaronder onderwerp/duur, doeleinden, beveiliging, instructies en geheimhouding.",
    },
    {
      question: "Wanneer moet je betrokkenen informeren over een datalek?",
      type: "multiple",
      options: [
        "Altijd binnen 24 uur",
        "Alleen als het lek een hoog risico oplevert voor hun rechten en vrijheden",
        "Alleen als de AP dat vraagt",
        "Nooit; alleen de AP moet worden gemeld",
      ],
      correct: 1,
      explanation: "Art. 34 AVG: je moet betrokkenen zonder onredelijke vertraging informeren als het lek een hoog risico oplevert voor hun rechten en vrijheden. Er zijn uitzonderingen (bijv. passende maatregelen zoals versleuteling).",
    },
    {
      question: "Wat is het 'register van verwerkingsactiviteiten'?",
      type: "multiple",
      options: [
        "Een lijst van alle betrokkenen",
        "Documentatie van je verwerkingen: welke gegevens, doel, rechtsgrond, bewaartermijn, beveiliging, etc.",
        "Alleen voor verwerkers verplicht",
        "Een register van datalekken",
      ],
      correct: 1,
      explanation: "Art. 30 AVG verplicht verantwoordelijken en verwerkers (met uitzonderingen) een register bij te houden met o.a. doeleinden, categorieën gegevens, ontvangers, bewaartermijnen en beveiligingsmaatregelen.",
    },
    {
      question: "Een aannemer verwerkt namens jou de contactgegevens van opdrachtgevers in een gedeeld projectportaal. Wat is de juiste kwalificatie?",
      type: "scenario",
      scenario: "Jij (opdrachtgever) deelt het portaal; de aannemer voegt contactpersonen toe en beheert toegang.",
      options: [
        "De aannemer is verantwoordelijke, jij bent verwerker",
        "De aannemer is verwerker, jij bent verantwoordelijke",
        "Geen van beiden verwerkt persoonsgegevens",
        "Alleen de portaalaanbieder is verwerker",
      ],
      correct: 1,
      explanation: "Jij bepaalt het doel en de middelen van de verwerking (welke contactgegevens, waarvoor). De aannemer verwerkt die gegevens namens jou. Dus jij bent verantwoordelijke, de aannemer is verwerker. De portaalaanbieder kan ook verwerker zijn voor jullie beiden.",
    },
    {
      question: "Recht op overdraagbaarheid van gegevens (art. 20 AVG) geldt in welke situatie?",
      type: "multiple",
      options: [
        "Altijd, voor alle persoonsgegevens",
        "Alleen als verwerking op toestemming of overeenkomst is gebaseerd en geautomatiseerd",
        "Alleen voor bijzondere persoonsgegevens",
        "Alleen bij een datalek",
      ],
      correct: 1,
      explanation: "Het recht op overdraagbaarheid geldt wanneer de verwerking is gebaseerd op toestemming of een overeenkomst en door geautomatiseerde middelen plaatsvindt. De betrokkene kan dan zijn gegevens in een gestructureerd formaat ontvangen.",
    },
    {
      question: "Wat wordt bedoeld met 'accountability' in de AVG?",
      type: "multiple",
      options: [
        "Alleen het melden van datalekken",
        "De verplichting om te kunnen aantonen dat je compliant bent met de AVG",
        "Het recht van betrokkenen op inzage",
        "Alleen het hebben van een privacyverklaring",
      ],
      correct: 1,
      explanation: "Accountability (art. 5 lid 2 AVG) betekent dat je verantwoordelijk bent voor de naleving van de beginselen en dat je die naleving moet kunnen aantonen. Documentatie en een register van verwerkingsactiviteiten horen daarbij.",
    },
  ],
};

export const AVG_MODULE_META = {
  title: "AVG – Algemene Verordening Gegevensbescherming",
  description: "Diepgaande e-learning over de AVG: rechtsgronden, rechten van betrokkenen, verwerkers, datalekken en bewaartermijnen.",
  paragraph: "AVG",
  duration: 45,
  xpReward: 200,
  sortOrder: -1000, // zodat AVG bovenaan kan staan
};
