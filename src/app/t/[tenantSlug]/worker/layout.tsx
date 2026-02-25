import { ReactNode } from 'react';
import WorkerNav from '@/components/worker/WorkerNav';

export default async function WorkerLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <main className="pb-16">
        {children}
      </main>
      <WorkerNav tenantSlug={tenantSlug} />
    </div>
  );
}
