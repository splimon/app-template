'use client';

import { useRouter } from 'next/navigation';

export default function PendingPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.replace('/login?type=user');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] px-6 text-center">
      <div className="max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-3">Access Pending</h1>
        <p className="text-[#9ca3af] mb-8 leading-relaxed">
          Your account has been created. An admin will grant you access to your organization soon.
        </p>
        <button
          onClick={handleSignOut}
          className="text-sm text-[#C4622D] underline underline-offset-4"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
