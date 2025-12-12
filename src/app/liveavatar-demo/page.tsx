"use client";

import React, { useState } from "react";
import { LiveKitAvatarSession } from "@/components/LiveKitAvatarSession";

interface SessionData {
  session_id: string;
  session_token: string;
  livekit_url: string;
  livekit_client_token: string;
}

export default function LiveAvatarDemoPage() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/heygen/session", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create session");
      }

      const data: SessionData = await response.json();
      setSessionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error creating session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = () => {
    setSessionData(null);
    setError(null);
  };

  if (sessionData) {
    return (
      <div className="w-full h-screen bg-black">
        <LiveKitAvatarSession
          livekitUrl={sessionData.livekit_url}
          token={sessionData.livekit_client_token}
          onDisconnect={endSession}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">LiveAvatar Demo</h1>
          <p className="text-gray-400">
            Connect with an AI avatar powered by LiveAvatar.com
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={createSession}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Creating Session...
            </span>
          ) : (
            "Start Conversation"
          )}
        </button>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm space-y-2">
          <p className="font-semibold text-gray-300">Before you start:</p>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Ensure your environment variables are configured</li>
            <li>You need a valid LiveAvatar API key</li>
            <li>Avatar ID, Voice ID, and Context ID must be set</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
