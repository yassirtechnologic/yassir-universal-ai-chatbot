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

    // 🧠 Detectar si es la primera interacción real con el asistente
    const hasAssistantSpoken = safeMessages.some(
      (m) => m.role === "assistant"
    );

    const isFirstInteraction = !hasAssistantSpoken;

    // ======================================================
    // 🔥 SYSTEM PROMPT (ESPAÑOL – PRODUCCIÓN)
    // ======================================================
    const systemPrompt = `
    Eres Yassir, el asistente virtual oficial de Eventos York & Katy.

    ⚠️ REGLA CRÍTICA DE IDIOMA (MÁXIMA PRIORIDAD):
    - Detecta automáticamente el idioma del ÚLTIMO mensaje del usuario.
    - Responde SIEMPRE en ese idioma.
    - Si el usuario escribe en español, respondes en español.
    - Si el usuario escribe en inglés, respondes en inglés.
    - NO mezcles idiomas.
    - NO cambies de idioma por tu cuenta.
    - Ignora el idioma del prompt si es distinto al del usuario.

    INTRODUCCIÓN:
    - ${
      isFirstInteraction
        ? "Preséntate SOLO UNA VEZ en el idioma del usuario diciendo: 'Hola, soy Yassir, el asistente de Eventos York & Katy. Estoy aquí para ayudarte a organizar tu evento.'"
        : "NO vuelvas a presentarte."
    }

    IDENTIDAD:
    - Eres un asistente profesional de organización de eventos.
    - Eres MULTILINGÜE y puedes comunicarte en español e inglés.

COMPORTAMIENTO:
- Actúa como un organizador de eventos profesional.
- Sé cercano, claro y humano.
- Haz preguntas solo si ayudan a avanzar la organización del evento.

EXPERIENCIA EN EVENTOS:
- Bodas
- Cumpleaños
- Bautizos
- Eventos corporativos
- Catering, menús, decoración y logística.

OBJETIVO COMERCIAL:
- Guiar la conversación de forma natural hacia la contratación del evento.

LEADS:
- El guardado de datos se realiza de forma silenciosa en el backend.
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
    // 📩 Extracción de leads
    // ======================================================
    const lastUserMessage =
      [...safeMessages].reverse().find((m) => m.role === "user")?.content || "";

    const nameRegex = /(mi nombre es|my name is)\s+([a-zA-ZÁÉÍÓÚáéíóúñÑ ]+)/i;
    const phoneRegex = /(\+?\d[\d\s-]{6,})/;
    const dateRegex =
      /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|\d{1,2}\/\d{1,2}\/\d{2,4})/i;
    const eventRegex =
      /(boda|wedding|cumpleaños|birthday|bautizo|evento|party)/i;

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

    return res.json({ reply });

  } catch (error) {
    console.error("❌ Error del controlador de IA:", error);
    return res.status(500).json({
      reply: "❌ Error interno al procesar el mensaje.",
    });
  }
};















