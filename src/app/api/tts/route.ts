import { NextResponse } from "next/server";

// ElevenLabs TTS API
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

// Default voice ID (Rachel - clear female voice)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

interface TTSRequest {
  text: string;
  voice?: string;
  language?: string;
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      console.error("TTS: ELEVENLABS_API_KEY not configured");
      return NextResponse.json(
        { error: "ElevenLabs API key is not configured" },
        { status: 500 }
      );
    }

    const { text, voice = DEFAULT_VOICE_ID }: TTSRequest = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    // Truncate if too long
    const truncatedText = text.length > 2000 ? text.substring(0, 2000) : text;

    console.log("TTS: Processing with ElevenLabs", {
      textLength: truncatedText.length,
      voice,
    });

    const response = await fetch(`${ELEVENLABS_API_URL}/${voice}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/pcm",
      },
      body: JSON.stringify({
        text: truncatedText,
        model_id: "eleven_multilingual_v2",
        output_format: "pcm_24000", // PCM 16-bit 24kHz - exactly what LiveAvatar needs!
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TTS: ElevenLabs API error:", response.status, errorText);
      return NextResponse.json(
        {
          error: "Failed to generate speech",
          details: errorText,
        },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();

    console.log("TTS: Success with ElevenLabs", {
      audioSizeKB: (audioBuffer.byteLength / 1024).toFixed(2) + "KB",
    });

    // ElevenLabs returns PCM 24kHz directly - no resampling needed!
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/pcm",
        "Content-Length": audioBuffer.byteLength.toString(),
        "X-Sample-Rate": "24000",
        "X-Bit-Depth": "16",
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
