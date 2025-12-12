"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/liveavatar";
import { useVoiceChat } from "@/lib/liveavatar";
import { useTextChat } from "@/lib/liveavatar";
import { useAvatarActions } from "@/lib/liveavatar";

const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}> = ({ onClick, disabled, children, variant = "primary" }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-all";
  const variantClasses = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export const LiveAvatarSession: React.FC<{
  mode: "FULL" | "CUSTOM";
  onSessionStopped: () => void;
}> = ({ mode, onSessionStopped }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{role: string, content: string}>>([]);
  
  const {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    connectionQuality,
    keepAlive,
    attachElement,
    sessionInitializing,
    sessionInitialized,
    sessionExists,
  } = useSession();
  
  const {
    isAvatarTalking,
    isUserTalking,
    isMuted,
    isActive: isVoiceChatActive,
    isLoading: isVoiceChatLoading,
    start: startVoiceChat,
    stop: stopVoiceChat,
    mute,
    unmute,
  } = useVoiceChat();

  const { interrupt, repeat, startListening, stopListening } = useAvatarActions(mode);
  const { sendMessage } = useTextChat(mode);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle session disconnection and errors
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (sessionState === "disconnected") {
      timeoutId = setTimeout(() => {
        onSessionStopped();
      }, 0);
    }
    
    if (sessionState === "error") {
      timeoutId = setTimeout(() => {
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
    
    // Only try to start session if:
    // 1. It's inactive
    // 2. It's not initializing
    // 3. The session is fully initialized (not just exists)
    if (sessionState === "inactive" && !sessionInitializing && sessionInitialized) {
      timeoutId = setTimeout(() => {
        startSession().catch((err: unknown) => {
          console.error("Failed to start session:", err);
          onSessionStopped();
        });
      }, 100); // Small delay to ensure session is properly initialized
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [startSession, sessionState, sessionInitializing, sessionInitialized, onSessionStopped]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      // Add user message to chat history
      setChatHistory(prev => [...prev, { role: "user", content: message }]);
      
      await sendMessage(message);
      
      // Add assistant response to chat history (in a real app, this would come from the API)
      // setChatHistory(prev => [...prev, { role: "assistant", content: response }]);
      
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleRepeatMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      await repeat(message);
      setMessage("");
    } catch (error) {
      console.error("Failed to repeat message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleVoiceChatToggle = async () => {
    try {
      if (isVoiceChatActive) {
        await stopVoiceChat();
      } else {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Failed to toggle voice chat:", error);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-4">
      {/* Video Container */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center">
        {sessionInitializing ? (
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
        
        <button
          className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors"
          onClick={() => stopSession().then(onSessionStopped).catch(console.error)}
        >
          End Session
        </button>
      </div>

      {/* Controls and Chat */}
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-gray-400">Session:</span> {sessionState}
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-gray-400">Connection:</span> {connectionQuality}
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-gray-400">Avatar:</span> {isAvatarTalking ? "Talking" : "Silent"}
          </div>
        </div>

        {/* Voice Chat Controls */}
        {mode === "FULL" && (
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Voice Chat</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <Button
                onClick={handleVoiceChatToggle}
                disabled={isVoiceChatLoading}
                variant={isVoiceChatActive ? "danger" : "primary"}
              >
                {isVoiceChatLoading 
                  ? "Loading..." 
                  : isVoiceChatActive 
                    ? "Stop Voice Chat" 
                    : "Start Voice Chat"}
              </Button>
              
              {isVoiceChatActive && (
                <Button
                  onClick={handleMuteToggle}
                  variant={isMuted ? "secondary" : "primary"}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-sm">User:</span>
                <div className={`w-3 h-3 rounded-full ${isUserTalking ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}></div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Avatar:</span>
                <div className={`w-3 h-3 rounded-full ${isAvatarTalking ? "bg-blue-500 animate-pulse" : "bg-gray-500"}`}></div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => keepAlive().catch(console.error)} variant="secondary">
            Keep Alive
          </Button>
          <Button 
            onClick={() => startListening?.()?.catch(console.error)} 
            disabled={!sessionExists || sessionState !== "active"}
          >
            Start Listening
          </Button>
          <Button 
            onClick={() => stopListening?.()?.catch(console.error)} 
            variant="secondary"
            disabled={!sessionExists || sessionState !== "active"}
          >
            Stop Listening
          </Button>
          <Button 
            onClick={() => interrupt?.()?.catch(console.error)} 
            variant="danger"
            disabled={!sessionExists || sessionState !== "active"}
          >
            Interrupt
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
              placeholder="Type your message here..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
            <Button 
              onClick={handleRepeatMessage} 
              disabled={!message.trim() || isSending}
              variant="secondary"
            >
              Repeat
            </Button>
          </div>
        </div>

        {/* Chat History */}
        {chatHistory.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-lg max-h-40 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Chat History</h3>
            <div className="space-y-2">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`p-2 rounded ${msg.role === "user" ? "bg-blue-900/30" : "bg-gray-700/50"}`}>
                  <span className="font-semibold capitalize">{msg.role}:</span> {msg.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};