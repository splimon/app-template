import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSessionFromCookies } from "@/lib/auth/session";

export default async function Home() {
  try {
    const cookieStore = await cookies();
    await validateSessionFromCookies(cookieStore);
    // Already logged in — let /dashboard handle role-based routing
    redirect("/dashboard");
  } catch {
    // Not logged in — go to login
    redirect("/login?type=user");
  }
}
