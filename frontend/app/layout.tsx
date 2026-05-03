import './globals.css';
export const metadata = { title: 'ClinicFlow AI', description: 'WhatsApp-first AI receptionist for Indian clinics' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
