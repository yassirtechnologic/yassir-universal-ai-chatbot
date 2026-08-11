/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   engine.js

   Description:
   Yassir Technologic conversation engine.

   Responsibility:
   Processes Yassir Technologic conversations,
   extracts and maintains commercial lead information,
   persists qualified opportunities and generates
   AI responses.

   Author:
   Yassir Technologic

   Version:
   2.1.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import {
    getAssistant
} from "../registry.js";

import {
    buildPrompt
} from "../../conversation/promptBuilder.js";

import {
    sendToOpenAI
} from "../../services/openai.service.js";

import {
    extractTechLeadWithAI
} from "./leadExtractor.js";

import {
    mergeTechLead
} from "./leadMerger.js";

import {
    getTechSession,
    updateTechSessionLanguage,
    updateTechSessionLead,
    markTechLeadPersisted
} from "./session.js";

import {
    upsertTechLead
} from "./techLead.service.js";


/* ==========================================================
   CONSTANTS
========================================================== */

const ASSISTANT_ID =
    "yassir-technologic";


/* ==========================================================
   NORMALIZE MESSAGES
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
                        ? message.content.trim()
                        : ""

            };

        })
        .filter((message) => {

            return Boolean(
                message.content
            );

        });

}


/* ==========================================================
   GET LAST USER MESSAGE
========================================================== */

function getLastUserMessage(
    messages
) {

    for (
        let index = messages.length - 1;
        index >= 0;
        index--
    ) {

        if (
            messages[index].role === "user"
        ) {

            return messages[index].content;

        }

    }


    return "";

}


/* ==========================================================
   DETECT LANGUAGE
========================================================== */

function detectLanguage(
    text = ""
) {

    const normalized =
        String(text)
            .toLowerCase()
            .trim();


    const englishPattern =
        /\b(hello|hi|hey|please|business|company|project|software|website|automation|automate|chatbot|price|cost|service|services|help|need|want)\b/i;


    if (
        englishPattern.test(
            normalized
        )
    ) {

        return "en";

    }


    return "es";

}


/* ==========================================================
   BUILD COMMERCIAL CONTEXT
========================================================== */

function buildCommercialContext(
    session
) {

    return `
==========================================================
INTERNAL COMMERCIAL CONVERSATION STATE
==========================================================

The following information has already been identified
during the current conversation.

Do not display this object to the visitor.

Do not mention internal lead extraction.

Do not ask again for information that is already known.

Use this information only to make the conversation
more coherent and commercially useful.

Lead:

${JSON.stringify(
    session.lead,
    null,
    2
)}

Commercial qualification:

${
    session.qualified
        ? "The opportunity currently has enough basic information to be considered qualified."
        : "The opportunity is not yet basically qualified."
}

IMPORTANT:

A qualified opportunity does not mean that you should
end the conversation immediately.

Continue helping the visitor naturally.

If useful information is still missing, ask only what
is genuinely relevant.

Do not turn the conversation into a form or interrogation.
`;

}


/* ==========================================================
   PERSIST QUALIFIED OPPORTUNITY
========================================================== */

async function persistQualifiedOpportunity({

    conversationId,

    session,

    language

}) {

    if (
        session.qualified !== true
    ) {

        return {

            attempted:
                false,

            saved:
                false,

            created:
                false,

            updated:
                false,

            result:
                null

        };

    }


    const result =
        await upsertTechLead({

            conversationId,

            lead:
                session.lead,

            language,

            qualified:
                session.qualified

        });


    if (
        !result?.saved
    ) {

        console.error(
            "❌ Yassir Technologic opportunity persistence failed:",
            result
        );


        return {

            attempted:
                true,

            saved:
                false,

            created:
                false,

            updated:
                false,

            result

        };

    }


    markTechLeadPersisted(

        conversationId,

        result.lead

    );


    console.log(
        result.created
            ? "💾 Yassir Technologic opportunity created:"
            : "🔄 Yassir Technologic opportunity updated:",
        result.lead?.id
    );


    return {

        attempted:
            true,

        saved:
            true,

        created:
            Boolean(
                result.created
            ),

        updated:
            Boolean(
                result.updated
            ),

        result

    };

}


/* ==========================================================
   PROCESS YASSIR TECHNOLOGIC CONVERSATION
========================================================== */

export async function processYassirTechnologicConversation({

    conversationId,

    messages = []

}) {

    /* ======================================================
       ASSISTANT
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


    /* ======================================================
       MESSAGES
    ====================================================== */

    const cleanMessages =
        normalizeMessages(
            messages
        );


    if (
        cleanMessages.length === 0
    ) {

        throw new Error(
            "At least one conversation message is required."
        );

    }


    /* ======================================================
       LAST USER MESSAGE
    ====================================================== */

    const lastUserMessage =
        getLastUserMessage(
            cleanMessages
        );


    if (!lastUserMessage) {

        throw new Error(
            "A user message is required."
        );

    }


    /* ======================================================
       LANGUAGE
    ====================================================== */

    const language =
        detectLanguage(
            lastUserMessage
        );


    updateTechSessionLanguage(
        conversationId,
        language
    );


    /* ======================================================
       CURRENT SESSION
    ====================================================== */

    const currentSession =
        getTechSession(
            conversationId
        );


    /* ======================================================
       EXTRACT COMMERCIAL LEAD
    ====================================================== */

    const extractedLead =
        await extractTechLeadWithAI(
            cleanMessages
        );


    console.log(
        "🟢 Yassir Technologic extracted lead:",
        extractedLead
    );


    /* ======================================================
       MERGE COMMERCIAL LEAD
    ====================================================== */

    const mergedLead =
        mergeTechLead(

            currentSession.lead,

            extractedLead

        );


    /* ======================================================
       SAVE LEAD IN SESSION
    ====================================================== */

    let updatedSession =
        updateTechSessionLead(

            conversationId,

            mergedLead

        );


    console.log(
        "🔵 Yassir Technologic lead:",
        updatedSession.lead
    );


    console.log(
        "🎯 Yassir Technologic qualified:",
        updatedSession.qualified
    );


    /* ======================================================
       PERSIST QUALIFIED OPPORTUNITY
    ====================================================== */

    const persistence =
        await persistQualifiedOpportunity({

            conversationId,

            session:
                updatedSession,

            language

        });


    /*
     * Persistence may update the session with
     * saved, leadId, savedAt and updatedAt.
     */

    updatedSession =
        getTechSession(
            conversationId
        );


    /* ======================================================
       SYSTEM PROMPT
    ====================================================== */

    const systemPrompt =
        buildPrompt({

            assistantId:
                ASSISTANT_ID,

            language

        });


    /* ======================================================
       COMMERCIAL CONTEXT
    ====================================================== */

    const commercialContext =
        buildCommercialContext(
            updatedSession
        );


    /* ======================================================
       OPENAI CONVERSATION
    ====================================================== */

    const conversation = [

        {

            role:
                "system",

            content:
                systemPrompt

        },

        {

            role:
                "system",

            content:
                commercialContext

        },

        ...cleanMessages

    ];


    /* ======================================================
       AI CONFIGURATION
    ====================================================== */

    const aiConfig =
        assistant.config?.ai || {};


    /* ======================================================
       GENERATE RESPONSE
    ====================================================== */

    const reply =
        await sendToOpenAI({

            messages:
                conversation,

            model:
                aiConfig.model ||
                "gpt-4o-mini",

            temperature:
                aiConfig.temperature ??
                0.4,

            maxTokens:
                aiConfig.maxTokens ??
                700

        });


    /* ======================================================
       DEBUG
    ====================================================== */

    console.log(
        "🤖 Yassir Technologic conversation:",
        {

            conversationId,

            language,

            messageCount:
                cleanMessages.length,

            qualified:
                updatedSession.qualified,

            persisted:
                updatedSession.persistence
                    ?.saved === true,

            leadId:
                updatedSession.persistence
                    ?.leadId || null

        }
    );


    /* ======================================================
       RESULT
    ====================================================== */

    return {

        success:
            true,

        assistantId:
            ASSISTANT_ID,

        language,

        reply,

        lead:
            updatedSession.lead,

        qualified:
            updatedSession.qualified,

        persistence: {

            saved:
                updatedSession.persistence
                    ?.saved === true,

            leadId:
                updatedSession.persistence
                    ?.leadId || null,

            created:
                persistence.created,

            updated:
                persistence.updated

        },

        workflow:
            null,

        actions:
            []

    };

}