# M.A.C.A. - Healthcare Consultation Platform

M.A.C.A. (Medical AI Consultation Assistant) is a healthcare consultation platform that enables patients to connect with AI-powered medical professionals for virtual consultations.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── CallControls.tsx
│   │   ├── BottomControls.tsx
│   │   └── index.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
```

## Components

1. **Header** - Contains the navigation and doctor information
2. **CallControls** - Manages the video call control buttons
3. **BottomControls** - Wrapper for call controls with drag handle

## Features

- Virtual consultations with AI medical professionals
- Video call interface with mute, camera, and flip controls
- Responsive design for mobile and desktop devices
- Real-time status indicators

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Dependencies

- Next.js 16
- React 19
- Tailwind CSS v4
- react-icons