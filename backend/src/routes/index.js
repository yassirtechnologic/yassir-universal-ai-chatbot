// src/routes/index.js
import { Router } from "express";
import aiRoutes from "./ai.routes.js";
import leadsRoutes from "./leads.routes.js";

const router = Router();

/* ======================================================
   🤖 Rutas de IA (Chatbot)
   POST /api/ai/chat
====================================================== */
router.use("/ai", aiRoutes);

/* ======================================================
   📊 Rutas de Leads (Panel / Admin)
   GET  /api/leads
   POST /api/leads
====================================================== */
router.use("/leads", leadsRoutes);

export default router;



