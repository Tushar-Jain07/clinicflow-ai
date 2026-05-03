'use client';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../../lib/api';

type InvoiceRow = {
  id: string;
  number: string;
  total: number;
  status: string;
  paymentUrl: string | null;
  qrValue: string | null;
  patient?: { name: string };
};

export default function Invoices() {
  const [items, setItems] = useState<InvoiceRow[]>([]);
  useEffect(() => {
    api('/api/invoices').then((r) => setItems(r.invoices));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>
      <p className="text-sm text-white/50 mb-4 max-w-2xl">
        Scan the QR with any UPI app when your clinic UPI ID is configured on the server; otherwise the QR opens your payment link.
      </p>
      <div className="card overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Patient</th>
              <th>Total</th>
              <th>Status</th>
              <th>Pay</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.number}</td>
                <td>{i.patient?.name}</td>
                <td>₹{i.total}</td>
                <td>{i.status}</td>
                <td>
                  <div className="flex flex-wrap items-center gap-3 py-1">
                    {i.qrValue ? (
                      <div
                        className="shrink-0 rounded bg-white p-1.5 shadow-sm"
                        title="Scan to pay (UPI or open payment page)"
                      >
                        <QRCodeSVG value={i.qrValue} size={80} level="M" />
                      </div>
                    ) : null}
                    {i.paymentUrl ? (
                      <a className="text-brand underline whitespace-nowrap" href={i.paymentUrl} target="_blank" rel="noreferrer">
                        Open link
                      </a>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
