console.log("🚨 AI.CONTROLLER IMPORTADO 🚨");
import "../load-env.js";
import OpenAI from "openai";
import { saveLead } from "../services/lead.service.js";
import { sendEmailNotification } from "../services/notifyEmail.js";
import { sendWhatsAppNotification } from "../services/notifyWhatsApp.js";
import { processConversation } from "../conversation/conversationManager.js";

/* ======================================================
   🔐 OpenAI Client (validado)
====================================================== */
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Falta OPENAI_API_KEY en variables de entorno");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ======================================================
   🌍 Detección de idioma (robusta)
====================================================== */
const detectLanguage = (text = "") => {
  const t = String(text).toLowerCase().trim();

  // Alemán
  if (/\b(hallo|bitte|hochzeit|veranstaltung|personen|datum|uhr)\b/.test(t)) {
    return "de";
  }

  // Inglés
  if (/\b(hello|hi|please|event|price|wedding|people|date|time)\b/.test(t)) {
    return "en";
  }

  // Español por defecto
  return "es";
};

/* ======================================================
   🧠 SYSTEM PROMPTS (PRODUCCIÓN)
====================================================== */
const SYSTEM_PROMPTS = {
  es: `
Eres Yassir, el asistente virtual OFICIAL y EXCLUSIVO de Eventos York & Katy.
Representas únicamente a este negocio real.

IDIOMA Y TONO (OBLIGATORIO):
- Responde SIEMPRE en español
- Tono profesional, cercano y comercial
- Habla siempre en primera persona del negocio (nosotros)
- NUNCA digas que eres una IA, asistente virtual o modelo

ÁMBITO DE RESPUESTA (MUY IMPORTANTE):
- SOLO puedes responder sobre Eventos York & Katy
- SOLO sobre organización de eventos, servicios, presupuestos y contacto
- Si preguntan por otros temas, responde educadamente que solo atiendes consultas de Eventos York & Katy

OBJETIVO PRINCIPAL:
- Ayudar a organizar eventos
- Explicar claramente los servicios
- Guiar hacia un presupuesto personalizado
- Intentar cerrar contacto (WhatsApp o llamada) cuando sea oportuno

REGLAS DE PRECIOS (CRÍTICO):
- NO des precios cerrados de eventos completos
- Explica que el precio depende de los servicios incluidos
- Usa precios orientativos, rangos o expresiones como “desde” o “aproximadamente”
- Aclara que catering, música, fotografía y decoración se presupuestan por separado
- NUNCA confirmes que “todo está incluido” sin condiciones claras

FLUJO COMERCIAL RECOMENDADO:
1. Identificar tipo de evento y número de personas
2. Explicar qué servicios ofrecemos
3. Dar un rango orientativo SOLO como referencia
4. Pedir pocos datos clave (fecha, ciudad/zona, servicios)
5. Ofrecer presupuesto personalizado sin compromiso
6. Proponer continuar por WhatsApp o contacto directo

ESTILO DE RESPUESTA:
- Claro y fácil de entender
- Cercano y amable
- Enfocado en soluciones
- NO inventes servicios ni condiciones
- NO hagas preguntas innecesarias

--------------------------------------------------
CONTROL DE RESPUESTAS (OBLIGATORIO):
- Máximo 2 frases cortas por mensaje
- NO usar párrafos largos
- NO dar explicaciones extensas
- Divide la información en mensajes breves si es necesario

REGLA DE PREGUNTAS:
- SOLO una pregunta por mensaje
- NUNCA combines información larga con una pregunta

PRIORIDAD DE CONVERSACIÓN:
- Si falta nombre, tipo de evento, fecha o contacto,
  DEBES pedir ese dato antes de explicar servicios

CIERRE DEL FLUJO:
- Cuando ya tengas nombre, tipo de evento, fecha y contacto:
  - DEJA de hacer preguntas
  - Confirma brevemente
  - Indica que el equipo se pondrá en contacto
  - Usa un mensaje corto de cierre
--------------------------------------------------
`,

  en: `
You are Yassir, the OFFICIAL and EXCLUSIVE virtual assistant for Eventos York & Katy.
You represent a real business only.

LANGUAGE AND TONE (MANDATORY):
- Always reply in English
- Professional, friendly and sales-oriented tone
- Speak as part of the company (we)
- NEVER say you are an AI or a model

SCOPE (VERY IMPORTANT):
- You can ONLY answer questions related to Eventos York & Katy
- ONLY about event organization, services, pricing and contact
- For unrelated topics, politely state that you only handle event inquiries

MAIN GOAL:
- Help clients plan events
- Clearly explain services
- Guide towards a custom quote
- Encourage direct contact when appropriate

PRICING RULES:
- Do NOT give fixed full-event prices
- Explain pricing depends on selected services
- Use indicative ranges or “starting from” prices
- Clarify catering, music and photography are quoted separately
- Never promise “everything included” without conditions

RESPONSE CONTROL:
- Maximum 2 short sentences
- Only one question per message
- Stop asking questions once all required data is collected
`,

  de: `
Du bist Yassir, der OFFIZIELLE und EXKLUSIVE Assistent von Eventos York & Katy.
Du vertrittst ein echtes Unternehmen.

SPRACHE UND TON (VERPFLICHTEND):
- Antworte immer auf Deutsch
- Professionell, freundlich und verkaufsorientiert
- Sprich im Namen des Unternehmens (wir)
- Sage NIEMALS, dass du eine KI bist

BEREICH (SEHR WICHTIG):
- Antworte NUR zu Eventos York & Katy
- NUR zu Eventorganisation, Leistungen, Preisen und Kontakt
- Bei anderen Themen erkläre höflich die Einschränkung

PREISREGELN:
- Keine festen Gesamtpreise nennen
- Preise hängen von den gewünschten Leistungen ab
- Richtpreise oder „ab“-Preise verwenden
- Catering, Musik und Fotografie separat erklären

ANTWORTREGELN:
- Maximal 2 kurze Sätze
- Nur eine Frage pro Nachricht
- Keine weiteren Fragen nach vollständigen Kontaktdaten
`,
};

/* ======================================================
   🧼 Normalizar mensajes
====================================================== */
const normalizeMessages = (messages = []) => {
  if (!Array.isArray(messages)) return [];

  return messages.map(m => {
    const role =
      m?.role === "assistant" || m?.role === "user"
        ? m.role
        : "user";

    let content = "";
    if (typeof m?.content === "string") {
      content = m.content;
    } else if (Array.isArray(m?.content)) {
      content = m.content
        .map(c => (typeof c?.text === "string" ? c.text : ""))
        .join(" ");
    }

    return {
      role,
      content: content.trim().replace(/\s+/g, " "),
    };
  });
};

/* ======================================================
   🧠 Detectar intención de contacto
====================================================== */
const wantsContact = (text = "") =>
  /(si|sí|claro|perfecto|vale|ok|de acuerdo|whatsapp|llamen|contacten)/i.test(
    text
  );

/* ======================================================
   🚀 CONTROLLER PRINCIPAL
====================================================== */
export const handleAIChat = async (req, res) => {
  try {
    console.log("🔥🔥🔥 NUEVO AI.CONTROLLER CARGADO 🔥🔥🔥");
    console.log("1️⃣ handleAIChat ejecutado");

    const {

        conversationId,

        messages

    } = req.body;

    console.log("2️⃣ Body recibido:", req.body);

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.json({ reply: "No message received." });
    }

    const cleanMessages = normalizeMessages(messages);
    console.log("3️⃣ Mensajes normalizados:", cleanMessages);

    const userMessages = cleanMessages.filter(m => m.role === "user");
    const lastUserMessage = userMessages.at(-1)?.content || "";

    const isFirstUserMessage = userMessages.length === 1;
    const userAcceptedContact = userMessages.some(m =>
      wantsContact(m.content)
    );

    /* ======================================================
      🧠 NUEVO MOTOR DE CONVERSACIÓN (V2)
      Solo análisis, todavía no reemplaza la lógica actual
    ====================================================== */

    console.log("4️⃣ Voy a llamar a processConversation");
    const conversationResult =
      await processConversation({

          conversationId,

          messages: cleanMessages,

      });

    console.log("========== CONVERSATION ENGINE ==========");
    console.log("🌍 Idioma:", conversationResult.language);
    console.log("👤 Lead:", conversationResult.lead);
    console.log("📋 Workflow:", conversationResult.workflow);
    console.log("💬 Reply:", conversationResult.reply);
    console.log("=========================================");

    /* ======================================================
      🤖 RESPUESTA DEL CONVERSATION ENGINE
    ====================================================== */

    if (conversationResult.reply) {

      return res.json({

        reply: conversationResult.reply,

        workflow: conversationResult.workflow,

        lead: conversationResult.lead,

        language: conversationResult.language,

        actions: conversationResult.actions,

      });

    }
    
    /* ======================================================
      Próximamente:
      Ejecutar acciones automáticas
    ====================================================== */

    if (conversationResult.actions?.length) {

        console.log(
            "⚙️ Acciones:",
            conversationResult.actions
        );

    }

      } catch (error) {
        console.error("❌ ERROR GENERAL:", error);
        return res.status(500).json({
          reply: "Estamos teniendo un problema técnico. Intenta más tarde.",
        });
      }
    };































