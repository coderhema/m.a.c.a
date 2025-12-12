import WebSocket, { WebSocketServer } from "ws";
import { handleConversation } from "./ai.js";

export const startWebSocketServer = () => {
    const wss = new WebSocketServer({ port: 8080 });
    console.log("WebSocket server running on ws://localhost:8080");

    wss.on("connection", (ws) => {
        console.log("🔗 Twilio connected to media stream");

        ws.on("message", async (msg) => {
            const data = JSON.parse(msg.toString());

            if (data.event === "media") {
                const audioBuffer = Buffer.from(data.media.payload, "base64");

                // STT → GPT → TTS
                const replyAudio = await handleConversation(audioBuffer);

                if (replyAudio) {
                    ws.send(JSON.stringify({
                        event: "media",
                        media: { payload: replyAudio.toString("base64") },
                    }));
                }
            }
        });

        ws.on("close", () => console.log("❌ Twilio disconnected"));
    });
};
