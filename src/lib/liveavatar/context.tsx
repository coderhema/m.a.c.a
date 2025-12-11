"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LiveAvatarSession } from "@heygen/liveavatar-web-sdk";

interface LiveAvatarContextType {
  session: LiveAvatarSession | null;
}

const LiveAvatarContext = createContext<LiveAvatarContextType | undefined>(undefined);

export const LiveAvatarContextProvider: React.FC<{
  children: React.ReactNode;
  sessionAccessToken?: string | null;
}> = ({ children, sessionAccessToken }) => {
  const [session, setSession] = useState<LiveAvatarSession | null>(null);

  useEffect(() => {
    if (!sessionAccessToken) {
      setSession(null);
      return;
    }
    const newSession = new LiveAvatarSession(sessionAccessToken);
    setSession(newSession);
    return () => {
      setSession(null);
    };
  }, [sessionAccessToken]);

  return (
    <LiveAvatarContext.Provider value={{ session }}>
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