import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSessionFromCookies } from '@/lib/auth/session';
import KiloHomeEmpty from '@/components/worker/KiloHomeEmpty';
import KiloHomeWithEntry from '@/components/worker/KiloHomeWithEntry';
import { getLunarDay, getHawaiianSeason, formatHawaiianDate } from '@/lib/hawaiian-calendar';

export default async function WorkerHomePage() {
  try {
    const cookieStore = await cookies();
    await validateSessionFromCookies(cookieStore);
  } catch {
    redirect('/login?type=user');
  }

  // TODO: query activity_logs table once created
  const hasEntryToday = false;

  if (!hasEntryToday) {
    return <KiloHomeEmpty />;
  }

  const today = new Date();
  const lunarDay = getLunarDay(today);
  const season = getHawaiianSeason(today);
  const formattedDate = formatHawaiianDate(today);

  return (
    <KiloHomeWithEntry
      formattedDate={formattedDate}
      lunarDay={lunarDay.name}
      season={season}
      weeklyEntries={0}
      weeklyHours={0}
      totalEntries={0}
    />
  );
}
