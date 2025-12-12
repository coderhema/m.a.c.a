import { NextResponse } from "next/server";

// Groq API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

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
- You do NOT recommend treatments or medications for non-emergency conditions
- You do NOT prescribe anything for chronic or non-urgent conditions
- You ALWAYS advise consulting a licensed medical practitioner for treatment
- You specify WHICH TYPE of practitioner based on the diagnosis

Maintain a professional, empathetic, and helpful tone in all languages. Clearly distinguish between life-threatening emergencies and standard medical consultations.

IMPORTANT FOR VOICE RESPONSES:
- Keep responses concise and conversational (under 100 words)
- Speak naturally as if in a real conversation
- Ask one question at a time
- Avoid long lists or bullet points`;

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
    const apiKey = process.env.GROQ_API_KEY;
    const { message, history = [] }: ChatRequest = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API key is not configured" },
        { status: 500 }
      );
    }

    // Build messages array for Groq (OpenAI-compatible)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      // Add history
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      // Add current message
      { role: "user", content: message },
    ];

    console.log("Chat: Sending to Groq Llama...");

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        max_tokens: 200, // Keep responses short for TTS
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Chat: Groq API error:", response.status, errorData);
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      console.error("Chat: Empty response from Groq");
      throw new Error("Empty response from Groq");
    }

    console.log("Chat: Success with Groq Llama");

    return NextResponse.json({
      response: text,
      conversationId: crypto.randomUUID(),
      model: "llama-3.3-70b-versatile",
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
