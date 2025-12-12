import dotenv from "dotenv";
dotenv.config(); // <-- load env variables first

import express from "express";
import voiceRouter from "./routes/voice.js";
import { startWebSocketServer } from "./services/stream.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Voice webhooks
app.use("/api/voice", voiceRouter);

// Start WebSocket server for Twilio media stream
startWebSocketServer();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
