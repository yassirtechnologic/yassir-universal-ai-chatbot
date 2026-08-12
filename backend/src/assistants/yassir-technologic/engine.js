/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   engine.js

   Description:
   Yassir Technologic conversation engine.

   Responsibility:
   Processes Yassir Technologic conversations,
   extracts and maintains commercial lead information,
   detects explicit contact intent,
   persists qualified opportunities and generates
   AI responses.

   Author:
   Yassir Technologic

   Version:
   2.2.0
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
    detectTechContactIntent
} from "./contactIntent.js";

import {
    getTechSession,
    updateTechSessionLanguage,
    updateTechSessionLead,
    markTechContactRequested,
    markTechContactRejected,
    markTechLeadPersisted
} from "./session.js";

import {
    sendTechBusinessLeadEmail
} from "./businessEmail.service.js";

import {
    sendTechCustomerConfirmation
} from "./customerEmail.service.js";

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

/*
 * Lightweight language detection for the currently
 * supported Yassir Technologic languages:
 *
 * - Spanish
 * - English
 *
 * Shared technology words such as:
 *
 * - chatbot
 * - software
 * - API
 * - AI
 *
 * are intentionally NOT treated as English indicators.
 *
 * Spanish remains the safe fallback.
 */

function detectLanguage(
    text = ""
) {

    /* ======================================================
       NORMALIZE
    ====================================================== */

    const normalized =
        String(text)
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();


    if (!normalized) {

        return "es";

    }


    /* ======================================================
       SPANISH SIGNALS
    ====================================================== */

    const spanishPatterns = [

        /\bhola\b/,

        /\btengo\b/,

        /\bquiero\b/,

        /\bquisiera\b/,

        /\bnecesito\b/,

        /\bnecesitamos\b/,

        /\bbusco\b/,

        /\bme gustaria\b/,

        /\bpueden\b/,

        /\bpuede\b/,

        /\bcomo\b/,

        /\bpara\b/,

        /\bcon\b/,

        /\buna\b/,

        /\bun\b/,

        /\bmi empresa\b/,

        /\bmi negocio\b/,

        /\brestaurante\b/,

        /\bempresa\b/,

        /\bnegocio\b/,

        /\bproyecto\b/,

        /\bcliente\b/,

        /\bclientes\b/,

        /\breservas\b/,

        /\bautomatizar\b/,

        /\bintegrar\b/,

        /\bimplementar\b/,

        /\bpresupuesto\b/,

        /\bcorreo\b/,

        /\btelefono\b/,

        /\bcontacten\b/,

        /\bllamen\b/,

        /\bayuda\b/,

        /\bayudar\b/

    ];


    /* ======================================================
       ENGLISH SIGNALS
    ====================================================== */

    const englishPatterns = [

        /\bhello\b/,

        /\bhi\b/,

        /\bhey\b/,

        /\bplease\b/,

        /\bi want\b/,

        /\bi need\b/,

        /\bi would like\b/,

        /\bwe want\b/,

        /\bwe need\b/,

        /\bcan you\b/,

        /\bcould you\b/,

        /\bwould you\b/,

        /\bmy business\b/,

        /\bmy company\b/,

        /\bour business\b/,

        /\bour company\b/,

        /\bbusiness\b/,

        /\bcompany\b/,

        /\bproject\b/,

        /\bcustomer\b/,

        /\bcustomers\b/,

        /\breservation\b/,

        /\breservations\b/,

        /\bautomate\b/,

        /\bintegrate\b/,

        /\bimplement\b/,

        /\bbudget\b/,

        /\bphone\b/,

        /\bcall me\b/,

        /\bcontact me\b/,

        /\bhelp me\b/

    ];


    /* ======================================================
       SCORE LANGUAGE SIGNALS
    ====================================================== */

    const spanishScore =
        spanishPatterns.reduce(
            (score, pattern) => {

                return (
                    score +
                    (
                        pattern.test(normalized)
                            ? 1
                            : 0
                    )
                );

            },
            0
        );


    const englishScore =
        englishPatterns.reduce(
            (score, pattern) => {

                return (
                    score +
                    (
                        pattern.test(normalized)
                            ? 1
                            : 0
                    )
                );

            },
            0
        );


    /* ======================================================
       RESOLVE LANGUAGE
    ====================================================== */

    if (
        englishScore >
        spanishScore
    ) {

        return "en";

    }


    /*
     * Spanish is intentionally the fallback because it is
     * Yassir Technologic's default language.
     */

    return "es";

}

/* ==========================================================
   APPLY CONTACT INTENT
========================================================== */

function applyContactIntent({

    conversationId,

    message

}) {

    const contactIntent =
        detectTechContactIntent(
            message
        );


    /* ======================================================
       EXPLICIT CONTACT REQUEST
    ====================================================== */

    if (
        contactIntent.requested === true
    ) {

        markTechContactRequested(
            conversationId
        );


        console.log(
            "📞 Yassir Technologic contact requested:",
            conversationId
        );

    }


    /* ======================================================
       EXPLICIT CONTACT REJECTION
    ====================================================== */

    if (
        contactIntent.rejected === true
    ) {

        markTechContactRejected(
            conversationId
        );


        console.log(
            "🚫 Yassir Technologic contact rejected:",
            conversationId
        );

    }


    return contactIntent;

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

Contact request:

${
    session.contact?.requested === true
        ? "The visitor has explicitly requested commercial contact from the Yassir Technologic team."
        : "The visitor has not explicitly requested commercial contact."
}

IMPORTANT:

A qualified opportunity does not mean that you should
end the conversation immediately.

Continue helping the visitor naturally.

If useful information is still missing, ask only what
is genuinely relevant.

Do not turn the conversation into a form or interrogation.

If the visitor has already requested contact, do not ask
again whether they want to be contacted.

You may acknowledge that their contact request has been
registered, but do not claim that an email, call, meeting
or other external action has already been performed unless
the system explicitly confirms it.
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
   PROCESS COMMERCIAL NOTIFICATIONS
========================================================== */

/*
 * Notifications are intentionally isolated from the
 * conversational flow.
 *
 * A notification failure must never prevent the visitor
 * from receiving a chatbot response.
 */

async function processCommercialNotifications({

    conversationId,

    assistant,

    session,

    language

}) {

    const result = {

        businessEmail: {

            attempted:
                false,

            sent:
                false

        },

        customerEmail: {

            attempted:
                false,

            sent:
                false

        }

    };


    /* ======================================================
       BUSINESS EMAIL
    ====================================================== */

    const businessEmailEnabled =
        assistant.config?.automations
            ?.sendEmailToBusiness === true;


    if (
        businessEmailEnabled &&
        shouldSendTechBusinessEmail(
            conversationId
        )
    ) {

        result.businessEmail.attempted =
            true;


        try {

            const emailResult =
                await sendTechBusinessLeadEmail({

                    lead:
                        session.lead,

                    leadId:
                        session.persistence?.leadId ||
                        null,

                    language

                });


            if (
                emailResult?.success === true
            ) {

                markTechBusinessEmailSent(
                    conversationId
                );


                result.businessEmail.sent =
                    true;

            }

        } catch (error) {

            console.error(
                "❌ Yassir Technologic business email failed:",
                error
            );

        }

    }


    /* ======================================================
       CUSTOMER EMAIL
    ====================================================== */

    const customerEmailEnabled =
        assistant.config?.automations
            ?.sendEmailToCustomer === true;


    if (
        customerEmailEnabled &&
        shouldSendTechCustomerEmail(
            conversationId
        )
    ) {

        result.customerEmail.attempted =
            true;


        try {

            const emailResult =
                await sendTechCustomerConfirmation({

                    lead:
                        session.lead,

                    language

                });


            if (
                emailResult?.success === true
            ) {

                markTechCustomerEmailSent(
                    conversationId
                );


                result.customerEmail.sent =
                    true;

            }

        } catch (error) {

            console.error(
                "❌ Yassir Technologic customer email failed:",
                error
            );

        }

    }


    return result;

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
       CONTACT INTENT
    ====================================================== */

    const contactIntent =
        applyContactIntent({

            conversationId,

            message:
                lastUserMessage

        });


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


    console.log(
        "📞 Yassir Technologic contact state:",
        updatedSession.contact
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
    COMMERCIAL NOTIFICATIONS
    ====================================================== */

    const notifications =
        await processCommercialNotifications({

            conversationId,

            assistant,

            session:
                updatedSession,

            language

        });


    /*
    * Email actions may update notification state.
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

            contactRequested:
                updatedSession.contact
                    ?.requested === true,

            contactDetectedThisMessage:
                contactIntent,

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

        contact: {

            requested:
                updatedSession.contact
                    ?.requested === true,

            detectedThisMessage:
                contactIntent

        },

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

        notifications: {

            businessEmail: {

                attempted:
                    notifications.businessEmail.attempted,

                sent:
                    notifications.businessEmail.sent,

                alreadySent:
                    updatedSession.notifications
                        ?.businessEmailSent === true

            },

            customerEmail: {

                attempted:
                    notifications.customerEmail.attempted,

                sent:
                    notifications.customerEmail.sent,

                alreadySent:
                    updatedSession.notifications
                        ?.customerEmailSent === true

            }

        },

        workflow:
            null,

        actions:
            []

    };

    }