"use client";

import { useCallback } from "react";
import { useLiveAvatarContext } from "./context";

export const useAvatarActions = (mode: "FULL" | "CUSTOM") => {
  const { session } = useLiveAvatarContext();

  const interrupt = useCallback(() => {
    return session?.interrupt();
  }, [session]);

  const repeat = useCallback(
    async (message: string) => {
      if (mode === "FULL") {
        return session?.repeat(message);
      } else if (mode === "CUSTOM") {
        const res = await fetch("/api/elevenlabs-text-to-speech", {
          method: "POST",
          body: JSON.stringify({ text: message }),
        });
        const { audio } = await res.json();
        // Play audio directly instead of trying to pass it to HeyGen session
        if (audio) {
          const audioUrl = `data:audio/mp3;base64,${audio}`;
          const audioElement = new Audio(audioUrl);
          audioElement.play();
        }
      }
    },
    [session, mode],
  );

  const startListening = useCallback(() => {
    return session?.startListening();
  }, [session]);

  const stopListening = useCallback(() => {
    return session?.stopListening();
  }, [session]);

  return {
    interrupt,
    repeat,
    startListening,
    stopListening,
  };
};