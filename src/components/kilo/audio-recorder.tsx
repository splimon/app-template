"use client";

import { useState, useRef } from "react";

export function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const sendAudio = async (fileBlob: Blob) => {
    try {
      setTranscribing(true);
      const formData = new FormData();
      formData.append('file', fileBlob, 'audio.webm');

      console.log("Sending audio blob to server:", fileBlob);
      console.log("FormData contents:", formData);
      
      const resp = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) throw new Error('Server responded with ' + resp.status);

      const data = await resp.json();
      setTranscript(data.text ?? JSON.stringify(data));
      setTranscribing(false);
    } catch (e) {
      console.error(e);
      setTranscript('Error processing audio');
      setTranscribing(false);
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
      await sendAudio(blob);
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