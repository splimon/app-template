// "use client" ensures this component runs only in the browser
"use client";

import { useState, useRef } from "react";

/**
 * Simple audio recorder that captures microphone input, sends the recording to the
 * server‑side Whisper endpoint (/api/whisper) and displays the returned
 * transcription.
 *
 * The server expects a JSON payload with a base64‑encoded WAV/WEBM audio buffer:
 *   { "audio": "<base64 string>" }
 * It returns the OpenAI Whisper response – the most useful field for a UI
 * consumer is `text`.
 */
export function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Convert a Blob to a base64 string (without the data: prefix)
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string; // data:audio/webm;base64,....
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendAudio = async (base64: string) => {
    try {
      setTranscribing(true);
      const resp = await fetch("/api/whisper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64 }),
      });
      if (!resp.ok) throw new Error("Server responded with " + resp.status);
      const data = await resp.json();
      // OpenAI's verbose JSON includes a `text` field with the transcription.
      setTranscript(data.text ?? JSON.stringify(data));
      setTranscribing(false);
    } catch (e) {
      console.error(e);
      setTranscript("Error processing audio");
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Your browser does not support audio capture.");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const base64 = await blobToBase64(blob);
      await sendAudio(base64);
      // clean up the microphone tracks
      stream.getTracks().forEach((t) => t.stop());
    };
    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {recording ? (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={stopRecording}
        >
          Stop Recording
        </button>
      ) : transcribing ? (
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          disabled
        >
          Transcribing...
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={startRecording}
        >
          Start Recording
        </button>
      )}
      {transcript && (
        <div className="max-w-md w-full p-4 border rounded bg-gray-50">
          <h3 className="font-medium mb-2">Transcription:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}