import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSessionFromCookies } from '@/lib/auth/session';

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  try {
    const cookieStore = await cookies();
    const user = await validateSessionFromCookies(cookieStore);

    if (user.role === 'admin') {
      redirect(`/t/${tenantSlug}/dashboard/admin`);
    } else {
      redirect(`/t/${tenantSlug}/worker`);
    }
  } catch {
    redirect('/login?type=user');
  }
}
