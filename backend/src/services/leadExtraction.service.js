/* ======================================================
   YASSIR TECH

   File:
   leadExtraction.service.js

   Description:
   AI Lead Extraction Service.

   Responsibility:
   Uses OpenAI to extract structured lead
   information from a conversation.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import { sendToOpenAI } from "./openai.service.js";

const today = new Date();

const currentDate = today.toISOString().split("T")[0];

const EMPTY_LEAD = {

    nombre: null,
    telefono: null,
    email: null,
    evento: null,
    fecha: null,
    ciudad: null,
    invitados: null,
    presupuesto: null,
    servicios: null,
    comentarios: null

};

export const extractLeadWithAI = async (messages = []) => {

    const systemPrompt = `
You are an information extraction engine.

Your only task is to extract customer information.

Today's date is:

${currentDate}

When the user provides a date without a year:

1. Assume the current year.
2. Compare it with today's date.
3. If that date is still in the future, keep the current year.
4. Only use the next year if the date has already passed.
5. Never invent another year.

Always return dates using:

YYYY-MM-DD

Return ONLY valid JSON.

Never explain anything.

If a value is unknown return null.

If the customer says things like:

- no
- none
- nothing
- no thanks
- no special requests
- no tengo ninguna petición especial
- ninguna
- nada más
- ya te dije que no

then set:

"comentarios": "Sin comentarios"

If the customer mentions several services,
return them as an array.

Example:

"servicios": [
    "catering",
    "decoración"
]

The JSON must always contain:

{
    "nombre": null,
    "telefono": null,
    "email": null,
    "evento": null,
    "fecha": null,
    "ciudad": null,
    "invitados": null,
    "presupuesto": null,
    "servicios": [],
    "comentarios": null
}
`;

    const response = await sendToOpenAI({

        messages: [

            {
                role: "system",
                content: systemPrompt
            },

            ...messages

        ],

        temperature: 0,

        maxTokens: 300

    });

    try {

        const lead = {

            ...EMPTY_LEAD,

            ...JSON.parse(response)

        };

        /* ==========================================
           Normalización backend
        ========================================== */

        const lastMessage =
            messages.at(-1)?.content?.trim().toLowerCase() || "";

        const noResponses = [

            "no",
            "ninguna",
            "ninguno",
            "nada",
            "nada más",
            "ningún comentario",
            "ninguna petición",
            "no tengo ninguna petición especial",
            "no tengo ninguna peticion especial",
            "ya te dije que no"

        ];

        if (

            !lead.comentarios &&

            noResponses.includes(lastMessage)

        ) {

            lead.comentarios =
                "Sin comentarios";

        }

        if (

            lead.servicios &&

            !Array.isArray(lead.servicios)

        ) {

            lead.servicios = [

                lead.servicios

            ];

        }

        return lead;

    } catch (error) {

        console.error(
            "Lead Extraction Error:",
            error
        );

        return {

            ...EMPTY_LEAD

        };

    }

};