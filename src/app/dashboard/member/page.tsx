import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionFromCookies } from "@/lib/auth/session";
import { fetchMemberDashboardData } from "@/lib/data/member";
import MemberDashboardClient from "./MemberDashboardClient";

export default async function MemberDashboard() {
  const cookieStore = await cookies();
  const user = await validateSessionFromCookies(cookieStore);

  // Role guard - redirect if not member
  if (user.system_role === "sysadmin" || user.role !== "member") {
    redirect("/dashboard");
  }

  const data = await fetchMemberDashboardData(user.id);

  return (
    <MemberDashboardClient
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
