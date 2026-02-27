import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { validateSessionFromCookies } from "@/lib/auth/session";
import { AuthProvider } from "@/hooks/contexts/AuthContext";
import DashboardHeader from "../../components/shared/DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies();

  let user;
  try {
    user = await validateSessionFromCookies(cookieStore);
    console.log(`[DashboardLayout] Authenticated user: ${user.username} (${user.email})`);
  } catch {
    console.log("[DashboardLayout] No valid session found, redirecting to login");
    redirect("/login?type=user");
  }

  const headerUser = {
    username: user.username,
    email: user.email,
    systemRole: user.system_role,
    role: user.role,
    orgName: user.org?.name ?? null,
  };

  return (
    <AuthProvider initialUser={user}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="container flex h-14 items-center px-4 justify-between">
            <Link href="/dashboard" className="ml-6 flex items-center space-x-2">
              <span className="font-bold text-xl">PMF Template</span>
            </Link>

            <DashboardHeader user={headerUser} />
          </div>
        </header>

        <main className="container mx-auto py-6 px-4">
          {children}

          <p className="text-sm text-muted-foreground font-bold mt-8"> Areas marked with * are not yet implemented</p>
        </main>
      </div>
    </AuthProvider>
  );
}
