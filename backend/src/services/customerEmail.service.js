/* ======================================================
   YASSIR TECH

   File:
   customerEmail.service.js

   Description:
   Customer confirmation email service.

   Responsibility:
   Sends a professional confirmation email
   after a customer completes the chatbot.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import nodemailer from "nodemailer";

/* ======================================================
   SMTP Transport
====================================================== */

const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,

    port: Number(process.env.EMAIL_PORT),

    secure: false,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

/* ======================================================
   Send Confirmation
====================================================== */

export const sendCustomerConfirmation = async ({

    lead,

    language = "es"

}) => {

    if (!lead.email) {

        return {

            success: false,

            reason: "Customer has no email."

        };

    }

    const html = `

    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;line-height:1.6">

        <h1 style="color:#ff7b2c;">
            🎉 ¡Hemos recibido tu solicitud!
        </h1>

        <p>

            Hola <strong>${lead.nombre}</strong>,

        </p>

        <p>

            Muchas gracias por contactar con
            <strong>Eventos YorKat</strong>.

        </p>

        <p>

            Hemos recibido correctamente tu solicitud
            y nuestro equipo la revisará lo antes posible.

        </p>

        <hr>

        <h2>📋 Resumen de tu solicitud</h2>

        <table style="border-collapse:collapse">

            <tr><td><strong>Evento:</strong></td><td>${lead.evento}</td></tr>

            <tr><td><strong>Fecha:</strong></td><td>${lead.fecha}</td></tr>

            <tr><td><strong>Ciudad:</strong></td><td>${lead.ciudad}</td></tr>

            <tr><td><strong>Invitados:</strong></td><td>${lead.invitados}</td></tr>

            <tr><td><strong>Presupuesto:</strong></td><td>${lead.presupuesto}</td></tr>

        </table>

        <br>

        <p>

            📞 Muy pronto uno de nuestros asesores se pondrá
            en contacto contigo para preparar una propuesta
            totalmente personalizada.

        </p>

        <p>

            Gracias por confiar en nosotros.

        </p>

        <br>

        <strong>

            Equipo de Eventos YorKat

        </strong>

    </div>

    `;

    await transporter.sendMail({

        from: `"Eventos York & Katy" <${process.env.EMAIL_USER}>`,

        to: lead.email,

        subject:
            "✅ Hemos recibido tu solicitud",

        html

    });

    console.log(
        "📧 Customer confirmation sent."
    );

    return {

        success: true

    };

};