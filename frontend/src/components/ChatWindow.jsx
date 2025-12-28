// src/components/ChatWindow.jsx

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

  // ======================================================
  // 📜 Scroll automático
  // ======================================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ======================================================
  // 🚀 Enviar mensaje
  // ======================================================
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input;

    // Mostrar mensaje del usuario
    addMessage("user", userInput);
    setInput("");
    setLoading(true);

    // ======================================================
    // 🧠 Construir historial REAL para el backend
    // ======================================================
    const historyForBackend = [
      ...messages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: userInput },
    ];

    try {
      // ✅ Payload COMPLETO (mensaje + idioma)
      const payload = {
        messages: historyForBackend,
        language, // 🔥 CLAVE DEL MULTIIDIOMA
      };

      console.log("🚀 Payload enviado:", payload);

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

      // Crear mensaje vacío del bot (para typing)
      addMessage("bot", "", true);

      // ======================================================
      // ✍️ Typing effect
      // ======================================================
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
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        Yassir – Eventos York & Katy
        <button className="clear-btn" onClick={clearChat}>🗑️</button>
      </div>

      {/* MENSAJES */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.from}`}>
            <div className="avatar">
              {msg.from === "user" ? "🧑" : "🤖"}
            </div>

            <div className={`chat-bubble ${msg.from} animated`}>
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









