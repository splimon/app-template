import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/session";
import { fetchAdminDashboardData } from "@/lib/data/admin";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  let user;
  try {
    user = await getAuthUser();
  } catch {
    redirect("/login?type=user");
  }

  // Role guard - redirect if not admin
  if (user.system_role === "sysadmin" || user.role !== "admin") {
    redirect("/dashboard");
  }

  const data = await fetchAdminDashboardData(user.id);

  return (
    <AdminDashboardClient
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
