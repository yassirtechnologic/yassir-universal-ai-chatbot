/* ======================================================
   YASSIR TECH

   File:
   smartDecision.js

   Description:
   Smart Conversation Decision Engine.

   Responsibility:
   Analyzes the detected intent and decides
   the next action of the AI Commercial Agent.

   This engine NEVER executes actions.
   It only decides the next conversation step.

   Author:
   Yassir Tech

   Version:
   4.0.0
====================================================== */

import { analyzeIntent } from "./intentAnalyzer.js";

/* ======================================================
   Smart Decision
====================================================== */

export const smartDecision = (

    message = "",

    workflow = {}

) => {

    const intent =

        analyzeIntent(

            message

        );

    switch (

        intent

    ) {

        /* ==========================================
           Greetings
        ========================================== */

        case "GREETING":

            return {

                action: "GREETING",

                intent

            };

        /* ==========================================
           Goodbye
        ========================================== */

        case "GOODBYE":

            return {

                action: "GOODBYE",

                intent

            };

        /* ==========================================
           Confirmation
        ========================================== */

        case "CONFIRMATION":

            return {

                action: "CONTINUE",

                intent

            };

        /* ==========================================
           Negation
        ========================================== */

        case "NEGATION":

            return {

                action: "NEGATION",

                intent

            };

        /* ==========================================
           Price Question
        ========================================== */

        case "ASK_PRICE":

            return {

                action: "ANSWER_PRICE",

                intent

            };

        /* ==========================================
           Services Question
        ========================================== */

        case "ASK_SERVICE":

            return {

                action: "ANSWER_SERVICE",

                intent

            };

        /* ==========================================
           Location Question
        ========================================== */

        case "ASK_LOCATION":

            return {

                action: "ANSWER_LOCATION",

                intent

            };

        /* ==========================================
           Availability Question
        ========================================== */

        case "ASK_AVAILABILITY":

            return {

                action: "ANSWER_AVAILABILITY",

                intent

            };

        /* ==========================================
           Generic Question
        ========================================== */

        case "QUESTION":

            return {

                action: "ANSWER_QUESTION",

                intent

            };

        /* ==========================================
           Topic Change
        ========================================== */

        case "TOPIC_CHANGE":

            return {

                action: "CHANGE_TOPIC",

                intent

            };

        /* ==========================================
           Unknown
        ========================================== */

        case "UNKNOWN":

            return {

                action: "SKIP_FIELD",

                reason: "UNKNOWN",

                intent

            };

        /* ==========================================
           Normal Answer
        ========================================== */

        case "ANSWER":

        default:

            return {

                action: "CONTINUE_WORKFLOW",

                intent

            };

    }

};