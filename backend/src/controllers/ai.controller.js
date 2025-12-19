// backend/src/controllers/ai.controller.js

import "../load-env.js";
import OpenAI from "openai";
import { saveLead } from "../services/lead.service.js";

/**
 * 🔐 Validación global de API KEY
 */
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY no está definida en el entorno");
}

/**
 * 🤖 Cliente OpenAI
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🚀 Handler principal del chatbot
 */
export const handleAIChat = async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "⚠️ El servicio de IA no está configurado correctamente.",
      });
    }

    const { messages } = req.body;

    // 🛡️ Asegurar array válido
    const safeMessages = Array.isArray(messages) ? messages : [];

    // 🧠 Detectar si es el primer mensaje REAL del usuario
    const userMessagesCount = safeMessages.filter(
      (m) => m.role === "user"
    ).length;

    const isFirstUserMessage = userMessagesCount === 1;

    // ======================================================
    // 🔥 SYSTEM PROMPT (PRODUCCIÓN)
    // ======================================================
    const systemPrompt = `
You are Yassir, the official virtual assistant of Eventos York & Katy.

CORE RULES (MANDATORY):
1. Respond ALWAYS in the same language as the user's LAST message.
2. Never mix languages.
3. Detect the language automatically from the user's message.
4. Maintain conversation context at all times (event type, number of guests, preferences).
5. Never reset the conversation.

INTRODUCTION RULE:
- ${
      isFirstUserMessage
        ? "Introduce yourself ONCE in the user's language: 'I am Yassir, the assistant from Eventos York & Katy.'"
        : "Do NOT introduce yourself again."
    }

BEHAVIOR:
- Act as a professional event planner.
- Be friendly, natural and human.
- Avoid generic phrases like 'How can I assist you today?' after the first message.
- Ask follow-up questions only when they help move the event forward.

EVENT EXPERTISE:
- Weddings, birthdays, baptisms, corporate events.
- Catering, menus, decoration and logistics.

SALES GOAL:
- Guide the conversation smoothly toward closing the event.
- If the user asks for ideas, give concrete and realistic suggestions adapted to the event size.

LEADS:
- If the user provides name, phone, date and event type, continue the conversation normally.
- Lead saving is handled silently in the backend.
`;

    // ======================================================
    // 🧠 Mensajes enviados a OpenAI
    // ======================================================
    const openAIMessages = [
      { role: "system", content: systemPrompt },
      ...safeMessages,
    ];

    // ======================================================
    // 🤖 Llamada a OpenAI
    // ======================================================
    const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: openAIMessages,
    temperature: 0.5,
    });

    const reply = completion.choices[0].message.content;

    // ======================================================
    // 📩 Extracción de leads (último mensaje del usuario)
    // ======================================================
    const lastUserMessage =
      [...safeMessages].reverse().find((m) => m.role === "user")?.content || "";

    const nameRegex = /(my name is|mi nombre es)\s+([a-zA-ZÁÉÍÓÚáéíóúñÑ ]+)/i;
    const phoneRegex = /(\+?\d[\d\s-]{6,})/;
    const dateRegex =
      /(january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}\/\d{2,4})/i;
    const eventRegex =
      /(wedding|boda|birthday|cumpleaños|communion|comunión|party|evento)/i;

    const phoneMatch = lastUserMessage.match(phoneRegex);

    if (phoneMatch) {
      await saveLead({
        name: lastUserMessage.match(nameRegex)?.[2]?.trim() || "No especificado",
        phone: phoneMatch[1].replace(/[\s-]/g, ""),
        event: lastUserMessage.match(eventRegex)?.[0] || "No especificado",
        date: lastUserMessage.match(dateRegex)?.[0] || null,
        message: lastUserMessage,
        createdAt: new Date(),
      });
    }

    // ======================================================
    // 📤 Respuesta final
    // ======================================================
    return res.json({ reply });

  } catch (error) {
    console.error("❌ Error del controlador de IA:", error);
    return res.status(500).json({
      reply: "❌ Error interno al procesar el mensaje.",
    });
  }
};














