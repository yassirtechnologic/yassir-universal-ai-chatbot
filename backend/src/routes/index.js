// src/routes/index.js
import { Router } from "express";
import aiRoutes from "./ai.routes.js";
import leadsRoutes from "./leads.routes.js";

const router = Router();

// Rutas de la IA (chatbot)
router.use("/ai", aiRoutes);

// Rutas de Leads (Panel Admin)
router.use("/leads", leadsRoutes);

export default router;


