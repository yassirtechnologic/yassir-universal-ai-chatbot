// src/server.js
import "./load-env.js";
import app from "./app.js";

console.log("🟢 Node version:", process.version);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend activo y escuchando en puerto ${PORT}`);
});




