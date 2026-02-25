import { cookies } from "next/headers";
import { validateSessionFromCookies } from "@/lib/auth/session";
import { db } from "@/db/kysely/client";
import DashboardRedirectClient from "./DashboardRedirectClient";

/**
 * Dashboard Index Page
 *
 * Redirects users to their appropriate role-based dashboard:
 * - /dashboard/sysadmin - System administrators
 * - /t/[slug]/dashboard/admin - Tenant administrators
 * - /t/[slug]/worker - Tenant workers
 * - /pending - Authenticated but no tenant membership
 * - /dashboard/guest - Unauthenticated or no role
 */
export default async function DashboardPage() {
  let destination = "/login?type=user";

  try {
    const cookieStore = await cookies();
    const user = await validateSessionFromCookies(cookieStore);

    if (user.system_role === "sysadmin") {
      destination = "/dashboard/sysadmin";
    } else if (user.role === "admin" || user.role === "worker") {
      const membership = await db
        .selectFrom("members")
        .innerJoin("tenants", "tenants.id", "members.tenant_id")
        .select(["tenants.slug", "members.user_role"])
        .where("members.user_id", "=", user.id)
        .executeTakeFirst();

      if (membership) {
        if (membership.user_role === "admin") {
          destination = `/t/${membership.slug}/dashboard/admin`;
        } else {
          destination = `/t/${membership.slug}/worker`;
        }
      } else {
        destination = "/pending";
      }
    } else {
      destination = "/dashboard/guest";
    }
  } catch {
    destination = "/login?type=user";
  }

  return <DashboardRedirectClient destination={destination} />;
}
