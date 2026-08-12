/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   contactIntent.js

   Description:
   Yassir Technologic contact intent detector.

   Responsibility:
   Detects whether a visitor has explicitly requested
   commercial follow-up or direct contact from the
   Yassir Technologic team.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   NORMALIZE TEXT
========================================================== */

/*
 * Text is normalized so expressions can be detected
 * consistently regardless of:
 *
 * - uppercase / lowercase
 * - accents
 * - punctuation
 * - repeated spaces
 */

function normalizeText(
    text = ""
) {

    if (
        typeof text !== "string"
    ) {

        return "";

    }


    return text
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^\p{L}\p{N}@+]+/gu,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* ==========================================================
   NEGATIVE CONTACT PATTERNS
========================================================== */

/*
 * Negative expressions are evaluated BEFORE positive
 * expressions.
 *
 * Example:
 *
 * "No quiero que me contacten"
 *
 * contains:
 *
 * "quiero que me contacten"
 *
 * but must never be interpreted as contact consent.
 */

const NEGATIVE_CONTACT_PATTERNS = [

    /* ======================================================
       SPANISH
    ====================================================== */

    /\bno quiero que me contacten\b/,

    /\bno quiero que me llamen\b/,

    /\bno me contacten\b/,

    /\bno me llamen\b/,

    /\bno quiero recibir correos\b/,

    /\bno quiero recibir emails\b/,

    /\bno quiero una llamada\b/,

    /\bno quiero una reunion\b/,

    /\bno quiero una consulta\b/,

    /\bno deseo que me contacten\b/,

    /\bno deseo recibir llamadas\b/,

    /\bno deseo recibir correos\b/,


    /* ======================================================
       ENGLISH
    ====================================================== */

    /\bdo not contact me\b/,

    /\bdon t contact me\b/,

    /\bdo not call me\b/,

    /\bdon t call me\b/,

    /\bdo not email me\b/,

    /\bdon t email me\b/,

    /\bi do not want to be contacted\b/,

    /\bi don t want to be contacted\b/,

    /\bi do not want a call\b/,

    /\bi don t want a call\b/,

    /\bi do not want a meeting\b/,

    /\bi don t want a meeting\b/

];


/* ==========================================================
   POSITIVE CONTACT PATTERNS
========================================================== */

/*
 * Patterns intentionally require explicit commercial
 * contact intent.
 *
 * Generic phrases such as:
 *
 * "sí"
 * "quiero continuar"
 * "me interesa"
 *
 * are NOT enough on their own.
 *
 * This reduces false positives.
 */

const POSITIVE_CONTACT_PATTERNS = [

    /* ======================================================
       SPANISH — GENERAL CONTACT
    ====================================================== */

    /\bquiero que me contacten\b/,

    /\bquiero que contacten conmigo\b/,

    /\bpueden contactarme\b/,

    /\bpuede contactarme\b/,

    /\bme pueden contactar\b/,

    /\bpueden ponerse en contacto conmigo\b/,

    /\bquiero hablar con ustedes\b/,

    /\bquiero hablar con vuestro equipo\b/,

    /\bquiero hablar con su equipo\b/,

    /\bquiero hablar con alguien\b/,

    /\bquiero que alguien me contacte\b/,

    /\bme gustaria que me contacten\b/,

    /\bme gustaria que contacten conmigo\b/,


    /* ======================================================
       SPANISH — PHONE
    ====================================================== */

    /\bpueden llamarme\b/,

    /\bpuede llamarme\b/,

    /\bme pueden llamar\b/,

    /\bquiero que me llamen\b/,

    /\bme gustaria que me llamen\b/,

    /\bquiero una llamada\b/,

    /\bquiero recibir una llamada\b/,


    /* ======================================================
       SPANISH — EMAIL
    ====================================================== */

    /\bpueden escribirme\b/,

    /\bpuede escribirme\b/,

    /\bpueden enviarme un correo\b/,

    /\bpueden enviarme un email\b/,

    /\bquiero que me envien un correo\b/,

    /\bquiero que me envien un email\b/,

    /\bme pueden enviar informacion\b/,

    /\bquiero recibir mas informacion\b/,


    /* ======================================================
       SPANISH — CONSULTATION / MEETING
    ====================================================== */

    /\bquiero una consulta\b/,

    /\bquiero solicitar una consulta\b/,

    /\bquiero programar una consulta\b/,

    /\bquiero concertar una consulta\b/,

    /\bquiero agendar una consulta\b/,

    /\bquiero una reunion\b/,

    /\bquiero programar una reunion\b/,

    /\bquiero concertar una reunion\b/,

    /\bquiero agendar una reunion\b/,

    /\bme gustaria una consulta\b/,

    /\bme gustaria programar una consulta\b/,

    /\bme gustaria una reunion\b/,


    /* ======================================================
       ENGLISH — GENERAL CONTACT
    ====================================================== */

    /\bi want you to contact me\b/,

    /\bi would like you to contact me\b/,

    /\bplease contact me\b/,

    /\byou can contact me\b/,

    /\bcan you contact me\b/,

    /\bi would like to speak with your team\b/,

    /\bi want to speak with your team\b/,

    /\bi would like to talk to someone\b/,

    /\bi want to talk to someone\b/,


    /* ======================================================
       ENGLISH — PHONE
    ====================================================== */

    /\bplease call me\b/,

    /\byou can call me\b/,

    /\bcan you call me\b/,

    /\bi would like a call\b/,

    /\bi want a call\b/,

    /\bi would like someone to call me\b/,


    /* ======================================================
       ENGLISH — EMAIL
    ====================================================== */

    /\bplease email me\b/,

    /\byou can email me\b/,

    /\bcan you email me\b/,

    /\bi would like more information by email\b/,

    /\bi want more information by email\b/,


    /* ======================================================
       ENGLISH — CONSULTATION / MEETING
    ====================================================== */

    /\bi want a consultation\b/,

    /\bi would like a consultation\b/,

    /\bi want to schedule a consultation\b/,

    /\bi would like to schedule a consultation\b/,

    /\bi want a meeting\b/,

    /\bi would like a meeting\b/,

    /\bi want to schedule a meeting\b/,

    /\bi would like to schedule a meeting\b/

];


/* ==========================================================
   MATCH PATTERNS
========================================================== */

function matchesAnyPattern(
    text,
    patterns
) {

    return patterns.some(
        (pattern) => {

            return pattern.test(
                text
            );

        }
    );

}


/* ==========================================================
   DETECT CONTACT INTENT
========================================================== */

/*
 * Returns a structured result instead of only a boolean.
 *
 * This makes debugging easier and gives the engine
 * additional context without exposing implementation
 * details to the visitor.
 */

export function detectTechContactIntent(
    message = ""
) {

    const normalized =
        normalizeText(
            message
        );


    if (!normalized) {

        return {

            requested:
                false,

            rejected:
                false

        };

    }


    /* ======================================================
       EXPLICIT REJECTION
    ====================================================== */

    if (
        matchesAnyPattern(
            normalized,
            NEGATIVE_CONTACT_PATTERNS
        )
    ) {

        return {

            requested:
                false,

            rejected:
                true

        };

    }


    /* ======================================================
       EXPLICIT REQUEST
    ====================================================== */

    if (
        matchesAnyPattern(
            normalized,
            POSITIVE_CONTACT_PATTERNS
        )
    ) {

        return {

            requested:
                true,

            rejected:
                false

        };

    }


    /* ======================================================
       NO CONTACT INTENT
    ====================================================== */

    return {

        requested:
            false,

        rejected:
            false

    };

}