/* ==========================================================
   YASSIR TECH

   File:
   promptBuilder.js

   Description:
   Multi-assistant system prompt builder.

   Responsibility:
   Builds the complete system prompt for the selected
   assistant by combining its identity, instructions
   and business knowledge.

   Author:
   Yassir Tech

   Version:
   4.0.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import {

    DEFAULT_ASSISTANT_ID,

    getAssistant

} from "../assistants/registry.js";


/* ==========================================================
   RESOLVE BUILD OPTIONS
========================================================== */

/*
 * Supports both:
 *
 * Legacy:
 *
 * buildPrompt("es")
 *
 * New architecture:
 *
 * buildPrompt({
 *     assistantId: "yassir-technologic",
 *     language: "es"
 * })
 *
 * This keeps Eventos York & Katy working while
 * the rest of the backend is migrated.
 */

function resolveBuildOptions(
    input = {}
) {

    /* ======================================================
       LEGACY CALL
    ====================================================== */

    if (
        typeof input === "string"
    ) {

        return {

            assistantId:
                DEFAULT_ASSISTANT_ID,

            language:
                input

        };

    }


    /* ======================================================
       NEW CALL
    ====================================================== */

    return {

        assistantId:
            input?.assistantId ||
            DEFAULT_ASSISTANT_ID,

        language:
            input?.language ||
            "es"

    };

}


/* ==========================================================
   RESOLVE LANGUAGE
========================================================== */

function resolveLanguage(
    assistant,
    requestedLanguage
) {

    const config =
        assistant.config;


    const supportedLanguages =
        Array.isArray(
            config?.languages
        )
            ? config.languages
            : [];


    const normalizedLanguage =
        String(
            requestedLanguage || ""
        )
            .trim()
            .toLowerCase();


    /* ======================================================
       REQUESTED LANGUAGE SUPPORTED
    ====================================================== */

    if (
        supportedLanguages.includes(
            normalizedLanguage
        ) &&
        assistant.prompts?.[
            normalizedLanguage
        ]
    ) {

        return normalizedLanguage;

    }


    /* ======================================================
       DEFAULT LANGUAGE
    ====================================================== */

    const defaultLanguage =
        config?.defaultLanguage ||
        "es";


    if (
        assistant.prompts?.[
            defaultLanguage
        ]
    ) {

        return defaultLanguage;

    }


    /* ======================================================
       LAST SAFE FALLBACK
    ====================================================== */

    const availableLanguages =
        Object.keys(
            assistant.prompts || {}
        );


    if (
        availableLanguages.length > 0
    ) {

        return availableLanguages[0];

    }


    throw new Error(
        `No prompts available for assistant "${config?.id || "unknown"}".`
    );

}


/* ==========================================================
   BUILD KNOWLEDGE CONTEXT
========================================================== */

function buildKnowledgeContext(
    assistant
) {

    const {
        config = {},
        knowledge = {}
    } = assistant;


    /*
     * Only business-relevant information is included
     * in the AI context.
     *
     * Internal AI settings such as model,
     * temperature or maxTokens do not need
     * to be exposed inside the system prompt.
     */

    const context = {

        assistant: {

            id:
                config.id,

            name:
                config.assistantName

        },


        company:
            config.company || {},


        business:
            config.business || {},


        commercial:
            config.commercial || {},


        services:
            knowledge.services || [],


        pricing:
            knowledge.pricing || {},


        faq:
            knowledge.faq || []

    };


    /* ======================================================
       OPTIONAL PRODUCTS
    ====================================================== */

    if (
        Array.isArray(
            knowledge.products
        ) &&
        knowledge.products.length > 0
    ) {

        context.products =
            knowledge.products;

    }


    /* ======================================================
       OPTIONAL PROJECTS
    ====================================================== */

    if (
        Array.isArray(
            knowledge.projects
        ) &&
        knowledge.projects.length > 0
    ) {

        context.projects =
            knowledge.projects;

    }


    return context;

}


/* ==========================================================
   BUILD PROMPT
========================================================== */

export const buildPrompt = (
    input = {}
) => {

    /* ======================================================
       OPTIONS
    ====================================================== */

    const {

        assistantId,

        language

    } = resolveBuildOptions(
        input
    );


    /* ======================================================
       ASSISTANT
    ====================================================== */

    const assistant =
        getAssistant(
            assistantId
        );


    if (!assistant) {

        throw new Error(
            `Unknown assistant: "${assistantId}".`
        );

    }


    /* ======================================================
       LANGUAGE
    ====================================================== */

    const resolvedLanguage =
        resolveLanguage(
            assistant,
            language
        );


    /* ======================================================
       BASE PROMPT
    ====================================================== */

    const basePrompt =
        assistant.prompts[
            resolvedLanguage
        ];


    /* ======================================================
       KNOWLEDGE
    ====================================================== */

    const knowledgeContext =
        buildKnowledgeContext(
            assistant
        );


    /* ======================================================
       COMPLETE SYSTEM PROMPT
    ====================================================== */

    return `
${basePrompt}

==========================================================
BUSINESS KNOWLEDGE
==========================================================

The following structured information is authoritative business
context for this assistant.

Use it when answering questions.

Do not invent information that is not supported by this context.

${JSON.stringify(
    knowledgeContext,
    null,
    2
)}
`;

};