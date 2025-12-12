import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

// Ruta correcta hacia backend/data/leads.json
const leadsPath = path.join(process.cwd(), "data", "leads.json");

// Obtener todos los leads
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(leadsPath, "utf8");
    const leads = JSON.parse(data);
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error leyendo los leads" });
  }
});

// Guardar un lead nuevo
router.post("/", (req, res) => {
  try {
    const data = fs.readFileSync(leadsPath, "utf8");
    const leads = JSON.parse(data);

    leads.push(req.body);

    fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));

    res.json({ message: "Lead guardado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error guardando el lead" });
  }
});

export default router;

