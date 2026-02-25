import { db } from "@/db/kysely/client";

type AdminTenant = {
  id: string;
  name: string;
  slug: string;
};

export type AdminDashboardData = {
  tenant: AdminTenant | null;
  teamMemberCount: number;
  pendingInvites: number;
};

/**
 * Retrieves dashboard data for an admin user, including tenant details and team member count.
 * @param userId The ID of the admin user.
 * @returns A promise that resolves to an AdminDashboardData object.
 */
export async function fetchAdminDashboardData(userId: string): Promise<AdminDashboardData> {
  const tenantMembership = await db
    .selectFrom("members as m")
    .innerJoin("tenants as t", "m.tenant_id", "t.id")
    .select(({ ref }) => [
      ref("t.id").as("tenantId"),
      ref("t.name").as("tenantName"),
      ref("t.slug").as("tenantSlug"),
    ])
    .where("m.user_id", "=", userId)
    .where("m.user_role", "=", "admin")
    .executeTakeFirst();

  if (!tenantMembership) {
    return {
      tenant: null,
      teamMemberCount: 0,
      pendingInvites: 0,
    };
  }

  const teamCountResult = await db
    .selectFrom("members")
    .select(({ fn }) => fn.count<number>("id").as("count"))
    .where("tenant_id", "=", tenantMembership.tenantId)
    .executeTakeFirst();

  return {
    tenant: {
      id: tenantMembership.tenantId,
      name: tenantMembership.tenantName,
      slug: tenantMembership.tenantSlug,
    },
    teamMemberCount: Number(teamCountResult?.count ?? 0),
    pendingInvites: 0,
  };
}
