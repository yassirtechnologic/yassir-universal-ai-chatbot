// backend/src/routes/ai.routes.js

import { Router } from "express";
import { handleAIChat } from "../controllers/ai.controller.js";

const router = Router();

/**
 * 🤖 Chatbot AI endpoint
 * POST /api/ai/chat
 * Body: { message | messages }
 */
router.post("/chat", handleAIChat);

export default router;






