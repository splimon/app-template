import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionFromCookies } from "@/lib/auth/session";

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

  let user;
  try {
    user = await validateSessionFromCookies(cookieStore);
  } catch {
    redirect("/login?type=user");
  }

  if (user.system_role === "sysadmin") {
    redirect("/dashboard/sysadmin");
  } else if (user.role === "admin") {
    redirect("/dashboard/admin");
  } else if (user.role === "member") {
    redirect("/dashboard/member");
  } else {
    redirect("/dashboard/guest");
  }
}
