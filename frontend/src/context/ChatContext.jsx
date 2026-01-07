import React, { createContext, useState, useEffect } from "react";

export const ChatContext = createContext();

/* ======================================================
   🧹 Limpieza segura de texto
====================================================== */
const cleanText = (text = "") =>
  text.replace(/[\uD800-\uDFFF]/g, "");

/* ======================================================
   🧠 Chat Provider
====================================================== */
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  /* ======================================================
     🔥 Cargar historial (sesión)
  ====================================================== */
  useEffect(() => {
    const saved = localStorage.getItem("yassir_chat_history");

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setMessages(parsed);
      }
    } catch {
      localStorage.removeItem("yassir_chat_history");
      setMessages([]);
    }
  }, []);

  /* ======================================================
     💾 Guardar historial
  ====================================================== */
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        "yassir_chat_history",
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  /* ======================================================
     ➕ Agregar mensaje
  ====================================================== */
  const addMessage = (from, text, typing = false) => {
    const cleaned = cleanText(text);

    setMessages((prev) => [
      ...prev,
      {
        from,
        text: cleaned,
        typing,
      },
    ]);
  };

  /* ======================================================
     ✏️ Typing effect (bot)
  ====================================================== */
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

  /* ======================================================
     🗑️ Reset total (nueva sesión)
  ====================================================== */
  const clearChat = () => {
    localStorage.removeItem("yassir_chat_history");
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









