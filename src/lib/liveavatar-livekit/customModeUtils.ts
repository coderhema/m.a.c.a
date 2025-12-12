"use client";

import { Room } from "livekit-client";

/**
 * In CUSTOM mode, you send audio to the avatar and it generates video.
 * This utility helps send audio data to the LiveAvatar via LiveKit data channel.
 */

export interface AudioMessage {
  type: "audio";
  audio: string; // Base64 encoded audio data
  format?: "pcm" | "wav" | "mp3"; // Audio format
  sampleRate?: number; // Sample rate in Hz
}

/**
 * Send audio data to the LiveAvatar for video generation
 * @param room - LiveKit room instance
 * @param audioData - Audio data as ArrayBuffer, Blob, or base64 string
 * @param options - Audio format options
 */
export async function sendAudioToAvatar(
  room: Room,
  audioData: ArrayBuffer | Blob | string,
  options: {
    format?: "pcm" | "wav" | "mp3";
    sampleRate?: number;
  } = {}
): Promise<void> {
  let base64Audio: string;

  // Convert audio data to base64
  if (typeof audioData === "string") {
    base64Audio = audioData;
  } else if (audioData instanceof Blob) {
    const arrayBuffer = await audioData.arrayBuffer();
    base64Audio = arrayBufferToBase64(arrayBuffer);
  } else {
    base64Audio = arrayBufferToBase64(audioData);
  }

  // Create audio message
  const message: AudioMessage = {
    type: "audio",
    audio: base64Audio,
    format: options.format || "pcm",
    sampleRate: options.sampleRate || 16000,
  };

  // Send via data channel
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(message));
  await room.localParticipant?.publishData(data, { reliable: true });
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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
    // Call your TTS service
    const response = await fetch(ttsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`TTS request failed: ${response.status}`);
    }

    const audioBlob = await response.blob();
    await sendAudioToAvatar(room, audioBlob);
  } catch (error) {
    console.error("Failed to send text as audio:", error);
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          
          // Send audio chunk to avatar
          await sendAudioToAvatar(this.room, event.data);
        }
      };

      // Capture audio in small chunks for real-time processing
      this.mediaRecorder.start(100); // Capture every 100ms
    } catch (error) {
      console.error("Failed to start microphone:", error);
      throw error;
    }
  }

  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    this.audioChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }
}
