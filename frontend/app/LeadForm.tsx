'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../lib/api';

function LeadFormFields() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: '', phone: '', message: '', consent: false });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (!plan) return;
    setForm((prev) => {
      if (prev.message.trim()) return prev;
      return { ...prev, message: `I'm interested in the ${plan} plan.` };
    });
  }, [searchParams]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!form.consent) return setErr('Please accept the consent to continue (DPDP).');
    try {
      await api('/api/leads', { method: 'POST', body: JSON.stringify({ ...form, source: 'website' }) });
      setDone(true);
    } catch (e: any) { setErr(e.message); }
  }
  if (done) return <div className="card">Thanks! We'll WhatsApp you in a few minutes.</div>;
  return (
    <form onSubmit={submit} className="card space-y-3">
      <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="WhatsApp number (+91…)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
      <textarea placeholder="What's your clinic & main pain point?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <label className="flex gap-2 text-sm text-white/70">
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="w-auto" />
        I consent to ClinicFlow AI processing my contact details under the DPDP Act, 2023.
      </label>
      {err && <div className="text-red-400 text-sm">{err}</div>}
      <button className="btn btn-primary w-full">Request pilot</button>
    </form>
  );
}

export default function LeadForm() {
  return (
    <Suspense fallback={<div className="card min-h-[240px] flex items-center justify-center text-white/40">Loading form…</div>}>
      <LeadFormFields />
    </Suspense>
  );
}
