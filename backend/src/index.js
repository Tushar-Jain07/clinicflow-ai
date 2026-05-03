import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import leads from './routes/leads.js';
import appointments from './routes/appointments.js';
import patients from './routes/patients.js';
import invoices from './routes/invoices.js';
import webhook from './routes/webhook.js';
import admin from './routes/admin.js';
import { startReminders } from './reminders.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/leads', leads);
app.use('/api/appointments', appointments);
app.use('/api/patients', patients);
app.use('/api/invoices', invoices);
app.use('/api/webhook', webhook);
app.use('/api/admin', admin);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`ClinicFlow API on :${port}`);
  startReminders();
});
