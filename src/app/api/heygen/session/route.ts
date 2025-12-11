import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.HEYGEN_API_KEY?.replace(/\s/g, "");
  const avatarId = process.env.HEYGEN_AVATAR_ID;
  const voiceId = process.env.HEYGEN_VOICE_ID;



  if (!apiKey) {
    return NextResponse.json(
      { error: "HEYGEN_API_KEY is not set" },
      { status: 500 }
    );
  }

  if (!avatarId) {
    return NextResponse.json(
      { error: "HEYGEN_AVATAR_ID is not set" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar_id: avatarId,
        voice_id: voiceId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to create session token" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.data);
  } catch (error) {
    console.error("Error creating session token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}