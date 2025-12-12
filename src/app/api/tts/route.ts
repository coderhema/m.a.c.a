import { NextResponse } from "next/server";

const YARNGPT_API_URL = "https://yarngpt.ai/api/v1/tts";

interface TTSRequest {
  text: string;
  voice?: string;
  response_format?: "mp3" | "wav" | "opus" | "flac";
}

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.YARNGPT_API_KEY) {
      return NextResponse.json(
        { error: "YarnGPT API key is not configured" },
        { status: 500 }
      );
    }

    const { text, voice = "Idera", response_format = "wav" }: TTSRequest = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "Text must be 2000 characters or less" },
        { status: 400 }
      );
    }

    // Call YarnGPT TTS API
    const response = await fetch(YARNGPT_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.YARNGPT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice,
        response_format,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("YarnGPT API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to generate speech",
          details: errorData,
        },
        { status: response.status }
      );
    }

    // Get the audio data as buffer
    const audioBuffer = await response.arrayBuffer();

    // Determine content type based on format
    const contentTypes: Record<string, string> = {
      mp3: "audio/mpeg",
      wav: "audio/wav",
      opus: "audio/opus",
      flac: "audio/flac",
    };

    // Return the audio file
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": contentTypes[response_format] || "audio/wav",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);

    return NextResponse.json(
      {
        error: "Failed to process TTS request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
