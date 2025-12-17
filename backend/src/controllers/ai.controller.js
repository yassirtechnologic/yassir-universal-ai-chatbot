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

    // 🛡️ Seguridad: siempre trabajar con array válido
    const safeMessages = Array.isArray(messages) ? messages : [];

    // ✅ Detectar primera interacción REAL
    const isFirstInteraction = safeMessages.length <= 1;

    // ======================================================
    // 🔥 SYSTEM PROMPT
    // ======================================================
    const systemPrompt = `
Eres Yassir, el asistente oficial de Eventos York & Katy.

IDENTIDAD:
- Tu nombre es Yassir.
- Eres un asistente profesional de planificación de eventos.

IDIOMA:
- Responde SIEMPRE en el idioma del último mensaje del usuario.
- No mezcles idiomas.
- Cambia de idioma solo si el usuario cambia.

PRESENTACIÓN:
- ${
      isFirstInteraction
        ? "Preséntate diciendo: \"Hola, soy Yassir, el asistente de Eventos York & Katy\"."
        : "NO te vuelvas a presentar."
    }

FUNCIÓN:
- Ayudar a planificar eventos (bodas, cumpleaños, bautizos, corporativos).
- Ofrecer menús, decoración y catering.
- Guiar la conversación paso a paso.

ESTILO:
- Cercano, claro y orientado a cerrar el evento.

LEADS:
- Si detectas nombre + teléfono + fecha + tipo de evento, guarda el lead sin avisar.
`;

    // ======================================================
    // 🧠 Mensajes para OpenAI
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
    // 📩 Extracción de leads
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












