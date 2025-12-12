// src/components/ChatWindow.jsx

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

  // 🔽 Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // ➤ Mensaje del usuario
    addMessage("user", input);
    setInput("");

    setLoading(true);

    // ➤ Crear mensaje vacío para el efecto de tipeo
    addMessage("bot", "", true);

    const reply = await sendMessage(input);

    // ➤ Efecto de tipeo letra por letra
    let index = 0;
    const interval = setInterval(() => {
      updateLastBotMessage(reply.slice(0, index));
      index++;

      if (index > reply.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 15);
  };

  return (
    <div className="chat-container">
      {/* ================= HEADER ================= */}
      <div className="chat-header">
        Yassir – Eventos York & Katy

        {/* 🗑️ Botón borrar historial */}
        <button className="clear-btn" onClick={clearChat}>
          🗑️
        </button>
      </div>

      {/* ================= MENSAJES ================= */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg-row ${msg.from}`}>
            
            {/* Avatar automático */}
            <div className="avatar">
              {msg.from === "user" ? "🧑" : "🤖"}
            </div>

            {/* Burbuja con animación */}
            <div className={`chat-bubble ${msg.from} animated`}>
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= INPUT ================= */}
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatWindow;





