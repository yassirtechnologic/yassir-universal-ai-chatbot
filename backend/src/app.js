import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";
// Este archivo es el que carga /ai y /leads

const app = express();

/* ======================================================
   🛡️ Middlewares globales
====================================================== */
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

/* ======================================================
   🔗 Rutas API
====================================================== */
app.use("/api", routes);

/* ======================================================
   ✅ Health check
====================================================== */
app.get("/", (req, res) => {
  res.json({
    status: "API Running",
    app: "Yassir Universal AI Chatbot",
    version: "1.0.0",
  });
});

export default app;




