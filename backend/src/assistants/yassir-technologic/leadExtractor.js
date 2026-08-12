/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   leadExtractor.js

   Description:
   Yassir Technologic AI lead extraction service.

   Responsibility:
   Extracts structured commercial opportunity data
   exclusively from information provided by the visitor,
   without inventing or borrowing facts from assistant
   responses.

   Author:
   Yassir Technologic

   Version:
   1.1.0
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
   NORMALIZE USER MESSAGES
========================================================== */

/*
 * IMPORTANT:
 *
 * Commercial facts must come from the visitor.
 *
 * Assistant messages are intentionally excluded from
 * lead extraction so suggestions made by Yassir AI
 * cannot accidentally become stored customer facts.
 */

function normalizeUserMessages(
    messages = []
) {

    if (!Array.isArray(messages)) {

        return [];

    }


    return messages
        .filter((message) => {

            return (
                message?.role === "user"
            );

        })
        .map((message) => {

            return {

                role:
                    "user",

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

/*
 * Extracts an email even if the source contains
 * presentation markup such as:
 *
 * [name@example.com](mailto:name@example.com)
 */

function normalizeEmail(
    value
) {

    const source =
        normalizeNullableString(
            value
        );


    if (!source) {

        return null;

    }


    const match =
        source.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );


    if (!match) {

        return null;

    }


    return match[0]
        .toLowerCase();

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


    const allowedPattern =
        /^[+\d\s().-]{6,30}$/;


    return allowedPattern.test(
        phone
    )
        ? phone
        : null;

}


/* ==========================================================
   COMPANY
========================================================== */

/*
 * A business category is not a company name.
 *
 * Example:
 *
 * "Tengo un restaurante"
 *
 * tipoNegocio = "Restaurante"
 * empresa = null
 */

function normalizeCompany(
    companyValue,
    businessTypeValue
) {

    const company =
        normalizeNullableString(
            companyValue
        );


    if (!company) {

        return null;

    }


    const businessType =
        normalizeNullableString(
            businessTypeValue
        );


    if (
        businessType &&
        company.localeCompare(
            businessType,
            undefined,
            {
                sensitivity:
                    "accent"
            }
        ) === 0
    ) {

        return null;

    }


    return company;

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

                    service
                        .trim()
                        .toLowerCase(),

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


    /* ======================================================
       BUSINESS TYPE FIRST
    ====================================================== */

    lead.tipoNegocio =
        normalizeNullableString(
            extractedLead.tipoNegocio
        );


    /* ======================================================
       CONTACT
    ====================================================== */

    lead.nombre =
        normalizeNullableString(
            extractedLead.nombre
        );


    lead.empresa =
        normalizeCompany(

            extractedLead.empresa,

            lead.tipoNegocio

        );


    lead.email =
        normalizeEmail(
            extractedLead.email
        );


    lead.telefono =
        normalizePhone(
            extractedLead.telefono
        );


    /* ======================================================
       OPPORTUNITY
    ====================================================== */

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

Your only responsibility is to extract commercial facts
from messages written by the VISITOR.

The conversation supplied to you contains ONLY visitor
messages.

Return ONLY valid JSON.

Do not use Markdown.

Do not include explanations.

Do not invent missing information.

If a field is unknown, use null.

For servicioInteres, use an empty array when no official
service can be identified with reasonable confidence.

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
SOURCE OF TRUTH
==========================================================

Only visitor messages are authoritative.

Never invent facts.

Never fill a field merely because it would be useful.

Never transform a suggestion, recommendation or likely
scenario into a customer fact.

==========================================================
NOMBRE
==========================================================

Use nombre only when the visitor explicitly provides
their personal name.

Examples:

"Me llamo Carlos"
→ nombre = "Carlos"

"Soy Carlos"
→ nombre = "Carlos"

Do not infer a name from an email address.

==========================================================
EMPRESA
==========================================================

empresa means the actual commercial name, organization
name, brand name or company name.

Only populate empresa when the visitor clearly provides
a business or organization name.

Examples:

"Mi empresa se llama Restaurante La Plaza"
→ empresa = "Restaurante La Plaza"

"Trabajo en Acme Solutions"
→ empresa = "Acme Solutions"

"Somos Hotel Mirador"
→ empresa = "Hotel Mirador"

IMPORTANT:

A business category is NOT a company name.

Examples:

"Tengo un restaurante"
→ empresa = null
→ tipoNegocio = "Restaurante"

"Tengo un hotel"
→ empresa = null
→ tipoNegocio = "Hotel"

"Soy autónomo"
→ empresa = null
→ tipoNegocio = "Autónomo"

Never put values such as:

"restaurante"
"hotel"
"empresa"
"negocio"
"autónomo"

inside empresa unless the visitor clearly states that
the value is actually the commercial name.

==========================================================
EMAIL
==========================================================

Extract only an email address explicitly provided by
the visitor.

If the input contains presentation markup around the
email, return only the email address itself.

Example:

[carlos@example.com](mailto:carlos@example.com)

must become:

carlos@example.com

==========================================================
TELEFONO
==========================================================

Use only a telephone number explicitly provided by
the visitor.

Do not invent country codes.

Do not modify a number except for harmless whitespace
normalization.

==========================================================
TIPO NEGOCIO
==========================================================

Use tipoNegocio when the visitor clearly identifies
their business category or professional activity.

Examples:

"Tengo un restaurante"
→ tipoNegocio = "Restaurante"

"Gestiono un hotel"
→ tipoNegocio = "Hotel"

"Soy fotógrafo autónomo"
→ tipoNegocio = "Fotografía / profesional autónomo"

==========================================================
PROBLEMA
==========================================================

problema may be a concise summary of a concrete problem,
inefficiency, repetitive process or business need
explicitly described by the visitor.

You may summarize the visitor's wording.

Do not add problems the visitor did not describe.

==========================================================
SERVICIO INTERES
==========================================================

Only use official Yassir Technologic service names from
the allowed list below.

A service may be selected when:

1. The visitor explicitly mentions it.

OR

2. The visitor describes a need that clearly maps to
   that service without speculative assumptions.

Do not classify every problem as Artificial Intelligence.

==========================================================
OBJETIVO
==========================================================

objetivo represents an outcome the VISITOR explicitly
states they want to achieve.

Examples:

"Quiero reducir el tiempo que dedica mi equipo a responder consultas"
→ objetivo may contain that outcome.

"Quiero aumentar las reservas"
→ objetivo may contain that outcome.

IMPORTANT:

Do not create objetivo merely because a likely benefit
exists.

Do not use generic benefits such as:

"improve efficiency"
"increase customer satisfaction"
"save money"
"grow the business"

unless the visitor actually expressed that objective.

If the visitor did not state an objective, use null.

==========================================================
PRESUPUESTO
==========================================================

Only include presupuesto if the visitor explicitly
mentions:

- an amount,
- a range,
- a spending limit,
- or a budget condition.

Never invent a budget.

==========================================================
PLAZO
==========================================================

Only include plazo if the visitor explicitly mentions:

- a date,
- a period,
- a deadline,
- or when they expect the solution.

Never invent a timeline.

==========================================================
COMENTARIOS
==========================================================

Use comentarios only for relevant commercial context
explicitly communicated by the visitor that does not fit
naturally in another field.

Do not duplicate information already stored in another
field unless necessary for meaning.

==========================================================
OFFICIAL SERVICES
==========================================================

${JSON.stringify(
    allowedServices,
    null,
    2
)}

==========================================================
FINAL VALIDATION
==========================================================

Before returning JSON, verify:

- empresa is not merely the same value as tipoNegocio.
- nombre was explicitly provided.
- email was explicitly provided.
- telefono was explicitly provided.
- objetivo came from a visitor statement.
- presupuesto was explicitly provided.
- plazo was explicitly provided.
- no field came from an assistant suggestion.
`;

}


/* ==========================================================
   EXTRACT TECH LEAD
========================================================== */

export async function extractTechLeadWithAI(
    messages = []
) {

    /* ======================================================
       VISITOR MESSAGES ONLY
    ====================================================== */

    const visitorMessages =
        normalizeUserMessages(
            messages
        );


    if (
        visitorMessages.length === 0
    ) {

        return createEmptyTechLead();

    }


    /* ======================================================
       ASSISTANT CONFIGURATION
    ====================================================== */

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


    /* ======================================================
       AI EXTRACTION
    ====================================================== */

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
                                visitorMessages,
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
         * from continuing the conversation.
         */

        console.error(
            "❌ Yassir Technologic lead extraction failed:",
            error
        );


        return createEmptyTechLead();

    }

}