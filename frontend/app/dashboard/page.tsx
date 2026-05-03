'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function Overview() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { api('/api/admin/analytics').then(setS).catch(() => {}); }, []);
  if (!s) return <div>Loading…</div>;
  const cards = [
    ['Total leads', s.leads], ['Booked', s.booked], ['Lost', s.lost],
    ['No-shows', s.noShow], ['Completed visits', s.completed], ['Repeat patients', s.repeat],
    ['Conversion %', s.conversion + '%'],
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map(([t, v]) => (
          <div key={t} className="card"><div className="text-white/60 text-sm">{t}</div><div className="text-3xl font-bold mt-2">{v}</div></div>
        ))}
      </div>
    </div>
  );
}
