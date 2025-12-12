"use client";

import { useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { sendAudioToAvatar, sendTextAsAudio } from "@/lib/liveavatar-livekit/customModeUtils";

/**
 * Example component showing how to use CUSTOM mode
 * In CUSTOM mode, you manage your own conversation logic and send audio to the avatar
 */
export const CustomModeExample = () => {
  const room = useRoomContext();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  /**
   * Example: Send text message to your LLM, get response, convert to audio, send to avatar
   */
  const handleSendMessage = async () => {
    if (!room || !message.trim()) return;

    setIsSending(true);
    try {
      // Step 1: Send message to your LLM backend
      const llmResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const { response: llmText } = await llmResponse.json();

      // Step 2: Convert LLM response to speech using your TTS service
      const ttsResponse = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: llmText }),
      });

      const audioBlob = await ttsResponse.blob();

      // Step 3: Send audio to LiveAvatar to generate video
      await sendAudioToAvatar(room, audioBlob, {
        format: "wav",
        sampleRate: 24000,
      });

      setMessage("");
    } catch (error) {
      console.error("Error in conversation flow:", error);
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Alternative: Use the helper function that combines TTS and avatar sending
   */
  const handleSendWithHelper = async () => {
    if (!room || !message.trim()) return;

    setIsSending(true);
    try {
      // First, get LLM response
      const llmResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const { response: llmText } = await llmResponse.json();

      // Use helper function to convert text to audio and send to avatar
      await sendTextAsAudio(room, llmText, "/api/tts");

      setMessage("");
    } catch (error) {
      console.error("Error in conversation flow:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">
        Custom Mode Conversation
      </h3>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isSending && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isSending}
        />
        
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          className="px-6 py-2 bg-primary text-black rounded-md font-medium hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>

      <p className="text-gray-400 text-sm mt-2">
        In CUSTOM mode, you handle the conversation logic. This example:
        <br />
        1. Sends your message to an LLM
        <br />
        2. Gets the response text
        <br />
        3. Converts text to speech
        <br />
        4. Sends audio to LiveAvatar for video generation
      </p>
    </div>
  );
};
