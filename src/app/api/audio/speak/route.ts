import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: `${process.env.SPEACHES_BASE_URL}/v1`,
    apiKey: process.env.SPEACHES_API_KEY?.trim(),
});
export async function POST(request: Request) {
  try {
    // In a real implementation you would parse the request body for custom input,
    // but for now we keep the static example payload.
    const question = {
      "input": "What is your weather like today?",
      "model": process.env.SPEACHES_TTS_MODEL || "speaches-ai/Kokoro-82M-v1.0-ONNX",
      "voice": "af_heart"
    };

    const response = await openai.audio.speech.create({
      model: question.model,
      voice: question.voice,
      input: question.input,
      response_format: "mp3",
      speed: 1.0,
    });

    // `response` is a streaming response containing raw MP3 bytes.
    // Forward it directly to the client with the appropriate content type.
    return new NextResponse(response.body, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });

  } catch (error) {
    console.error("[speaches] Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
