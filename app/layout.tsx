import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'GTM Dashboard',
  description: 'Tableau de bord marketing — Meta Ads & Klaviyo CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-50">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
