"use client";

import { useState, useEffect } from "react";
import { Header } from "@/app/components";
import { BottomControls } from "@/app/components";
import { LiveAvatarSession } from "@/app/components";
import { LiveAvatarContextProvider } from "@/lib/liveavatar";

export default function HealthDashboard() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envError, setEnvError] = useState<string | null>(null);

  // Check for required environment variables on component mount
  useEffect(() => {
    const checkEnvVariables = () => {
      const requiredVars = ['HEYGEN_API_KEY', 'HEYGEN_AVATAR_ID'];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        setEnvError(`Missing required environment variables: ${missingVars.join(', ')}. Please check your .env file.`);
      }
    };

    // Since we're in a client component, we can't access process.env directly
    // We'll rely on the server-side validation in the API route
  }, []);

  const handleStartSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/heygen/session", {
        method: "POST",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to start session: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Validate that we received a token
      if (!data.token) {
        throw new Error("Invalid response from server - missing session token");
      }
      
      setSessionToken(data.token);
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
    <LiveAvatarContextProvider sessionAccessToken={sessionToken}>
      <div className="relative flex flex-col h-full w-full md:max-w-full md:mx-0 max-w-md mx-auto bg-black overflow-hidden shadow-2xl">
        {/* Video Feed Background */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
        </div>

        <Header />

        {/* Middle Section */}
        <div className="flex-1 relative z-10 flex flex-col justify-end pb-4 px-4 md:px-8 md:pb-8 md:items-start md:justify-center">
          {envError && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4 text-white">
              <p>Configuration Error: {envError}</p>
              <p className="mt-2 text-sm">Please ensure your .env file is properly configured with HEYGEN_API_KEY and HEYGEN_AVATAR_ID.</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4 text-white">
              <p>Error: {error}</p>
            </div>
          )}
          
          {sessionToken ? (
            <LiveAvatarSession
              mode="FULL"
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
    </LiveAvatarContextProvider>
  );
}