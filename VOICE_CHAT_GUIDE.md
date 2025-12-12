# Voice Chat Integration Guide

## Overview

MACA now supports full voice-to-voice conversations with the LiveAvatar using this pipeline:

```
User speaks → Whisper (STT) → Gemini (LLM) → YarnGPT (TTS) → LiveAvatar
```

## Components

### 1. **Speech-to-Text (STT)** - OpenAI Whisper
- **Endpoint**: `/api/stt`
- **Function**: Converts user's spoken audio to text
- **Supports**: Multilingual transcription (auto-detects English, Yoruba, Igbo, Hausa)

### 2. **Large Language Model (LLM)** - Gemini 1.5 Pro
- **Endpoint**: `/api/chat`
- **Function**: Generates intelligent medical responses
- **Features**:
  - Medical diagnosis capability
  - Multilingual support (English, Yoruba, Igbo, Hausa)
  - Emergency first-aid guidance
  - Specialist recommendations
  - Conversation history

### 3. **Text-to-Speech (TTS)** - YarnGPT
- **Endpoint**: `/api/tts`
- **Function**: Converts text responses to natural speech
- **Available Voices**:
  - Idera (Melodic, gentle)
  - Emma (Authoritative, deep)
  - Zainab (Soothing, gentle)
  - Osagie (Smooth, calm)
  - Wura (Young, sweet)
  - Jude (Warm, confident)
  - Chinenye (Engaging, warm)
  - Tayo (Upbeat, energetic)
  - Regina (Mature, warm)
  - Femi (Rich, reassuring)
  - Adaora (Warm, engaging)
  - Umar (Calm, smooth)
  - Mary (Energetic, youthful)
  - Nonso (Bold, resonant)
  - Remi (Melodious, warm)
  - Adam (Deep, clear)

### 4. **LiveAvatar** - Custom Mode
- **Function**: Displays avatar speaking the generated audio
- **Integration**: Uses existing LiveAvatar CUSTOM mode setup

## Usage

### Quick Start - Using the Hook

```typescript
import { useVoiceChat } from "@/lib/liveavatar-livekit/useVoiceChat";
import { useRoomContext } from "@livekit/components-react";

function MyComponent() {
  const room = useRoomContext();
  
  const {
    startRecording,
    stopRecording,
    isRecording,
    isProcessing,
    conversationHistory,
  } = useVoiceChat({
    room,
    voice: "Idera", // Choose any YarnGPT voice
    onTranscriptionComplete: (text) => console.log("User said:", text),
    onLLMComplete: (response) => console.log("MACA said:", response),
    onError: (error) => console.error(error),
  });

  return (
    <button onClick={isRecording() ? stopRecording : startRecording}>
      {isRecording() ? "Stop" : "Start"} Recording
    </button>
  );
}
```

### Using the Example Component

```typescript
import { VoiceChatExample } from "@/components/VoiceChatExample";

// In your LiveAvatar page
<LiveKitRoom>
  <VoiceChatExample />
</LiveKitRoom>
```

## API Endpoints

### POST `/api/stt`
Convert audio to text using OpenAI Whisper.

**Request** (multipart/form-data):
```
audio: File (required)
language: string (optional - "en", "yo", "ig", "ha")
```

**Response**:
```json
{
  "text": "Transcribed text",
  "language": "auto-detected"
}
```

### POST `/api/chat`
Generate medical response using Gemini 1.5 Pro.

**Request**:
```json
{
  "message": "I have a headache",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ]
}
```

**Response**:
```json
{
  "response": "Based on your symptoms...",
  "conversationId": "uuid"
}
```

### POST `/api/tts`
Convert text to speech using YarnGPT.

**Request**:
```json
{
  "text": "Hello, how are you?",
  "voice": "Idera",
  "response_format": "wav"
}
```

**Response**: Audio file (audio/wav, audio/mp3, etc.)

## Configuration

### Environment Variables

All API keys are stored in `.env.local`:

```env
# Gemini LLM
GEMINI_API_KEY=your_gemini_key

# YarnGPT TTS
YARNGPT_API_KEY=your_yarngpt_key

# OpenAI Whisper STT
OPENAI_API_KEY=your_openai_key

# LiveAvatar
LIVEAVATAR_API_KEY=your_liveavatar_key
LIVEAVATAR_AVATAR_ID=your_avatar_id
```

## Voice Selection

Change the voice by modifying the `voice` parameter in `useVoiceChat`:

```typescript
const voiceChat = useVoiceChat({
  room,
  voice: "Femi", // Rich, reassuring voice
  // ... other options
});
```

## Workflow Example






1. User clicks "Start Recording"
2. Browser captures microphone audio
3. User clicks "Stop Recording"
4. **STT**: Audio sent to `/api/stt` → transcribed to text
5. **LLM**: Text sent to `/api/chat` → Gemini generates response
6. **TTS**: Response sent to `/api/tts` → YarnGPT creates audio
7. **Avatar**: Audio sent to LiveAvatar → avatar speaks

## Error Handling

```typescript
useVoiceChat({
  room,
  onError: (error) => {
    if (error.message.includes("Microphone")) {
      alert("Please allow microphone access");
    } else if (error.message.includes("STT")) {
      alert("Failed to transcribe audio");
    } else if (error.message.includes("LLM")) {
      alert("Failed to generate response");
    } else if (error.message.includes("TTS")) {
      alert("Failed to generate speech");
    }
  },
});
```

## Testing

### Manual Testing

1. **Start dev server**:
   ```bash
   pnpm dev
   ```

2. **Visit video call page**:
   ```
   http://localhost:3000/health/video-call
   ```

3. **Test voice chat**:
   - Allow microphone access
   - Click "Start Recording"
   - Speak your medical question
   - Click "Stop Recording"
   - Watch the avatar respond!

### API Testing Examples

#### Test STT Endpoint (Speech-to-Text)

**Using cURL:**
```bash
# Test with an audio file
curl -X POST http://localhost:3000/api/stt \
  -F "audio=@test-audio.webm" \
  -F "language=en"
```

**Using JavaScript/Fetch:**
```javascript
// Test STT endpoint
async function testSTT() {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'test.webm');
  formData.append('language', 'en');

  const response = await fetch('http://localhost:3000/api/stt', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  console.log('Transcription:', result.text);
}
```

**Expected Response:**
```json
{
  "text": "I have a headache and feel dizzy",
  "language": "auto-detected"
}
```

#### Test Chat Endpoint (LLM)

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have a headache and feel dizzy",
    "history": []
  }'
```

**Using JavaScript/Fetch:**
```javascript
// Test Chat endpoint
async function testChat() {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'I have a headache and feel dizzy',
      history: [],
    }),
  });

  const result = await response.json();
  console.log('MACA Response:', result.response);
}
```

**Expected Response:**
```json
{
  "response": "Based on your symptoms of headache and dizziness, this could indicate several conditions such as dehydration, migraine, or vertigo. I recommend consulting a general practitioner or neurologist for proper evaluation and diagnosis.",
  "conversationId": "uuid-here"
}
```

#### Test TTS Endpoint (Text-to-Speech)

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Based on your symptoms, I recommend seeing a doctor.",
    "voice": "Idera",
    "response_format": "wav"
  }' \
  --output test-speech.wav
```

**Using JavaScript/Fetch:**
```javascript
// Test TTS endpoint
async function testTTS() {
  const response = await fetch('http://localhost:3000/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: 'Based on your symptoms, I recommend seeing a doctor.',
      voice: 'Idera',
      response_format: 'wav',
    }),
  });

  const audioBlob = await response.blob();
  console.log('Audio generated:', audioBlob.size, 'bytes');
  
  // Play the audio
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}
```

**Expected Response:** Audio file (binary data)

### Integration Testing

#### Full Pipeline Test

```javascript
// Test complete voice chat pipeline
async function testFullPipeline() {
  console.log('Starting full pipeline test...');

  // Step 1: Record audio (simulated)
  const audioBlob = await recordTestAudio(); // Your test audio

  // Step 2: STT
  console.log('Step 1: Testing STT...');
  const formData = new FormData();
  formData.append('audio', audioBlob);
  
  const sttResponse = await fetch('/api/stt', {
    method: 'POST',
    body: formData,
  });
  const { text } = await sttResponse.json();
  console.log('✓ STT Result:', text);

  // Step 3: LLM
  console.log('Step 2: Testing Chat...');
  const chatResponse = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, history: [] }),
  });
  const { response } = await chatResponse.json();
  console.log('✓ Chat Result:', response);

  // Step 4: TTS
  console.log('Step 3: Testing TTS...');
  const ttsResponse = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: response,
      voice: 'Idera',
      response_format: 'wav',
    }),
  });
  const audioResponse = await ttsResponse.blob();
  console.log('✓ TTS Result:', audioResponse.size, 'bytes');

  console.log('✅ Full pipeline test completed successfully!');
}
```

### Multilingual Testing

#### Test English
```javascript
await testChat("I have a fever and cough");
// Expected: English response about respiratory symptoms
```

#### Test Yoruba
```javascript
await testChat("Mo ni ibà àti ikọ̀");
// Expected: Yoruba response about fever and cough
```

#### Test Igbo
```javascript
await testChat("Enwere m ahụ ọkụ na ụkwara");
// Expected: Igbo response about fever and cough
```

#### Test Hausa
```javascript
await testChat("Ina da zazzabi da tari");
// Expected: Hausa response about fever and cough
```

### Voice Testing

```javascript
// Test different YarnGPT voices
const voices = ['Idera', 'Femi', 'Zainab', 'Osagie'];
const testText = 'Hello, I am MACA, your medical assistant.';

for (const voice of voices) {
  console.log(`Testing voice: ${voice}`);
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: testText,
      voice: voice,
      response_format: 'wav',
    }),
  });
  
  const audioBlob = await response.blob();
  console.log(`${voice}: ${audioBlob.size} bytes`);
  
  // Optional: Play each voice
  const audio = new Audio(URL.createObjectURL(audioBlob));
  await audio.play();
  await new Promise(resolve => setTimeout(resolve, 3000));
}
```

### Error Handling Tests

```javascript
// Test missing audio file
async function testMissingAudio() {
  const response = await fetch('/api/stt', {
    method: 'POST',
    body: new FormData(), // Empty form data
  });
  
  console.assert(response.status === 400, 'Should return 400 for missing audio');
  const result = await response.json();
  console.log('Error message:', result.error);
}

// Test empty message
async function testEmptyMessage() {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '' }),
  });
  
  console.assert(response.status === 400, 'Should return 400 for empty message');
}

// Test text too long (>2000 chars)
async function testTextTooLong() {
  const longText = 'a'.repeat(2001);
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: longText }),
  });
  
  console.assert(response.status === 400, 'Should return 400 for text too long');
}
```

### Performance Testing

```javascript
// Measure pipeline performance
async function measurePerformance() {
  const startTime = performance.now();
  
  const timings = {};
  
  // STT
  const sttStart = performance.now();
  const sttResponse = await fetch('/api/stt', { /* ... */ });
  timings.stt = performance.now() - sttStart;
  
  // Chat
  const chatStart = performance.now();
  const chatResponse = await fetch('/api/chat', { /* ... */ });
  timings.chat = performance.now() - chatStart;
  
  // TTS
  const ttsStart = performance.now();
  const ttsResponse = await fetch('/api/tts', { /* ... */ });
  timings.tts = performance.now() - ttsStart;
  
  const totalTime = performance.now() - startTime;
  
  console.log('Performance Report:');
  console.log(`STT: ${timings.stt.toFixed(2)}ms`);
  console.log(`Chat: ${timings.chat.toFixed(2)}ms`);
  console.log(`TTS: ${timings.tts.toFixed(2)}ms`);
  console.log(`Total: ${totalTime.toFixed(2)}ms`);
}
```

### Test Checklist

- [ ] STT endpoint transcribes audio correctly
- [ ] STT supports multiple languages
- [ ] Chat endpoint generates medical responses
- [ ] Chat maintains conversation history
- [ ] Chat enforces medical safety rules
- [ ] TTS endpoint generates audio
- [ ] TTS supports different voices
- [ ] Full pipeline works end-to-end
- [ ] Error handling works correctly
- [ ] LiveAvatar receives and plays audio
- [ ] Microphone recording works in browser
- [ ] Performance is acceptable (< 10s total)

## Medical Safety Features

The system includes built-in safety constraints:
- ✅ Can provide medical diagnoses
- ✅ Can recommend specialist types
- ✅ Can provide emergency first-aid instructions
- ❌ Cannot prescribe medications (except emergencies)
- ❌ Cannot recommend treatments for non-emergencies
- Always advises consulting licensed practitioners

## Multilingual Support

The system automatically detects and responds in:
- **English**
- **Yoruba** (yo)
- **Igbo** (ig)
- **Hausa** (ha)

Simply speak in your preferred language, and MACA will respond in the same language!

## Advanced Usage

### Custom Voice Processing

```typescript
const { processVoiceInput } = useVoiceChat({ room });

// Process pre-recorded audio
const audioFile = new File([audioBlob], "recording.webm");
await processVoiceInput(audioFile);
```

### Conversation Management

```typescript
const { conversationHistory, resetConversation } = useVoiceChat({ room });

// View conversation
console.log(conversationHistory);

// Clear history
resetConversation();
```

## Troubleshooting

### No microphone access
- Ensure browser permissions are granted
- Check for HTTPS (required for microphone)

### Avatar not speaking
- Verify LiveAvatar session is active
- Check browser console for errors
- Ensure audio format is compatible (WAV recommended)

### Poor transcription quality
- Speak clearly and reduce background noise
- Check microphone quality
- Consider setting language explicitly

### Slow response time
- Check internet connection
- API calls are sequential (STT → LLM → TTS)
- Consider optimizing by running steps in parallel where possible

## Next Steps

- Integrate voice chat into your main UI
- Customize voices for different contexts
- Add visual feedback during processing
- Implement push-to-talk vs continuous listening
- Add conversation analytics

Enjoy your voice-powered medical assistant! 🎙️🤖
