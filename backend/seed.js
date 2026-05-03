import 'dotenv/config';
import { prisma } from './src/db.js';
import { hash } from './src/auth.js';

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@clinic.local' },
    update: {},
    create: { email: 'admin@clinic.local', password: hash('admin123'), name: 'Clinic Admin' },
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
  console.log('Seeded.');
}
main().finally(() => process.exit(0));
