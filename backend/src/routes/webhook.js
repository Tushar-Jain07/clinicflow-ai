import { Router } from 'express';
import { prisma } from '../db.js';
import { aiReply } from '../ai.js';
import { sendWhatsApp } from '../whatsapp.js';

const r = Router();

// Meta WhatsApp webhook verification
r.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) return res.send(challenge);
  res.sendStatus(403);
});

// Inbound message
r.post('/whatsapp', async (req, res) => {
  try {
    const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
    const msg = entry?.messages?.[0];
    if (!msg) return res.sendStatus(200);
    const phone = msg.from;
    const text = msg.text?.body || '';
    const name = entry?.contacts?.[0]?.profile?.name;

    const reply = await aiReply(text, { name });
    await prisma.lead.create({
      data: { phone, name, source: 'whatsapp', message: text, aiReply: reply, firstReplyAt: new Date(), consent: true },
    });
    await sendWhatsApp(phone, reply);
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.sendStatus(200);
  }
});

export default r;
