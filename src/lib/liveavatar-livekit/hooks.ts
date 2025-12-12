"use client";

import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { useCallback, useState } from "react";

export const useVoiceChatLiveKit = () => {
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);

  const start = useCallback(async () => {
    // Enable microphone
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(true);
      setIsMuted(false);
    }
  }, [localParticipant]);

  const stop = useCallback(async () => {
    // Disable microphone
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(false);
    }
  }, [localParticipant]);

  const mute = useCallback(() => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(false);
      setIsMuted(true);
    }
  }, [localParticipant]);

  const unmute = useCallback(() => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(true);
      setIsMuted(false);
    }
  }, [localParticipant]);

  const isActive = localParticipant?.isMicrophoneEnabled ?? false;

  return {
    isActive,
    isMuted,
    start,
    stop,
    mute,
    unmute,
    isLoading: false,
    isAvatarTalking: false,
    isUserTalking: false,
  };
};

export const useSessionLiveKit = () => {
  const room = useRoomContext();

  const stopSession = useCallback(async () => {
    if (room) {
      room.disconnect();
    }
  }, [room]);

  const keepAlive = useCallback(async () => {
    // LiveKit automatically handles connection keep-alive
    console.log("Keep alive (handled automatically by LiveKit)");
  }, []);

  return {
    stopSession,
    keepAlive,
    sessionState: room?.state ?? "disconnected",
  };
};

export const useAvatarActionsLiveKit = () => {
  const room = useRoomContext();

  const interrupt = useCallback(async () => {
    // Send interrupt signal via data channel
    if (room) {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({ action: "interrupt" }));
      await room.localParticipant?.publishData(data, { reliable: true });
    }
  }, [room]);

  return {
    interrupt,
  };
};
