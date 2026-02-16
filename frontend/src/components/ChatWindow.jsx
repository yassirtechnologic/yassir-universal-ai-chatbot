import React, { useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import { sendMessage } from "../services/api";
import "../styles/chat.css";

const ChatWindow = () => {
  const {
    messages,
    addMessage,
    updateLastBotMessage,
    clearChat,
  } = useContext(ChatContext);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  /* ======================================================
     📜 Scroll automático
  ====================================================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ======================================================
     🗑️ Limpiar chat (nueva sesión)
  ====================================================== */
  const handleClearChat = () => {
    if (window.confirm("¿Seguro que quieres borrar la conversación?")) {
      clearChat();
    }
  };

  /* ======================================================
     🚀 Enviar mensaje (EL BACKEND MANDA)
  ====================================================== */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();

    // 1️⃣ Mostrar mensaje del usuario
    addMessage("user", userInput);
    setInput("");
    setLoading(true);

    // 2️⃣ Preparar historial para backend
    const historyForBackend = messages
      .filter(m => !m.typing)
      .map(m => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      }))
      .concat({ role: "user", content: userInput });

    try {
      // 3️⃣ Backend responde según SYSTEM PROMPT
      const response = await sendMessage({
        messages: historyForBackend,
      });

      if (!response?.reply) {
        addMessage("bot", "⚠️ Error en la respuesta del servidor.");
        return;
      }

      const replyText = response.reply;

      // 4️⃣ Mostrar respuesta del bot con typing
      addMessage("bot", "", true);

      let index = 0;
      const interval = setInterval(() => {
        updateLastBotMessage(replyText.slice(0, index));
        index++;

        if (index > replyText.length) {
          clearInterval(interval);
        }
      }, 15);
    } catch (error) {
      console.error("❌ Error:", error);
      addMessage(
        "bot",
        "❌ Error de conexión. Inténtalo de nuevo en unos segundos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container light">
      {/* HEADER */}
      <div className="chat-header">
        <span>Eventos York & Katy</span>

        <button
          className="clear-btn"
          onClick={handleClearChat}
          title="Limpiar chat"
        >
          🗑️
        </button>
      </div>

      {/* MENSAJES */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.from}`}>
            <div className="avatar">
              {msg.from === "user" ? "🧑" : "🤖"}
            </div>

            <div className={`chat-bubble ${msg.from}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
















