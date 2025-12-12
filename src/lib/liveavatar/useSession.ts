"use client";

import { useState, useEffect, useCallback } from "react";
import { useLiveAvatarContext } from "./context";
import { LiveAvatarSession, SessionState } from "./types";
import { log } from "@/lib/logger";

export const useSession = () => {
  const { session, sessionInitializing, sessionInitialized } = useLiveAvatarContext();
  const [sessionState, setSessionState] = useState<SessionState>("inactive");
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<string>("unknown");

  const updateSessionState = useCallback((state: unknown) => {
    // Type guard to ensure we're getting a valid SessionState
    if (typeof state === 'string') {
      log.debug("Session state changed", { state });
      setSessionState(state as SessionState);
    }
  }, []);

  const updateStreamReady = useCallback((ready: boolean) => {
    log.info("Stream ready status updated", { ready });
    setIsStreamReady(ready);
  }, []);

  const updateConnectionQuality = useCallback((quality: string) => {
    log.debug("Connection quality changed", { quality });
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
        log.error("Cannot start session - still initializing");
        throw new Error("Session is still initializing");
      }
      log.error("Cannot start session - not initialized");
      throw new Error("Session not initialized");
    }
    
    try {
      log.info("Starting LiveAvatar session");
      setSessionState("inactive"); // Reset state before starting
      await (session as unknown as LiveAvatarSession).start();
      log.info("LiveAvatar session started successfully");
    } catch (error) {
      log.error("Failed to start session", error);
      throw error;
    }
  }, [session, sessionInitializing, sessionInitialized]);

  const stopSession = useCallback(async () => {
    if (!session) {
      log.error("Cannot stop session - not initialized");
      throw new Error("Session not initialized");
    }
    
    try {
      log.info("Stopping LiveAvatar session");
      await (session as unknown as LiveAvatarSession).stop();
      setSessionState("inactive");
      setIsStreamReady(false);
      setConnectionQuality("unknown");
      log.info("LiveAvatar session stopped successfully");
    } catch (error) {
      log.error("Failed to stop session", error);
      throw error;
    }
  }, [session]);

  const keepAlive = useCallback(async () => {
    if (!session) {
      log.error("Cannot keep session alive - not initialized");
      throw new Error("Session not initialized");
    }
    
    try {
      log.debug("Sending keepAlive ping");
      await (session as unknown as LiveAvatarSession).keepAlive();
    } catch (error) {
      log.error("Failed to keep session alive", error);
      throw error;
    }
  }, [session]);

  const attachElement = useCallback((element: HTMLVideoElement) => {
    if (!session) {
      log.error("Cannot attach element - session not initialized");
      throw new Error("Session not initialized");
    }
    
    log.debug("Attaching video element to session");
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