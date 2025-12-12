# MACA - Medical AI Conversational Assistant

A Next.js 16 application featuring a conversational AI doctor powered by HeyGen's LiveAvatar technology.

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

## Prerequisites

Before running this application, you'll need:

1. Node.js (version 18 or higher)
2. PNPM package manager
3. HeyGen API credentials:
   - HEYGEN_API_KEY
   - HEYGEN_AVATAR_ID
   - (Optional) HEYGEN_VOICE_ID

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

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
4. Configure your HeyGen credentials in the `.env` file:
   - Sign up at [HeyGen](https://www.heygen.com/) to get your API key
   - Create or select an avatar in your HeyGen dashboard to get the AVATAR_ID
   - (Optional) Select a voice to get the VOICE_ID

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open your browser to `http://localhost:3000` to access the application

## Environment Variables

The application requires the following environment variables:

- `HEYGEN_API_KEY`: Your HeyGen API key for authentication
- `HEYGEN_AVATAR_ID`: The ID of the avatar you want to use
- `HEYGEN_VOICE_ID`: (Optional) The ID of the voice you want to use

See `.env.example` for a template.

## Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the production application
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint

## HeyGen Integration

This application uses HeyGen's LiveAvatar SDK to create real-time conversational experiences with AI avatars. The integration includes:

- Secure session token generation via HeyGen's API
- Real-time video streaming with WebRTC
- Voice and text interaction capabilities
- Session lifecycle management

For more information about HeyGen's LiveAvatar SDK, visit [HeyGen Documentation](https://docs.heygen.com/).