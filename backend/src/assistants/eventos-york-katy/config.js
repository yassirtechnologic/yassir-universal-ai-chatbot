/* ==========================================================
   YASSIR TECH

   File:
   config.js

   Description:
   Eventos York & Katy assistant configuration.

   Responsibility:
   Defines the identity, languages, AI preferences,
   business settings and automation capabilities
   for the Eventos York & Katy assistant.

   Author:
   Yassir Tech

   Version:
   1.0.0
========================================================== */

const eventosYorkKatyConfig = {

    /* ======================================================
       ASSISTANT
    ====================================================== */

    id: "eventos-york-katy",

    assistantName: "Yassir",

    /* ======================================================
       COMPANY
    ====================================================== */

    company: {

        name:
            "Eventos York & Katy",

        website:
            "https://eventosyorkat.com",

        email:
            "eventosyorkat@gmail.com",

        whatsapp:
            "+34666030923",

        locations: [

            "Mallorca",

            "León, Nicaragua"

        ]

    },

    /* ======================================================
       LANGUAGES
    ====================================================== */

    languages: [

        "es",

        "en",

        "de"

    ],

    defaultLanguage:
        "es",

    /* ======================================================
       AI
    ====================================================== */

    ai: {

        model:
            "gpt-4o-mini",

        temperature:
            0.4,

        maxTokens:
            500

    },

    /* ======================================================
       BUSINESS
    ====================================================== */

    business: {

        type:
            "event-services",

        services: [

            "Organización de eventos",

            "Decoración",

            "Catering",

            "DJ",

            "Fotografía",

            "Pastelería",

            "Música",

            "Coordinación",

            "Eventos corporativos",

            "Bodas",

            "Cumpleaños",

            "Comuniones",

            "Bautizos"

        ]

    },

    /* ======================================================
       AUTOMATIONS
    ====================================================== */

    automations: {

        saveLead:
            true,

        sendEmailToBusiness:
            true,

        sendEmailToCustomer:
            true,

        sendWhatsAppToBusiness:
            true,

        sendWhatsAppToCustomer:
            true,

        scheduleAppointments:
            true

    }

};

export default eventosYorkKatyConfig;