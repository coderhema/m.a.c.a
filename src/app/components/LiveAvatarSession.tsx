"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/liveavatar";
import { SessionState } from "@heygen/liveavatar-web-sdk";

export const LiveAvatarSession: React.FC<{
  mode: "FULL" | "CUSTOM";
  onSessionStopped: () => void;
}> = ({ onSessionStopped }) => {
  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    attachElement,
    connectionQuality,
    sessionInitializing,
  } = useSession();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle session disconnection and errors
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (sessionState === "disconnected") {
      timeoutId = setTimeout(() => {
        setError("Session disconnected. Please try again.");
        onSessionStopped();
      }, 0);
    }
    
    if (sessionState === "error") {
      timeoutId = setTimeout(() => {
        setError("Session error occurred. Please try again.");
        onSessionStopped();
      }, 0);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionState, onSessionStopped]);

  // Handle video attachment
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isStreamReady && videoRef.current) {
      timeoutId = setTimeout(() => {
        try {
          attachElement(videoRef.current!);
        } catch (err) {
          console.error("Failed to attach video element:", err);
          setError("Failed to initialize video stream. Please try again.");
        }
      }, 0);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [attachElement, isStreamReady]);

  // Handle session start
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Only try to start session if it's inactive and not initializing
    if (sessionState === "inactive" && !sessionInitializing) {
      timeoutId = setTimeout(() => {
        setError(null); // Clear any previous errors
        startSession().catch((err: unknown) => {
          console.error("Failed to start session:", err);
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          setError(`Failed to start session: ${errorMessage}`);
          onSessionStopped();
        });
      }, 0);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [startSession, sessionState, sessionInitializing, onSessionStopped]);

  const handleStopSession = async () => {
    try {
      await stopSession();
      onSessionStopped();
    } catch (err: unknown) {
      console.error("Failed to stop session:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to stop session: ${errorMessage}`);
      // Even if stopping fails, we should still notify the parent
      onSessionStopped();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-4">
      {/* Video Container */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center">
        {error ? (
          <div className="flex flex-col items-center justify-center text-white p-4 text-center">
            <div className="text-red-500 mb-2">Error</div>
            <p className="mb-4">{error}</p>
            <button
              className="bg-primary hover:bg-primary/90 text-black font-bold py-2 px-4 rounded-full transition-all"
              onClick={handleStopSession}
            >
              Try Again
            </button>
          </div>
        ) : sessionInitializing ? (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p>Initializing session...</p>
          </div>
        ) : isStreamReady ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p>
              {sessionState === "connecting"
                ? "Connecting to avatar..."
                : sessionState === "loading"
                ? "Loading avatar..."
                : "Preparing session..."}
            </p>
            {connectionQuality && connectionQuality !== "unknown" && (
              <p className="text-xs mt-2 opacity-75">
                Connection: {connectionQuality}
              </p>
            )}
          </div>
        )}
        
        {!error && sessionState !== "inactive" && (
          <button
            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors"
            onClick={handleStopSession}
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
};