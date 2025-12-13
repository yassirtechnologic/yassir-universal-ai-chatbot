// src/server.js

import "./load-env.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend iniciado correctamente en el puerto ${PORT}`);
});




