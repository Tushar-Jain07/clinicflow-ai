'use client';

import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../../lib/api';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      const { token } = await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('cf_token', token);
      router.push('/dashboard');
    } catch {
      setErr('Invalid credentials');
    }
  }

  async function onGoogleSuccess(cr: CredentialResponse) {
    setErr('');
    const credential = cr.credential;
    if (!credential) {
      setErr('Google did not return a credential');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/admin/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      let data: { token?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* ignore */
      }
      if (!res.ok) throw new Error(data.error || 'request_failed');
      if (!data.token) throw new Error('no_token');
      localStorage.setItem('cf_token', data.token);
      router.push('/dashboard');
    } catch {
      setErr('Google sign-in failed. Check GOOGLE_CLIENT_ID on the API and OAuth settings.');
    }
  }

  return (
    <div className="card space-y-4">
      {googleClientId ? (
        <>
          <div className="flex justify-center [&>div]:!w-full [&_iframe]:!w-full">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => setErr('Google sign-in was cancelled or failed')}
              useOneTap={false}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width={320}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-[#0b1020] px-2 text-white/40">or email</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-xs text-white/40 text-center rounded-lg border border-white/10 px-3 py-2">
          Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to use Sign in with Google (same OAuth Client ID as backend GOOGLE_CLIENT_ID).
        </p>
      )}

      <form onSubmit={submit} className="space-y-3">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          autoComplete="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
        />
        {err ? <div className="text-red-400 text-sm">{err}</div> : null}
        <button type="submit" className="btn btn-primary w-full">
          Sign in
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-sm mx-auto py-20 px-6">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <LoginCard />
        </GoogleOAuthProvider>
      ) : (
        <LoginCard />
      )}
    </main>
  );
}
