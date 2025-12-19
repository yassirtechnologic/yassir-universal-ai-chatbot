// src/components/ChatWindow.jsx

import React, { useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import { sendMessage } from "../services/api";
import "../styles/chat.css";

const ChatWindow = () => {
  const { messages, addMessage, updateLastBotMessage, clearChat } =
    useContext(ChatContext);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Convertir formato FRONTEND -> BACKEND
  const convertMessages = (extraUserMessage = null) => {
    const history = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // 🔥 INYECTAR el mensaje actual del usuario
    if (extraUserMessage) {
      history.push({
        role: "user",
        content: extraUserMessage,
      });
    }

    return history;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input;

    // Mostrar mensaje del usuario inmediatamente
    addMessage("user", userInput);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        messages: convertMessages(userInput), // ✅ CLAVE
      };

      console.log("🚀 Payload enviado:", payload);

      const reply = await sendMessage(payload);

      if (!reply || typeof reply !== "string") {
        addMessage("bot", "⚠️ Error en la respuesta del servidor.");
        return;
      }

      // Crear mensaje del bot REAL
      addMessage("bot", "");

      // Efecto typing
      let index = 0;
      const interval = setInterval(() => {
        updateLastBotMessage(reply.slice(0, index));
        index++;

        if (index > reply.length) {
          clearInterval(interval);
        }
      }, 15);
    } catch (error) {
      console.error("❌ Error:", error);
      updateLastBotMessage("❌ Error al conectar con el servidor.");
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
          placeholder="Escribe tu mensaje..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;








