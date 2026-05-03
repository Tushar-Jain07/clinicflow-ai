import { Router } from 'express';
import { prisma } from '../db.js';
import { compare, sign } from '../auth.js';

const r = Router();

r.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !compare(password, user.password)) return res.status(401).json({ error: 'invalid_credentials' });
  res.json({ token: sign(user), user: { id: user.id, email: user.email, name: user.name } });
});

r.get('/analytics', async (_req, res) => {
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
