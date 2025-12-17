// backend/src/controllers/ai.controller.js

import "../load-env.js";
import OpenAI from "openai";
import { saveLead } from "../services/lead.service.js";

/**
 * 🔐 VALIDACIÓN GLOBAL DE API KEY
 * (útil para ver errores claros en producción)
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
    // 🔐 Protección dura: sin API key no seguimos
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "⚠️ El servicio de IA no está configurado correctamente.",
      });
    }

    const { messages } = req.body;

    // 🛡️ Seguridad: garantizar array de mensajes
    const safeMessages =
      Array.isArray(messages) && messages.length > 0
        ? messages
        : [{ role: "user", content: "Hola" }];

    // ======================================================
    // 🔥 SYSTEM PROMPT
    // ======================================================
    const systemPrompt = `
Eres Yassir, el asistente oficial de Eventos York & Katy.

🧠 IDIOMA:
- Responde SIEMPRE en el idioma del último mensaje del usuario.
- No adivines nacionalidad.
- No mezcles idiomas.
- Cambia de idioma solo si el usuario cambia.

🎤 PRESENTACIÓN:
Preséntate SOLO si es la primera interacción.

🎯 FUNCIÓN:
- Planificar eventos (bodas, cumpleaños, bautizos, corporativos).
- Ofrecer menús, decoración, catering.
- Ser profesional, cercano y orientado a ventas.

📩 LEADS:
Si detectas nombre + teléfono + fecha + tipo de evento:
- Guarda el lead sin avisar.
`;

    // ======================================================
    // 🧠 MENSAJES PARA OPENAI
    // ======================================================
    const openAIMessages = [
      { role: "system", content: systemPrompt },
      ...safeMessages,
    ];

    // ======================================================
    // 🤖 LLAMADA A OPENAI
    // ======================================================
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // modelo seguro para pruebas
      messages: openAIMessages,
    });

    const reply = completion.choices[0].message.content;

    // ======================================================
    // 📩 EXTRACCIÓN DE LEADS
    // ======================================================
    const lastUserMessage =
      [...safeMessages].reverse().find((m) => m.role === "user")?.content || "";

    const nameRegex = /(my name is|mi nombre es)\s+([a-zA-ZÁÉÍÓÚáéíóúñÑ ]+)/i;
    const phoneRegex = /(\+?\d[\d\s-]{6,})/;
    const dateRegex =
      /(january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}\/\d{2,4})/i;
    const eventRegex =
      /(wedding|boda|birthday|cumpleaños|communion|comunión|party|evento)/i;

    const nameMatch = lastUserMessage.match(nameRegex);
    const phoneMatch = lastUserMessage.match(phoneRegex);
    const dateMatch = lastUserMessage.match(dateRegex);
    const eventMatch = lastUserMessage.match(eventRegex);

    const cleanPhone = phoneMatch
      ? phoneMatch[1].replace(/[\s-]/g, "")
      : null;

    if (cleanPhone) {
      await saveLead({
        name: nameMatch ? nameMatch[2].trim() : "No especificado",
        phone: cleanPhone,
        event: eventMatch ? eventMatch[0] : "No especificado",
        date: dateMatch ? dateMatch[0] : null,
        message: lastUserMessage,
        createdAt: new Date(),
      });
    }

    // ======================================================
    // 📤 RESPUESTA FINAL
    // ======================================================
    return res.json({ reply });

  } catch (error) {
    console.error("❌ AI Controller Error:", error);
    return res.status(500).json({
      reply: "❌ Error interno al procesar el mensaje.",
    });
  }
};











