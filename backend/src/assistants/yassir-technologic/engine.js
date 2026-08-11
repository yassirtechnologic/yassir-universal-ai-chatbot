/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   engine.js

   Description:
   Yassir Technologic conversation engine.

   Responsibility:
   Processes conversations for the Yassir Technologic
   assistant using its own prompt, knowledge and AI
   configuration without depending on the Eventos
   York & Katy workflow.

   Author:
   Yassir Technologic

   Version:
   1.0.0
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
 * Yassir Technologic currently supports:
 *
 * - Spanish
 * - English
 *
 * This detector is intentionally conservative.
 * Spanish remains the safe default.
 */

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
       OPENAI CONVERSATION
    ====================================================== */

    const conversation = [

        {

            role:
                "system",

            content:
                systemPrompt

        },

        ...cleanMessages

    ];


    /* ======================================================
       AI CONFIGURATION
    ====================================================== */

    const aiConfig =
        assistant.config?.ai || {};


    /* ======================================================
       OPENAI REQUEST
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

            messages:
                cleanMessages.length

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

        /*
         * Dedicated technology lead extraction
         * will be implemented in a later phase.
         */

        lead:
            null,

        workflow:
            null,

        actions:
            []

    };

}