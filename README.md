# ClinicFlow AI

WhatsApp-first AI receptionist + clinic OS for Indian clinics.

## Quick start

```bash
# Backend (PostgreSQL — use docker compose or a local instance)
cd backend
cp .env.example .env          # edit DATABASE_URL if needed
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

Or spin up the full stack with Docker:

```bash
docker compose up -d          # PostgreSQL + backend + frontend
```

Login: `admin@clinic.local` / `admin123` (email/password), or **Sign in with Google** when OAuth is configured.

### Google Sign-In (optional)

Uses Google Identity Services (your Gmail / Google Workspace account — no password is stored on ClinicFlow).

1. If Google asks you to configure the **OAuth consent screen** first: APIs & Services → **OAuth consent screen** → choose **External** (or **Internal** if everyone uses your Workspace). App name can be **ClinicFlow AI**. **User support email** must be a real inbox you monitor — use **your own Gmail or Workspace email** (the same account or any email you control). **Developer contact email** can be the same address.
2. In **Credentials** → **Create credentials** → **OAuth client ID** → Application type **Web application**.
3. Under **Authorized JavaScript origins**, add `http://localhost:3000` and your production site URL.
4. Copy the **Client ID** into **`backend/.env`** → `GOOGLE_CLIENT_ID`. The frontend picks up the same value automatically via `frontend/next.config.js` (you can override with `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local` if needed).
5. Restart backend and frontend. New Google users get a dashboard account automatically (`staff` role); seeded admin stays `admin`.
6. For **production**, add your deployed site URL under **Authorized JavaScript origins** (see [Deploy on Railway](#deploy-on-railway) below).

### Deploy on Railway

This monorepo deploys as **two Railway services** (backend + frontend) plus a **Railway PostgreSQL** database.

#### 1. Create the project

1. Go to [Railway](https://railway.app/) → **New Project** → **Deploy from GitHub Repo** → select **clinicflow-ai**.
2. Railway detects the repo — do **not** let it auto-deploy yet.

#### 2. Add PostgreSQL

1. In your Railway project → **+ New** → **Database** → **Add PostgreSQL**.
2. Railway creates a `DATABASE_URL` variable automatically.

#### 3. Backend service

1. **+ New** → **GitHub Repo** → same repo.
2. **Settings** → **Root Directory** → `backend`.
3. Under **Variables**, add:
   - `DATABASE_URL` → click **Add Reference** → select the Postgres plugin's `DATABASE_URL`.
   - `JWT_SECRET` — a long random string.
   - `OPENAI_API_KEY` — your OpenAI key (optional).
   - `GOOGLE_CLIENT_ID` — your OAuth Web Client ID (optional).
   - `CLINIC_NAME`, `CLINIC_BOOKING_URL`, etc. as needed.
4. Railway reads `backend/railway.toml` and `backend/Dockerfile` automatically.
5. **Deploy**. The container runs `prisma migrate deploy` on start-up, then starts Express.

#### 4. Frontend service

1. **+ New** → **GitHub Repo** → same repo.
2. **Settings** → **Root Directory** → `frontend`.
3. Under **Variables**, add:
   - `NEXT_PUBLIC_API_URL` — the backend's Railway URL, e.g. `https://backend-production-xxxx.up.railway.app` (no trailing slash). Get this from the backend service's **Settings → Networking → Public URL**.
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — same Web Client ID as the backend's `GOOGLE_CLIENT_ID` (optional).
   - `PORT` — Railway sets this automatically; Next.js standalone respects it.
4. Railway reads `frontend/railway.toml` and `frontend/Dockerfile` automatically.
5. **Deploy**.

#### 5. Post-deploy

- **Google Cloud Console** → your OAuth Web client → **Authorized JavaScript origins**: add the frontend's public Railway URL.
- Update `CLINIC_BOOKING_URL` in the backend to point to the frontend's public URL + `/book`.

> **Data residency note:** Choose Railway's **Asia (Singapore)** region to stay close to India. For strict DPDP compliance, consider self-hosting on AWS Mumbai (`ap-south-1`).

## Stack
- Next.js 14, Tailwind, TypeScript
- Node.js, Express, Prisma, PostgreSQL
- JWT auth (email/password + optional Google OAuth), OpenAI for AI replies, node-cron for reminders
- WhatsApp Cloud API webhook (stubbed; plug in BSP like AiSensy/Interakt in `src/whatsapp.js`)

## Compliance notes
- DPDP Act 2023: consent flag stored on every Lead and Patient; data retention helper in `src/db.js`.
- ABDM/ABHA: `patient.abhaId` field reserved; integration is roadmapped, not implemented.
- Host on AWS Mumbai / ap-south-1 in production. Do not store PII on US edge.
