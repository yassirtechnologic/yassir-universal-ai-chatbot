/* ======================================================
   YASSIR TECH

   File:
   chatbot.config.js

   Description:
   Global configuration for the chatbot.

   Responsibility:
   Stores all business information, AI settings,
   contact details and supported languages.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

const chatbotConfig = {

    /* ==========================================
       COMPANY
    ========================================== */

    company: {

        name: "Eventos York & Katy",

        assistantName: "Yassir",

        website: "https://eventosyorkat.com",

        email: "eventosyorkat@gmail.com",

        whatsapp: "+34666030923",

        locations: [

            "Mallorca",

            "León, Nicaragua"

        ]

    },

    /* ==========================================
       AI
    ========================================== */

    ai: {

        model: "gpt-4o-mini",

        temperature: 0.4,

        maxTokens: 500

    },

    /* ==========================================
       LANGUAGES
    ========================================== */

    languages: [

        "es",

        "en",

        "de"

    ],

    defaultLanguage: "es",

    /* ==========================================
       BUSINESS
    ========================================== */

    services: [

        "Organización de eventos",

        "Decoración",

        "Catering",

        "Fotografía",

        "DJ",

        "Música",

        "Coordinación"

    ],

    /* ==========================================
       AUTOMATIONS
    ========================================== */

    automations: {

        saveLead: true,

        sendEmailToBusiness: true,

        sendEmailToCustomer: true,

        sendWhatsAppToBusiness: true,

        sendWhatsAppToCustomer: true,

        scheduleAppointments: true

    }

};

export default chatbotConfig;