'use client';

import Image from "next/image";
import { useAuth } from "@/src/contexts/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Welcome to the Auth Demo
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              This application demonstrates authentication with admin and user roles.
              Please log in to continue.
            </p>
          </div>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Link
              href="/login?type=admin"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 md:w-[180px]"
            >
              Admin Login
            </Link>
            <Link
              href="/login?type=user"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-zinc-300 dark:border-zinc-700 px-5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 md:w-[180px]"
            >
              User Login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // User is authenticated
  const isAdmin = user.system_role === 'sysadmin';

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <div className="w-full p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-2">
              {isAdmin ? '🔐 Admin Dashboard' : '👤 User Dashboard'}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Welcome back, <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.username}</span>!
            </p>
          </div>

          <div className="w-full p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
              Your Account Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-600 dark:text-zinc-400">Email:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-600 dark:text-zinc-400">Username:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-600 dark:text-zinc-400">System Role:</span>
                <span className={`font-semibold ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {user.system_role}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-600 dark:text-zinc-400">Session Type:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.type}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-600 dark:text-zinc-400">User ID:</span>
                <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">{user.id}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="w-full p-6 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <h2 className="text-xl font-semibold mb-2 text-purple-900 dark:text-purple-100">
                Admin Capabilities
              </h2>
              <p className="text-purple-700 dark:text-purple-300 mb-4">
                As a system administrator, you have access to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-purple-700 dark:text-purple-300">
                <li>User management</li>
                <li>System settings</li>
                <li>Organization administration</li>
                <li>Full platform access</li>
              </ul>
            </div>
          )}

          {!isAdmin && (
            <div className="w-full p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">
                User Capabilities
              </h2>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                As a regular user, you have access to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>Your profile and settings</li>
                <li>Organization membership</li>
                <li>Standard platform features</li>
                <li>Collaboration tools</li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full sm:w-auto">
          <button
            onClick={() => logout()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 sm:w-[158px]"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
