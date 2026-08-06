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

/* ======================================================
   Greeting
====================================================== */

const GREETING_PATTERNS = [

    "hola",

    "buenas",

    "buenos dias",

    "buenos días",

    "buenas tardes",

    "buenas noches",

    "hey",

    "hello"

];

/* ======================================================
   Goodbye
====================================================== */

const GOODBYE_PATTERNS = [

    "adios",

    "adiós",

    "hasta luego",

    "nos vemos",

    "gracias",

    "muchas gracias",

    "bye",

    "hasta pronto"

];

/* ======================================================
   Ask Price
====================================================== */

const ASK_PRICE_PATTERNS = [

    "precio",

    "precios",

    "cuánto cuesta",

    "coste",

    "valor",

    "tarifa",

    "cuanto vale",

    "cuanto costaria",

    "costaria",

    "costaría",

    "costo",

    "costos",

    "vale",

    "cotizacion",

    "presupuesto"

];

/* ======================================================
   Ask Services
====================================================== */

const ASK_SERVICE_PATTERNS = [

    "servicio",

    "servicios",

    "catering",

    "decoracion",

    "decoración",

    "fotografia",

    "fotografía",

    "dj",

    "musica",

    "música",

    "animacion",

    "organizacion",

    "organización",

    "barra libre",

    "fotografo",

    "fotógrafo",

    "video",

    "vídeo",

    "musica en vivo",
    
    "música en vivo",

    "animación"

];

/* ======================================================
   Ask Location
====================================================== */

const ASK_LOCATION_PATTERNS = [

    "donde estan",

    "dónde están",

    "ubicacion",

    "ubicación",

    "direccion",

    "dirección",

    "donde se encuentran"

];

/* ======================================================
   Ask Availability
====================================================== */

const ASK_AVAILABILITY_PATTERNS = [

    "disponibilidad",

    "disponible",

    "tienen fecha",

    "teneis fecha",

    "tenéis fecha",

    "libre"

];

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
       GREETING
    =========================== */

    if (
        GREETING_PATTERNS.some(
            pattern => message.includes(pattern)
        )
    ) {
        return "GREETING";
    }

    /* ===========================
       GOODBYE
    =========================== */

    if (
        GOODBYE_PATTERNS.some(
            pattern => message.includes(pattern)
        )
    ) {
        return "GOODBYE";
    }

    /* ===========================
       ASK PRICE
       (Alta prioridad)
    =========================== */

    if (
        ASK_PRICE_PATTERNS.some(
            pattern => message.includes(pattern)
        )
    ) {
        return "ASK_PRICE";
    }

    /* ===========================
       ASK SERVICES
    =========================== */

    if (
        ASK_SERVICE_PATTERNS.some(
            pattern => message.includes(pattern)
        )
    ) {
        return "ASK_SERVICE";
    }

    /* ===========================
       ASK LOCATION
    =========================== */

    if (
        ASK_LOCATION_PATTERNS.some(
            pattern => message.includes(pattern)
        )
    ) {
        return "ASK_LOCATION";
    }

    /* ===========================
       ASK AVAILABILITY
    =========================== */

    if (
        ASK_AVAILABILITY_PATTERNS.some(
            pattern => message.includes(pattern)
        )
    ) {
        return "ASK_AVAILABILITY";
    }

    /* ===========================
       UNKNOWN
    =========================== */

    if (
        UNKNOWN_PATTERNS.some(
            pattern => message.includes(pattern)
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
        message.includes("¿") ||
        message.includes("como") ||
        message.includes("cómo") ||
        message.includes("cuando") ||
        message.includes("cuándo") ||
        message.includes("donde") ||
        message.includes("dónde")
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