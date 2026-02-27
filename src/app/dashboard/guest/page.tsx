import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth/session";
import GuestDashboardClient from "./GuestDashboardClient";

export default async function GuestDashboard() {
  let user;
  try {
    user = await getAuthUser();
  } catch {
    redirect("/login?type=user");
  }

  // Role guard - redirect if not guest (has org role or is sysadmin)
  if (user.system_role === "sysadmin" || user.role !== null) {
    redirect("/dashboard");
  }

  return (
    <GuestDashboardClient
      user={{
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
        role: user.role,
        system_role: user.system_role,
      }}
    />
  );
}
