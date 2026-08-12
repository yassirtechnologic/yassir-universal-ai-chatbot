/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   businessEmail.service.js

   Description:
   Yassir Technologic business lead notification service.

   Responsibility:
   Sends an internal notification email when a qualified
   Yassir Technologic opportunity explicitly requests
   commercial contact.

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


/* ==========================================================
   CONSTANTS
========================================================== */

const BUSINESS_EMAIL =
    "yassir.technologic@gmail.com";

const COMPANY_NAME =
    "Yassir Technologic";


/* ==========================================================
   ESCAPE HTML
========================================================== */

/*
 * Lead values originate from visitor input.
 *
 * They must never be inserted directly into HTML without
 * escaping because transactional emails are HTML documents.
 */

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "-";

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
   FORMAT SERVICES
========================================================== */

function formatServices(
    services
) {

    if (
        !Array.isArray(services) ||
        services.length === 0
    ) {

        return "-";

    }


    return services
        .map(
            (service) =>
                escapeHtml(service)
        )
        .join(", ");

}


/* ==========================================================
   BUILD EMAIL HTML
========================================================== */

function buildBusinessEmailHtml({

    lead,

    leadId,

    language

}) {

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
        Nuevo cliente potencial
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
            max-width:720px;
            margin:0 auto;
            padding:30px 20px;
        "
    >

        <div
            style="
                background:#ffffff;
                border-radius:14px;
                padding:30px;
                box-shadow:0 4px 18px rgba(0,0,0,.06);
            "
        >

            <div
                style="
                    margin-bottom:25px;
                "
            >

                <h1
                    style="
                        margin:0 0 8px;
                        font-size:24px;
                        color:#2563eb;
                    "
                >
                    🚀 Nuevo cliente potencial
                </h1>

                <p
                    style="
                        margin:0;
                        color:#6b7280;
                    "
                >
                    Se ha registrado una nueva oportunidad comercial
                    desde el chatbot de Yassir Technologic.
                </p>

            </div>


            <hr
                style="
                    border:none;
                    border-top:1px solid #e5e7eb;
                    margin:25px 0;
                "
            >


            <table
                style="
                    width:100%;
                    border-collapse:collapse;
                "
            >

                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        👤 Nombre
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.nombre)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        🏢 Empresa
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.empresa)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        💼 Tipo de negocio
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.tipoNegocio)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        📧 Email
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.email)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        📞 Teléfono
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.telefono)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        🎯 Problema
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.problema)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        ⚙️ Servicios de interés
                    </td>

                    <td style="padding:8px 0;">
                        ${formatServices(
                            lead?.servicioInteres
                        )}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        📈 Objetivo
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.objetivo)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        💰 Presupuesto
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.presupuesto)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        🗓️ Plazo
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.plazo)}
                    </td>
                </tr>


                <tr>
                    <td style="padding:8px 0;font-weight:bold;">
                        📝 Comentarios
                    </td>

                    <td style="padding:8px 0;">
                        ${escapeHtml(lead?.comentarios)}
                    </td>
                </tr>

            </table>


            <hr
                style="
                    border:none;
                    border-top:1px solid #e5e7eb;
                    margin:25px 0;
                "
            >


            <div
                style="
                    background:#f8fafc;
                    border-radius:10px;
                    padding:16px;
                    font-size:13px;
                    color:#64748b;
                "
            >

                <div>
                    <strong>Lead ID:</strong>
                    ${escapeHtml(leadId)}
                </div>

                <div style="margin-top:6px;">
                    <strong>Idioma:</strong>
                    ${escapeHtml(language || "es")}
                </div>

                <div style="margin-top:6px;">
                    <strong>Origen:</strong>
                    Yassir Technologic Website Chatbot
                </div>

            </div>


            <p
                style="
                    margin:25px 0 0;
                    color:#64748b;
                    font-size:13px;
                "
            >
                Este correo ha sido generado automáticamente por
                Yassir Universal AI Chatbot.
            </p>

        </div>

    </div>

</body>

</html>
`;

}


/* ==========================================================
   BUILD TEXT FALLBACK
========================================================== */

function buildBusinessEmailText({

    lead,

    leadId,

    language

}) {

    return `
NUEVO CLIENTE POTENCIAL - YASSIR TECHNOLOGIC

Nombre: ${lead?.nombre || "-"}
Empresa: ${lead?.empresa || "-"}
Tipo de negocio: ${lead?.tipoNegocio || "-"}
Email: ${lead?.email || "-"}
Teléfono: ${lead?.telefono || "-"}
Problema: ${lead?.problema || "-"}
Servicios: ${
    Array.isArray(lead?.servicioInteres)
        ? lead.servicioInteres.join(", ")
        : "-"
}
Objetivo: ${lead?.objetivo || "-"}
Presupuesto: ${lead?.presupuesto || "-"}
Plazo: ${lead?.plazo || "-"}
Comentarios: ${lead?.comentarios || "-"}

Lead ID: ${leadId || "-"}
Idioma: ${language || "es"}
Origen: Yassir Technologic Website Chatbot
`.trim();

}


/* ==========================================================
   SEND BUSINESS LEAD EMAIL
========================================================== */

export async function sendTechBusinessLeadEmail({

    lead,

    leadId = null,

    language = "es"

}) {

    if (
        !lead ||
        typeof lead !== "object"
    ) {

        throw new Error(
            "Lead data is required."
        );

    }


    const html =
        buildBusinessEmailHtml({

            lead,

            leadId,

            language

        });


    const text =
        buildBusinessEmailText({

            lead,

            leadId,

            language

        });


    const result =
        await sendEmail({

            fromName:
                COMPANY_NAME,

            to:
                BUSINESS_EMAIL,

            subject:
                `🚀 Nuevo cliente potencial - ${
                    lead.nombre ||
                    lead.empresa ||
                    "Yassir Technologic"
                }`,

            html,

            text,

            /*
             * Replying to the notification can open
             * a direct response to the lead when an
             * email address is available.
             */

            replyTo:
                lead.email ||
                null

        });


    console.log(
        "📧 Yassir Technologic business notification sent:",
        {
            leadId,
            recipient:
                BUSINESS_EMAIL
        }
    );


    return result;

}