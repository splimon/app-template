export default function JourneyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-32 h-32 rounded-full bg-[#252525] mb-6 flex items-center justify-center">
        <span className="text-5xl">🗺️</span>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Your Journey</h2>
      <p className="text-[#9ca3af] text-sm leading-relaxed max-w-xs">
        Your work history and progress will appear here as you log your daily kilos.
      </p>
    </div>
  );
}
