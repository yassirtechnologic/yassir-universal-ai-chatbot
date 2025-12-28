// src/context/ChatContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

// ======================================================
// 🧹 Limpia caracteres problemáticos
// ======================================================
const cleanText = (text) => {
  if (!text) return "";
  return text.replace(/[\uD800-\uDFFF]./g, "");
};

// ======================================================
// 🌍 Detección básica de idioma (frontend)
// ======================================================
const detectLanguage = (text = "") => {
  const t = text.toLowerCase();

  if (
    t.includes("hello") ||
    t.includes("hi") ||
    t.includes("please") ||
    t.includes("event") ||
    t.includes("price") ||
    t.includes("wedding")
  ) {
    return "en";
  }

  return "es";
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("es");

  // ======================================================
  // 🔥 Cargar historial SOLO si existe y es válido
  // ======================================================
  useEffect(() => {
    const saved = localStorage.getItem("yassir_chat_history");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMessages(parsed);

          // 🔄 Recuperar idioma del último mensaje
          const lastMessage = parsed[parsed.length - 1];
          if (lastMessage?.language) {
            setLanguage(lastMessage.language);
          }
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.warn("⚠️ Historial corrupto, limpiando...");
        localStorage.removeItem("yassir_chat_history");
        setMessages([]);
        setLanguage("es");
      }
    } else {
      setMessages([]);
    }
  }, []);

  // ======================================================
  // 💾 Guardar historial (solo si hay mensajes)
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
  // ➕ Agregar mensaje (usuario o bot)
  // ======================================================
  const addMessage = (from, text, typing = false) => {
    const detectedLang =
      from === "user" ? detectLanguage(text) : language;

    if (from === "user") {
      setLanguage(detectedLang);
    }

    setMessages((prev) => [
      ...prev,
      {
        from,
        text: cleanText(text),
        typing,
        language: detectedLang,
      },
    ]);
  };

  // ======================================================
  // ✏️ Actualizar último mensaje del bot (typing effect)
  // ======================================================
  const updateLastBotMessage = (newText) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;

      if (
        lastIndex >= 0 &&
        updated[lastIndex].from === "bot"
      ) {
        updated[lastIndex].text = cleanText(newText);
      }

      return updated;
    });
  };

  // ======================================================
  // 🗑️ Limpiar conversación COMPLETA
  // ======================================================
  const clearChat = () => {
    localStorage.removeItem("yassir_chat_history");
    setMessages([]);
    setLanguage("es"); // 🔄 Reset idioma
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








