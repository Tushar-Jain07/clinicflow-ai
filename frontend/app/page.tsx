import Link from 'next/link';
import dynamic from 'next/dynamic';

const ClientLeadForm = dynamic(() => import('./LeadForm'), { ssr: false });

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6">
      <nav className="flex justify-between items-center py-6">
        <div className="font-bold text-xl">ClinicFlow <span className="text-brand">AI</span></div>
        <div className="flex gap-3">
          <Link href="/login" className="btn btn-ghost">Login</Link>
          <a href="#contact" className="btn btn-primary">Book demo</a>
        </div>
      </nav>

      <section className="py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block text-xs uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full mb-4">For Indian clinics</span>
          <h1 className="text-5xl font-bold leading-tight">The WhatsApp front desk that <span className="text-brand">never sleeps.</span></h1>
          <p className="mt-5 text-lg text-white/70">Capture every lead from WhatsApp, Instagram, and your website. AI replies in 3 seconds, books appointments, sends reminders, follows up after visits — so you stop losing patients at 9:47pm.</p>
          <div className="mt-7 flex gap-3">
            <a href="#contact" className="btn btn-primary">Get a 14-day free pilot</a>
            <a href="#features" className="btn btn-ghost">See how it works</a>
          </div>
          <p className="mt-4 text-xs text-white/50">DPDP-ready · Hosted in India · ABDM/ABHA on roadmap</p>
        </div>
        <div className="card">
          <div className="text-sm text-white/60 mb-3">Live patient inbox</div>
          {[
            { n: 'Riya S.', t: 'Acne treatment cost?', r: 'Hi Riya! Acne consults start at ₹800. Book here: clinic.in/book ✨' },
            { n: 'Arjun M.', t: 'Open Sunday?', r: 'Yes! Sun 10am–2pm. Want me to hold a slot?' },
            { n: 'Neha P.', t: 'Hair fall doctor available tomorrow?', r: 'Dr. Mehta has 11:30 & 4:00 free tomorrow. Which works?' },
          ].map((m, i) => (
            <div key={i} className="border-t border-white/10 py-3">
              <div className="text-sm"><b>{m.n}</b>: {m.t}</div>
              <div className="text-sm text-brand mt-1">AI reply (3s): {m.r}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="py-16 grid md:grid-cols-3 gap-5">
        {[
          ['AI receptionist', 'Replies to WhatsApp & Insta DMs in 3 seconds, in English, Hindi, or Hinglish.'],
          ['Smart booking', 'Patients pick a slot from a link. Synced to your doctor calendar.'],
          ['Auto reminders', '24h-before WhatsApp reminders cut no-shows by up to 30%.'],
          ['Patient CRM', 'Every conversation, visit, and invoice in one timeline.'],
          ['Invoices & payments', 'GST invoices and Razorpay payment links in two clicks.'],
          ['Review requests', 'Auto-ask happy patients for a Google review 2 hours after visit.'],
          ['Missed-lead analytics', 'See exactly where patients drop off — and recover them.'],
          ['DPDP-ready', 'Consent capture, India hosting, retention controls built in.'],
          ['Roadmap: ABDM', 'ABHA linkage, teleconsult, multi-branch coming next.'],
        ].map(([t, d]) => (
          <div key={t} className="card">
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-white/60 mt-2">{d}</div>
          </div>
        ))}
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Pricing</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'Starter', price: '₹2,499', for: 'Single-location clinics', f: ['WhatsApp inbox + AI replies', 'Booking + reminders', '500 messages included', 'Email support'] },
            { name: 'Growth', price: '₹6,499', for: 'Busy clinics, 2–5 staff', popular: true, f: ['Everything in Starter', 'Patient CRM + invoices', '2,000 messages included', 'Review automation', 'Priority support'] },
            { name: 'Pro', price: '₹11,999', for: 'Multi-doctor / multi-branch', f: ['Everything in Growth', 'Unlimited staff seats', '5,000 messages included', 'Custom AI training', 'Dedicated success manager'] },
          ].map((p) => (
            <div
              key={p.name}
              className={`card flex flex-col h-full ${'popular' in p && p.popular ? 'ring-2 ring-brand/50 md:scale-[1.02]' : ''}`}
            >
              {'popular' in p && p.popular ? (
                <div className="text-xs font-semibold text-brand uppercase tracking-wide mb-1">Most popular</div>
              ) : null}
              <div className="text-sm text-white/60">{p.name}</div>
              <div className="text-3xl font-bold mt-2">{p.price}<span className="text-base text-white/50">/mo</span></div>
              <div className="text-sm text-white/60 mt-1">{p.for}</div>
              <ul className="mt-4 space-y-2 text-sm flex-1">{p.f.map((x) => <li key={x}>✓ {x}</li>)}</ul>
              <a href={`/?plan=${encodeURIComponent(p.name)}#contact`} className="btn btn-primary w-full mt-6">
                Apply
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/50 mt-4">Setup & onboarding: ₹5,000–₹25,000 one-time. WhatsApp conversation costs (Meta) billed transparently.</p>
      </section>

      <section id="contact" className="py-16 max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Start your free 14-day pilot</h2>
        <ClientLeadForm />
      </section>

      <footer className="py-10 text-center text-xs text-white/40">© ClinicFlow AI · Made in India · DPDP-ready</footer>
    </main>
  );
}
