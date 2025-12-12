"use client";

import { Room } from "livekit-client";
import { log } from "@/lib/logger";

/**
 * LiveAvatar Custom Mode Events
 * Audio must be PCM 16Bit 24KHz encoded as Base64
 */

// LiveAvatar Custom Mode event types
export interface AgentSpeakEvent {
  type: "agent.speak";
  audio: string; // Base64 encoded PCM 16Bit 24KHz audio
  event_id?: string;
}

export interface AgentSpeakEndEvent {
  type: "agent.speak_end";
  event_id?: string;
}

export interface AgentInterruptEvent {
  type: "agent.interrupt";
}

export interface AgentListeningEvent {
  type: "agent.start_listening" | "agent.stop_listening";
  event_id?: string;
}

export interface SessionKeepAliveEvent {
  type: "session.keep_alive";
  event_id?: string;
}

type LiveAvatarEvent = AgentSpeakEvent | AgentSpeakEndEvent | AgentInterruptEvent | AgentListeningEvent | SessionKeepAliveEvent;

/**
 * Send a LiveAvatar event via LiveKit data channel
 */
async function sendEvent(room: Room, event: LiveAvatarEvent): Promise<void> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(event));
  await room.localParticipant?.publishData(data, { reliable: true });
  log.debug("Event sent", { type: event.type, dataSize: data.length });
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  // Process in chunks to avoid call stack issues with large arrays
  const chunkSize = 8192;
  for (let i = 0; i < bytes.byteLength; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.byteLength));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

/**
 * Extract PCM data from WAV file
 * WAV format: 44-byte header followed by PCM data
 */
function extractPCMFromWav(wavBuffer: ArrayBuffer): ArrayBuffer {
  const view = new DataView(wavBuffer);
  
  // Verify RIFF header
  const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
  if (riff !== "RIFF") {
    log.warn("Not a valid WAV file, sending as-is");
    return wavBuffer;
  }
  
  // Find "data" chunk
  let offset = 12; // Skip RIFF header
  while (offset < wavBuffer.byteLength - 8) {
    const chunkId = String.fromCharCode(
      view.getUint8(offset),
      view.getUint8(offset + 1),
      view.getUint8(offset + 2),
      view.getUint8(offset + 3)
    );
    const chunkSize = view.getUint32(offset + 4, true);
    
    if (chunkId === "data") {
      // Found data chunk, extract PCM
      const pcmStart = offset + 8;
      const pcmData = wavBuffer.slice(pcmStart, pcmStart + chunkSize);
      log.debug("Extracted PCM from WAV", { 
        wavSize: wavBuffer.byteLength, 
        pcmSize: pcmData.byteLength,
        headerSize: pcmStart 
      });
      return pcmData;
    }
    
    offset += 8 + chunkSize;
  }
  
  log.warn("Could not find data chunk in WAV, sending as-is");
  return wavBuffer;
}

/**
 * Send audio data to the LiveAvatar for video generation
 * LiveAvatar requires PCM 16Bit 24KHz audio encoded as Base64
 * 
 * @param room - LiveKit room instance
 * @param audioData - Audio data as ArrayBuffer or Blob (WAV format will be converted to PCM)
 * @param options - Audio format options
 */
export async function sendAudioToAvatar(
  room: Room,
  audioData: ArrayBuffer | Blob | string,
  options: {
    format?: "pcm" | "wav" | "mp3";
    sampleRate?: number;
    eventId?: string;
  } = {}
): Promise<void> {
  const eventId = options.eventId || crypto.randomUUID();
  log.info("[AVATAR] Preparing audio for LiveAvatar", { 
    format: options.format, 
    sampleRate: options.sampleRate,
    eventId 
  });

  let pcmBuffer: ArrayBuffer;

  // Convert to ArrayBuffer first
  if (typeof audioData === "string") {
    // Assume already base64 PCM
    const binaryString = atob(audioData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    pcmBuffer = bytes.buffer;
  } else if (audioData instanceof Blob) {
    const arrayBuffer = await audioData.arrayBuffer();
    // If WAV format, extract PCM data
    if (options.format === "wav") {
      pcmBuffer = extractPCMFromWav(arrayBuffer);
    } else {
      pcmBuffer = arrayBuffer;
    }
  } else {
    if (options.format === "wav") {
      pcmBuffer = extractPCMFromWav(audioData);
    } else {
      pcmBuffer = audioData;
    }
  }

  // Convert to base64
  const base64Audio = arrayBufferToBase64(pcmBuffer);
  
  log.info("[AVATAR] Sending audio", { 
    pcmSize: pcmBuffer.byteLength,
    pcmSizeKB: (pcmBuffer.byteLength / 1024).toFixed(2) + "KB",
    base64Length: base64Audio.length
  });

  // Send audio in chunks if too large (LiveAvatar recommends small packets)
  const MAX_CHUNK_SIZE = 500000; // 500KB base64 chunks
  
  if (base64Audio.length > MAX_CHUNK_SIZE) {
    log.info("[AVATAR] Audio too large, sending in chunks", { 
      totalSize: base64Audio.length,
      chunkSize: MAX_CHUNK_SIZE 
    });
    
    for (let i = 0; i < base64Audio.length; i += MAX_CHUNK_SIZE) {
      const chunk = base64Audio.slice(i, i + MAX_CHUNK_SIZE);
      const chunkNum = Math.floor(i / MAX_CHUNK_SIZE) + 1;
      const totalChunks = Math.ceil(base64Audio.length / MAX_CHUNK_SIZE);
      
      log.debug(`[AVATAR] Sending chunk ${chunkNum}/${totalChunks}`);
      
      await sendEvent(room, {
        type: "agent.speak",
        audio: chunk,
        event_id: eventId,
      });
      
      // Small delay between chunks
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  } else {
    // Send as single message
    await sendEvent(room, {
      type: "agent.speak",
      audio: base64Audio,
      event_id: eventId,
    });
  }

  // Signal end of speaking
  await sendEvent(room, {
    type: "agent.speak_end",
    event_id: eventId,
  });

  log.info("[AVATAR] Audio sent successfully", { eventId });
}

/**
 * Start avatar listening state
 */
export async function startAvatarListening(room: Room): Promise<void> {
  const eventId = crypto.randomUUID();
  log.info("[AVATAR] Starting listening state", { eventId });
  await sendEvent(room, {
    type: "agent.start_listening",
    event_id: eventId,
  });
}

/**
 * Stop avatar listening state
 */
export async function stopAvatarListening(room: Room): Promise<void> {
  const eventId = crypto.randomUUID();
  log.info("[AVATAR] Stopping listening state", { eventId });
  await sendEvent(room, {
    type: "agent.stop_listening",
    event_id: eventId,
  });
}

/**
 * Interrupt avatar (stop current speech)
 */
export async function interruptAvatar(room: Room): Promise<void> {
  log.info("[AVATAR] Sending interrupt");
  await sendEvent(room, {
    type: "agent.interrupt",
  });
}

/**
 * Keep session alive
 */
export async function keepSessionAlive(room: Room): Promise<void> {
  const eventId = crypto.randomUUID();
  log.debug("[AVATAR] Sending keep-alive", { eventId });
  await sendEvent(room, {
    type: "session.keep_alive",
    event_id: eventId,
  });
}

/**
 * Send text-to-speech request to generate audio and send to avatar
 * This is a helper for when you want to use a TTS service to generate audio
 * @param room - LiveKit room instance
 * @param text - Text to convert to speech
 * @param ttsEndpoint - Your TTS API endpoint
 */
export async function sendTextAsAudio(
  room: Room,
  text: string,
  ttsEndpoint: string
): Promise<void> {
  try {
    log.info("Converting text to audio", { text, ttsEndpoint });
    // Call your TTS service
    const response = await fetch(ttsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      log.error("TTS request failed", undefined, { status: response.status });
      throw new Error(`TTS request failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    log.debug("TTS audio received, sending to avatar", { blobSize: audioBlob.size });
    await sendAudioToAvatar(room, audioBlob);
    log.info("Text converted and sent as audio successfully");
  } catch (error) {
    log.error("Failed to send text as audio", error);
    throw error;
  }
}

/**
 * Hook for recording and sending user microphone audio to avatar
 * This captures the user's voice and sends it to the avatar in real-time
 */
export class MicrophoneAudioSender {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private room: Room;

  constructor(room: Room) {
    this.room = room;
  }

  async start(): Promise<void> {
    try {
      log.info("Starting microphone audio capture");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          
          // Send audio chunk to avatar
          log.debug("Sending microphone audio chunk", { size: event.data.size });
          await sendAudioToAvatar(this.room, event.data);
        }
      };

      // Capture audio in small chunks for real-time processing
      this.mediaRecorder.start(100); // Capture every 100ms
      log.info("Microphone audio capture started");
    } catch (error) {
      log.error("Failed to start microphone", error);
      throw error;
    }
  }

  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      log.info("Stopping microphone audio capture");
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}
