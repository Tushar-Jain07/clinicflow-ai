const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function token() { return typeof window !== 'undefined' ? localStorage.getItem('cf_token') : null; }

export async function api(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'request_failed');
  return res.json();
}
