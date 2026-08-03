/* ======================================================
   YASSIR TECH

   File:
   notifyEmail.js

   Description:
   Business email notification service.

   Responsibility:
   Sends a detailed notification email to the
   business whenever a new lead is completed.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import nodemailer from "nodemailer";

/* ======================================================
   Send Business Notification
====================================================== */

export const sendEmailNotification = async (lead = {}) => {

    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,

        port: Number(process.env.EMAIL_PORT) || 587,

        secure: false,

        auth: {

            user: process.env.EMAIL_USER,

            pass: process.env.EMAIL_PASS,

        },

    });

    const mailOptions = {

        from: `"Eventos York & Katy" <${process.env.EMAIL_USER}>`,

        to: process.env.NOTIFY_EMAIL,

        subject: `🎉 Nuevo Lead - ${lead.evento || "Evento"}`,

        html: `

        <div style="font-family:Arial,sans-serif;padding:20px;max-width:700px;">

            <h2 style="color:#1E88E5;">
                🎉 Nuevo Lead recibido desde el Chatbot
            </h2>

            <hr>

            <table style="width:100%;border-collapse:collapse;">

                <tr>
                    <td><strong>👤 Nombre</strong></td>
                    <td>${lead.nombre || "-"}</td>
                </tr>

                <tr>
                    <td><strong>📞 Teléfono</strong></td>
                    <td>${lead.telefono || "-"}</td>
                </tr>

                <tr>
                    <td><strong>📧 Email</strong></td>
                    <td>${lead.email || "-"}</td>
                </tr>

                <tr>
                    <td><strong>🎉 Evento</strong></td>
                    <td>${lead.evento || "-"}</td>
                </tr>

                <tr>
                    <td><strong>📅 Fecha</strong></td>
                    <td>${lead.fecha || "-"}</td>
                </tr>

                <tr>
                    <td><strong>📍 Ciudad</strong></td>
                    <td>${lead.ciudad || "-"}</td>
                </tr>

                <tr>
                    <td><strong>👥 Invitados</strong></td>
                    <td>${lead.invitados || "-"}</td>
                </tr>

                <tr>
                    <td><strong>💰 Presupuesto</strong></td>
                    <td>${lead.presupuesto || "-"}</td>
                </tr>

                <tr>
                    <td><strong>🍽️ Servicios</strong></td>
                    <td>${(lead.servicios || []).join(", ") || "-"}</td>
                </tr>

                <tr>
                    <td><strong>📝 Comentarios</strong></td>
                    <td>${lead.comentarios || "-"}</td>
                </tr>

                <tr>
                    <td><strong>🌍 Idioma</strong></td>
                    <td>${lead.language || "es"}</td>
                </tr>

                <tr>
                    <td><strong>🖥️ Origen</strong></td>
                    <td>Website Chatbot</td>
                </tr>

            </table>

            <hr>

            <p style="color:#666;font-size:13px;">

                Este correo fue generado automáticamente por el
                <strong>Yassir Universal AI Chatbot</strong>.

            </p>

        </div>

        `,

    };

    try {

        await transporter.sendMail(mailOptions);

        console.log(
            "📧 Business email sent successfully."
        );

        return {

            success: true

        };

    }

    catch (error) {

        console.error(
            "❌ Business Email:",
            error.message
        );

        return {

            success: false,

            error: error.message

        };

    }

};
