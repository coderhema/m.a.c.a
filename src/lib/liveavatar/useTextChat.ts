"use client";

import { useCallback } from "react";
import { useLiveAvatarContext } from "./context";
import { log } from "@/lib/logger";

export const useTextChat = (mode: "FULL" | "CUSTOM") => {
  const { session } = useLiveAvatarContext();

  const sendMessage = useCallback(async (message: string) => {
    if (mode === "FULL") {
      log.debug("Sending text message in FULL mode", { message });
      await session?.sendText(message);
    } else {
      // Custom implementation for text-to-speech
      log.warn("Custom text chat mode not implemented", { mode });
    }
  }, [session, mode]);

  return {
    sendMessage,
  };
};