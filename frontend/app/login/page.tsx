'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function Login() {
  const [email, setEmail] = useState('admin@clinic.local');
  const [password, setPassword] = useState('admin123');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { token } = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      localStorage.setItem('cf_token', token);
      router.push('/dashboard');
    } catch { setErr('Invalid credentials'); }
  }

  return (
    <main className="max-w-sm mx-auto py-20 px-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={submit} className="card space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        {err && <div className="text-red-400 text-sm">{err}</div>}
        <button className="btn btn-primary w-full">Sign in</button>
      </form>
    </main>
  );
}
