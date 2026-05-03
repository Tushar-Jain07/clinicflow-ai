import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { aiReply } from '../ai.js';
import { sendWhatsApp } from '../whatsapp.js';
import { requireAuth } from '../auth.js';

const r = Router();

const LeadIn = z.object({
  name: z.string().optional(),
  phone: z.string().min(7),
  source: z.enum(['whatsapp', 'instagram', 'website', 'phone']),
  message: z.string().optional(),
  consent: z.boolean().default(false),
});

// Public: capture lead from website forms / Instagram zap / phone log
r.post('/', async (req, res) => {
  const parsed = LeadIn.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data;
  const reply = data.message ? await aiReply(data.message, { name: data.name }) : null;
  const lead = await prisma.lead.create({
    data: { ...data, aiReply: reply, firstReplyAt: reply ? new Date() : null },
  });
  if (reply && data.source === 'whatsapp') await sendWhatsApp(data.phone, reply);
  res.json({ lead });
});

r.get('/', requireAuth, async (req, res) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  res.json({ leads });
});

r.patch('/:id', requireAuth, async (req, res) => {
  const lead = await prisma.lead.update({ where: { id: req.params.id }, data: req.body });
  res.json({ lead });
});

export default r;
