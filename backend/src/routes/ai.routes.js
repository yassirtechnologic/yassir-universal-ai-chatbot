// backend/src/routes/ai.routes.js

import { Router } from "express";
import { handleAIChat } from "../controllers/ai.controller.js";

const router = Router();

// ✅ Ruta FINAL del chatbot
router.post("/chat", handleAIChat);

export default router;





