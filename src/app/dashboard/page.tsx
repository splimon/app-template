'use client';

import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Dashboard Index Page
 * 
 * Redirects users to their appropriate role-based dashboard:
 * - /dashboard/sysadmin - System administrators
 * - /dashboard/admin - Organization administrators  
 * - /dashboard/member - Organization members
 * - /dashboard/guest - Guest users (no organization)
 */
export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace('/login?type=user');
      return;
    }

    // Determine dashboard based on role
    if (user.system_role === 'sysadmin') {
      router.replace('/dashboard/sysadmin');
    } else if (user.role === 'admin') {
      router.replace('/dashboard/admin');
    } else if (user.role === 'member') {
      router.replace('/dashboard/member');
    } else {
      router.replace('/dashboard/guest');
    }
  }, [user, isLoading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg text-muted-foreground">Redirecting to your dashboard...</div>
    </div>
  );
}