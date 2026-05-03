const path = require('path');
const fs = require('fs');

/** Read KEY=value from a .env-style file (handles quotes and # comments). */
function parseEnvValue(filePath, key) {
  if (!fs.existsSync(filePath)) return '';
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    if (k !== key) continue;
    let v = trimmed.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    return v.trim();
  }
  return '';
}

const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');

// Prefer explicit NEXT_PUBLIC_* (.env.local); otherwise reuse backend GOOGLE_CLIENT_ID for dev.
const nextPublicGoogle =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ||
  parseEnvValue(backendEnvPath, 'GOOGLE_CLIENT_ID');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    ...(nextPublicGoogle ? { NEXT_PUBLIC_GOOGLE_CLIENT_ID: nextPublicGoogle } : {}),
  },
};
