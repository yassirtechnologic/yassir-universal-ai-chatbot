// frontend/src/services/api.js

const API_URL = "http://localhost:5000/api/ai/chat";

export const sendMessage = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }), // 👈 IMPORTANTE: debe ser { message }
    });

    if (!response.ok) {
      console.error("Error en respuesta del servidor:", response.status);
      return "Hubo un error al procesar tu mensaje.";
    }

    const data = await response.json();
    return data.reply; // 👈 el backend devuelve { reply: ... }
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    return "Error de conexión con el servidor.";
  }
};


