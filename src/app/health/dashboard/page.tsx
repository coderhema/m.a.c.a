"use client";

import { useState } from "react";
import { Header } from "@/app/components";
import { BottomControls } from "@/app/components";
import { LiveAvatarSession } from "@/app/components";


export default function HealthDashboard() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/heygen/session", {
        method: "POST",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to start session");
      }
      
      const data = await res.json();
      setSessionToken(data.session_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionStopped = () => {
    setSessionToken(null);
  };

  return (
    <div className="relative flex flex-col h-full w-full md:max-w-full md:mx-0 max-w-md mx-auto bg-black overflow-hidden shadow-2xl">
      {/* Video Feed Background */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
      </div>

      <Header />

      {/* Middle Section */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-4 px-4 md:px-8 md:pb-8 md:items-start md:justify-center">
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4 text-white">
            <p>Error: {error}</p>
          </div>
        )}
        
        {sessionToken ? (
          <LiveAvatarSession
            mode="FULL"
            sessionAccessToken={sessionToken}
            onSessionStopped={handleSessionStopped}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <button
              onClick={handleStartSession}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-black font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 mb-4 disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Talk to AI Doctor"}
            </button>
            <p className="text-gray-400 text-center max-w-md">
              Connect with our AI medical professional for consultation and advice
            </p>
          </div>
        )}
      </div>

      <BottomControls />
    </div>
  );
}