"use client";

import { useCallback } from "react";
import { useLiveAvatarContext } from "./context";

export const useTextChat = (mode: "FULL" | "CUSTOM") => {
  const { session } = useLiveAvatarContext();

  const sendMessage = useCallback(async (message: string) => {
    if (mode === "FULL") {
      await (session as any)?.sendText(message);
    } else {
      // Custom implementation for text-to-speech
      console.warn("Custom text chat mode not implemented");
    }
  }, [session, mode]);

  return {
    sendMessage,
  };
};