import OpenAI from "openai";

/* ======================================================
   🔐 OpenAI Client (único)
====================================================== */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ======================================================
   🤖 Envío de mensajes a OpenAI
   - NO lógica de negocio
   - NO idioma
   - NO presentación
====================================================== */
export const sendToOpenAI = async ({
  messages,
  model = "gpt-4o-mini",
  temperature = 0.4,
  maxTokens = 300,
}) => {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required");
  }

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  const content = response?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return content;
};
















