# ClinicFlow AI

WhatsApp-first AI receptionist + clinic OS for Indian clinics.

## Quick start

```bash
# Backend (Prisma uses SQLite — creates backend/prisma/dev.db)
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev   # http://localhost:4000

# Frontend (new terminal)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev   # http://localhost:3000
```

Optional: start PostgreSQL with `docker compose up -d` if you switch `datasource` in `backend/prisma/schema.prisma` to PostgreSQL and point `DATABASE_URL` in `.env` at that instance.

Login: `admin@clinic.local` / `admin123`

## Stack
- Next.js 14, Tailwind, TypeScript
- Node.js, Express, Prisma, SQLite (local dev database file)
- JWT auth, OpenAI for AI replies, node-cron for reminders
- WhatsApp Cloud API webhook (stubbed; plug in BSP like AiSensy/Interakt in `src/whatsapp.js`)

## Compliance notes
- DPDP Act 2023: consent flag stored on every Lead and Patient; data retention helper in `src/db.js`.
- ABDM/ABHA: `patient.abhaId` field reserved; integration is roadmapped, not implemented.
- Host on AWS Mumbai / ap-south-1 in production. Do not store PII on US edge.
