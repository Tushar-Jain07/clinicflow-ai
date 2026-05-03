'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function Appointments() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api('/api/appointments').then((r) => setItems(r.appointments)); }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="card overflow-x-auto">
        <table>
          <thead><tr><th>When</th><th>Patient</th><th>Doctor</th><th>Status</th><th>Reminder</th></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.startsAt).toLocaleString('en-IN')}</td>
                <td>{a.patient?.name}</td>
                <td>{a.doctor}</td>
                <td>{a.status}</td>
                <td>{a.reminderSent ? '✓' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
