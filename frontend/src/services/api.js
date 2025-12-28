// frontend/src/services/api.js

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://yassirbot-backend.onrender.com/api/ai/chat";

export const sendMessage = async (payload) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();

    // ✅ VALIDACIÓN CORRECTA
    if (!data || !data.reply) {
      throw new Error("Formato incorrecto del backend");
    }

    // 🔥 DEVOLVEMOS TODO, NO SOLO EL TEXTO
    return {
      reply: data.reply,
      language: data.language || payload.language || "es",
    };

  } catch (error) {
    console.error("❌ Error de conexión:", error);

    return {
      reply: "🤖 I'm having a small technical issue. Please try again in a few seconds.",
      language: payload.language || "es",
    };
  }
};












