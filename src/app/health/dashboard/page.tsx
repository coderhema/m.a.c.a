"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/app/components";
import { BottomControls } from "@/app/components";
import { LiveKitAvatarSession } from "@/components/LiveKitAvatarSession";

interface SessionData {
  session_id: string;
  session_token: string;
  livekit_url: string;
  livekit_client_token: string;
}

export default function HealthDashboard() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState("00:00");
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

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
      
      const data: SessionData = await res.json();
      
      if (!data.livekit_url || !data.livekit_client_token) {
        throw new Error("Invalid response from server - missing LiveKit credentials");
      }
      
      setSessionData(data);
      
      // Start the timer
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
          setCallDuration(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionStopped = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
    setCallDuration("00:00");
    setCurrentTranscript("");
    setCurrentResponse("");
    setSessionData(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full w-full md:max-w-full md:mx-0 max-w-md mx-auto bg-black overflow-hidden shadow-2xl">
      {/* Video Feed Background */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {sessionData && (
          <LiveKitAvatarSession
            livekitUrl={sessionData.livekit_url}
            token={sessionData.livekit_client_token}
            onDisconnect={handleSessionStopped}
          >
            <BottomControls 
              variant="livekit"
              onTranscript={setCurrentTranscript}
              onResponse={setCurrentResponse}
            />
          </LiveKitAvatarSession>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>
      </div>

      <Header callDuration={sessionData ? callDuration : undefined} />

      {/* Middle Section - pointer-events-none so it doesn't block controls beneath */}
      <div className="flex-1 relative z-10 flex flex-col justify-end pb-4 px-4 md:px-8 md:pb-8 md:items-center md:justify-center pointer-events-none">
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4 text-white max-w-md mx-auto pointer-events-auto">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-xs text-red-300 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {sessionData ? (
          <div className="w-full max-w-lg mx-auto space-y-3 mb-32">
            {/* Chat bubbles hidden for now
            {currentTranscript && (
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-300 font-medium mb-1">You said:</p>
                <p className="text-sm text-white">{currentTranscript}</p>
              </div>
            )}
            {currentResponse && (
              <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-3">
                <p className="text-xs text-primary font-medium mb-1">MACA:</p>
                <p className="text-sm text-white">{currentResponse}</p>
              </div>
            )}
            */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full pointer-events-auto">
            <button
              onClick={handleStartSession}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-black font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 mb-4 disabled:opacity-50 text-lg"
            >
              {loading ? "Connecting..." : "Talk to M.A.C.A."}
            </button>
            <p className="text-gray-400 text-center max-w-md">
              Connect with our AI Health Practitioner for consultation and advice
            </p>
          </div>
        )}
      </div>
    </div>
  );
}