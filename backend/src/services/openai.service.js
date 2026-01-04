import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🤖 Servicio único para enviar mensajes a OpenAI
 * Toda la lógica vive en el controller
 */
export const sendToOpenAI = async ({
  messages,
  model = "gpt-4o-mini",
  temperature = 0.4,
  maxTokens = 300,
}) => {
  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0].message.content;
};















