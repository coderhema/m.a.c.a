"use client";

import { useState } from "react";
import { PiMicrophoneFill, PiMicrophoneSlashFill, PiPhoneX, PiHandPalm, PiSpinnerGapBold, PiArrowCounterClockwiseBold } from "react-icons/pi";
import { useRoomContext } from "@livekit/components-react";
import { useVoiceChat } from "@/lib/liveavatar-livekit/useVoiceChat";
import { useAvatarActionsLiveKit, useSessionLiveKit } from "@/lib/liveavatar-livekit/hooks";
import { log } from "@/lib/logger";

interface CustomModeCallControlsProps {
  onStatusChange?: (status: string) => void;
  onTranscript?: (text: string) => void;
  onResponse?: (text: string) => void;
}

export default function CustomModeCallControls({
  onStatusChange,
  onTranscript,
  onResponse,
}: CustomModeCallControlsProps) {
  const room = useRoomContext();
  const { interrupt } = useAvatarActionsLiveKit();
  const { stopSession } = useSessionLiveKit();
  const [status, setStatus] = useState("Ready");

  const updateStatus = (newStatus: string) => {
    log.info("[UI] Status changed", { from: status, to: newStatus });
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const {
    startRecording,
    stopRecording,
    isRecording,
    isProcessing,
    conversationHistory,
    resetConversation,
  } = useVoiceChat({
    room,
    voice: "Idera", // YarnGPT voice for Nigerian languages
    onTranscriptionStart: () => updateStatus("Transcribing..."),
    onTranscriptionComplete: (text) => {
      log.info("[UI] Transcript received", { text });
      onTranscript?.(text);
      updateStatus("Thinking...");
    },
    onLLMStart: () => updateStatus("Generating response..."),
    onLLMComplete: (response) => {
      log.info("[UI] LLM response received", { responsePreview: response.substring(0, 100) + "..." });
      onResponse?.(response);
      updateStatus("Converting to speech...");
    },
    onTTSStart: () => updateStatus("Sending to avatar..."),
    onTTSComplete: () => {
      updateStatus("Ready");
    },
    onError: (error) => {
      console.error("Voice chat error:", error);
      updateStatus("Error occurred");
      setTimeout(() => updateStatus("Ready"), 2000);
    },
  });

  const handleRecordToggle = () => {
    if (isRecording()) {
      log.info("[UI] User stopped recording");
      stopRecording();
      updateStatus("Processing...");
    } else {
      log.info("[UI] User started recording");
      startRecording();
      updateStatus("Listening...");
    }
  };

  const recording = isRecording();

  return (
    <>
      {/* Status Display */}
      <div className="text-center mb-4">
        <span
          className={`text-sm font-medium px-4 py-2 rounded-full ${
            recording
              ? "bg-red-500/20 text-red-400"
              : isProcessing
              ? "bg-yellow-500/20 text-yellow-400"
              : status === "Ready"
              ? "bg-primary/20 text-primary"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-between px-2 pt-2 md:justify-center md:gap-8 md:bg-black/40 md:backdrop-blur-xl md:p-3 md:rounded-full md:border md:border-white/10 md:w-fit md:mx-auto">
        
        {/* Main Mic Button - Press to Talk */}
        <button 
          onClick={handleRecordToggle}
          disabled={isProcessing}
          className="flex flex-col items-center gap-1 group relative"
        >
          <div className={`flex items-center justify-center size-14 rounded-full transition-all active:scale-95 ${
            isProcessing
              ? 'bg-gray-600 cursor-not-allowed'
              : recording
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
              : 'bg-primary text-black hover:bg-primary/80'
          }`}>
            {isProcessing ? (
              <PiSpinnerGapBold className="text-[28px] text-white animate-spin" />
            ) : recording ? (
              <PiMicrophoneSlashFill className="text-[28px]" />
            ) : (
              <PiMicrophoneFill className="text-[28px]" />
            )}
          </div>
          
          {/* Recording pulse animation */}
          {recording && !isProcessing && (
            <span className="absolute inset-0 rounded-full top-0 left-0 right-0 bottom-5 bg-red-500 animate-ping opacity-30" />
          )}
          
          <span className="text-[10px] text-gray-400 font-medium md:hidden">
            {recording ? "Recording" : isProcessing ? "Wait" : "Speak"}
          </span>
        </button>

        {/* Interrupt */}
        <button 
          onClick={interrupt}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
            <PiHandPalm 
              className="text-[28px]"
            />
          </div>
          <span className="text-[10px] text-gray-400 font-medium md:hidden">Interrupt</span>
        </button>

        {/* Reset Conversation */}
        {conversationHistory.length > 0 && !isProcessing && (
          <button 
            onClick={resetConversation}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="flex items-center justify-center size-14 rounded-full bg-white/10 group-hover:bg-white/20 text-white transition-all active:scale-95">
              <PiArrowCounterClockwiseBold className="text-[28px]" />
            </div>
            <span className="text-[10px] text-gray-400 font-medium md:hidden">Reset</span>
          </button>
        )}

        {/* End Call */}
        <button 
          onClick={stopSession}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="flex items-center justify-center size-14 rounded-full bg-red-500/90 group-hover:bg-red-500 text-white shadow-lg shadow-red-500/30 transition-all active:scale-95">
            <PiPhoneX 
              className="text-[28px]"
            />
          </div>
          <span className="text-[10px] text-red-400 font-medium md:hidden">End</span>
        </button>
      </div>

      {/* Instructions */}
      {!recording && !isProcessing && status === "Ready" && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Tap the mic to speak with MACA
        </p>
      )}
    </>
  );
}
