import "../load-env.js";
import { saveLead } from "../services/lead.service.js";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handleMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    // ======================================================
    // 🔥 PROMPT MULTILENGUAJE (SYSTEM)
    // ======================================================
    const systemPrompt = `
Eres Yassir, el asistente oficial de Eventos York & Katy.

🧠 COMPORTAMIENTO DE IDIOMA (OBLIGATORIO):

⚠️ NO intentes adivinar la nacionalidad del usuario.
⚠️ NO analices estilo, acentos ni calidad gramatical.
⚠️ NO decidas idioma basado en errores o traducciones.

➡️ DETERMINA EL IDIOMA ÚNICAMENTE por el último mensaje del usuario.
➡️ SIEMPRE responde en el mismo idioma.

🎤 PRESENTACIÓN:
Preséntate SOLO si es la primera interacción del usuario.

🎯 FUNCIÓN:
- Planear eventos
- Ofrecer menús, decoración, catering
- Ser profesional, cálido y orientado a ventas

📩 LEADS:
Si detectas nombre + teléfono + fecha + evento → guarda sin avisar.
`;

    // ======================================================
    // 🔥 MENSAJES PARA OPENAI (CON MEMORIA)
    // ======================================================
    const openAIMessages = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openAIMessages,
    });

    const reply = completion.choices[0].message.content;

    // ======================================================
    // 📩 LEAD EXTRACTION (SOLO DEL ÚLTIMO MENSAJE)
    // ======================================================
    const lastUserMessage = messages
      .filter((m) => m.role === "user")
      .at(-1)?.content || "";

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
    res.json({ reply });

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ error: "Error processing message" });
  }
};








