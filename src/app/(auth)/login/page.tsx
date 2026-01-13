'use client';

import { LoginForm } from '@/src/components/LoginForm';
import { SystemRole } from '@/src/types/db';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as SystemRole | null;
  const loginType = type === 'sysadmin' ? 'sysadmin' : 'user';

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md">
        <LoginForm loginType={loginType} />

        <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
            Test Accounts
          </h3>
          <div className="space-y-4 text-sm">
            <div className="bg-white dark:bg-zinc-800 p-4 rounded">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Admin Account (sysadmin role or org_admin role)
              </p>

              <p className="text-zinc-600 dark:text-zinc-400">
                Use the sysadmin account you created on app setup or create a new one using the sysadmin script
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                Run: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">pnpm init:sysadmin</code>
              </p>

              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                OR use this org admin account:
              </p>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                Email: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">alice.johnson@example.com</code>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Username: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">alice.johnson</code>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Password: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">password123!</code>
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                From seed script: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">pnpm init:seed</code>
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-4 rounded">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Regular User (user role)
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Email: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">john.doe@example.com</code>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Username: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">john.doe</code>
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                Password: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">password123!</code>
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                From seed script: <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">pnpm init:seed</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
