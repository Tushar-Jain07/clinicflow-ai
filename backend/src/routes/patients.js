import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';

const r = Router();

r.get('/', requireAuth, async (_req, res) => {
  const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  res.json({ patients });
});

r.post('/', requireAuth, async (req, res) => {
  const p = await prisma.patient.create({ data: req.body });
  res.json({ patient: p });
});

r.get('/:id', requireAuth, async (req, res) => {
  const p = await prisma.patient.findUnique({
    where: { id: req.params.id },
    include: { appointments: true, invoices: true },
  });
  res.json({ patient: p });
});

export default r;
