import { NextResponse } from "next/server";

// Define response interfaces
interface ErrorResponse {
  error: string;
}

interface LiveAvatarSessionTokenResponse {
  session_id: string;
  session_token: string;
}

interface LiveAvatarSessionStartResponse {
  livekit_url: string;
  livekit_client_token: string;
  session_id: string;
}

interface SessionData {
  session_id: string;
  session_token: string;
  livekit_url: string;
  livekit_client_token: string;
}

export async function POST() {
  const apiKey = process.env.LIVEAVATAR_API_KEY?.replace(/\s/g, "");
  const avatarId = process.env.LIVEAVATAR_AVATAR_ID;

  // Validate required environment variables
  if (!apiKey) {
    return NextResponse.json<ErrorResponse>(
      { error: "LIVEAVATAR_API_KEY is not set in environment variables" },
      { status: 500 }
    );
  }

  if (!avatarId) {
    return NextResponse.json<ErrorResponse>(
      { error: "LIVEAVATAR_AVATAR_ID is not set in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Step 1: Create session token
    // Using CUSTOM mode - only handles video generation from audio
    // You'll manage your own LLM/conversation logic
    const tokenPayload = {
      mode: "CUSTOM",
      avatar_id: avatarId,
    };

    const tokenResponse = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "accept": "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(tokenPayload),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("LiveAvatar Token API Error:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json<ErrorResponse>(
          { error: errorData.message || `LiveAvatar Token API error: ${tokenResponse.status}` },
          { status: tokenResponse.status }
        );
      } catch (parseError) {
        return NextResponse.json<ErrorResponse>(
          { error: `LiveAvatar Token API error: ${tokenResponse.status} - ${errorText}` },
          { status: tokenResponse.status }
        );
      }
    }

    const tokenData: LiveAvatarSessionTokenResponse = await tokenResponse.json();
    
    // Validate token response
    if (!tokenData.session_id || !tokenData.session_token) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid response from LiveAvatar Token API - missing session data" },
        { status: 500 }
      );
    }

    // Step 2: Start the session
    const startResponse = await fetch("https://api.liveavatar.com/v1/sessions/start", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "authorization": `Bearer ${tokenData.session_token}`,
      },
    });

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      console.error("LiveAvatar Start API Error:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json<ErrorResponse>(
          { error: errorData.message || `LiveAvatar Start API error: ${startResponse.status}` },
          { status: startResponse.status }
        );
      } catch (parseError) {
        return NextResponse.json<ErrorResponse>(
          { error: `LiveAvatar Start API error: ${startResponse.status} - ${errorText}` },
          { status: startResponse.status }
        );
      }
    }

    const startData: LiveAvatarSessionStartResponse = await startResponse.json();
    
    // Validate start response
    if (!startData.livekit_url || !startData.livekit_client_token) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid response from LiveAvatar Start API - missing LiveKit data" },
        { status: 500 }
      );
    }

    // Return combined session data
    const sessionData: SessionData = {
      session_id: tokenData.session_id,
      session_token: tokenData.session_token,
      livekit_url: startData.livekit_url,
      livekit_client_token: startData.livekit_client_token,
    };

    return NextResponse.json<SessionData>(sessionData);
  } catch (error) {
    console.error("Error creating LiveAvatar session:", error);
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message || "Internal server error when creating LiveAvatar session" },
        { status: 500 }
      );
    }
    return NextResponse.json<ErrorResponse>(
      { error: "Unknown error occurred when creating LiveAvatar session" },
      { status: 500 }
    );
  }
}
