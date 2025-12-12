import dotenv from "dotenv";
dotenv.config(); // <-- ensure env variables are loaded first

import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 1️⃣ Speech-to-Text (STT) from raw audio buffer
export const transcribeAudio = async (audioBuffer) => {
    try {
        // audioBuffer must be a Node.js Buffer
        const resp = await openai.audio.transcriptions.create({
            file: audioBuffer,
            model: "whisper-1" // Whisper for transcription
        });

        return resp.text;
    } catch (err) {
        console.error("STT Error:", err);
        return "Sorry, I couldn't understand that.";
    }
};

// 2️⃣ GPT Text Generation
export const runGPT = async (userText) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful medical assistant." },
                { role: "user", content: userText }
            ]
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("GPT Error:", err);
        return "Sorry, I couldn't generate a response.";
    }
};

// 3️⃣ Text-to-Speech (TTS)
export const generateReplyAudio = async (text) => {
    try {
        const resp = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "alloy", // you can choose other voices if available
            input: text
        });

        return Buffer.from(await resp.arrayBuffer());
    } catch (err) {
        console.error("TTS Error:", err);
        return null;
    }
};

// 4️⃣ Helper: full conversation step (STT → GPT → TTS)
export const handleConversation = async (audioBuffer) => {
    const transcription = await transcribeAudio(audioBuffer);
    const gptReply = await runGPT(transcription);
    const audioReply = await generateReplyAudio(gptReply);

    return audioReply;
};
