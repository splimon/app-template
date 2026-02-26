import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const base64Audio = body.audio;

    if (!base64Audio) {
      return NextResponse.json({ error: "No audio uploaded" }, { status: 400 });
    }

    const audio = Buffer.from(base64Audio, "base64");
    const tempFilePath = `/tmp/${Date.now()}.wav`;

    fs.writeFileSync(tempFilePath, audio);

    const readStream = fs.createReadStream(tempFilePath);
    const response = await openai.audio.transcriptions.create({
      file: readStream,
      model: "whisper-1",
      response_format: "verbose_json",
    });

    fs.unlinkSync(tempFilePath);

    return NextResponse.json(response);
  } catch (error) {
    console.error("[whisper] Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}