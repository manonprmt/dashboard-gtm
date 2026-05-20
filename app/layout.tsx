import type { Metadata } from 'next';
import { Inter, Bricolage_Grotesque, Dancing_Script } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' });
const dancing = Dancing_Script({ subsets: ['latin'], variable: '--font-script' });

export const metadata: Metadata = {
  title: 'GTM Dashboard',
  description: 'Tableau de bord marketing — Meta Ads & Klaviyo CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${bricolage.variable} ${dancing.variable}`}>
      <body className="bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
