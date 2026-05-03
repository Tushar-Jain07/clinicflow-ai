import { Router } from 'express';
import { prisma } from '../db.js';
import { requireAuth } from '../auth.js';
import { invoiceQrPayload } from '../invoiceQr.js';

const r = Router();

r.get('/', requireAuth, async (_req, res) => {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: 'desc' }, include: { patient: true }, take: 200,
  });
  const parsed = invoices.map((inv) => ({
    ...inv,
    items: JSON.parse(inv.items),
    qrValue: invoiceQrPayload(inv),
  }));
  res.json({ invoices: parsed });
});

r.post('/', requireAuth, async (req, res) => {
  const { patientId, items, taxPct = 0 } = req.body;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = +(subtotal * (taxPct / 100)).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const number = 'INV-' + Date.now();
  // Razorpay payment link generation goes here in production
  const paymentUrl = `https://pay.example.com/${number}`;
  const inv = await prisma.invoice.create({
    data: { patientId, items: JSON.stringify(items), subtotal, tax, total, number, paymentUrl },
  });
  res.json({
    invoice: {
      ...inv,
      items,
      qrValue: invoiceQrPayload(inv),
    },
  });
});

export default r;
