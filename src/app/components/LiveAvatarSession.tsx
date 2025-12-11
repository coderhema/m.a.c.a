"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LiveAvatarContextProvider,
  useSession,
  useTextChat,
  useVoiceChat,
} from "@/lib/liveavatar";
import { SessionState } from "@heygen/liveavatar-web-sdk";
import { useAvatarActions } from "@/lib/liveavatar/useAvatarActions";

const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
    >
      {children}
    </button>
  );
};

const LiveAvatarSessionComponent: React.FC<{
  mode: "FULL" | "CUSTOM";
  onSessionStopped: () => void;
}> = ({ mode, onSessionStopped }) => {
  const [message, setMessage] = useState("");
  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    connectionQuality,
    keepAlive,
    attachElement,
  } = useSession();
  const {
    isAvatarTalking,
    isUserTalking,
    isMuted,
    isActive,
    isLoading,
    start,
    stop,
    mute,
    unmute,
  } = useVoiceChat();

  const { interrupt, repeat, startListening, stopListening } =
    useAvatarActions(mode);

  const { sendMessage } = useTextChat(mode);
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

  const handleStartVoiceChat = () => {
    if (isActive) {
      stop();
    } else {
      start();
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleRepeatMessage = () => {
    if (message.trim()) {
      repeat(message);
      setMessage("");
    }
  };

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

      {/* Session Controls */}
      <div className="w-full max-w-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={handleStartVoiceChat}
            disabled={isLoading}
          >
            {isActive ? "Stop Voice Chat" : "Start Voice Chat"}
          </Button>
          
          {isActive && (
            <Button
              onClick={handleMuteToggle}
            >
              {isMuted ? "Unmute" : "Mute"}
            </Button>
          )}
          
          <Button
            onClick={keepAlive}
          >
            Keep Alive
          </Button>
          
          <Button
            onClick={interrupt}
          >
            Interrupt
          </Button>
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send
          </Button>
          <Button
            onClick={handleRepeatMessage}
            disabled={!message.trim()}
          >
            Repeat
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 text-center">
            <p className="text-gray-400">Status</p>
            <p className="text-white font-medium">{sessionState}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 text-center">
            <p className="text-gray-400">Quality</p>
            <p className="text-white font-medium capitalize">{connectionQuality}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 text-center">
            <p className="text-gray-400">Avatar</p>
            <p className="text-white font-medium">{isAvatarTalking ? "Talking" : "Silent"}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 text-center">
            <p className="text-gray-400">Voice Chat</p>
            <p className="text-white font-medium">{isActive ? "Active" : "Inactive"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LiveAvatarSession: React.FC<{
  mode: "FULL" | "CUSTOM";
  sessionAccessToken: string;
  onSessionStopped: () => void;
}> = ({ mode, sessionAccessToken, onSessionStopped }) => {
  return (
    <LiveAvatarContextProvider sessionAccessToken={sessionAccessToken}>
      <LiveAvatarSessionComponent
        mode={mode}
        onSessionStopped={onSessionStopped}
      />
    </LiveAvatarContextProvider>
  );
};