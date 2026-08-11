/* ==========================================================
   YASSIR TECH

   File:
   registry.js

   Description:
   Central assistant registry.

   Responsibility:
   Registers every assistant available in the
   Yassir Universal AI Chatbot platform and provides
   safe access to their configuration, prompts
   and knowledge.

   Author:
   Yassir Tech

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   EVENTOS YORK & KATY
========================================================== */

import eventosYorkKatyConfig
    from "./eventos-york-katy/config.js";

import eventosPromptES
    from "./eventos-york-katy/prompts/es.js";

import eventosPromptEN
    from "./eventos-york-katy/prompts/en.js";

import eventosPromptDE
    from "./eventos-york-katy/prompts/de.js";

import eventosServices
    from "./eventos-york-katy/knowledge/services.js";

import eventosPricing
    from "./eventos-york-katy/knowledge/pricing.js";

import eventosFaq
    from "./eventos-york-katy/knowledge/faq.js";


/* ==========================================================
   YASSIR TECHNOLOGIC
========================================================== */

import yassirTechnologicConfig
    from "./yassir-technologic/config.js";

import yassirTechnologicPromptES
    from "./yassir-technologic/prompts/es.js";

import yassirTechnologicPromptEN
    from "./yassir-technologic/prompts/en.js";

import yassirTechnologicServices
    from "./yassir-technologic/knowledge/services.js";

import yassirTechnologicPricing
    from "./yassir-technologic/knowledge/pricing.js";

import yassirTechnologicFaq
    from "./yassir-technologic/knowledge/faq.js";

import yassirTechnologicProducts
    from "./yassir-technologic/knowledge/products.js";

import yassirTechnologicProjects
    from "./yassir-technologic/knowledge/projects.js";


/* ==========================================================
   DEFAULT ASSISTANT
========================================================== */

/*
 * Backward compatibility:
 *
 * Existing clients that do not yet send assistantId
 * will continue using Eventos York & Katy until
 * their frontend has been migrated.
 */

export const DEFAULT_ASSISTANT_ID =
    "eventos-york-katy";


/* ==========================================================
   ASSISTANT REGISTRY
========================================================== */

const ASSISTANTS = {

    /* ======================================================
       EVENTOS YORK & KATY
    ====================================================== */

    "eventos-york-katy": {

        config:
            eventosYorkKatyConfig,

        prompts: {

            es:
                eventosPromptES,

            en:
                eventosPromptEN,

            de:
                eventosPromptDE

        },

        knowledge: {

            services:
                eventosServices,

            pricing:
                eventosPricing,

            faq:
                eventosFaq

        }

    },


    /* ======================================================
       YASSIR TECHNOLOGIC
    ====================================================== */

    "yassir-technologic": {

        config:
            yassirTechnologicConfig,

        prompts: {

            es:
                yassirTechnologicPromptES,

            en:
                yassirTechnologicPromptEN

        },

        knowledge: {

            services:
                yassirTechnologicServices,

            pricing:
                yassirTechnologicPricing,

            faq:
                yassirTechnologicFaq,

            products:
                yassirTechnologicProducts,

            projects:
                yassirTechnologicProjects

        }

    }

};


/* ==========================================================
   NORMALIZE ASSISTANT ID
========================================================== */

function normalizeAssistantId(
    assistantId
) {

    if (
        typeof assistantId !== "string"
    ) {

        return DEFAULT_ASSISTANT_ID;

    }


    const normalized =
        assistantId
            .trim()
            .toLowerCase();


    return normalized ||
        DEFAULT_ASSISTANT_ID;

}


/* ==========================================================
   CHECK ASSISTANT
========================================================== */

export function hasAssistant(
    assistantId
) {

    const normalizedId =
        normalizeAssistantId(
            assistantId
        );


    return Object.prototype.hasOwnProperty.call(
        ASSISTANTS,
        normalizedId
    );

}


/* ==========================================================
   GET ASSISTANT
========================================================== */

export function getAssistant(
    assistantId = DEFAULT_ASSISTANT_ID
) {

    const normalizedId =
        normalizeAssistantId(
            assistantId
        );


    return (
        ASSISTANTS[normalizedId] ??
        null
    );

}


/* ==========================================================
   GET DEFAULT ASSISTANT
========================================================== */

export function getDefaultAssistant() {

    return ASSISTANTS[
        DEFAULT_ASSISTANT_ID
    ];

}


/* ==========================================================
   GET REGISTERED ASSISTANT IDS
========================================================== */

export function getAssistantIds() {

    return Object.keys(
        ASSISTANTS
    );

}