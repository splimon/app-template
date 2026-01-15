import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionFromCookies } from "@/src/lib/auth/session";

/**
 * Dashboard Index Page
 *
 * Redirects users to their appropriate role-based dashboard:
 * - /dashboard/sysadmin - System administrators
 * - /dashboard/admin - Organization administrators
 * - /dashboard/member - Organization members
 * - /dashboard/guest - Guest users (no organization)
 */
export default async function DashboardPage() {
  const cookieStore = await cookies();
  const user = await validateSessionFromCookies(cookieStore);

  if (user.system_role === "sysadmin") {
    redirect("/dashboard/sysadmin");
  }

  if (user.role === "admin") {
    redirect("/dashboard/admin");
  }

  if (user.role === "member") {
    redirect("/dashboard/member");
  }

  redirect("/dashboard/guest");
}
