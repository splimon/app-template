'use client';

import { useTenant } from '@/hooks/contexts/TenantContext';

export default function AdminDashboardPage() {
  const { tenant, membership } = useTenant();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{tenant.name} — Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your organization.</p>
      </div>
      <div className="rounded-lg border p-4 bg-card">
        <p className="text-sm text-muted-foreground">Tenant ID: {tenant.id}</p>
        <p className="text-sm text-muted-foreground">Your role: {membership.user_role}</p>
      </div>
    </div>
  );
}
