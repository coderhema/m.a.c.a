import { NextResponse } from "next/server";

// ElevenLabs Speech-to-Text API
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    // Check if API key is configured
    if (!apiKey) {
      console.error("STT API error: ELEVENLABS_API_KEY not configured");
      return NextResponse.json(
        { error: "ElevenLabs API key is not configured" },
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

    console.log("STT: Processing audio with ElevenLabs", { 
      type: audioFile.type, 
      sizeKB: (audioFile.size / 1024).toFixed(2) + "KB" 
    });

    // Create form data for ElevenLabs API
    const elevenLabsFormData = new FormData();
    elevenLabsFormData.append("file", audioFile);
    elevenLabsFormData.append("model_id", "scribe_v1");
    
    if (language) {
      elevenLabsFormData.append("language_code", language);
    }

    const response = await fetch(ELEVENLABS_API_URL, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: elevenLabsFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("STT: ElevenLabs API error:", response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const transcribedText = data.text?.trim();

    if (!transcribedText) {
      console.error("STT: Empty transcription response", data);
      throw new Error("Empty transcription response");
    }

    console.log("STT: Success with ElevenLabs:", transcribedText.substring(0, 100) + "...");

    return NextResponse.json({
      text: transcribedText,
      language: data.language_code || language || "auto-detected",
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
