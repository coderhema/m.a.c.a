import Twilio from "twilio";

const VoiceResponse = Twilio.twiml.VoiceResponse;

export const handleIncomingCall = (req, res) => {
    const twiml = new VoiceResponse();

    // Only connect to the WebSocket — no "say" before
    twiml.connect().stream({
        url: process.env.WS_URL // e.g., wss://your-ngrok-url/ws
    });

    res.type("text/xml");
    res.send(twiml.toString());
};
