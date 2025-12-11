"use client";

import { useCallback } from "react";
import { useLiveAvatarContext } from "./context";

export const useTextChat = (mode: "FULL" | "CUSTOM") => {
  const { sessionRef } = useLiveAvatarContext();

  const sendMessage = useCallback(async (message: string) => {
    if (mode === "FULL") {
      await sessionRef.current?.sendText(message);
    } else {
      // Custom implementation for text-to-speech
      console.warn("Custom text chat mode not implemented");
    }
  }, [sessionRef, mode]);

  return {
    sendMessage,
  };
};