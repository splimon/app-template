import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSessionFromCookies } from '@/lib/auth/session';
import { db } from '@/db/kysely/client';
import WorkerProfile from '@/components/worker/WorkerProfile';

export default async function ProfilePage() {
  let user;
  try {
    const cookieStore = await cookies();
    user = await validateSessionFromCookies(cookieStore);
  } catch {
    redirect('/login?type=user');
  }

  const profile = await db
    .selectFrom('users')
    .select(['display_name', 'avatar_url', 'username', 'email'])
    .where('id', '=', user.id)
    .executeTakeFirst();

  return (
    <WorkerProfile
      username={profile?.username ?? user.username}
      displayName={profile?.display_name ?? null}
      avatarUrl={profile?.avatar_url ?? null}
      email={profile?.email ?? user.email}
    />
  );
}
