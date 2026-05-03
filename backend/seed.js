import 'dotenv/config';
import { prisma } from './src/db.js';
import { hash } from './src/auth.js';

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@clinic.local' },
    update: { role: 'admin', password: hash('admin123') },
    create: { email: 'admin@clinic.local', password: hash('admin123'), name: 'Clinic Admin', role: 'admin' },
  });
  const p = await prisma.patient.upsert({
    where: { phone: '+919999000001' },
    update: {},
    create: { name: 'Riya Sharma', phone: '+919999000001', email: 'riya@example.com', consent: true },
  });
  await prisma.lead.create({
    data: { name: 'New Inquiry', phone: '+919999000002', source: 'whatsapp', message: 'Acne treatment cost?', consent: true, status: 'new' },
  });
  await prisma.appointment.create({
    data: { patientId: p.id, doctor: 'Dr. Mehta', startsAt: new Date(Date.now() + 86400000), duration: 30 },
  });
  const itemsJson = JSON.stringify([{ name: 'Consultation', qty: 1, price: 800 }, { name: 'Follow-up patch test', qty: 1, price: 400 }]);
  await prisma.invoice.upsert({
    where: { number: 'INV-SEED-001' },
    update: {
      items: itemsJson,
      subtotal: 1200,
      tax: 216,
      total: 1416,
      status: 'unpaid',
      paymentUrl: 'https://pay.example.com/INV-SEED-001',
    },
    create: {
      patientId: p.id,
      number: 'INV-SEED-001',
      items: itemsJson,
      subtotal: 1200,
      tax: 216,
      total: 1416,
      status: 'unpaid',
      paymentUrl: 'https://pay.example.com/INV-SEED-001',
    },
  });
  await prisma.invoice.upsert({
    where: { number: 'INV-SEED-002' },
    update: {},
    create: {
      patientId: p.id,
      number: 'INV-SEED-002',
      items: JSON.stringify([{ name: 'GST medicines', qty: 1, price: 650 }]),
      subtotal: 650,
      tax: 117,
      total: 767,
      status: 'paid',
      paymentUrl: 'https://pay.example.com/INV-SEED-002',
    },
  });
  console.log('Seeded.');
}
main().finally(() => process.exit(0));
