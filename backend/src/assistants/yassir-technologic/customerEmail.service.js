/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   customerEmail.service.js

   Description:
   Yassir Technologic customer confirmation email service.

   Responsibility:
   Sends a professional confirmation email to visitors
   who explicitly requested commercial contact.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import {
    sendEmail
} from "../../services/mailer.service.js";

import yassirTechnologicConfig
    from "./config.js";


/* ==========================================================
   CONSTANTS
========================================================== */

const COMPANY_NAME =
    yassirTechnologicConfig.company?.name ||
    "Yassir Technologic";

const COMPANY_EMAIL =
    yassirTechnologicConfig.company?.email ||
    "yassir.technologic@gmail.com";


/* ==========================================================
   ESCAPE HTML
========================================================== */

/*
 * Visitor-provided values must be escaped before
 * being inserted into HTML email templates.
 */

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================================
   NORMALIZE EMAIL
========================================================== */

/*
 * Defensive normalization.
 *
 * This ensures that only the real email address reaches
 * Nodemailer even if presentation markup is received.
 */

function normalizeEmail(
    value
) {

    if (
        typeof value !== "string"
    ) {

        return null;

    }


    const match =
        value.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );


    if (!match) {

        return null;

    }


    return match[0]
        .toLowerCase();

}


/* ==========================================================
   FORMAT SERVICES
========================================================== */

function formatServices(
    services
) {

    if (
        !Array.isArray(services) ||
        services.length === 0
    ) {

        return null;

    }


    return services
        .map(
            (service) =>
                escapeHtml(service)
        )
        .join(", ");

}


/* ==========================================================
   SPANISH HTML
========================================================== */

function buildSpanishHtml(
    lead
) {

    const customerName =
        escapeHtml(
            lead?.nombre
        ) || "Hola";

    const services =
        formatServices(
            lead?.servicioInteres
        );


    return `
<!DOCTYPE html>

<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        Hemos recibido tu solicitud
    </title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f4f7fb;
        font-family:Arial,Helvetica,sans-serif;
        color:#1f2937;
    "
>

    <div
        style="
            max-width:680px;
            margin:0 auto;
            padding:30px 20px;
        "
    >

        <div
            style="
                background:#ffffff;
                border-radius:14px;
                padding:32px;
                box-shadow:0 4px 18px rgba(0,0,0,.06);
            "
        >

            <h1
                style="
                    margin:0 0 20px;
                    color:#2563eb;
                    font-size:26px;
                "
            >
                Hemos recibido tu solicitud
            </h1>


            <p>
                Hola ${customerName},
            </p>


            <p>
                Gracias por contactar con
                <strong>Yassir Technologic</strong>.
            </p>


            <p>
                Hemos recibido correctamente tu solicitud
                y el equipo podrá revisar la información
                que nos has facilitado para definir los
                siguientes pasos.
            </p>


            ${
                services
                    ? `
                        <div
                            style="
                                margin:24px 0;
                                padding:18px;
                                background:#f8fafc;
                                border-radius:10px;
                            "
                        >

                            <strong>
                                Soluciones de interés
                            </strong>

                            <p
                                style="
                                    margin:8px 0 0;
                                "
                            >
                                ${services}
                            </p>

                        </div>
                    `
                    : ""
            }
            
            <p>
                Pronto nuestro equipo se pondrá en contacto contigo
                para continuar con tu solicitud y revisar contigo
                los siguientes pasos.
            </p>


            <p>
                Gracias por confiar en
                <strong>Yassir Technologic</strong>.
            </p>


            <div
                style="
                    margin-top:30px;
                    padding-top:20px;
                    border-top:1px solid #e5e7eb;
                "
            >

                <strong>
                    Equipo de Yassir Technologic
                </strong>

                <p
                    style="
                        margin:6px 0 0;
                        color:#64748b;
                        font-size:14px;
                    "
                >
                    ${escapeHtml(COMPANY_EMAIL)}
                </p>

            </div>


            <p
                style="
                    margin:28px 0 0;
                    color:#94a3b8;
                    font-size:12px;
                "
            >
                Este mensaje es una confirmación automática
                de la solicitud enviada a través del asistente
                virtual de Yassir Technologic.
            </p>

        </div>

    </div>

</body>

</html>
`;

}


/* ==========================================================
   ENGLISH HTML
========================================================== */

function buildEnglishHtml(
    lead
) {

    const customerName =
        escapeHtml(
            lead?.nombre
        ) || "Hello";

    const services =
        formatServices(
            lead?.servicioInteres
        );


    return `
<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        We have received your request
    </title>

</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f4f7fb;
        font-family:Arial,Helvetica,sans-serif;
        color:#1f2937;
    "
>

    <div
        style="
            max-width:680px;
            margin:0 auto;
            padding:30px 20px;
        "
    >

        <div
            style="
                background:#ffffff;
                border-radius:14px;
                padding:32px;
                box-shadow:0 4px 18px rgba(0,0,0,.06);
            "
        >

            <h1
                style="
                    margin:0 0 20px;
                    color:#2563eb;
                    font-size:26px;
                "
            >
                We have received your request
            </h1>


            <p>
                Hello ${customerName},
            </p>


            <p>
                Thank you for contacting
                <strong>Yassir Technologic</strong>.
            </p>


            <p>
                We have successfully received your request.
                Our team can review the information you
                provided and determine the appropriate
                next steps.
            </p>


            ${
                services
                    ? `
                        <div
                            style="
                                margin:24px 0;
                                padding:18px;
                                background:#f8fafc;
                                border-radius:10px;
                            "
                        >

                            <strong>
                                Solutions of interest
                            </strong>

                            <p
                                style="
                                    margin:8px 0 0;
                                "
                            >
                                ${services}
                            </p>

                        </div>
                    `
                    : ""
            }


            <p>
                Our team will be in touch with you soon to continue
                with your request and review the next steps together.
            </p>


            <p>
                Thank you for choosing
                <strong>Yassir Technologic</strong>.
            </p>


            <div
                style="
                    margin-top:30px;
                    padding-top:20px;
                    border-top:1px solid #e5e7eb;
                "
            >

                <strong>
                    Yassir Technologic Team
                </strong>

                <p
                    style="
                        margin:6px 0 0;
                        color:#64748b;
                        font-size:14px;
                    "
                >
                    ${escapeHtml(COMPANY_EMAIL)}
                </p>

            </div>


            <p
                style="
                    margin:28px 0 0;
                    color:#94a3b8;
                    font-size:12px;
                "
            >
                This is an automatic confirmation of the
                request submitted through the Yassir
                Technologic virtual assistant.
            </p>

        </div>

    </div>

</body>

</html>
`;

}


/* ==========================================================
   TEXT FALLBACK
========================================================== */

function buildTextContent({

    lead,

    language

}) {

    const name =
        lead?.nombre ||
        (
            language === "en"
                ? "there"
                : ""
        );


    if (
        language === "en"
    ) {

        return `
Hello ${name},

Thank you for contacting Yassir Technologic.

We have successfully received your request. Our team can
review the information you provided and determine the
appropriate next steps.

If additional information is required, the team may use
the contact details you provided.

Yassir Technologic Team
${COMPANY_EMAIL}
`.trim();

    }


    return `
Hola ${name},

Gracias por contactar con Yassir Technologic.

Hemos recibido correctamente tu solicitud. El equipo podrá
revisar la información facilitada y definir los siguientes
pasos.

Si necesitamos información adicional, podremos utilizar los
datos de contacto que nos has proporcionado.

Equipo de Yassir Technologic
${COMPANY_EMAIL}
`.trim();

}


/* ==========================================================
   SEND CUSTOMER CONFIRMATION
========================================================== */

export async function sendTechCustomerConfirmation({

    lead,

    language = "es"

}) {

    /* ======================================================
       VALIDATE LEAD
    ====================================================== */

    if (
        !lead ||
        typeof lead !== "object"
    ) {

        throw new Error(
            "Lead data is required."
        );

    }


    /* ======================================================
       RECIPIENT
    ====================================================== */

    const recipient =
        normalizeEmail(
            lead.email
        );


    if (!recipient) {

        return {

            success:
                false,

            reason:
                "Customer has no valid email."

        };

    }


    /* ======================================================
       LANGUAGE
    ====================================================== */

    const normalizedLanguage =
        language === "en"
            ? "en"
            : "es";


    /* ======================================================
       CONTENT
    ====================================================== */

    const html =
        normalizedLanguage === "en"
            ? buildEnglishHtml(lead)
            : buildSpanishHtml(lead);


    const text =
        buildTextContent({

            lead,

            language:
                normalizedLanguage

        });


    /* ======================================================
       SEND
    ====================================================== */

    const result =
        await sendEmail({

            fromName:
                COMPANY_NAME,

            to:
                recipient,

            subject:
                normalizedLanguage === "en"
                    ? "Request received - Yassir Technologic"
                    : "Solicitud recibida - Yassir Technologic",

            html,

            text,

            replyTo:
                COMPANY_EMAIL

        });


    console.log(
        "📧 Yassir Technologic customer confirmation sent:",
        {
            recipient
        }
    );


    return result;

}