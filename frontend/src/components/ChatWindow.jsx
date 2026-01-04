import React, { useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import { sendMessage } from "../services/api";
import "../styles/chat.css";

const ChatWindow = () => {
  const {
    messages,
    language,
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
     🗑️ Limpiar chat (CONFIRMADO Y DEFINIDO)
  ====================================================== */
  const handleClearChat = () => {
    const confirmText =
      language === "en"
        ? "Are you sure you want to clear the conversation?"
        : "¿Seguro que quieres borrar la conversación?";

    if (window.confirm(confirmText)) {
      clearChat();
    }
  };

  /* ======================================================
     🚀 Enviar mensaje
  ====================================================== */
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input;

    addMessage("user", userInput);
    setInput("");
    setLoading(true);

    const historyForBackend = [
      ...messages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: userInput },
    ];

    try {
      const payload = {
        messages: historyForBackend,
    };

      const response = await sendMessage(payload);

      if (!response || !response.reply) {
        addMessage(
          "bot",
          language === "en"
            ? "⚠️ Server response error."
            : "⚠️ Error en la respuesta del servidor."
        );
        return;
      }

      const replyText = response.reply;

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
        language === "en"
          ? "❌ Connection error. Please try again."
          : "❌ Error al conectar con el servidor."
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

        {/* Botón limpiar SIN texto */}
        <button
          className="clear-btn"
          onClick={handleClearChat}
          title={language === "en" ? "Clear chat" : "Limpiar chat"}
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
          placeholder={
            language === "en"
              ? "Type your message..."
              : "Escribe tu mensaje..."
          }
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading
            ? language === "en"
              ? "Sending..."
              : "Enviando..."
            : language === "en"
            ? "Send"
            : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;












