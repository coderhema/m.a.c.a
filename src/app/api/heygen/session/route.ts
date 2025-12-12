import { NextResponse } from "next/server";

// Define the payload interface
interface CreateTokenPayload {
  avatar_id: string;
  voice_id?: string;
}

// Define ICE server interface
interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

// Define response interfaces
interface ErrorResponse {
  error: string;
}

interface TokenData {
  token: string;
  // Include known fields from HeyGen API response
  session_id?: string;
  ice_servers?: IceServer[];
}

interface TokenResponse {
  data: TokenData;
  message?: string;
  status?: string;
}

export async function POST() {
  const apiKey = process.env.HEYGEN_API_KEY?.replace(/\s/g, "");
  const avatarId = process.env.HEYGEN_AVATAR_ID;
  const voiceId = process.env.HEYGEN_VOICE_ID;

  // Validate required environment variables
  if (!apiKey) {
    return NextResponse.json<ErrorResponse>(
      { error: "HEYGEN_API_KEY is not set in environment variables" },
      { status: 500 }
    );
  }

  if (!avatarId) {
    return NextResponse.json<ErrorResponse>(
      { error: "HEYGEN_AVATAR_ID is not set in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Create the request payload
    const payload: CreateTokenPayload = {
      avatar_id: avatarId,
    };

    // Only include voice_id if it's provided
    if (voiceId) {
      payload.voice_id = voiceId;
    }

    const response = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HeyGen API Error Response:", errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        return NextResponse.json<ErrorResponse>(
          { error: errorData.message || `HeyGen API error: ${response.status}` },
          { status: response.status }
        );
      } catch (parseError) {
        return NextResponse.json<ErrorResponse>(
          { error: `HeyGen API error: ${response.status} - ${errorText}` },
          { status: response.status }
        );
      }
    }

    const data: TokenResponse = await response.json();
    
    // Validate that we received a token
    if (!data.data || !data.data.token) {
      return NextResponse.json<ErrorResponse>(
        { error: "Invalid response from HeyGen API - missing token" },
        { status: 500 }
      );
    }

    return NextResponse.json<TokenData>(data.data);
  } catch (error) {
    console.error("Error creating session token:", error);
    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json<ErrorResponse>(
        { error: error.message || "Internal server error when creating session token" },
        { status: 500 }
      );
    }
    return NextResponse.json<ErrorResponse>(
      { error: "Unknown error occurred when creating session token" },
      { status: 500 }
    );
  }
}