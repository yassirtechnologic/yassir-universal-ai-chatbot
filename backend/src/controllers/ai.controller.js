import "../load-env.js";
import OpenAI from "openai";
import { saveLead } from "../services/lead.service.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ======================================================
   🌍 Detección de idioma
====================================================== */
const detectLanguage = (text = "") => {
  const t = text.toLowerCase();

  if (/\b(hallo|bitte|hochzeit|veranstaltung|personen|datum|uhr)\b/.test(t))
    return "de";

  if (/\b(hello|hi|please|event|price|wedding|people|date|time)\b/.test(t))
    return "en";

  return "es";
};

/* ======================================================
   🧠 SYSTEM PROMPTS
====================================================== */
const SYSTEM_PROMPTS = {
  es: "Responde siempre en español. No te presentes.",
  en: "Always reply in English. Do not introduce yourself.",
  de: "Antworte immer auf Deutsch. Stelle dich nicht vor.",
};

/* ======================================================
   🧼 Normalizar mensajes (FIX CLAVE)
   👉 Evita errores tipo 'texto'
====================================================== */
const normalizeMessages = (messages = []) => {
  return messages.map(m => ({
    role: m.role,
    content:
      typeof m.content === "string"
        ? m.content
        : Array.isArray(m.content)
        ? m.content.map(c => c.text).join(" ")
        : "",
  }));
};

/* ======================================================
   🚀 CONTROLLER
====================================================== */
export const handleAIChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: "No message received." });
    }

    // 🔧 NORMALIZACIÓN CRÍTICA
    const cleanMessages = normalizeMessages(messages);

    const lastUserMessage =
      [...cleanMessages].reverse().find(m => m.role === "user")?.content || "";

    const language = detectLanguage(lastUserMessage);

    const hasIntro = cleanMessages.some(
      m =>
        m.role === "assistant" &&
        typeof m.content === "string" &&
        m.content.toLowerCase().includes("yassir")
    );

    let intro = "";
    if (!hasIntro) {
      if (language === "es")
        intro = "Hola, soy Yassir, el asistente virtual de Eventos York & Katy. ";
      if (language === "en")
        intro = "Hi, I'm Yassir, the virtual assistant for Eventos York & Katy. ";
      if (language === "de")
        intro =
          "Hallo, ich bin Yassir, der virtuelle Assistent von Eventos York & Katy. ";
    }

    // ✅ USO CORRECTO DE CHAT COMPLETIONS
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[language] },
        ...cleanMessages,
      ],
    });

    const aiReply =
      completion?.choices?.[0]?.message?.content ||
      "Lo siento, no pude responder en este momento.";

    // 📞 Detección de teléfono (lead)
    const phoneMatch = lastUserMessage.match(/(\+?\d[\d\s-]{6,})/);
    if (phoneMatch) {
      await saveLead({
        phone: phoneMatch[1].replace(/[\s-]/g, ""),
        message: lastUserMessage,
        createdAt: new Date(),
      });
    }

    return res.json({ reply: intro + aiReply });

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    return res
      .status(500)
      .json({ reply: "Estamos teniendo un problema técnico. Intenta más tarde." });
  }
};





























