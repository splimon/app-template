interface KiloHomeWithEntryProps {
  formattedDate: string;
  lunarDay: string;
  season: string;
  weeklyEntries: number;
  weeklyHours: number;
  totalEntries: number;
}

export default function KiloHomeWithEntry({
  formattedDate,
  lunarDay,
  season,
  weeklyEntries,
  weeklyHours,
  totalEntries,
}: KiloHomeWithEntryProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#1a1a1a] px-6 pt-12">
      {/* Date header */}
      <div className="mb-4">
        <p className="text-[#C4622D] text-xs font-bold uppercase tracking-widest mb-1">Today</p>
        <h1 className="text-xl font-bold text-white">{formattedDate}</h1>
      </div>

      {/* Lunar / season chips */}
      <div className="flex gap-2 mb-6">
        <span className="px-3 py-1 rounded-full bg-[#252525] text-[#9ca3af] text-xs">
          🌙 {lunarDay}
        </span>
        <span className="px-3 py-1 rounded-full bg-[#252525] text-[#9ca3af] text-xs">
          🌿 {season}
        </span>
      </div>

      {/* Quote card */}
      <div className="rounded-2xl bg-[#252525] p-4 mb-6">
        <p className="text-white text-sm leading-relaxed italic">
          &ldquo;He aliʻi ka ʻāina, he kauwā ke kanaka.&rdquo;
        </p>
        <p className="text-[#6b7280] text-xs mt-2">
          The land is chief, the people are its servants.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'This Week', value: weeklyEntries, unit: 'entries' },
          { label: 'Hours', value: weeklyHours, unit: 'this week' },
          { label: 'Total', value: totalEntries, unit: 'entries' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[#252525] p-3 text-center">
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-[#9ca3af] text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ʻĀina Kilo banner */}
      <div className="rounded-2xl bg-[#252525] p-4 mb-6">
        <p className="text-white text-sm font-semibold">ʻĀina Kilo</p>
        <p className="text-[#9ca3af] text-xs mt-1">Your daily entry has been recorded.</p>
      </div>

      {/* FAB */}
      <div className="flex justify-center pb-4">
        <button
          className="w-full py-4 rounded-2xl font-semibold text-white text-base"
          style={{ backgroundColor: '#C4622D' }}
        >
          + Add Another Entry
        </button>
      </div>
    </div>
  );
}
