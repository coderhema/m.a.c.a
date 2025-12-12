# LiveAvatar CUSTOM Mode Setup Guide

## Overview

 MACA app is now configured to use LiveAvatar.com in **CUSTOM mode**. This guide explains how CUSTOM mode works and how to use it effectively.

## What is CUSTOM Mode?

In CUSTOM mode, LiveAvatar focuses on one thing: **converting audio to video**.

- ✅ **LiveAvatar handles**: Video generation from audio (avatar lip-sync and animation)
- ❌ **LiveAvatar does NOT handle**: Conversation logic, LLM responses, or audio generation

You are responsible for:
1. Your own LLM/AI conversation logic
2. Generating or capturing audio (via TTS or microphone)
3. Sending audio to the LiveAvatar
4. Receiving and displaying the generated video

## Setup Requirements

### Environment Variables

Only two variables are required:

```env
LIVEAVATAR_API_KEY=your_api_key_here
LIVEAVATAR_AVATAR_ID=your_avatar_id_here
```

Get these from:
- API Key: [LiveAvatar Dashboard](https://www.liveavatar.com/)
- Avatar ID: Browse available avatars in the LiveAvatar documentation

### Dependencies


Already installed:
- `livekit-client` - WebRTC communication
- `@livekit/components-react` - React components for LiveKit
- `@livekit/components-styles` - Styling for LiveKit components

## Architecture Flow

```
User Input
    ↓
Your LLM/AI Logic (you implement)
    ↓
Generate Audio (TTS service - you implement)
    ↓
Send Audio to LiveAvatar (via LiveKit)
    ↓
LiveAvatar generates video
    ↓
Display avatar video (handled by LiveKit components)
```

## How to Use

### 1. Session Creation

The session is automatically created when you visit `/health/video-call`:

```typescript
// Already implemented in src/app/api/heygen/session/route.ts
const tokenPayload = {
  mode: "CUSTOM",
  avatar_id: avatarId,
};
```

### 2. Sending Audio to Avatar

Use the provided utilities in `src/lib/liveavatar-livekit/customModeUtils.ts`:

#### Option A: Send Audio Data Directly

```typescript
import { sendAudioToAvatar } from "@/lib/liveavatar-livekit/customModeUtils";
import { useRoomContext } from "@livekit/components-react";

const room = useRoomContext();

// Send audio blob
await sendAudioToAvatar(room, audioBlob, {
  format: "wav",
  sampleRate: 24000,
});
```

#### Option B: Send Text (with TTS)

```typescript
import { sendTextAsAudio } from "@/lib/liveavatar-livekit/customModeUtils";

// This will call your TTS endpoint and send audio to avatar
await sendTextAsAudio(room, "Hello, how can I help you?", "/api/tts");
```

#### Option C: Stream Microphone Audio

```typescript
import { MicrophoneAudioSender } from "@/lib/liveavatar-livekit/customModeUtils";

const micSender = new MicrophoneAudioSender(room);

// Start capturing and streaming microphone
await micSender.start();

// Stop when done
micSender.stop();
```

### 3. Example Conversation Flow

See `src/components/CustomModeExample.tsx` for a complete example:

```typescript
// 1. Get user input
const userMessage = "What are my symptoms?";

// 2. Send to your LLM
const llmResponse = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ message: userMessage }),
});
const { response } = await llmResponse.json();

// 3. Convert to audio
const ttsResponse = await fetch("/api/tts", {
  method: "POST",
  body: JSON.stringify({ text: response }),
});
const audioBlob = await ttsResponse.blob();

// 4. Send to avatar
await sendAudioToAvatar(room, audioBlob);

// 5. LiveAvatar automatically generates and streams the video
```

## What You Need to Implement

To complete your CUSTOM mode setup, you need to create:

### 1. LLM/Chat API Endpoint

Create `/api/chat` to handle conversation logic:

```typescript
// src/app/api/chat/route.ts
export async function POST(request: Request) {
  const { message } = await request.json();
  
  // Your LLM logic here (OpenAI, Anthropic, etc.)
  const response = await callYourLLM(message);
  
  return Response.json({ response });
}
```

### 2. Text-to-Speech (TTS) API Endpoint

Create `/api/tts` to convert text to audio:

```typescript
// src/app/api/tts/route.ts
export async function POST(request: Request) {
  const { text } = await request.json();
  
  // Use your TTS service (ElevenLabs, Google TTS, etc.)
  const audioBuffer = await convertTextToSpeech(text);
  
  return new Response(audioBuffer, {
    headers: { "Content-Type": "audio/wav" },
  });
}
```

## Testing Your Setup

1. **Start the dev server**:
   ```bash
   pnpm dev
   ```

2. **Visit the video call page**:
   ```
   http://localhost:3000/health/video-call
   ```

3. **Check the console** for connection status

4. **Implement your conversation logic** using the examples provided

## Available Components

- `LiveKitAvatarSession` - Main video component (already integrated in video-call page)
- `LiveKitCallControls` - Control buttons for microphone, mute, etc.
- `CustomModeExample` - Example conversation component

## Troubleshooting

### No video appearing?
- Check that your API key and Avatar ID are correct
- Open browser console to see connection logs
- Verify the session is created successfully

### Audio not working?
- Ensure your TTS endpoint returns valid audio data
- Check audio format matches what you specify in `sendAudioToAvatar()`
- Look for errors in the browser console

### LiveKit connection issues?
- Check that the LiveKit room URL is valid in the response
- Verify your network allows WebRTC connections
- Try refreshing the page to create a new session

## Resources

- [LiveAvatar Custom Mode Docs](https://docs.liveavatar.com/docs/configuring-custom-mode)
- [LiveKit Documentation](https://docs.livekit.io/)
- [LiveAvatar API Reference](https://docs.liveavatar.com/)

## Next Steps

1. ✅ LiveAvatar session creation - **Already done**
2. ✅ LiveKit video integration - **Already done**
3. ✅ Custom mode utilities - **Already done**
4. ⏳ Implement your LLM endpoint (`/api/chat`)
5. ⏳ Implement your TTS endpoint (`/api/tts`)
6. ⏳ Connect your conversation UI to the avatar

Your app is ready for CUSTOM mode! Just implement your conversation logic and TTS service, then use the provided utilities to send audio to the avatar.
