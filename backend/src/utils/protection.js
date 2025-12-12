// src/utils/protection.js

// Guardamos últimos mensajes por IP
const messageHistory = {};

export function rateLimit(req, res) {
  const ip = req.ip;
  const now = Date.now();

  if (!messageHistory[ip]) {
    messageHistory[ip] = [];
  }

  // Mantener solo los últimos 60 segundos
  messageHistory[ip] = messageHistory[ip].filter(
    (t) => now - t < 60 * 1000
  );

  // Máximo 5 mensajes por minuto
  if (messageHistory[ip].length >= 5) {
    return res.status(429).json({
      error: "Bro, estás enviando mensajes demasiado rápido. Intenta en un minuto.",
    });
  }

  // Registrar mensaje
  messageHistory[ip].push(now);
  return null; // No hay error
}

// Validación básica del mensaje
export function validateMessage(message) {

  if (!message || message.trim() === "") {
    return "El mensaje no puede estar vacío, bro.";
  }

  if (message.length > 300) {
    return "Bro, tu mensaje es demasiado largo. Intenta resumirlo un poco.";
  }

  // Detectar spam repetido
  const repeated = /(.)\1{10,}/;
  if (repeated.test(message)) {
    return "Bro, parece que ese mensaje tiene spam. Escríbelo normal.";
  }

  return null; // mensaje válido
}
