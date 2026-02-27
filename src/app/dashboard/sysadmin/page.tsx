import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/session";
import { fetchSysAdminDashboardData } from "@/lib/data/sysadmin";
import SysAdminDashboardClient from "./SysAdminDashboardClient";

export default async function SysAdminDashboard() {
  let user;
  try {
    user = await getAuthUser();
  } catch {
    redirect("/login?type=sysadmin");
  }

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
