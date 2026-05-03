import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';
import { sendWhatsApp } from '../whatsapp.js';

const r = Router();

r.get('/', requireAuth, async (_req, res) => {
  const appointments = await prisma.appointment.findMany({
    orderBy: { startsAt: 'asc' }, include: { patient: true }, take: 200,
  });
  res.json({ appointments });
});

r.post('/', requireAuth, async (req, res) => {
  const a = await prisma.appointment.create({ data: req.body, include: { patient: true } });
  await sendWhatsApp(a.patient.phone, `Booked: ${a.doctor} on ${a.startsAt.toLocaleString('en-IN')}. See you soon!`);
  res.json({ appointment: a });
});

r.patch('/:id', requireAuth, async (req, res) => {
  const a = await prisma.appointment.update({ where: { id: req.params.id }, data: req.body });
  res.json({ appointment: a });
});

export default r;
