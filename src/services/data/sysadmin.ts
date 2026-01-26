import { db } from "@/db/kysely/client";

export type SysAdminDashboardData = {
  totalUsers: number;
  totalOrgs: number;
  activeSessions: number;
};

export async function fetchSysAdminDashboardData(): Promise<SysAdminDashboardData> {
  const [usersResult, orgsResult, sessionsResult] = await Promise.all([
    db.selectFrom("users")
      .select(({ fn }) => fn.count<number>("id").as("count"))
      .executeTakeFirst(),
    db.selectFrom("orgs")
      .select(({ fn }) => fn.count<number>("id").as("count"))
      .executeTakeFirst(),
    db.selectFrom("sessions")
      .select(({ fn }) => fn.count<number>("id").as("count"))
      .where("expires_at", ">", new Date())
      .executeTakeFirst(),
  ]);

  return {
    totalUsers: Number(usersResult?.count ?? 0),
    totalOrgs: Number(orgsResult?.count ?? 0),
    activeSessions: Number(sessionsResult?.count ?? 0),
  };
}
