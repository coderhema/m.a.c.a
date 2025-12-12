import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Get the audio file from the request
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    // Optional: Get language hint from request
    const language = formData.get("language") as string | null;

    // Convert File to format OpenAI expects
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type });
    const file = new File([audioBlob], audioFile.name, { type: audioFile.type });

    // Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: language || undefined, // Auto-detect if not provided
      response_format: "json",
    });

    return NextResponse.json({
      text: transcription.text,
      language: language || "auto-detected",
    });
  } catch (error) {
    console.error("STT API error:", error);

    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
