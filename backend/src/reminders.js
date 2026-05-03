import cron from 'node-cron';
import { prisma } from './db.js';
import { sendWhatsApp } from './whatsapp.js';

export function startReminders() {
  // Every 5 minutes: send 24h-before reminders and post-visit review requests
  cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    const in24 = new Date(now.getTime() + 24 * 3600 * 1000);
    const in23 = new Date(now.getTime() + 23 * 3600 * 1000);

    const upcoming = await prisma.appointment.findMany({
      where: { reminderSent: false, status: 'scheduled', startsAt: { gte: in23, lte: in24 } },
      include: { patient: true },
    });
    for (const a of upcoming) {
      await sendWhatsApp(a.patient.phone, `Reminder: appointment with ${a.doctor} tomorrow at ${a.startsAt.toLocaleString('en-IN')}. Reply CANCEL to reschedule.`);
      await prisma.appointment.update({ where: { id: a.id }, data: { reminderSent: true } });
    }

    // Review requests 2 hours after completion
    const twoHrAgo = new Date(now.getTime() - 2 * 3600 * 1000);
    const completed = await prisma.appointment.findMany({
      where: { reviewSent: false, status: 'completed', startsAt: { lte: twoHrAgo } },
      include: { patient: true },
    });
    for (const a of completed) {
      await sendWhatsApp(a.patient.phone, `Hi ${a.patient.name}, thanks for visiting today. Mind leaving a quick Google review? It really helps us. 🙏`);
      await prisma.appointment.update({ where: { id: a.id }, data: { reviewSent: true } });
    }
  });
}
