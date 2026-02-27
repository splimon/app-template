import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionFromCookies } from "@/lib/auth/session";
import GuestDashboardClient from "./GuestDashboardClient";

export default async function GuestDashboard() {
  // Fetching user data to give to client component and ensure user is a guest (not member or sysadmin)
  const cookieStore = await cookies();
  const user = await validateSessionFromCookies(cookieStore);

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
        role: user.role,
        systemRole: user.system_role,
      }}
    />
  );
}
