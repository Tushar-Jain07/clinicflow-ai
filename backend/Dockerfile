# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

# ── Runtime stage ────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE ${PORT:-4000}

CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
