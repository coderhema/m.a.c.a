"use client";

import { useState, useEffect, useCallback } from "react";
import { useLiveAvatarContext } from "./context";

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
    session.on("avatar_talking" as any, handleAvatarTalking);
    session.on("user_talking" as any, handleUserTalking);
    session.on("muted" as any, handleMuted);
    session.on("voice_chat_active" as any, handleVoiceChatActive);

    return () => {
      session.off("avatar_talking" as any, handleAvatarTalking);
      session.off("user_talking" as any, handleUserTalking);
      session.off("muted" as any, handleMuted);
      session.off("voice_chat_active" as any, handleVoiceChatActive);
    };
  }, [session]);

  const start = useCallback(async () => {
    setIsLoading(true);
    try {
      await (session as any)?.startVoiceChat();
    } catch (error) {
      console.error("Failed to start voice chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const stop = useCallback(async () => {
    try {
      await (session as any)?.stopVoiceChat();
    } catch (error) {
      console.error("Failed to stop voice chat:", error);
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