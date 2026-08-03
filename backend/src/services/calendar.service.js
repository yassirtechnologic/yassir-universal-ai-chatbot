/* ======================================================
   YASSIR TECH

   File:
   calendar.service.js

   Description:
   Google Calendar Service.

   Responsibility:
   Creates events in Google Calendar.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({

    keyFile: "./credentials/calendar.json",

    scopes: [

        "https://www.googleapis.com/auth/calendar"

    ]

});

const calendar = google.calendar({

    version: "v3",

    auth

});

export const createCalendarEvent = async (lead) => {

    try {

        const event = {

            summary:
                `${lead.evento || "Evento"} - ${lead.nombre || "Cliente"}`,

            description:

                `
Nombre: ${lead.nombre || "-"}

Teléfono: ${lead.telefono || "-"}

Email: ${lead.email || "-"}

Ciudad: ${lead.ciudad || "-"}

Invitados: ${lead.invitados || "-"}

Presupuesto: ${lead.presupuesto || "-"}

Servicios:

${(lead.servicios || []).join(", ")}

Comentarios:

${lead.comentarios || "-"}
                `,

            start: {

                date: lead.fecha || undefined,

                timeZone: "Europe/Madrid"

            },

            end: {

                date: lead.fecha || undefined,

                timeZone: "Europe/Madrid"

            }

        };

        const response =
            await calendar.events.insert({

                calendarId: "primary",

                resource: event

            });

        console.log(
            "📅 Evento creado:",
            response.data.htmlLink
        );

        return {

            success: true,

            link: response.data.htmlLink

        };

    } catch (error) {

        console.error(
            "❌ Calendar Error:",
            error.message
        );

        return {

            success: false,

            error: error.message

        };

    }

};