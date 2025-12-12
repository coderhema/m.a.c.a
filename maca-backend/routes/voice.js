import express from "express";
import { handleIncomingCall } from "../services/twilio.js";

const router = express.Router();

router.post("/incoming", handleIncomingCall);

export default router;
