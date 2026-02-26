"use client";

import { useState, useRef } from "react";

export default function AudioPlayer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSpeech = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/audio/speak", { method: "POST" });
      if (!resp.ok) {
        throw new Error(`Server responded with ${resp.status}`);
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play();
      }
    } catch (e: any) {
      console.error("Error fetching speech audio:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={playSpeech}
        disabled={loading}
      >
        {loading ? "Loading..." : "Play Speech"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <audio ref={audioRef} />
    </div>
  );
}
