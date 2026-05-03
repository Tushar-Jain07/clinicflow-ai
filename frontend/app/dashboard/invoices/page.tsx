'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function Invoices() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api('/api/invoices').then((r) => setItems(r.invoices)); }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>
      <div className="card overflow-x-auto">
        <table>
          <thead><tr><th>Number</th><th>Patient</th><th>Total</th><th>Status</th><th>Pay link</th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.number}</td><td>{i.patient?.name}</td><td>₹{i.total}</td><td>{i.status}</td>
                <td><a className="text-brand underline" href={i.paymentUrl} target="_blank">link</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
