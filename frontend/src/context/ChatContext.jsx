// src/context/ChatContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

// 🧹 Limpia emojis problemáticos que causan “URI malformed”
const cleanText = (text) => {
  if (!text) return "";
  return text.replace(/[\uD800-\uDFFF]./g, "");
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  // 🔥 Cargar historial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("yassir_chat_history");

    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // NO ponemos mensaje inicial → lo generará la IA multilingüe
      setMessages([]);
    }
  }, []);

  // 🔥 Guardar historial
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("yassir_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // ➕ Agregar mensajes
  const addMessage = (from, text, typing = false) => {
    setMessages((prev) => [
      ...prev,
      { from, text: cleanText(text), typing },
    ]);
  };

  // ✏️ Actualizar último mensaje (efecto tecleo)
  const updateLastBotMessage = (newText) => {
    setMessages((prev) => {
      const updated = [...prev];
      const index = updated.length - 1;

      if (index >= 0 && updated[index].from === "bot") {
        updated[index].text = cleanText(newText);
      }

      return updated;
    });
  };

  // 🗑️ BORRAR TODO EL HISTORIAL
  const clearChat = () => {
    localStorage.removeItem("yassir_chat_history");

    // SI quieres que Yassir salude de nuevo según idioma → DEJA ARRAY VACÍO
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        updateLastBotMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};







