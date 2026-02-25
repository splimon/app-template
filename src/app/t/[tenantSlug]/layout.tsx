import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { validateSessionFromCookies } from '@/lib/auth/session';
import { getTenantBySlug, assertTenantAccess } from '@/lib/auth/tenant';
import { TenantProvider } from '@/hooks/contexts/TenantContext';

export default async function TenantLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  let user;
  try {
    const cookieStore = await cookies();
    user = await validateSessionFromCookies(cookieStore);
  } catch {
    redirect('/login?type=user');
  }

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) redirect('/dashboard');

  let membership;
  try {
    membership = await assertTenantAccess(user.id, tenant.id);
  } catch {
    redirect('/pending');
  }

  return (
    <TenantProvider value={{ tenant, membership }}>
      {children}
    </TenantProvider>
  );
}
