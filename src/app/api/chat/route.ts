import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// System prompt for MACA
const SYSTEM_PROMPT = `You are MACA (Multimodal Assistant for Clinical Analysis), a knowledgeable medical AI assistant.

LANGUAGE SUPPORT:
You understand and respond in multiple languages including:
- English
- Yoruba
- Igbo  
- Hausa
- Pidgin

Detect the language from the user's input and respond in that same language to ensure clear communication.

Your role is to:
- Listen carefully to patient symptoms
- Ask relevant clarifying questions
- Analyze symptoms and provide potential diagnoses
- Explain the diagnosed condition in clear, understandable terms
- Recommend the appropriate type of medical specialist to consult

EMERGENCY FIRST-AID EXCEPTION:
If the situation is life-threatening or an emergency requiring immediate action before professional help arrives, you MAY provide first-aid instructions and emergency medication guidance to sustain life (e.g., CPR, stopping bleeding, EpiPen for anaphylaxis, aspirin for heart attack). ALWAYS instruct to call emergency services immediately.

STANDARD LIMITATIONS (Non-Emergency):
- You CAN provide diagnoses based on symptomsTTS endpoint (/api/tts) - Convert text to speech using a TTS service (ElevenLabs, Google TTS, etc.)
- You do NOT recommend treatments or medications for non-emergency conditions
- You do NOT prescribe anything for chronic or non-urgent conditions
- You ALWAYS advise consulting a licensed medical practitioner for treatment
- You specify WHICH TYPE of practitioner based on the diagnosis

Maintain a professional, empathetic, and helpful tone in all languages. Clearly distinguish between life-threatening emergencies and standard medical consultations.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: Message[];
}

export async function POST(request: Request) {
  try {
    const { message, history = [] }: ChatRequest = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert history to Gemini format
    const chatHistory = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
    });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      conversationId: crypto.randomUUID(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
