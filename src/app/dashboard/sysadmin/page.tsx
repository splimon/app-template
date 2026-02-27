import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionFromCookies } from "@/lib/auth/session";
import { fetchSysAdminDashboardData } from "@/lib/data/sysadmin";
import SysAdminDashboardClient from "./SysAdminDashboardClient";

export default async function SysAdminDashboard() {
  const cookieStore = await cookies();
  const user = await validateSessionFromCookies(cookieStore);

  // Role guard - redirect if not sysadmin
  if (user.system_role !== "sysadmin") {
    redirect("/dashboard");
  }

  const data = await fetchSysAdminDashboardData();

  return (
    <SysAdminDashboardClient
      user={{
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        systemRole: user.system_role,
      }}
      data={data}
    />
  );
}
