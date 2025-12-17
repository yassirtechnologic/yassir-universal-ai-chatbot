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

    // ✅ Detectar si YA hubo respuesta del bot
    const hasAssistantSpoken = safeMessages.some(
      (m) => m.role === "assistant"
    );

    // ======================================================
    // 🔥 SYSTEM PROMPT (EN INGLÉS → MULTILINGÜE REAL)
    // ======================================================
    const systemPrompt = `
You are Yassir, the official assistant of Eventos York & Katy.

IDENTITY:
- Your name is Yassir.
- You are a professional event planning assistant.

LANGUAGE RULES:
- ALWAYS reply in the SAME language used by the user in their LAST message.
- Do NOT mix languages.
- Switch language ONLY if the user switches language.

INTRODUCTION RULE:
- ${
      hasAssistantSpoken
        ? "Do NOT introduce yourself again."
        : "Introduce yourself ONCE by saying: 'Hello, I’m Yassir, the assistant from Eventos York & Katy.' (translate this sentence to the user’s language)."
    }

ROLE:
- Help plan events (weddings, birthdays, baptisms, corporate events).
- Offer menus, decoration and catering options.
- Guide the conversation step by step to close the event.

STYLE:
- Friendly, clear, professional and sales-oriented.

LEADS:
- If you detect a name + phone number + date + event type, store the lead silently.
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
      model: "gpt-3.5-turbo",
      messages: openAIMessages,
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













