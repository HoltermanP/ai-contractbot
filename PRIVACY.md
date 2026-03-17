# Privacy & AVG Compliance

## Overzicht

Contractbot is ontworpen met privacy en AVG-compliance als kernwaarden. Dit document beschrijft hoe we omgaan met persoonsgegevens en bedrijfsvertrouwelijke informatie.

## Gegevensverzameling

### Gebruikersgegevens
- **Email adres**: Gebruikt voor authenticatie
- **Naam**: Optioneel, voor persoonlijke weergave
- **Wachtwoord**: Gehashed opgeslagen met bcrypt (nooit in plain text)

### Documenten
- **Contractdocumenten**: Opgeslagen lokaal op de server
- **Geëxtraheerde tekst**: Opgeslagen in database voor zoekfunctionaliteit
- **Metadata**: Bestandsnaam, grootte, uploaddatum

### Chat Geschiedenis
- **Vragen en antwoorden**: Opgeslagen voor context in conversaties
- **Gebruikte documenten**: Referenties naar documenten die gebruikt zijn voor antwoorden

## Gegevensbescherming

### Beveiliging
- ✅ Wachtwoorden worden gehashed met bcrypt (10 rounds)
- ✅ JWT tokens voor sessiebeheer
- ✅ HTTPS verplicht in productie
- ✅ Input validatie en sanitization
- ✅ SQL injection bescherming via Prisma ORM
- ✅ XSS bescherming via React

### Toegangscontrole
- ✅ Rolgebaseerde toegang (USER vs ADMIN)
- ✅ Authenticatie vereist voor alle functionaliteit
- ✅ Admin-only toegang voor document upload
- ✅ Gebruikers kunnen alleen eigen conversaties zien

## Externe Services

### OpenAI
- **Gebruik**: AI antwoord generatie
- **Data**: Vragen en document context worden naar OpenAI gestuurd
- **Privacy**: OpenAI heeft eigen privacybeleid. Controleer hun AVG compliance.
- **Aanbeveling**: Overweeg self-hosted LLM voor volledige controle

### UAV (Unie van Aannemers)
- **Status**: Placeholder implementatie
- **Aanbeveling**: Implementeer via officiële API met proper authenticatie
- **Privacy**: Controleer UAV privacybeleid bij implementatie

## Gegevensretentie

- **Gebruikersaccounts**: Blijven actief tot verwijdering
- **Documenten**: Soft delete (isActive flag) - kunnen worden hersteld
- **Conversaties**: Blijven bewaard voor gebruikerscontext
- **Logs**: Minimale logging, geen gevoelige data

## Gebruikersrechten (AVG)

Gebruikers hebben het recht op:
- **Inzage**: Bekijk je eigen gegevens via de applicatie
- **Rectificatie**: Wijzig je profielgegevens
- **Verwijdering**: Vraag account verwijdering aan (admin)
- **Bezwaar**: Stop met gebruik van de applicatie
- **Gegevensoverdraagbaarheid**: Exporteer je data (feature kan worden toegevoegd)

## Aanbevelingen voor Productie

1. **Encryptie**: Implementeer encryptie-at-rest voor documenten
2. **Backup**: Regelmatige backups met encryptie
3. **Audit Logging**: Log alle belangrijke acties (document upload, verwijdering)
4. **Data Minimization**: Verwijder oude conversaties na X dagen
5. **Self-hosted AI**: Overweeg self-hosted LLM (Llama, Mistral) voor volledige controle
6. **Regular Security Audits**: Voer regelmatig security audits uit
7. **Privacy Policy**: Voeg een privacy policy pagina toe aan de applicatie
8. **Terms of Service**: Voeg terms of service toe

## Contact

Voor vragen over privacy of AVG compliance, neem contact op met [contact informatie].

## Changelog

- **v1.0.0**: Initiële implementatie met basis privacy maatregelen

