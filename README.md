# MACA - Medical AI Conversational Assistant

A Next.js 16 application featuring a conversational AI doctor powered by LiveAvatar.com technology with LiveKit integration.

## Features

- Real-time video conversations with AI medical professionals
- Voice and text interaction capabilities
- Responsive UI optimized for healthcare consultations
- Secure session management

## Dependencies

- Next.js 16
- React 19
- Tailwind CSS v4
- react-icons
- LiveKit Client SDK
- LiveKit React Components

## Prerequisites

Before running this application, you'll need:

1. Node.js (version 18 or higher)
2. PNPM package manager
3. LiveAvatar API credentials:
   - LIVEAVATAR_API_KEY (from https://docs.liveavatar.com/)
   - LIVEAVATAR_AVATAR_ID

Note: This app uses CUSTOM mode, which only requires an avatar ID. You'll manage your own LLM/conversation logic.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd maca
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```
   
4. Configure your LiveAvatar credentials in the `.env.local` file:
   - Sign up at [LiveAvatar](https://www.liveavatar.com/) to get your API key
   - Find your API key on the LiveAvatar settings page
   - Get your Avatar ID from the LiveAvatar dashboard
   - See the [Quick Start Guide](https://docs.liveavatar.com/docs/quick-start-guide) for more details

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open your browser to `http://localhost:3000` to access the application

## Environment Variables

The application requires the following environment variables:

- `LIVEAVATAR_API_KEY`: Your LiveAvatar API key for authentication
- `LIVEAVATAR_AVATAR_ID`: The ID of the avatar you want to use

See `.env.example` for a template.

**Note:** Using CUSTOM mode means Voice ID and Context ID are not needed. You handle your own conversation logic.

## Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the production application
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint

## LiveAvatar Integration

This application uses LiveAvatar.com's API in **CUSTOM mode** with LiveKit for real-time avatar experiences.

### What is CUSTOM Mode?

In CUSTOM mode, LiveAvatar handles video generation from audio only. You manage:
- Your own LLM/conversation logic
- Audio input (TTS or microphone)
- When to send audio to the avatar

LiveAvatar generates the corresponding video of the avatar speaking.

### Integration Flow

1. Create a session token with avatar configuration (CUSTOM mode)
2. Start the session to get LiveKit room credentials
3. Connect to the LiveKit room
4. Send audio data to the avatar via LiveKit data channel
5. Receive video stream of the avatar speaking

### Custom Mode Utilities

The app includes utilities for CUSTOM mode:
- `sendAudioToAvatar()` - Send audio data to generate avatar video
- `sendTextAsAudio()` - Convert text to speech and send to avatar
- `MicrophoneAudioSender` - Capture and stream microphone audio

See `src/lib/liveavatar-livekit/customModeUtils.ts` for implementation details.

### Resources

- [LiveAvatar Custom Mode Guide](https://docs.liveavatar.com/docs/configuring-custom-mode)
- [LiveAvatar Quick Start](https://docs.liveavatar.com/docs/quick-start-guide)
- [LiveKit Documentation](https://docs.livekit.io/)

## Demo Page

Visit `/liveavatar-demo` to test the LiveAvatar integration with a simple interface.
