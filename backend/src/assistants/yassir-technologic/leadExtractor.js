/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   leadExtractor.js

   Description:
   Yassir Technologic AI lead extraction service.

   Responsibility:
   Extracts structured commercial opportunity data
   from a Yassir Technologic conversation without
   inventing information not provided by the visitor.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import {
    sendToOpenAI
} from "../../services/openai.service.js";

import {
    getAssistant
} from "../registry.js";

import {
    createEmptyTechLead
} from "./leadSchema.js";


/* ==========================================================
   CONSTANTS
========================================================== */

const ASSISTANT_ID =
    "yassir-technologic";

const MAX_HISTORY_MESSAGES =
    30;


/* ==========================================================
   NORMALIZE CONVERSATION
========================================================== */

function normalizeMessages(
    messages = []
) {

    if (!Array.isArray(messages)) {

        return [];

    }


    return messages
        .filter((message) => {

            return (
                message?.role === "user" ||
                message?.role === "assistant"
            );

        })
        .map((message) => {

            return {

                role:
                    message.role,

                content:
                    typeof message.content === "string"
                        ? message.content
                            .trim()
                            .replace(/\s+/g, " ")
                        : ""

            };

        })
        .filter((message) => {

            return Boolean(
                message.content
            );

        })
        .slice(
            -MAX_HISTORY_MESSAGES
        );

}


/* ==========================================================
   REMOVE JSON CODE FENCES
========================================================== */

function cleanJsonResponse(
    text = ""
) {

    return String(text)
        .trim()
        .replace(
            /^```json\s*/i,
            ""
        )
        .replace(
            /^```\s*/i,
            ""
        )
        .replace(
            /\s*```$/i,
            ""
        )
        .trim();

}


/* ==========================================================
   STRING OR NULL
========================================================== */

function normalizeNullableString(
    value
) {

    if (
        typeof value !== "string"
    ) {

        return null;

    }


    const normalized =
        value
            .trim()
            .replace(/\s+/g, " ");


    return normalized ||
        null;

}


/* ==========================================================
   EMAIL
========================================================== */

function normalizeEmail(
    value
) {

    const email =
        normalizeNullableString(
            value
        );


    if (!email) {

        return null;

    }


    const normalized =
        email.toLowerCase();


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailPattern.test(
        normalized
    )
        ? normalized
        : null;

}


/* ==========================================================
   PHONE
========================================================== */

function normalizePhone(
    value
) {

    const phone =
        normalizeNullableString(
            value
        );


    if (!phone) {

        return null;

    }


    /*
     * We intentionally keep international symbols,
     * spaces and separators because phone formatting
     * depends on the visitor's country.
     */

    const allowedPattern =
        /^[+\d\s().-]{6,30}$/;


    return allowedPattern.test(
        phone
    )
        ? phone
        : null;

}


/* ==========================================================
   SERVICE INTEREST
========================================================== */

function normalizeServiceInterest(
    value,
    allowedServices
) {

    if (!Array.isArray(value)) {

        return [];

    }


    const normalizedAllowed =
        new Map(
            allowedServices.map(
                (service) => [

                    service.toLowerCase(),

                    service

                ]
            )
        );


    const result = [];


    value.forEach((service) => {

        if (
            typeof service !== "string"
        ) {

            return;

        }


        const normalized =
            service
                .trim()
                .toLowerCase();


        const officialService =
            normalizedAllowed.get(
                normalized
            );


        if (
            officialService &&
            !result.includes(
                officialService
            )
        ) {

            result.push(
                officialService
            );

        }

    });


    return result;

}


/* ==========================================================
   NORMALIZE EXTRACTED LEAD
========================================================== */

function normalizeExtractedLead(
    extractedLead,
    allowedServices
) {

    const lead =
        createEmptyTechLead();


    if (
        !extractedLead ||
        typeof extractedLead !== "object" ||
        Array.isArray(extractedLead)
    ) {

        return lead;

    }


    lead.nombre =
        normalizeNullableString(
            extractedLead.nombre
        );


    lead.empresa =
        normalizeNullableString(
            extractedLead.empresa
        );


    lead.email =
        normalizeEmail(
            extractedLead.email
        );


    lead.telefono =
        normalizePhone(
            extractedLead.telefono
        );


    lead.tipoNegocio =
        normalizeNullableString(
            extractedLead.tipoNegocio
        );


    lead.problema =
        normalizeNullableString(
            extractedLead.problema
        );


    lead.servicioInteres =
        normalizeServiceInterest(
            extractedLead.servicioInteres,
            allowedServices
        );


    lead.objetivo =
        normalizeNullableString(
            extractedLead.objetivo
        );


    lead.presupuesto =
        normalizeNullableString(
            extractedLead.presupuesto
        );


    lead.plazo =
        normalizeNullableString(
            extractedLead.plazo
        );


    lead.comentarios =
        normalizeNullableString(
            extractedLead.comentarios
        );


    return lead;

}


/* ==========================================================
   GET OFFICIAL SERVICE NAMES
========================================================== */

function getOfficialServiceNames(
    assistant
) {

    const services =
        assistant?.knowledge?.services;


    if (!Array.isArray(services)) {

        return [];

    }


    return services
        .map((service) => {

            if (
                typeof service === "string"
            ) {

                return service;

            }


            if (
                typeof service?.name === "string"
            ) {

                return service.name;

            }


            return null;

        })
        .filter(Boolean);

}


/* ==========================================================
   EXTRACTION PROMPT
========================================================== */

function buildExtractionPrompt(
    allowedServices
) {

    return `
You are a structured commercial lead extraction engine
for Yassir Technologic.

Your only responsibility is to extract information that
the visitor has explicitly provided or that can be
directly inferred without speculation from the conversation.

Return ONLY valid JSON.

Do not use Markdown.

Do not include explanations.

Do not invent missing data.

If a field is unknown, use null.

For servicioInteres, use an empty array when no service
can be identified with reasonable confidence.

==========================================================
OUTPUT SCHEMA
==========================================================

{
    "nombre": null,
    "empresa": null,
    "email": null,
    "telefono": null,
    "tipoNegocio": null,
    "problema": null,
    "servicioInteres": [],
    "objetivo": null,
    "presupuesto": null,
    "plazo": null,
    "comentarios": null
}

==========================================================
FIELD RULES
==========================================================

nombre:
The visitor's name only if explicitly provided.

empresa:
Company or business name only if explicitly provided.

email:
Visitor's email address only if explicitly provided.

telefono:
Visitor's phone number only if explicitly provided.

tipoNegocio:
The type of business or professional activity when the
conversation clearly establishes it.

problema:
A concise summary of the concrete business problem,
inefficiency or need described by the visitor.

servicioInteres:
Only use official Yassir Technologic service names from
the allowed list below.

objetivo:
The result the visitor wants to achieve.

presupuesto:
Only include budget information if the visitor explicitly
mentions an amount, range or budget condition.

plazo:
Only include timing information if the visitor explicitly
mentions when they need or expect the solution.

comentarios:
Relevant commercial context that does not belong naturally
in another field. Do not duplicate information unnecessarily.

==========================================================
OFFICIAL SERVICES
==========================================================

${JSON.stringify(
    allowedServices,
    null,
    2
)}

==========================================================
IMPORTANT RULES
==========================================================

Do not assume that a visitor wants Artificial Intelligence
simply because their problem could be solved with AI.

Do not invent company names.

Do not invent budgets.

Do not invent deadlines.

Do not invent contact information.

Do not classify assistant messages as visitor information.

Use the entire conversation for context, but extract
commercial facts from what the visitor has communicated.
`;

}


/* ==========================================================
   EXTRACT TECH LEAD
========================================================== */

export async function extractTechLeadWithAI(
    messages = []
) {

    const conversation =
        normalizeMessages(
            messages
        );


    if (
        conversation.length === 0
    ) {

        return createEmptyTechLead();

    }


    const assistant =
        getAssistant(
            ASSISTANT_ID
        );


    if (!assistant) {

        throw new Error(
            `Assistant "${ASSISTANT_ID}" is not registered.`
        );

    }


    const allowedServices =
        getOfficialServiceNames(
            assistant
        );


    const extractionPrompt =
        buildExtractionPrompt(
            allowedServices
        );


    try {

        const response =
            await sendToOpenAI({

                messages: [

                    {

                        role:
                            "system",

                        content:
                            extractionPrompt

                    },

                    {

                        role:
                            "user",

                        content:
                            JSON.stringify(
                                conversation,
                                null,
                                2
                            )

                    }

                ],

                model:
                    assistant.config?.ai?.model ||
                    "gpt-4o-mini",

                temperature:
                    0,

                maxTokens:
                    500

            });


        const parsed =
            JSON.parse(
                cleanJsonResponse(
                    response
                )
            );


        return normalizeExtractedLead(
            parsed,
            allowedServices
        );

    } catch (error) {

        /*
         * Lead extraction must never prevent the chatbot
         * from continuing a conversation.
         */

        console.error(
            "❌ Yassir Technologic lead extraction failed:",
            error
        );


        return createEmptyTechLead();

    }

}