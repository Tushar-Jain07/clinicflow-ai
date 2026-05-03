'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  useEffect(() => { api('/api/leads').then((r) => setLeads(r.leads)); }, []);
  async function setStatus(id: string, status: string) {
    await api(`/api/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    setLeads((x) => x.map((l) => (l.id === id ? { ...l, status } : l)));
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Leads</h1>
      <div className="card overflow-x-auto">
        <table>
          <thead><tr><th>Time</th><th>Name</th><th>Phone</th><th>Source</th><th>Message</th><th>AI reply</th><th>Status</th></tr></thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>{new Date(l.createdAt).toLocaleString('en-IN')}</td>
                <td>{l.name || '—'}</td>
                <td>{l.phone}</td>
                <td>{l.source}</td>
                <td className="max-w-xs truncate">{l.message}</td>
                <td className="max-w-xs truncate text-brand">{l.aiReply}</td>
                <td>
                  <select value={l.status} onChange={(e) => setStatus(l.id, e.target.value)}>
                    <option>new</option><option>qualified</option><option>booked</option><option>lost</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
