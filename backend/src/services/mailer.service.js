/* ==========================================================
   YASSIR TECH

   File:
   mailer.service.js

   Description:
   Shared SMTP email transport service.

   Responsibility:
   Provides a reusable and centralized mechanism
   for sending transactional emails through SMTP.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import nodemailer from "nodemailer";


/* ==========================================================
   SMTP CONFIGURATION
========================================================== */

function getSmtpConfig() {

    const host =
        process.env.EMAIL_HOST;

    const port =
        Number(
            process.env.EMAIL_PORT
        ) || 587;

    const user =
        process.env.EMAIL_USER;

    const pass =
        process.env.EMAIL_PASS;


    if (
        !host ||
        !user ||
        !pass
    ) {

        throw new Error(
            "SMTP configuration is incomplete."
        );

    }


    return {

        host,

        port,

        secure:
            port === 465,

        auth: {

            user,

            pass

        }

    };

}


/* ==========================================================
   CREATE TRANSPORTER
========================================================== */

function createTransporter() {

    return nodemailer.createTransport(
        getSmtpConfig()
    );

}


/* ==========================================================
   SEND EMAIL
========================================================== */

export async function sendEmail({

    fromName,

    to,

    subject,

    html,

    text = null,

    replyTo = null

}) {

    /* ======================================================
       VALIDATION
    ====================================================== */

    if (
        typeof to !== "string" ||
        !to.trim()
    ) {

        throw new Error(
            "Email recipient is required."
        );

    }


    if (
        typeof subject !== "string" ||
        !subject.trim()
    ) {

        throw new Error(
            "Email subject is required."
        );

    }


    if (
        typeof html !== "string" ||
        !html.trim()
    ) {

        throw new Error(
            "Email HTML content is required."
        );

    }


    /* ======================================================
       TRANSPORTER
    ====================================================== */

    const transporter =
        createTransporter();


    /* ======================================================
       MESSAGE
    ====================================================== */

    const mailOptions = {

        from: `"${fromName || "Yassir Technologic"}" <${process.env.EMAIL_USER}>`,

        to:
            to.trim(),

        subject:
            subject.trim(),

        html

    };


    if (
        typeof text === "string" &&
        text.trim()
    ) {

        mailOptions.text =
            text.trim();

    }


    if (
        typeof replyTo === "string" &&
        replyTo.trim()
    ) {

        mailOptions.replyTo =
            replyTo.trim();

    }


    /* ======================================================
       SEND
    ====================================================== */

    const info =
        await transporter.sendMail(
            mailOptions
        );


    console.log(
        "📧 Email sent:",
        {
            to:
                to.trim(),

            messageId:
                info.messageId
        }
    );


    return {

        success:
            true,

        messageId:
            info.messageId || null

    };

}