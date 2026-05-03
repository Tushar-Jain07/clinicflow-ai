'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function Patients() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api('/api/patients').then((r) => setItems(r.patients)); }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Patients</h1>
      <div className="card overflow-x-auto">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Consent</th><th>ABHA</th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.phone}</td><td>{p.email || '—'}</td>
                <td>{p.consent ? '✓' : '—'}</td><td>{p.abhaId || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
