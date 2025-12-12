"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LiveAvatarSession } from "./types";

interface LiveAvatarContextType {
  session: LiveAvatarSession | null;
  sessionInitializing: boolean;
  sessionInitialized: boolean;
}

const LiveAvatarContext = createContext<LiveAvatarContextType | undefined>(undefined);

export const LiveAvatarContextProvider: React.FC<{
  children: React.ReactNode;
  sessionAccessToken?: string | null;
}> = ({ children, sessionAccessToken }) => {
  const [session, setSession] = useState<LiveAvatarSession | null>(null);
  const [sessionInitializing, setSessionInitializing] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  useEffect(() => {
    // Reset session initialized flag when token changes
    setSessionInitialized(false);
    
    // Clean up any existing session
    setSession(prevSession => {
      if (prevSession) {
        // Attempt to stop any existing session
        try {
          // We can't await this, but we'll try to clean up
          (prevSession as unknown as LiveAvatarSession).stop?.();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      return null;
    });
    
    if (!sessionAccessToken) {
      setSessionInitializing(false);
      return;
    }
    
    // Set initializing state
    setSessionInitializing(true);
    
    // Dynamically import the LiveAvatarSession class
    const initSession = async () => {
      try {
        const liveAvatarModule = await import("@heygen/liveavatar-web-sdk");
        const LiveAvatarSessionClass = liveAvatarModule.LiveAvatarSession;
        const newSession = new LiveAvatarSessionClass(sessionAccessToken);
        setSession(newSession as unknown as LiveAvatarSession);
        setSessionInitialized(true);
      } catch (error) {
        console.error("Failed to initialize LiveAvatarSession:", error);
        setSession(null);
        setSessionInitialized(false);
      } finally {
        setSessionInitializing(false);
      }
    };
    
    initSession();
    
    // Cleanup function
    return () => {
      setSession(prevSession => {
        if (prevSession) {
          // Attempt to stop the session
          try {
            (prevSession as unknown as LiveAvatarSession).stop?.();
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
        return null;
      });
      setSessionInitializing(false);
      setSessionInitialized(false);
    };
  }, [sessionAccessToken]);

  return (
    <LiveAvatarContext.Provider value={{ session, sessionInitializing, sessionInitialized }}>
      {children}
    </LiveAvatarContext.Provider>
  );
};

export const useLiveAvatarContext = () => {
  const context = useContext(LiveAvatarContext);
  if (context === undefined) {
    throw new Error("useLiveAvatarContext must be used within a LiveAvatarContextProvider");
  }
  return context;
};