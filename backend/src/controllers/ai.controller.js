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

    // ======================================================
    // 🧠 Último mensaje del usuario
    // ======================================================
    const lastUserMessage =
      [...safeMessages].reverse().find((m) => m.role === "user")?.content || "";

    // ======================================================
    // 🧠 Detectar fase de la conversación (FUENTE DE VERDAD)
    // ======================================================
    let conversationStage = "inicio";

    if (/(boda|wedding|cumpleaños|birthday|bautizo|evento|party)/i.test(lastUserMessage)) {
      conversationStage = "tipo_evento";
    }

    if (/\d+\s*(personas|invitados|guests)/i.test(lastUserMessage)) {
      conversationStage = "personas";
    }

    if (
      /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|\d{1,2}\/\d{1,2}\/\d{2,4})/i.test(
        lastUserMessage
      )
    ) {
      conversationStage = "fecha";
    }

    if (/\b(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))\b/i.test(lastUserMessage)) {
      conversationStage = "hora";
    }

    // ======================================================
    // ⏰ Fecha y hora actual (para contexto real)
    // ======================================================
    const now = new Date();
    const fechaActual = now.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const horaActual = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // ======================================================
    // 🔥 SYSTEM PROMPT (PRODUCCIÓN – REGLAS ABSOLUTAS)
    // ======================================================
    const systemPrompt = `
Eres Yassir, el asistente virtual oficial de Eventos York & Katy.

⚠️ REGLA CRÍTICA DE IDIOMA (MÁXIMA PRIORIDAD):
- Detecta el idioma del ÚLTIMO mensaje del usuario.
- Responde SIEMPRE en ese idioma.
- NO mezcles idiomas.
- NO cambies de idioma por tu cuenta.

FECHA Y HORA ACTUAL:
- Hoy es ${fechaActual}.
- Hora actual: ${horaActual}.

INTRODUCCIÓN (REGLA ABSOLUTA):
- SOLO puedes presentarte si la fase actual es EXACTAMENTE "inicio".
- Si la fase NO es "inicio", está TERMINANTEMENTE PROHIBIDO:
  - Volver a presentarte
  - Repetir el saludo
  - Decir "Hola, soy Yassir"
  - Preguntar otra vez el tipo de evento

IDENTIDAD:
- Eres un organizador de eventos profesional y humano.
- Cercano, claro y directo.
- No repites información ya dada.

EXPERIENCIA:
- Bodas
- Cumpleaños
- Bautizos
- Eventos corporativos
- Catering, decoración y logística.

ESTADO ACTUAL DE LA CONVERSACIÓN:
- Fase actual: ${conversationStage}

FLUJO OBLIGATORIO:
- inicio → pregunta tipo de evento (y preséntate SOLO aquí).
- tipo_evento → pregunta cuántas personas asistirán.
- personas → pregunta la fecha del evento.
- fecha → pregunta la hora aproximada.
- hora → propone cierre (llamada, WhatsApp o cita).
- NUNCA retrocedas.
- NUNCA reinicies la conversación.
- NUNCA repitas preguntas ya respondidas.

OBJETIVO COMERCIAL:
- Guiar de forma natural hasta cerrar una cita o contacto directo.
- Propón cierre con frases como:
  - "¿Te parece si lo vemos por WhatsApp?"
  - "Puedo agendar una llamada contigo hoy o mañana"
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
      temperature: 0.4,
    });

    const reply = completion.choices[0].message.content;

    // ======================================================
    // 📩 Extracción de leads (silenciosa)
    // ======================================================
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
















