"use client";

import { useState, useEffect, useCallback } from "react";
import { SessionState } from "@heygen/liveavatar-web-sdk";
import { useLiveAvatarContext } from "./context";

export const useSession = () => {
  const { sessionRef } = useLiveAvatarContext();
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.INACTIVE);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<string>("unknown");

  const updateSessionState = useCallback((state: SessionState) => {
    setSessionState(state);
  }, []);

  const updateStreamReady = useCallback((ready: boolean) => {
    setIsStreamReady(ready);
  }, []);

  const updateConnectionQuality = useCallback((quality: string) => {
    setConnectionQuality(quality);
  }, []);

  useEffect(() => {
    if (!sessionRef.current) return;

    const session = sessionRef.current;

    // Set up event listeners
    session.on("state_changed", updateSessionState);
    session.on("stream_ready", () => updateStreamReady(true));
    session.on("connection_quality_changed", updateConnectionQuality);

    return () => {
      session.off("state_changed", updateSessionState);
      session.off("stream_ready", () => updateStreamReady(true));
      session.off("connection_quality_changed", updateConnectionQuality);
    };
  }, [sessionRef, updateSessionState, updateStreamReady, updateConnectionQuality]);

  const startSession = useCallback(async () => {
    try {
      await sessionRef.current?.start();
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  }, [sessionRef]);

  const stopSession = useCallback(async () => {
    try {
      await sessionRef.current?.stop();
    } catch (error) {
      console.error("Failed to stop session:", error);
    }
  }, [sessionRef]);

  const keepAlive = useCallback(async () => {
    try {
      await sessionRef.current?.keepAlive();
    } catch (error) {
      console.error("Failed to keep session alive:", error);
    }
  }, [sessionRef]);

  const attachElement = useCallback((element: HTMLVideoElement) => {
    sessionRef.current?.attachElement(element);
  }, [sessionRef]);

  return {
    sessionState,
    isStreamReady,
    startSession,
    stopSession,
    connectionQuality,
    keepAlive,
    attachElement,
  };
};