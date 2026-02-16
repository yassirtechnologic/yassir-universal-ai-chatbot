import React, { createContext, useState } from "react";

export const ChatContext = createContext();

/* ======================================================
   🧹 Limpieza segura de texto
====================================================== */
const cleanText = (text = "") =>
  String(text).replace(/[\uD800-\uDFFF]/g, "");

/* ======================================================
   🧠 Chat Provider (FRONTEND NEUTRO)
====================================================== */
export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  /* ======================================================
     ➕ Agregar mensaje
     - NO persistente
     - NO inventa comportamiento
  ====================================================== */
  const addMessage = (from, text, typing = false) => {
    setMessages((prev) => [
      ...prev,
      {
        from,
        text: cleanText(text),
        typing,
      },
    ]);
  };

  /* ======================================================
     ✏️ Typing effect (bot)
     - Actualiza texto
     - Finaliza typing correctamente
  ====================================================== */
  const updateLastBotMessage = (newText, finish = false) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;

      const updated = [...prev];
      const lastIndex = updated.length - 1;

      if (updated[lastIndex]?.from === "bot") {
        updated[lastIndex] = {
          ...updated[lastIndex],
          text: cleanText(newText),
          typing: finish ? false : updated[lastIndex].typing,
        };
      }

      return updated;
    });
  };

  /* ======================================================
     🗑️ Reset total (nueva sesión real)
  ====================================================== */
  const clearChat = () => {
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










