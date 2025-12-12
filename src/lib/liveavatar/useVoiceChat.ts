"use client";

import { useState, useEffect, useCallback } from "react";
import { useLiveAvatarContext } from "./context";
import { log } from "@/lib/logger";

export const useVoiceChat = () => {
  const { session } = useLiveAvatarContext();
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) return;

    const handleAvatarTalking = (talking: boolean) => setIsAvatarTalking(talking);
    const handleUserTalking = (talking: boolean) => setIsUserTalking(talking);
    const handleMuted = (muted: boolean) => setIsMuted(muted);
    const handleVoiceChatActive = (active: boolean) => setIsActive(active);

    // Set up event listeners
    session.on("avatar_talking", handleAvatarTalking);
    session.on("user_talking", handleUserTalking);
    session.on("muted", handleMuted);
    session.on("voice_chat_active", handleVoiceChatActive);

    return () => {
      session.off("avatar_talking", handleAvatarTalking);
      session.off("user_talking", handleUserTalking);
      session.off("muted", handleMuted);
      session.off("voice_chat_active", handleVoiceChatActive);
    };
  }, [session]);

  const start = useCallback(async () => {
    setIsLoading(true);
    try {
      log.info("Starting voice chat");
      await session?.startVoiceChat();
      log.info("Voice chat started successfully");
    } catch (error) {
      log.error("Failed to start voice chat", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const stop = useCallback(async () => {
    try {
      log.info("Stopping voice chat");
      await session?.stopVoiceChat();
      log.info("Voice chat stopped successfully");
    } catch (error) {
      log.error("Failed to stop voice chat", error);
    }
  }, [session]);

  /* 
  const mute = useCallback(async () => {
    try {
      await session?.mute();
    } catch (error) {
      console.error("Failed to mute:", error);
    }
  }, [session]);

  const unmute = useCallback(async () => {
    try {
      await session?.unmute();
    } catch (error) {
      console.error("Failed to unmute:", error);
    }
  }, [session]);
  */
  const mute = useCallback(async () => { }, []);
  const unmute = useCallback(async () => { }, []);

  return {
    isAvatarTalking,
    isUserTalking,
    isMuted,
    isActive,
    isLoading,
    start,
    stop,
    mute,
    unmute,
  };
};