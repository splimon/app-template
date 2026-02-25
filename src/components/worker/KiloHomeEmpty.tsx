export default function KiloHomeEmpty() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-[#1a1a1a]">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-white">ʻĀina Kilo</h1>
        <p className="text-[#9ca3af] text-sm mt-1">Track your daily farm work</p>
      </div>

      {/* Illustration placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-48 h-48 rounded-2xl bg-[#252525] mb-6 flex items-center justify-center">
          {/* Replace with <Image src="/illustrations/farm-field.png" ... /> */}
          <span className="text-6xl">🌱</span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">No entry yet today</h2>
        <p className="text-[#9ca3af] text-sm leading-relaxed max-w-xs">
          Log your work to track your contributions to the ʻāina.
        </p>
      </div>

      {/* FAB */}
      <div className="px-6 pb-6 flex justify-center">
        <button
          className="w-full max-w-xs py-4 rounded-2xl font-semibold text-white text-base"
          style={{ backgroundColor: '#C4622D' }}
        >
          + Start Your Daily Kilo
        </button>
      </div>
    </div>
  );
}
