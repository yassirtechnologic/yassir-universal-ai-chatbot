/* ======================================================
   YASSIR TECH

   File:
   intentAnalyzer.js

   Description:
   Intent Analyzer.

   Responsibility:
   Detects the customer's real intention
   before the Workflow Engine decides
   what to do next.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

const UNKNOWN_PATTERNS = [

    "no lo se",
    "no lo sé",
    "nose",
    "ni idea",
    "quien sabe",
    "quién sabe",
    "todavia no",
    "todavía no",
    "aun no",
    "aún no",
    "mas tarde",
    "más tarde",
    "despues",
    "después",
    "luego",
    "no tengo idea",
    "no tengo ni idea",
    "no sabria decirte",
    "no sabría decirte",
    "no estoy seguro",
    "no estoy segura"

];

const CONFIRMATION_PATTERNS = [

    "si",
    "sí",
    "claro",
    "vale",
    "ok",
    "perfecto",
    "correcto"

];

const NEGATION_PATTERNS = [

    "no",
    "nop",
    "negativo"

];

export const analyzeIntent = (text = "") => {

    const message =
        text
            .toLowerCase()
            .trim();

    /* ===========================
       UNKNOWN
    =========================== */

    if (

        UNKNOWN_PATTERNS.some(

            pattern =>

                message.includes(pattern)

        )

    ) {

        return "UNKNOWN";

    }

    /* ===========================
       CONFIRMATION
    =========================== */

    if (

        CONFIRMATION_PATTERNS.includes(

            message

        )

    ) {

        return "CONFIRMATION";

    }

    /* ===========================
       NEGATION
    =========================== */

    if (

        NEGATION_PATTERNS.includes(

            message

        )

    ) {

        return "NEGATION";

    }

    /* ===========================
       QUESTION
    =========================== */

    if (

        message.includes("?") ||

        message.includes("cuanto") ||

        message.includes("cuánto") ||

        message.includes("precio")

    ) {

        return "QUESTION";

    }

    /* ===========================
       CHANGE TOPIC
    =========================== */

    if (

        message.includes("tambien") ||

        message.includes("también") ||

        message.includes("otra cosa")

    ) {

        return "TOPIC_CHANGE";

    }

    return "ANSWER";

};