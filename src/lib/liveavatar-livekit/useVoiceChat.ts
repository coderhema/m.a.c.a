import { useState, useCallback, useRef } from "react";
import { Room } from "livekit-client";
import { sendAudioToAvatar, startAvatarListening, stopAvatarListening } from "@/lib/liveavatar-livekit/customModeUtils";
import { log } from "@/lib/logger";

interface VoiceChatOptions {
  room: Room;
  voice?: string; // YarnGPT voice selection
  onTranscriptionStart?: () => void;
  onTranscriptionComplete?: (text: string) => void;
  onLLMStart?: () => void;
  onLLMComplete?: (response: string) => void;
  onTTSStart?: () => void;
  onTTSComplete?: () => void;
  onError?: (error: Error) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useVoiceChat(options: VoiceChatOptions) {
  const {
    room,
    voice = "lucy",
    onTranscriptionStart,
    onTranscriptionComplete,
    onLLMStart,
    onLLMComplete,
    onTTSStart,
    onTTSComplete,
    onError,
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecordingState, setIsRecordingState] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * Process audio through the full pipeline:
   * Audio → STT → LLM → TTS → Avatar
   */
  const processVoiceInput = useCallback(
    async (audioBlob: Blob) => {
      if (isProcessing) {
        log.warn("Voice processing already in progress, ignoring new input");
        return;
      }

      setIsProcessing(true);
      log.info("=== VOICE PIPELINE START ===");
      log.info("Input audio blob", { 
        size: audioBlob.size, 
        type: audioBlob.type,
        sizeKB: (audioBlob.size / 1024).toFixed(2) + "KB"
      });

      try {
        // Step 1: Speech-to-Text (ElevenLabs)
        log.info("[1/4] STT: Sending audio to ElevenLabs...");
        onTranscriptionStart?.();

        const formData = new FormData();
        formData.append("audio", audioBlob);

        const sttStartTime = Date.now();
        const sttResponse = await fetch("/api/stt", {
          method: "POST",
          body: formData,
        });
        const sttDuration = Date.now() - sttStartTime;

        if (!sttResponse.ok) {
          const errorText = await sttResponse.text();
          log.error("[1/4] STT FAILED", undefined, { status: sttResponse.status, error: errorText });
          throw new Error(`STT request failed: ${sttResponse.status}`);
        }

        const sttResult = await sttResponse.json();
        const transcribedText = sttResult.text;
        log.info("[1/4] STT complete", { 
          transcribedText,
          duration: sttDuration + "ms",
          language: sttResult.language
        });
        onTranscriptionComplete?.(transcribedText);

        // Add user message to history
        const newUserMessage: Message = {
          role: "user",
          content: transcribedText,
        };
        const updatedHistory = [...conversationHistory, newUserMessage];

        // Step 2: LLM Processing (Gemini)
        log.info("[2/4] LLM: Sending to Groq Llama...", {
          message: transcribedText,
          historyLength: conversationHistory.length 
        });
        onLLMStart?.();

        const llmStartTime = Date.now();
        const chatResponse = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: transcribedText,
            history: conversationHistory,
          }),
        });
        const llmDuration = Date.now() - llmStartTime;

        if (!chatResponse.ok) {
          const errorText = await chatResponse.text();
          log.error("[2/4] LLM FAILED", undefined, { status: chatResponse.status, error: errorText });
          throw new Error(`LLM request failed: ${chatResponse.status}`);
        }

        const chatResult = await chatResponse.json();
        const llmResponse = chatResult.response;
        log.info("[2/4] LLM complete", { 
          llmResponse,
          responseLength: llmResponse.length,
          duration: llmDuration + "ms"
        });
        onLLMComplete?.(llmResponse);

        // Add assistant message to history
        const newAssistantMessage: Message = {
          role: "assistant",
          content: llmResponse,
        };
        const finalHistory = [...updatedHistory, newAssistantMessage];
        setConversationHistory(finalHistory);

        // Step 3: Text-to-Speech (ElevenLabs)
        log.info("[3/4] TTS: Converting to speech with ElevenLabs...", {
          textLength: llmResponse.length,
          voice
        });
        onTTSStart?.();

        const ttsStartTime = Date.now();
        const ttsResponse = await fetch("/api/tts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: llmResponse,
            voice,
            response_format: "wav",
          }),
        });
        const ttsDuration = Date.now() - ttsStartTime;

        if (!ttsResponse.ok) {
          const errorText = await ttsResponse.text();
          log.error("[3/4] TTS FAILED", undefined, { status: ttsResponse.status, error: errorText });
          throw new Error(`TTS request failed: ${ttsResponse.status}`);
        }

        const audioResponseBlob = await ttsResponse.blob();
        log.info("[3/4] TTS complete", { 
          audioSize: audioResponseBlob.size,
          audioSizeKB: (audioResponseBlob.size / 1024).toFixed(2) + "KB",
          contentType: ttsResponse.headers.get("content-type"),
          duration: ttsDuration + "ms"
        });
        onTTSComplete?.();

        // Step 4: Send to LiveAvatar
        log.info("[4/4] AVATAR: Sending audio to LiveAvatar...");
        const avatarStartTime = Date.now();
        
        // Optional: Signal avatar to start listening (shows listening animation)
        log.info("[4/4] AVATAR: Signaling start listening...");
        await startAvatarListening(room);
        
        // Send the audio (ElevenLabs returns raw PCM 24kHz)
        await sendAudioToAvatar(room, audioResponseBlob, {
          format: "pcm", // ElevenLabs returns raw PCM 16-bit 24kHz
          sampleRate: 24000,
        });
        
        // Optional: Signal avatar to stop listening (return to idle)
        // Note: This is optional per docs, but helps with animation state
        log.info("[4/4] AVATAR: Signaling stop listening...");
        await stopAvatarListening(room);
        
        const avatarDuration = Date.now() - avatarStartTime;
        
        const totalDuration = sttDuration + llmDuration + ttsDuration + avatarDuration;
        log.info("=== VOICE PIPELINE COMPLETE ===", {
          totalDuration: totalDuration + "ms",
          breakdown: {
            stt: sttDuration + "ms",
            llm: llmDuration + "ms", 
            tts: ttsDuration + "ms",
            avatar: avatarDuration + "ms"
          }
        });
      } catch (error) {
        log.error("Voice chat processing failed", error);
        onError?.(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setIsProcessing(false);
      }
    },
    [
      room,
      voice,
      isProcessing,
      conversationHistory,
      onTranscriptionStart,
      onTranscriptionComplete,
      onLLMStart,
      onLLMComplete,
      onTTSStart,
      onTTSComplete,
      onError,
    ]
  );

  /**
   * Start recording user's voice
   */
  const startRecording = useCallback(async () => {
    try {
      log.info("=== RECORDING START ===");
      
      // NOTE: Don't send agent.start_listening here - it should be sent
      // right before the audio, not at recording start (per HeyGen workflow)
      
      log.info("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Log audio track info
      const audioTrack = stream.getAudioTracks()[0];
      log.info("Microphone access granted", {
        trackLabel: audioTrack?.label,
        trackSettings: audioTrack?.getSettings()
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      log.info("MediaRecorder created", { mimeType: mediaRecorder.mimeType });

      audioChunksRef.current = [];
      let chunkCount = 0;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunkCount++;
          audioChunksRef.current.push(event.data);
          log.debug("Audio chunk received", { chunkNumber: chunkCount, chunkSize: event.data.size });
        }
      };

      mediaRecorder.onstop = async () => {
        const totalSize = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0);
        log.info("=== RECORDING STOP ===", {
          totalChunks: chunkCount,
          totalSize: totalSize,
          totalSizeKB: (totalSize / 1024).toFixed(2) + "KB"
        });
        
        // NOTE: Don't stop listening here - wait until AFTER audio is sent to avatar
        // The listening state helps avatar know to expect audio
        
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        log.info("Audio blob created", { 
          blobSize: audioBlob.size,
          blobType: audioBlob.type 
        });
        
        await processVoiceInput(audioBlob);
        audioChunksRef.current = [];

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        log.debug("Audio tracks stopped");
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecordingState(true);
      log.info("Voice recording active - speak now!");
    } catch (error) {
      log.error("Failed to start recording", error);
      onError?.(error instanceof Error ? error : new Error("Microphone access denied"));
    }
  }, [room, processVoiceInput, onError]);

  /**
   * Stop recording user's voice
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      log.info("Stopping voice recording");
      mediaRecorderRef.current.stop();
      setIsRecordingState(false);
    }
  }, []);

  /**
   * Reset conversation history
   */
  const resetConversation = useCallback(() => {
    setConversationHistory([]);
    log.info("Conversation history reset");
  }, []);

  return {
    processVoiceInput,
    startRecording,
    stopRecording,
    isRecording: isRecordingState,
    isProcessing,
    conversationHistory,
    resetConversation,
  };
}
