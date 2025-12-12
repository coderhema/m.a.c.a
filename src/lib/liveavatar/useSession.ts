"use client";

import { useState, useEffect, useCallback } from "react";
import { useLiveAvatarContext } from "./context";
import { LiveAvatarSession, SessionState } from "./types";

export const useSession = () => {
  const { session, sessionInitializing, sessionInitialized } = useLiveAvatarContext();
  const [sessionState, setSessionState] = useState<SessionState>("inactive");
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<string>("unknown");

  const updateSessionState = useCallback((state: unknown) => {
    // Type guard to ensure we're getting a valid SessionState
    if (typeof state === 'string') {
      setSessionState(state as SessionState);
    }
  }, []);

  const updateStreamReady = useCallback((ready: boolean) => {
    setIsStreamReady(ready);
  }, []);

  const updateConnectionQuality = useCallback((quality: string) => {
    setConnectionQuality(quality);
  }, []);

  useEffect(() => {
    if (!session) return;

    // Set up event listeners with proper typing
    session.on("state_changed", updateSessionState);
    session.on("stream_ready", () => updateStreamReady(true));
    session.on("connection_quality_changed", updateConnectionQuality);

    // Clean up event listeners
    return () => {
      session.off("state_changed", updateSessionState);
      session.off("stream_ready", () => updateStreamReady(true));
      session.off("connection_quality_changed", updateConnectionQuality);
    };
  }, [session, updateSessionState, updateStreamReady, updateConnectionQuality]);

  const startSession = useCallback(async () => {
    if (!session) {
      if (sessionInitializing) {
        throw new Error("Session is still initializing");
      }
      throw new Error("Session not initialized");
    }
    
    try {
      setSessionState("inactive"); // Reset state before starting
      await (session as unknown as LiveAvatarSession).start();
    } catch (error) {
      console.error("Failed to start session:", error);
      throw error;
    }
  }, [session, sessionInitializing, sessionInitialized]);

  const stopSession = useCallback(async () => {
    if (!session) {
      throw new Error("Session not initialized");
    }
    
    try {
      await (session as unknown as LiveAvatarSession).stop();
      setSessionState("inactive");
      setIsStreamReady(false);
      setConnectionQuality("unknown");
    } catch (error) {
      console.error("Failed to stop session:", error);
      throw error;
    }
  }, [session]);

  const keepAlive = useCallback(async () => {
    if (!session) {
      throw new Error("Session not initialized");
    }
    
    try {
      await (session as unknown as LiveAvatarSession).keepAlive();
    } catch (error) {
      console.error("Failed to keep session alive:", error);
      throw error;
    }
  }, [session]);

  const attachElement = useCallback((element: HTMLVideoElement) => {
    if (!session) {
      throw new Error("Session not initialized");
    }
    
    (session as unknown as LiveAvatarSession).attachElement(element);
  }, [session]);

  return {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    connectionQuality,
    keepAlive,
    attachElement,
    sessionInitializing,
    sessionInitialized,
    // Expose session existence for components to check
    sessionExists: !!session,
  };
};