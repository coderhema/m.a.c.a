"use client";

import { useState, useEffect } from "react";
import { Header } from "@/app/components";
import { BottomControls } from "@/app/components";
import { LiveKitAvatarSession } from "@/components/LiveKitAvatarSession";

interface SessionData {
  session_id: string;
  session_token: string;
  livekit_url: string;
  livekit_client_token: string;
}

export default function VideoCallPage() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create LiveAvatar session on mount
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

    createSession();
  }, []);

  const handleDisconnect = () => {
    setSessionData(null);
    // Optionally redirect or show reconnect UI
  };

  return (
    <div className="relative flex flex-col h-full w-full md:max-w-full md:mx-0 max-w-md mx-auto bg-black overflow-hidden shadow-2xl">
      {/* Video Feed Background */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* LiveKit Video Room */}
        {sessionData && (
          <LiveKitAvatarSession
            livekitUrl={sessionData.livekit_url}
            token={sessionData.livekit_client_token}
            onDisconnect={handleDisconnect}
          />
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-sm">Initializing session...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center text-white max-w-md px-4">
              <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-lg">
                <p className="font-semibold mb-2">Connection Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-primary text-black rounded-full font-medium hover:bg-primary/80 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
      </div>

      <Header />

      {/* Middle Section */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-4 px-4 md:px-8 md:pb-8 md:items-start md:justify-center">
        {/* Content can be added here */}
      </div>

      <BottomControls />
    </div>
  );
}
