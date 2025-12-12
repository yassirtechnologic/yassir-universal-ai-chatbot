import { saveLead } from "../services/lead.service.js";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handleMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // ======================================================
    // 🔥 PROMPT MULTILENGUAJE OPTIMIZADO Y MEJORADO
    // ======================================================
    const systemPrompt = `
Eres Yassir, el asistente oficial de Eventos York & Katy.

🧠 COMPORTAMIENTO DE IDIOMA (OBLIGATORIO):

⚠️ NO intentes adivinar la nacionalidad del usuario.
⚠️ NO analices estilo, acentos ni calidad gramatical.
⚠️ NO decidas idioma basado en errores o traducciones.

➡️ DETERMINA EL IDIOMA **ÚNICAMENTE** por la detección lingüística del texto más reciente del usuario.

➡️ SIEMPRE responde en el mismo idioma que escribió el usuario, aunque esté mal escrito o sea simple.

Reglas:
1. Si el usuario escribe en español → responde en español.
2. Si escribe en inglés → responde en inglés.
3. Si escribe en alemán → responde en alemán.
4. NO mezcles idiomas nunca.
5. Si el usuario cambia de idioma, tú cambias también.

🎤 PRESENTACIÓN (solo en la primera interacción del usuario):
- Español: "¡Hola! Soy Yassir, tu asistente de eventos de Eventos York & Katy. ¿En qué puedo ayudarte hoy?"
- Inglés: "Hello! I'm Yassir, your event assistant from Eventos York & Katy. How can I help you today?"
- Alemán: "Hallo! Ich bin Yassir, Ihr Eventassistent von Eventos York & Katy. Wie kann ich Ihnen heute helfen?"

🎯 TU FUNCIÓN:
- Ayudar a planear bodas, cumpleaños, bautizos, comuniones, eventos privados y corporativos.
- Ofrecer menús, decoración, catering, precios estimados y paquetes.
- Ser cálido, profesional, útil y orientado a ventas.
- Adaptar tus respuestas al idioma detectado.

📩 SOBRE LOS LEADS:
Si detectas nombre + teléfono + fecha + tipo de evento:
- NO le digas al usuario que estás guardando nada.
- Responde de forma natural.
- Continúa la conversación normalmente.

Tu objetivo final es ayudar, asesorar y guiar al cliente como un asistente real del negocio.
`;

    // ======================================================
    // 🔥 RESPUESTA DEL CHATBOT
    // ======================================================
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    // ======================================================
    // 📩 EXTRACCIÓN AUTOMÁTICA DE LEADS
    // ======================================================
    const nameRegex = /(my name is|mi nombre es)\s+([a-zA-ZÁÉÍÓÚáéíóúñÑ ]+)/i;
    const phoneRegex = /(\+?\d[\d\s-]{6,})/;
    const dateRegex =
      /(january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}\/\d{2,4})/i;

    const eventRegex =
      /(wedding|boda|birthday|cumpleaños|communion|comunión|party|evento)/i;

    const nameMatch = message.match(nameRegex);
    const phoneMatch = message.match(phoneRegex);
    const dateMatch = message.match(dateRegex);
    const eventMatch = message.match(eventRegex);

    const cleanPhone = phoneMatch
      ? phoneMatch[1].replace(/[\s-]/g, "")
      : null;

    if (cleanPhone) {
      const lead = {
        name: nameMatch ? nameMatch[2].trim() : "No especificado",
        phone: cleanPhone,
        event: eventMatch ? eventMatch[0] : "No especificado",
        date: dateMatch ? dateMatch[0] : null,
        message,
        createdAt: new Date(),
      };

      await saveLead(lead);
    }

    // ======================================================
    // 📤 RESPUESTA FINAL
    // ======================================================
    res.json({ reply });

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ error: "Error processing message" });
  }
};







