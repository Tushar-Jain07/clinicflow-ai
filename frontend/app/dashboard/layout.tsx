import Link from 'next/link';

export default function DashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-black/30 border-r border-white/10 p-5 space-y-2">
        <div className="font-bold text-lg mb-6">ClinicFlow <span className="text-brand">AI</span></div>
        {[
          ['Overview', '/dashboard'],
          ['Leads', '/dashboard/leads'],
          ['Appointments', '/dashboard/appointments'],
          ['Patients', '/dashboard/patients'],
          ['Invoices', '/dashboard/invoices'],
        ].map(([t, h]) => <Link key={h} href={h} className="block px-3 py-2 rounded hover:bg-white/5">{t}</Link>)}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
