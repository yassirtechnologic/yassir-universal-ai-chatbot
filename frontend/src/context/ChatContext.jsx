// src/context/ChatContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

// ======================================================
// 🧹 Limpieza segura de texto
// ======================================================
const cleanText = (text = "") =>
  text.replace(/[\uD800-\uDFFF]/g, "");

// ======================================================
// 🌍 Detección de idioma (SOLO usuario)
// ======================================================
const detectUserLanguage = (text = "") => {
  const t = text.toLowerCase();

  if (
    /\b(hello|hi|please|event|price|wedding|people|date|time)\b/.test(t)
  ) {
    return "en";
  }

  if (
    /\b(hallo|bitte|hochzeit|veranstaltung|personen|datum|uhr)\b/.test(t)
  ) {
    return "de";
  }

  return "es";
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("es");

  // ======================================================
  // 🔥 Cargar historial si existe
  // ======================================================
  useEffect(() => {
    const saved = localStorage.getItem("yassir_chat_history");

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setMessages(parsed);

        const lastUserMsg = [...parsed]
          .reverse()
          .find((m) => m.from === "user");

        if (lastUserMsg?.language) {
          setLanguage(lastUserMsg.language);
        }
      }
    } catch {
      localStorage.removeItem("yassir_chat_history");
      setMessages([]);
      setLanguage("es");
    }
  }, []);

  // ======================================================
  // 💾 Guardar historial
  // ======================================================
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "yassir_chat_history",
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  // ======================================================
  // ➕ Agregar mensaje
  // ======================================================
  const addMessage = (from, text, typing = false) => {
    const cleaned = cleanText(text);

    let msgLanguage = language;

    if (from === "user") {
      msgLanguage = detectUserLanguage(cleaned);
      setLanguage(msgLanguage);
    }

    setMessages((prev) => [
      ...prev,
      {
        from,
        text: cleaned,
        typing,
        language: msgLanguage,
      },
    ]);
  };

  // ======================================================
  // ✏️ Typing effect (bot)
  // ======================================================
  const updateLastBotMessage = (newText) => {
    setMessages((prev) => {
      const updated = [...prev];
      const last = updated.length - 1;

      if (updated[last]?.from === "bot") {
        updated[last].text = cleanText(newText);
      }

      return updated;
    });
  };

  // ======================================================
  // 🗑️ Reset total
  // ======================================================
  const clearChat = () => {
    localStorage.removeItem("yassir_chat_history");
    setMessages([]);
    setLanguage("es");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        language,
        addMessage,
        updateLastBotMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};









