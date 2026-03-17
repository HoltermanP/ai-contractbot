# Contractbot

Een AVG-proof Next.js applicatie voor het beheren en raadplegen van contractdocumenten met AI-ondersteuning.

## Features

- 🤖 **AI Chat Interface**: Stel vragen over contracten en krijg antwoorden op basis van geüploade documenten
- 📄 **Document Beheer**: Upload en beheer contractdocumenten (PDF)
- 🔐 **Authenticatie**: Veilige gebruikersauthenticatie met NextAuth
- 👥 **Rolgebaseerde Toegang**: Scheiding tussen gebruikers en beheerders
- 🛡️ **AVG-Compliance**: Volledige privacybescherming en beveiliging
- 📚 **UAV Integratie**: Mogelijkheid om UAV informatie te raadplegen

## Technologie Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Database**: Neon (PostgreSQL) voor development en productie
- **Bestanden**: lokaal in `uploads/`, in productie in Vercel Blob
- **ORM**: Prisma
- **Authenticatie**: NextAuth.js
- **AI**: OpenAI GPT-4o-mini
- **PDF Processing**: pdf-parse

## Installatie

1. Clone de repository:
```bash
git clone <repository-url>
cd Contractbot
```

2. Installeer dependencies:
```bash
npm install
```

3. Maak een `.env` bestand aan (kopieer van `.env.example`):
   - **DATABASE_URL**: Neon PostgreSQL-connection string van [neon.tech](https://neon.tech)
   - **NEXTAUTH_URL**, **NEXTAUTH_SECRET**, **OPENAI_API_KEY**: zoals in `.env.example`
   - **BLOB_READ_WRITE_TOKEN**: alleen voor productie (Vercel Blob); lokaal worden bestanden in `uploads/` opgeslagen

4. Initialiseer de database (Neon):
```bash
npx prisma generate
npx prisma db push
```
Voor productie kun je migraties gebruiken: `npx prisma migrate deploy`

5. Maak een admin gebruiker aan:
```bash
npm run create-admin
```

Of met custom credentials:
```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=securepassword npm run create-admin
```

6. Start de development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

## Gebruik

### Als Admin

1. Log in met je admin credentials
2. Ga naar de "Beheer" pagina
3. Upload contractdocumenten (PDF)
4. Documenten worden automatisch geïndexeerd en kunnen gebruikt worden voor vragen

### Als Gebruiker

1. Log in met je gebruikersaccount
2. Ga naar de "Chat" pagina
3. Stel vragen over contracten
4. De AI gebruikt geüploade documenten om antwoorden te geven
5. Optioneel: vink "Ook UAV raadplegen" aan voor UAV informatie

## AVG & Security

De applicatie is gebouwd met privacy en beveiliging als prioriteit:

- ✅ Wachtwoorden worden gehashed met bcrypt
- ✅ JWT-based sessie management
- ✅ Rolgebaseerde toegangscontrole
- ✅ Documenten lokaal in `uploads/`; in productie optioneel in Vercel Blob (privé)
- ✅ Geen bedrijfsvertrouwelijke informatie wordt gedeeld met externe services (behalve OpenAI voor AI functionaliteit)
- ✅ Soft delete voor documenten
- ✅ Input validatie en sanitization

Zie `PRIVACY.md` voor meer details over privacy en AVG compliance.

## Project Structuur

```
Contractbot/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin pagina's
│   │   ├── auth/              # Authenticatie pagina's
│   │   ├── chat/               # Chat interface
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── admin/             # Admin componenten
│   │   ├── chat/              # Chat componenten
│   │   ├── layout/            # Layout componenten
│   │   └── ui/                # shadcn UI componenten
│   ├── lib/
│   │   ├── ai.ts              # AI integratie
│   │   ├── auth.ts            # NextAuth configuratie
│   │   ├── documents.ts       # Document management
│   │   └── prisma.ts          # Prisma client
│   └── types/                 # TypeScript types
└── uploads/                   # Geüploade documenten (gitignored)
```

## Development

### Database Migraties

```bash
# Maak een nieuwe migratie
npx prisma migrate dev --name migration-name

# Push schema changes (development)
npx prisma db push
```

### Nieuwe shadcn Componenten

```bash
npx shadcn@latest add [component-name]
```

## Productie Deployment

1. **Database**: Gebruik Neon (PostgreSQL). Zet `DATABASE_URL` op je Neon connection string (met `?sslmode=require`).
2. **Bestanden**: Maak een Vercel Blob store aan in je Vercel-project en zet `BLOB_READ_WRITE_TOKEN` in de environment variables. Zonder deze variabele werken uploads in productie niet persistent (serverless filesystem is tijdelijk).
3. **Overige env**: Stel `NEXTAUTH_URL` in op je productie-URL, genereer een sterk `NEXTAUTH_SECRET`, en vul `OPENAI_API_KEY` in.
4. Build en start:
```bash
npm run build
npm start
```
Of deploy op Vercel: koppel de repo en configureer de env vars (inclusief Neon `DATABASE_URL` en optioneel `BLOB_READ_WRITE_TOKEN`).

## Licentie

[Voeg licentie toe]

## Contact

[Voeg contact informatie toe]
