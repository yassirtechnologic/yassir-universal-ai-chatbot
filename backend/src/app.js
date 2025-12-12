// src/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js"; 
// Este archivo es el que carga /ai y /leads

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// API Routes agrupadas
app.use("/api", routes);

// Test
app.get("/", (req, res) => {
  res.json({
    status: "API Running",
    app: "Yassir Universal AI Chatbot",
    version: "1.0.0",
  });
});

export default app;



