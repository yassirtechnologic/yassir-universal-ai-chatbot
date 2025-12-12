// src/server.js

import "./load-env.js";  // 🚀 Cargar variables antes que todo

import app from "./app.js";

const PORT = process.env.PORT || 5000;

console.log("OPENAI KEY CARGADA:", !!process.env.OPENAI_API_KEY);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});



