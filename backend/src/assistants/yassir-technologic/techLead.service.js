/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   techLead.service.js

   Description:
   Yassir Technologic commercial lead persistence service.

   Responsibility:
   Creates and updates qualified technology opportunities
   generated through Yassir AI conversations.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import fs from "fs";
import crypto from "crypto";

import {
    fileURLToPath
} from "url";


/* ==========================================================
   CONSTANTS
========================================================== */

const ASSISTANT_ID =
    "yassir-technologic";


/* ==========================================================
   STORAGE FILE
========================================================== */

/*
 * Storage is currently JSON-based for development.
 *
 * The path is resolved relative to this module rather
 * than process.cwd(), making it independent from the
 * directory used to start the Node.js process.
 */

const leadsFile =
    fileURLToPath(
        new URL(
            "../../../data/tech-leads.json",
            import.meta.url
        )
    );


/* ==========================================================
   ENSURE STORAGE
========================================================== */

function ensureStorage() {

    const directory =
        fileURLToPath(
            new URL(
                "../../../data/",
                import.meta.url
            )
        );


    if (
        !fs.existsSync(
            directory
        )
    ) {

        fs.mkdirSync(
            directory,
            {
                recursive:
                    true
            }
        );

    }


    if (
        !fs.existsSync(
            leadsFile
        )
    ) {

        fs.writeFileSync(
            leadsFile,
            "[]",
            "utf8"
        );

    }

}


/* ==========================================================
   READ LEADS
========================================================== */

function readLeads() {

    ensureStorage();


    try {

        const raw =
            fs.readFileSync(
                leadsFile,
                "utf8"
            );


        const data =
            JSON.parse(
                raw || "[]"
            );


        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        console.error(
            "❌ Tech Lead Storage Read:",
            error
        );


        return [];

    }

}


/* ==========================================================
   WRITE LEADS
========================================================== */

function writeLeads(
    leads
) {

    ensureStorage();


    /*
     * Write to a temporary file first.
     *
     * This reduces the risk of leaving the main JSON
     * file partially written if the process is interrupted.
     */

    const temporaryFile =
        `${leadsFile}.tmp`;


    fs.writeFileSync(
        temporaryFile,

        JSON.stringify(
            leads,
            null,
            2
        ),

        "utf8"
    );


    fs.renameSync(
        temporaryFile,
        leadsFile
    );

}


/* ==========================================================
   NORMALIZE STRING
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
   NORMALIZE SERVICES
========================================================== */

function normalizeServices(
    services
) {

    if (
        !Array.isArray(
            services
        )
    ) {

        return [];

    }


    return [

        ...new Set(

            services
                .filter(
                    (service) =>
                        typeof service === "string"
                )
                .map(
                    (service) =>
                        service.trim()
                )
                .filter(Boolean)

        )

    ];

}


/* ==========================================================
   BUILD LEAD DATA
========================================================== */

function buildLeadData(
    lead = {}
) {

    return {

        nombre:
            normalizeNullableString(
                lead.nombre
            ),

        empresa:
            normalizeNullableString(
                lead.empresa
            ),

        email:
            normalizeNullableString(
                lead.email
            )?.toLowerCase() ||
            null,

        telefono:
            normalizeNullableString(
                lead.telefono
            ),

        tipoNegocio:
            normalizeNullableString(
                lead.tipoNegocio
            ),

        problema:
            normalizeNullableString(
                lead.problema
            ),

        servicioInteres:
            normalizeServices(
                lead.servicioInteres
            ),

        objetivo:
            normalizeNullableString(
                lead.objetivo
            ),

        presupuesto:
            normalizeNullableString(
                lead.presupuesto
            ),

        plazo:
            normalizeNullableString(
                lead.plazo
            ),

        comentarios:
            normalizeNullableString(
                lead.comentarios
            )

    };

}


/* ==========================================================
   FIND BY CONVERSATION
========================================================== */

function findLeadIndexByConversation(
    leads,
    conversationId
) {

    return leads.findIndex(
        (record) => {

            return (
                record.assistantId ===
                    ASSISTANT_ID &&

                record.conversationId ===
                    conversationId
            );

        }
    );

}


/* ==========================================================
   UPSERT TECH LEAD
========================================================== */

/*
 * One conversation represents one commercial opportunity.
 *
 * If the conversation has already been persisted,
 * the existing record is updated rather than duplicated.
 */

export async function upsertTechLead({

    conversationId,

    lead,

    language =
        "es",

    qualified =
        false

}) {

    try {

        if (
            typeof conversationId !== "string" ||
            !conversationId.trim()
        ) {

            throw new Error(
                "conversationId is required."
            );

        }


        const normalizedConversationId =
            conversationId.trim();


        const leads =
            readLeads();


        const now =
            new Date().toISOString();


        const leadData =
            buildLeadData(
                lead
            );


        const existingIndex =
            findLeadIndexByConversation(
                leads,
                normalizedConversationId
            );


        /* ==================================================
           UPDATE EXISTING OPPORTUNITY
        ================================================== */

        if (
            existingIndex >= 0
        ) {

            const existing =
                leads[
                    existingIndex
                ];


            const updatedLead = {

                ...existing,

                ...leadData,

                assistantId:
                    ASSISTANT_ID,

                conversationId:
                    normalizedConversationId,

                language:
                    language === "en"
                        ? "en"
                        : "es",

                qualified:
                    Boolean(
                        qualified
                    ),

                updatedAt:
                    now

            };


            leads[
                existingIndex
            ] = updatedLead;


            writeLeads(
                leads
            );


            return {

                saved:
                    true,

                created:
                    false,

                updated:
                    true,

                lead:
                    updatedLead

            };

        }


        /* ==================================================
           CREATE NEW OPPORTUNITY
        ================================================== */

        const newLead = {

            id:
                crypto.randomUUID(),

            assistantId:
                ASSISTANT_ID,

            conversationId:
                normalizedConversationId,

            createdAt:
                now,

            updatedAt:
                now,

            status:
                "Nuevo",

            source:
                "Yassir Technologic Website Chatbot",

            language:
                language === "en"
                    ? "en"
                    : "es",

            qualified:
                Boolean(
                    qualified
                ),

            ...leadData

        };


        leads.push(
            newLead
        );


        writeLeads(
            leads
        );


        return {

            saved:
                true,

            created:
                true,

            updated:
                false,

            lead:
                newLead

        };

    } catch (error) {

        console.error(
            "❌ Yassir Technologic Lead Service:",
            error
        );


        return {

            saved:
                false,

            created:
                false,

            updated:
                false,

            error:
                error.message

        };

    }

}