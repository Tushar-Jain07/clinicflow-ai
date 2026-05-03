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

Login: `admin@clinic.local` / `admin123` (email/password), or **Sign in with Google** when OAuth is configured.

### Google Sign-In (optional)

Uses Google Identity Services (your Gmail / Google Workspace account — no password is stored on ClinicFlow).

1. If Google asks you to configure the **OAuth consent screen** first: APIs & Services → **OAuth consent screen** → choose **External** (or **Internal** if everyone uses your Workspace). App name can be **ClinicFlow AI**. **User support email** must be a real inbox you monitor — use **your own Gmail or Workspace email** (the same account or any email you control). **Developer contact email** can be the same address.
2. In **Credentials** → **Create credentials** → **OAuth client ID** → Application type **Web application**.
3. Under **Authorized JavaScript origins**, add `http://localhost:3000` and your production site URL.
4. Copy the **Client ID** into **`backend/.env`** → `GOOGLE_CLIENT_ID`. The frontend picks up the same value automatically via `frontend/next.config.js` (you can override with `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local` if needed).
5. Restart backend and frontend. New Google users get a dashboard account automatically (`staff` role); seeded admin stays `admin`.
6. For **production**, add your deployed site URL under **Authorized JavaScript origins** (see [Deploy on Vercel](#deploy-on-vercel) below).

### Deploy on Vercel (frontend)

This repo’s **Next.js app** lives in **`frontend/`**. The **Express API** (`backend/`) is **not** run by Vercel — host it separately (Railway, Render, Fly.io, VPS, etc.) and point the frontend at it.

1. **Import the repo** in [Vercel](https://vercel.com/) → **Add New…** → **Project** → select **clinicflow-ai** from GitHub.
2. Set **Root Directory** to **`frontend`** (important — monorepo).
3. Under **Environment Variables** (Production / Preview), set:
   - **`NEXT_PUBLIC_API_URL`** — public URL of your API, e.g. `https://api.yourdomain.com` (no trailing slash). Until the API is deployed, the live site cannot load dashboard data (defaults to `localhost` only if unset).
   - **`NEXT_PUBLIC_GOOGLE_CLIENT_ID`** — same Web Client ID as **`GOOGLE_CLIENT_ID`** on the backend (required on Vercel builds because `backend/.env` is not in git).
4. **Deploy**. Optional CLI from `frontend/`: `npx vercel --prod` (requires login once).
5. **Google Cloud Console** → your OAuth Web client → **Authorized JavaScript origins**: add  
   `https://<your-vercel-domain>` (and preview URLs if you use Google login on previews).

Compliance note: default Vercel regions may be outside India — see [Vercel regions](https://vercel.com/docs/regions); align with your DPDP / data residency policy.

## Stack
- Next.js 14, Tailwind, TypeScript
- Node.js, Express, Prisma, SQLite (local dev database file)
- JWT auth (email/password + optional Google OAuth), OpenAI for AI replies, node-cron for reminders
- WhatsApp Cloud API webhook (stubbed; plug in BSP like AiSensy/Interakt in `src/whatsapp.js`)

## Compliance notes
- DPDP Act 2023: consent flag stored on every Lead and Patient; data retention helper in `src/db.js`.
- ABDM/ABHA: `patient.abhaId` field reserved; integration is roadmapped, not implemented.
- Host on AWS Mumbai / ap-south-1 in production. Do not store PII on US edge.
