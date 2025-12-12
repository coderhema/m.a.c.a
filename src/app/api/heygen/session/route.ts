import { NextResponse } from "next/server";
import { log } from "@/lib/logger";

// Define response interfaces
interface ErrorResponse {
  error: string;
}

interface LiveAvatarSessionTokenResponse {
  code: number;
  data: {
    session_id: string;
    session_token: string;
  };
  message: string;
}

interface LiveAvatarSessionStartResponse {
  code: number;
  data: {
    livekit_url: string;
    livekit_client_token: string;
    session_id: string;
  };
  message: string;
}

interface SessionData {
  session_id: string;
  session_token: string;
  livekit_url: string;
  livekit_client_token: string;
}

export async function POST() {
  log.info("Starting LiveAvatar session creation");
  const apiKey = process.env.LIVEAVATAR_API_KEY?.replace(/\s/g, "");
  const avatarId = process.env.LIVEAVATAR_AVATAR_ID;

  // Validate required environment variables
  if (!apiKey) {
    log.error("Missing LIVEAVATAR_API_KEY environment variable");
    return NextResponse.json<ErrorResponse>(
      { error: "LIVEAVATAR_API_KEY is not set in environment variables" },
      { status: 500 }
    );
  }

  if (!avatarId) {
    log.error("Missing LIVEAVATAR_AVATAR_ID environment variable");
    return NextResponse.json<ErrorResponse>(
      { error: "LIVEAVATAR_AVATAR_ID is not set in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Step 1: Create session token
    // Using FULL mode - HeyGen handles LLM, TTS, and avatar speaking
    const tokenPayload = {
      mode: "FULL",
      avatar_id: avatarId,
      avatar_persona: {
        context_id: "997c5c6b-53d9-43dc-861c-554cdae5f906", // MACA medical assistant context
        language: "en",
      },
    };

    log.debug("Requesting session token", { avatarId, mode: "FULL" });

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
      log.error("LiveAvatar Token API Error", errorText, { status: tokenResponse.status });
      
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
    
    // Log the full response for debugging
    log.info("Session token response received", { 
      sessionId: tokenData.data?.session_id,
      hasToken: !!tokenData.data?.session_token,
      code: tokenData.code,
      message: tokenData.message
    });
    
    // Validate token response
    if (!tokenData.data?.session_id || !tokenData.data?.session_token) {
      log.error("Invalid token response - missing session data", undefined, { 
        receivedData: tokenData,
        hasSessionId: !!tokenData.data?.session_id,
        hasSessionToken: !!tokenData.data?.session_token
      });
      return NextResponse.json<ErrorResponse>(
        { error: `Invalid response from LiveAvatar Token API - missing session data. Received: ${JSON.stringify(tokenData)}` },
        { status: 500 }
      );
    }

    // Step 2: Start the session to get LiveKit credentials
    log.debug("Starting LiveAvatar session", { sessionId: tokenData.data.session_id });
    
    const startResponse = await fetch("https://api.liveavatar.com/v1/sessions/start", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "authorization": `Bearer ${tokenData.data.session_token}`,
      },
    });

    if (!startResponse.ok) {
      const errorText = await startResponse.text();
      log.error("LiveAvatar Start API Error", errorText, { status: startResponse.status });
      
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
    log.info("LiveAvatar session started successfully", { 
      sessionId: startData.data?.session_id,
      livekitUrl: startData.data?.livekit_url,
      code: startData.code,
      message: startData.message
    });
    
    // Validate start response
    if (!startData.data?.livekit_url || !startData.data?.livekit_client_token) {
      log.error("Invalid start response - missing LiveKit data", undefined, { startData });
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid response from LiveAvatar Start API - missing LiveKit data" },
        { status: 500 }
      );
    }

    // Return session data with LiveKit credentials
    const sessionData: SessionData = {
      session_id: tokenData.data.session_id,
      session_token: tokenData.data.session_token,
      livekit_url: startData.data.livekit_url,
      livekit_client_token: startData.data.livekit_client_token,
    };

    log.info("LiveAvatar session creation complete", { sessionId: sessionData.session_id });
    return NextResponse.json<SessionData>(sessionData);
  } catch (error) {
    log.error("Error creating LiveAvatar session", error);
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
