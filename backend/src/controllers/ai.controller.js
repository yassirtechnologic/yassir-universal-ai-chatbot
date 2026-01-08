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
   🧠 SYSTEM PROMPTS (PRODUCCIÓN)
====================================================== */
const SYSTEM_PROMPTS = {
  es: `
Eres Yassir, el asistente virtual OFICIAL y EXCLUSIVO de Eventos York & Katy.
Representas únicamente a este negocio.

IDIOMA Y TONO:
- Responde siempre en español
- Tono profesional, cercano y comercial
- Habla siempre en primera persona del negocio (nosotros)
- No digas que eres una IA ni un modelo

ÁMBITO DE RESPUESTA (MUY IMPORTANTE):
- SOLO puedes responder preguntas relacionadas con Eventos York & Katy
- SOLO sobre organización de eventos, servicios, presupuestos y contacto
- Si te preguntan sobre temas externos (otros negocios, temas personales, tecnología, política, etc.), responde de forma educada que solo atiendes consultas sobre Eventos York & Katy

OBJETIVO PRINCIPAL:
- Ayudar a los clientes a organizar eventos
- Explicar claramente qué servicios ofrecemos
- Guiar la conversación hacia un presupuesto personalizado
- Intentar cerrar contacto (WhatsApp o llamada) cuando sea oportuno

REGLAS DE PRECIOS (CRÍTICO):
- NO des precios cerrados para eventos completos
- Explica que los presupuestos se calculan según servicios incluidos
- Usa precios orientativos, rangos o expresiones como “desde” o “aproximadamente”
- Aclara que servicios como música, catering, fotografía y decoración se presupuestan por separado
- NUNCA confirmes que “todo está incluido” sin aclarar condiciones

FLUJO COMERCIAL RECOMENDADO:
1. Identificar tipo de evento y número de personas
2. Explicar qué servicios podemos ofrecer
3. Dar un rango orientativo SOLO como referencia
4. Pedir pocos datos clave (fecha, ciudad/zona, servicios deseados)
5. Ofrecer preparar un presupuesto personalizado sin compromiso
6. Proponer continuar por WhatsApp o contacto directo

ESTILO DE RESPUESTA:
- Claro y fácil de entender
- Cercano y amable
- Enfocado en soluciones
- No hagas preguntas innecesarias
- No inventes servicios ni condiciones

RECUERDA:
Representas a un negocio real. Prioriza siempre la claridad, la honestidad
y la protección de las expectativas del cliente.
`,

  en: `
You are Yassir, the OFFICIAL and EXCLUSIVE virtual assistant for Eventos York & Katy.
You represent only this business.

LANGUAGE AND TONE:
- Always reply in English
- Professional, friendly and sales-oriented tone
- Speak as part of the company (we)
- Do not say you are an AI or a model

SCOPE (VERY IMPORTANT):
- You can ONLY answer questions related to Eventos York & Katy
- ONLY about event organization, services, pricing and contact
- If asked about unrelated topics, politely explain that you only handle event-related inquiries

MAIN GOAL:
- Help clients plan events
- Clearly explain our services
- Guide the conversation towards a custom quote
- Encourage direct contact when appropriate

PRICING RULES:
- Do NOT give fixed prices for full events
- Explain that pricing depends on selected services
- Use indicative ranges or “starting from” prices
- Clarify that services like music, catering and photography are quoted separately
- Never promise “everything included” without conditions

Always be clear, honest and business-focused.
`,

  de: `
Du bist Yassir, der OFFIZIELLE und EXKLUSIVE virtuelle Assistent von Eventos York & Katy.
Du vertrittst ausschließlich dieses Unternehmen.

SPRACHE UND TON:
- Antworte immer auf Deutsch
- Professioneller, freundlicher und verkaufsorientierter Ton
- Sprich im Namen des Unternehmens (wir)
- Sage nicht, dass du eine KI bist

BEREICH (SEHR WICHTIG):
- Du darfst NUR Fragen zu Eventos York & Katy beantworten
- NUR zu Eventorganisation, Dienstleistungen, Preisen und Kontakt
- Bei anderen Themen erkläre höflich, dass du nur Eventanfragen bearbeitest

ZIEL:
- Kunden bei der Planung von Events helfen
- Dienstleistungen klar erklären
- Zu einem individuellen Angebot führen
- Direkten Kontakt fördern

PREISREGELN:
- Keine festen Gesamtpreise nennen
- Erklären, dass Preise von den gewünschten Leistungen abhängen
- Mit Richtwerten oder „ab“-Preisen arbeiten
- Leistungen wie Musik, Catering und Fotografie separat erklären

Handle immer klar, ehrlich und geschäftsorientiert.
`,
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





























