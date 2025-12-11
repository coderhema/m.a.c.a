"use client";

import React, { useEffect, useRef } from "react";
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
  } = useSession();
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionState === SessionState.DISCONNECTED) {
      onSessionStopped();
    }
  }, [sessionState, onSessionStopped]);

  useEffect(() => {
    if (isStreamReady && videoRef.current) {
      attachElement(videoRef.current);
    }
  }, [attachElement, isStreamReady]);

  useEffect(() => {
    if (sessionState === SessionState.INACTIVE) {
      startSession();
    }
  }, [startSession, sessionState]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-4">
      {/* Video Container */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center">
        {isStreamReady ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p>Connecting to avatar...</p>
          </div>
        )}
        
        {sessionState === SessionState.INACTIVE && (
          <button
            className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors"
            onClick={stopSession}
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
};