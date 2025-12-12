import { NextResponse } from "next/server";

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

// Vision analysis prompt for medical context
const VISION_PROMPT = `You are a medical AI assistant analyzing an image from a patient during a telemedicine consultation.

Analyze this image and describe what you see in a medical context:
1. If you see hands or gestures, describe the gesture or what they might be indicating
2. If you see skin conditions, rashes, or visible symptoms, describe them clearly
3. If you see any objects (medications, medical devices, documents), identify them
4. If you see general body parts or posture, describe any relevant observations

Be concise and clinical. Focus on medically relevant observations.
If nothing medically relevant is visible, simply describe what you see briefly.

Respond in 1-2 sentences, suitable for voice output.`;

interface VisionRequest {
  image: string; // Base64 encoded image
  prompt?: string; // Optional custom prompt
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { image, prompt }: VisionRequest = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Remove data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    
    // Detect MIME type from data URL or default to JPEG
    let mimeType = "image/jpeg";
    if (image.startsWith("data:image/png")) {
      mimeType = "image/png";
    } else if (image.startsWith("data:image/webp")) {
      mimeType = "image/webp";
    }

    console.log("Vision: Analyzing image with Gemini 2.5 Flash...");

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
              {
                text: prompt || VISION_PROMPT,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Vision: Gemini API error:", response.status, errorData);
      throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Vision: Empty response from Gemini");
      throw new Error("No analysis result from Gemini");
    }

    console.log("Vision: Analysis complete:", text.substring(0, 100) + "...");

    return NextResponse.json({
      analysis: text,
      model: "gemini-2.5-flash-preview-05-20",
    });

  } catch (error) {
    console.error("Vision API error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
