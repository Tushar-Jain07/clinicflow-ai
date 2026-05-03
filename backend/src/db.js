import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// DPDP retention helper — call from a cron monthly in production
export async function purgeOldUnconvertedLeads(days = 365) {
  const cutoff = new Date(Date.now() - days * 86400000);
  await prisma.lead.deleteMany({
    where: { createdAt: { lt: cutoff }, status: { in: ['new', 'lost'] }, patientId: null },
  });
}
