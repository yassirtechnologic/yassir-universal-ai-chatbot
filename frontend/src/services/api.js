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
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (!data?.reply) {
      throw new Error("Invalid backend response");
    }

    // 🔥 El backend SOLO devuelve texto
    return {
      reply: data.reply,
    };

  } catch (error) {
    console.error("❌ API error:", error);

    return {
      reply:
        "🤖 I'm having a small technical issue. Please try again in a few seconds.",
    };
  }
};













