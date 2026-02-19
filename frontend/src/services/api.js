// frontend/src/services/api.js

const API_URL = "https://yassirbot-backend.onrender.com/api/ai/chat";

export const sendMessage = async (payload) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: payload.message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        reply: data?.reply || "❌ Error del servidor.",
      };
    }

    return {
      reply: data.reply,
    };
  } catch (error) {
    console.error("❌ API error:", error);

    return {
      reply: "❌ No se pudo conectar con el servidor. Intenta más tarde.",
    };
  }
};
















