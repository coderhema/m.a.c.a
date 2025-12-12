"use client";

import { useRoomContext } from "@livekit/components-react";
import { useVoiceChat } from "@/lib/liveavatar-livekit/useVoiceChat";
import { useState } from "react";
import { PiMicrophoneFill, PiMicrophoneSlashFill, PiSpinnerGapBold, PiArrowCounterClockwiseBold } from "react-icons/pi";

export function VoiceChatExample() {
  const room = useRoomContext();
  const [status, setStatus] = useState("Ready");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentResponse, setCurrentResponse] = useState("");

  const {
    startRecording,
    stopRecording,
    isRecording,
    isProcessing,
    conversationHistory,
    resetConversation,
  } = useVoiceChat({
    room,
    voice: "Idera", // You can change this to any YarnGPT voice
    onTranscriptionStart: () => setStatus("Transcribing..."),
    onTranscriptionComplete: (text) => {
      setCurrentTranscript(text);
      setStatus("Thinking...");
    },
    onLLMStart: () => setStatus("Generating response..."),
    onLLMComplete: (response) => {
      setCurrentResponse(response);
      setStatus("Converting to speech...");
    },
    onTTSStart: () => setStatus("Generating audio..."),
    onTTSComplete: () => {
      setStatus("Ready");
    },
    onError: (error) => {
      setStatus("Ready");
      console.error("Voice chat error:", error);
    },
  });

  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
      setStatus("Processing...");
    } else {
      startRecording();
      setStatus("Listening...");
    }
  };

  const recording = isRecording;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mic Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleRecordToggle}
          disabled={isProcessing}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : recording
              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
              : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
          }`}
          aria-label={recording ? "Stop recording" : "Start recording"}
        >
          {isProcessing ? (
            <PiSpinnerGapBold className="w-8 h-8 text-white animate-spin" />
          ) : recording ? (
            <PiMicrophoneSlashFill className="w-8 h-8 text-white" />
          ) : (
            <PiMicrophoneFill className="w-8 h-8 text-white" />
          )}

          {/* Recording pulse animation */}
          {recording && !isProcessing && (
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
          )}
        </button>

        {/* Reset Button */}
        {conversationHistory.length > 0 && !isProcessing && (
          <button
            onClick={resetConversation}
            className="w-10 h-10 rounded-full bg-gray-500 hover:bg-gray-600 flex items-center justify-center transition-colors"
            aria-label="Reset conversation"
          >
            <PiArrowCounterClockwiseBold className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Status */}
      <div className="text-sm font-medium text-center">
        <span
          className={`${
            recording
              ? "text-red-500"
              : isProcessing
              ? "text-yellow-500"
              : "text-primary"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Instruction */}
      {!recording && !isProcessing && status === "Ready" && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Tap the mic to speak
        </p>
      )}

      {/* Transcription Display */}
      {currentTranscript && (
        <div className="w-full max-w-md p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
            You said:
          </div>
          <div className="text-sm">{currentTranscript}</div>
        </div>
      )}

      {/* Response Display */}
      {currentResponse && (
        <div className="w-full max-w-md p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">
            MACA responded:
          </div>
          <div className="text-sm">{currentResponse}</div>
        </div>
      )}

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="w-full max-w-md mt-4">
          <div className="text-sm font-semibold mb-2">Conversation History:</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {conversationHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded text-sm ${
                  msg.role === "user"
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "bg-green-50 dark:bg-green-900/20"
                }`}
              >
                <span className="font-semibold">
                  {msg.role === "user" ? "You" : "MACA"}:
                </span>{" "}
                {msg.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
