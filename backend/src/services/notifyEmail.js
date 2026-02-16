import nodemailer from "nodemailer";

export const sendEmailNotification = async (lead) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Eventos York & Katy" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: "🔔 Nueva cita desde el chatbot",
    html: `
      <h2>Nueva solicitud de evento</h2>
      <p><b>Nombre:</b> ${lead.nombre}</p>
      <p><b>Fecha:</b> ${lead.fecha}</p>
      <p><b>Evento:</b> ${lead.evento}</p>
      <p><b>Contacto:</b> ${lead.contacto}</p>
      <p><b>Origen:</b> Chatbot</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
