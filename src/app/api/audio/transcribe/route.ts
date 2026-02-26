import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: `${process.env.SPEACHES_BASE_URL}/v1`,
    apiKey: process.env.SPEACHES_API_KEY?.trim(),
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("file") as File;

    if (!audio) {
      return NextResponse.json({ error: "No audio sent" }, { status: 400 });
    }

    const form = new FormData();
    form.append("file", audio);
    form.append("model", "Systran/faster-whisper-large-v3");


    // Transcribe the audio file using Speaches API
    const response = await openai.audio.transcriptions.create({
      file: audio,
      model: process.env.SPEACHES_STT_MODEL || "Systran/faster-whisper-large-v3",
    });

    // const response = await fetch(`${process.env.SPEACHES_BASE_URL}/v1/audio/transcriptions`, {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.SPEACHES_API_KEY?.trim()}`,
    //   },
    //   body: form,
    // }).then(res => res.json());

    return NextResponse.json(response);
  } catch (error) {
    console.error("[speaches] Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}