"use client";

import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { useCallback, useState } from "react";
import { log } from "@/lib/logger";

export const useVoiceChatLiveKit = () => {
  const { localParticipant } = useLocalParticipant();
  const [isMuted, setIsMuted] = useState(false);

  const start = useCallback(async () => {
    // Enable microphone
    if (localParticipant) {
      log.info("Enabling microphone for voice chat");
      await localParticipant.setMicrophoneEnabled(true);
      setIsMuted(false);
    }
  }, [localParticipant]);

  const stop = useCallback(async () => {
    // Disable microphone
    if (localParticipant) {
      log.info("Disabling microphone for voice chat");
      await localParticipant.setMicrophoneEnabled(false);
    }
  }, [localParticipant]);

  const mute = useCallback(() => {
    if (localParticipant) {
      log.debug("Muting microphone");
      localParticipant.setMicrophoneEnabled(false);
      setIsMuted(true);
    }
  }, [localParticipant]);

  const unmute = useCallback(() => {
    if (localParticipant) {
      log.debug("Unmuting microphone");
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
      log.info("Disconnecting from LiveKit room");
      room.disconnect();
    }
  }, [room]);

  const keepAlive = useCallback(async () => {
    // LiveKit automatically handles connection keep-alive
    log.debug("Keep alive (handled automatically by LiveKit)");
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
      log.debug("Sending interrupt signal to avatar");
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({ action: "interrupt" }));
      await room.localParticipant?.publishData(data, { reliable: true });
      log.debug("Interrupt signal sent");
    }
  }, [room]);

  return {
    interrupt,
  };
};
