import Link from 'next/link';
import { ReactNode } from 'react';
import LogoutButton from '@/components/auth/LogoutButton';

export default function TenantDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4 justify-between">
          <Link href="/dashboard" className="font-bold text-xl">
            ʻĀina Kilo
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}
