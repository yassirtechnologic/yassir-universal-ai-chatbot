import "../load-env.js";
import OpenAI from "openai";
import { saveLead } from "../services/lead.service.js";

/* ======================================================
   🔐 OpenAI Client
====================================================== */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ======================================================
   🧠 SYSTEM PROMPTS POR IDIOMA
====================================================== */
const SYSTEM_PROMPTS = {
  es: `
Eres Yassir, el asistente virtual oficial de Eventos York & Katy.

REGLAS
- Responde SIEMPRE en español.
- No uses otros idiomas.
- No te presentes (la presentación la gestiona el sistema).

ESTILO
- Cercano, natural y profesional.
- Una sola pregunta a la vez.

FLUJO
inicio → tipo de evento
tipo_evento → personas
personas → fecha
fecha → hora
hora → contacto

OBJETIVO
- Guiar al cliente hasta un contacto real.
`,
  en: `
You are Yassir, the official virtual assistant of Eventos York & Katy.

RULES
- ALWAYS reply in English.
- Do not introduce yourself (system handles that).

STYLE
- Friendly and professional.
- One question at a time.

FLOW
start → event type
event → people
people → date
date → time
time → contact

GOAL
- Close a real lead.
`,
  de: `
Du bist Yassir, der virtuelle Assistent von Eventos York & Katy.

REGELN
- Antworte IMMER auf Deutsch.
- Stelle dich nicht vor (System übernimmt das).

STIL
- Freundlich und professionell.
- Eine Frage nach der anderen.

ABLAUF
Start → Eventtyp
Event → Personen
Personen → Datum
Datum → Uhrzeit
Uhrzeit → Kontakt

ZIEL
- Einen echten Kontakt herstellen.
`,
};

/* ======================================================
   🚀 HANDLER PRINCIPAL
====================================================== */
export const handleAIChat = async (req, res) => {
  try {
    const { messages, language } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        reply: "⚠️ No message received.",
      });
    }

    if (!language || !SYSTEM_PROMPTS[language]) {
      return res.status(400).json({
        reply: "⚠️ Language not provided.",
      });
    }

    /* ---------------- ¿Ya se presentó? ---------------- */
    const hasIntroduction = messages.some(
      m =>
        m.role === "assistant" &&
        m.meta === "intro"
    );

    /* ---------------- Presentación FORZADA ---------------- */
    let intro = "";
    if (!hasIntroduction) {
      if (language === "es")
        intro = "Hola, soy Yassir, el asistente virtual de Eventos York & Katy. ";
      if (language === "en")
        intro = "Hi, I'm Yassir, the virtual assistant for Eventos York & Katy. ";
      if (language === "de")
        intro = "Hallo, ich bin Yassir, der virtuelle Assistent von Eventos York & Katy. ";
    }

    /* ---------------- OpenAI ---------------- */
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[language] },
        ...messages,
      ],
      temperature: 0.4,
    });

    const aiReply = completion.choices[0].message.content;

    /* ---------------- Guardar lead ---------------- */
    const lastUser = messages.filter(m => m.role === "user").at(-1)?.content || "";
    const phoneMatch = lastUser.match(/(\+?\d[\d\s-]{6,})/);

    if (phoneMatch) {
      await saveLead({
        phone: phoneMatch[1].replace(/[\s-]/g, ""),
        message: lastUser,
        createdAt: new Date(),
      });
    }

    return res.json({
      reply: intro + aiReply,
      meta: !hasIntroduction ? "intro" : undefined,
      language,
    });

  } catch (error) {
    console.error("❌ AI ERROR:", error);
    return res.status(500).json({
      reply: "❌ Error interno.",
    });
  }
};
























