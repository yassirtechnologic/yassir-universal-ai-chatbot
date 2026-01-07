import "../load-env.js";
import OpenAI from "openai";
import { saveLead } from "../services/lead.service.js";

/* ======================================================
   🔐 OpenAI Client (SDK NUEVO)
====================================================== */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ======================================================
   🌍 Detección simple de idioma
====================================================== */
const detectLanguage = (text = "") => {
  const t = text.toLowerCase();

  if (/\b(hallo|bitte|hochzeit|veranstaltung|personen|datum|uhr)\b/.test(t)) {
    return "de";
  }

  if (/\b(hello|hi|please|event|price|wedding|people|date|time)\b/.test(t)) {
    return "en";
  }

  return "es";
};

/* ======================================================
   🧠 SYSTEM PROMPTS
====================================================== */
const SYSTEM_PROMPTS = {
  es: `
Eres Yassir, el asistente virtual oficial de Eventos York & Katy.
Responde SIEMPRE en español.
Guía al cliente hasta un contacto real.
Una sola pregunta a la vez.
`,
  en: `
You are Yassir, the official assistant of Eventos York & Katy.
Always reply in English.
Guide the user to a real contact.
One question at a time.
`,
  de: `
Du bist Yassir, der Assistent von Eventos York & Katy.
Antworte immer auf Deutsch.
Führe den Kunden zu einem echten Kontakt.
Eine Frage nach der anderen.
`,
};

/* ======================================================
   🚀 HANDLER PRINCIPAL
====================================================== */
export const handleAIChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: "⚠️ No message received." });
    }

    /* ---------- Idioma automático ---------- */
    const lastUserMessage =
      [...messages].reverse().find(m => m.role === "user")?.content || "";

    const language = detectLanguage(lastUserMessage);

    /* ---------- Intro una sola vez ---------- */
    const hasIntroduction = messages.some(
      m =>
        m.role === "assistant" &&
        typeof m.content === "string" &&
        (
          m.content.includes("soy Yassir") ||
          m.content.includes("I'm Yassir") ||
          m.content.includes("ich bin Yassir")
        )
    );

    let intro = "";
    if (!hasIntroduction) {
      if (language === "es")
        intro = "Hola, soy Yassir, el asistente virtual de Eventos York & Katy. ";
      if (language === "en")
        intro = "Hi, I'm Yassir, the virtual assistant for Eventos York & Katy. ";
      if (language === "de")
        intro = "Hallo, ich bin Yassir, der virtuelle Assistent von Eventos York & Katy. ";
    }

    /* ======================================================
       🤖 OPENAI — FORMATO CORRECTO SDK NUEVO
    ====================================================== */
    const formattedMessages = [
      {
        role: "system",
        content: [{ type: "text", text: SYSTEM_PROMPTS[language] }],
      },
      ...messages.map(m => ({
        role: m.role,
        content: [{ type: "text", text: m.content }],
      })),
    ];

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: formattedMessages,
    });

    /* ---------- Extraer texto seguro ---------- */
    const aiReply =
      response.output?.[0]?.content?.[0]?.text ||
      "❌ No response generated.";

    /* ---------- Guardar lead ---------- */
    const phoneMatch = lastUserMessage.match(/(\+?\d[\d\s-]{6,})/);
    if (phoneMatch) {
      await saveLead({
        phone: phoneMatch[1].replace(/[\s-]/g, ""),
        message: lastUserMessage,
        createdAt: new Date(),
      });
    }

    return res.json({
      reply: intro + aiReply,
    });

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    return res.status(500).json({
      reply: "❌ Error interno.",
    });
  }
};



























