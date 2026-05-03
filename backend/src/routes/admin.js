import { Router } from 'express';
import { prisma } from '../db.js';
import { compare, sign, requireAuth } from '../auth.js';
import { verifyGoogleCredential } from '../googleAuth.js';

const r = Router();

r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password || !compare(password, user.password)) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  res.json({ token: sign(user), user: { id: user.id, email: user.email, name: user.name } });
});

r.post('/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'missing_credential' });
  let payload;
  try {
    payload = await verifyGoogleCredential(credential);
  } catch {
    return process.env.GOOGLE_CLIENT_ID
      ? res.status(401).json({ error: 'invalid_google_token' })
      : res.status(503).json({ error: 'google_login_not_configured' });
  }
  if (!payload?.email || !payload.sub) return res.status(401).json({ error: 'invalid_google_profile' });
  if (payload.email_verified === false) return res.status(401).json({ error: 'email_not_verified' });

  const email = payload.email;
  const name = payload.name || email.split('@')[0];
  const sub = payload.sub;

  let user = await prisma.user.findUnique({ where: { googleId: sub } });
  if (!user) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: { googleId: sub, name: name || byEmail.name },
      });
    } else {
      user = await prisma.user.create({
        data: { email, name, googleId: sub },
      });
    }
  }

  res.json({ token: sign(user), user: { id: user.id, email: user.email, name: user.name } });
});

r.get('/analytics', requireAuth, async (_req, res) => {
  const [leads, booked, lost, noShow, completed, repeat] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'booked' } }),
    prisma.lead.count({ where: { status: 'lost' } }),
    prisma.appointment.count({ where: { status: 'no_show' } }),
    prisma.appointment.count({ where: { status: 'completed' } }),
    prisma.patient.count({ where: { appointments: { some: {} } } }),
  ]);
  const conversion = leads ? +((booked / leads) * 100).toFixed(1) : 0;
  res.json({ leads, booked, lost, noShow, completed, repeat, conversion });
});

export default r;
