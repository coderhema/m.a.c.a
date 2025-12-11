"use client";

import { useState, useEffect, useCallback } from "react";
import { useLiveAvatarContext } from "./context";

export const useVoiceChat = () => {
  const { sessionRef } = useLiveAvatarContext();
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionRef.current) return;

    const session = sessionRef.current;

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
  }, [sessionRef]);

  const start = useCallback(async () => {
    setIsLoading(true);
    try {
      await sessionRef.current?.startVoiceChat();
    } catch (error) {
      console.error("Failed to start voice chat:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionRef]);

  const stop = useCallback(async () => {
    try {
      await sessionRef.current?.stopVoiceChat();
    } catch (error) {
      console.error("Failed to stop voice chat:", error);
    }
  }, [sessionRef]);

  const mute = useCallback(async () => {
    try {
      await sessionRef.current?.mute();
    } catch (error) {
      console.error("Failed to mute:", error);
    }
  }, [sessionRef]);

  const unmute = useCallback(async () => {
    try {
      await sessionRef.current?.unmute();
    } catch (error) {
      console.error("Failed to unmute:", error);
    }
  }, [sessionRef]);

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