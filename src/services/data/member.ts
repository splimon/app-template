import { db } from "@/db/kysely/client";

type WorkerTenant = {
  id: string;
  name: string;
  slug: string;
};

export type WorkerDashboardData = {
  tenant: WorkerTenant | null;
  teamMemberCount: number;
};

/**
 * Retrieves dashboard data for a worker, including tenant details and team member count.
 * @param userId The ID of the worker user.
 * @returns A promise that resolves to a WorkerDashboardData object.
 */
export async function fetchWorkerDashboardData(userId: string): Promise<WorkerDashboardData> {
  const tenantMembership = await db
    .selectFrom("members as m")
    .innerJoin("tenants as t", "m.tenant_id", "t.id")
    .select(({ ref }) => [
      ref("t.id").as("tenantId"),
      ref("t.name").as("tenantName"),
      ref("t.slug").as("tenantSlug"),
    ])
    .where("m.user_id", "=", userId)
    .where("m.user_role", "=", "worker")
    .executeTakeFirst();

  if (!tenantMembership) {
    return {
      tenant: null,
      teamMemberCount: 0,
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
  };
}
