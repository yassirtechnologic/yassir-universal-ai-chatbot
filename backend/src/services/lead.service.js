import fs from "fs";
import path from "path";

// Ruta correcta para leads.json
const leadsFile = path.join(process.cwd(), "backend", "data", "leads.json");

// Función para guardar un lead
export const saveLead = async (lead) => {
  try {
    // Asegurar que la carpeta backend/data existe
    const dir = path.dirname(leadsFile);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let leads = [];

    // Si el archivo existe, cargar leads previos
    if (fs.existsSync(leadsFile)) {
      leads = JSON.parse(fs.readFileSync(leadsFile, "utf8"));
    }

    // Evitar duplicados por número de teléfono
    if (leads.some((l) => l.phone === lead.phone)) {
      return { saved: false, msg: "Lead already exists" };
    }

    // Guardar nuevo lead
    leads.push(lead);

    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));

    return { saved: true, msg: "Lead saved successfully" };
  } catch (error) {
    console.error("LEAD SERVICE ERROR:", error);
    return { saved: false, msg: "Error saving lead" };
  }
};
