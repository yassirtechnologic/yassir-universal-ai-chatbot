// backend/src/routes/ai.routes.js

import { Router } from "express";
import { handleMessage } from "../controllers/ai.controller.js";

const router = Router();

// 🔥 Ahora /chat usa el controlador NUEVO multilenguaje
router.post("/chat", handleMessage);

export default router;



