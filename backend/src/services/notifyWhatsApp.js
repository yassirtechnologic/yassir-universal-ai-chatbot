import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppNotification = async (lead) => {
  try {
    const message = `
Hola ${lead.nombre} 👋

Somos Eventos York & Katy.
Hemos recibido tu solicitud:

Evento: ${lead.evento}
Fecha: ${lead.fecha}

En breve nuestro equipo te contactará.
    `.trim();

    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${lead.contacto}`,
      body: message,
    });

    console.log("✅ WhatsApp enviado:", response.sid);
    return true;

  } catch (error) {
    console.error("❌ Error enviando WhatsApp:", error.message);
    return false;
  }
};

