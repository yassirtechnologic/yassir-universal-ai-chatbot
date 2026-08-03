/* ======================================================
   YASSIR TECH

   File:
   smartDecision.js

   Description:
   Smart Conversation Decision Engine.

   Responsibility:
   Makes the workflow decision based on
   the detected user intent.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import { analyzeIntent } from "./intentAnalyzer.js";

export const smartDecision = (

    message = "",

    workflow

) => {

    const intent =
        analyzeIntent(message);

    switch (intent) {

        case "UNKNOWN":

            return {

                action: "SKIP_FIELD",

                reason: "UNKNOWN",

                intent

            };

        case "CONFIRMATION":

            return {

                action: "CONTINUE",

                intent

            };

        case "NEGATION":

            return {

                action: "NEGATION",

                intent

            };

        case "QUESTION":

            return {

                action: "ANSWER_QUESTION",

                intent

            };

        case "TOPIC_CHANGE":

            return {

                action: "CHANGE_TOPIC",

                intent

            };

        case "ANSWER":

        default:

            return {

                action: "NORMAL",

                intent

            };

    }

};