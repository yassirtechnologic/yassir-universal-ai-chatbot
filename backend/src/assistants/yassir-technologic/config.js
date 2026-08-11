/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   config.js

   Description:
   Yassir Technologic assistant configuration.

   Responsibility:
   Defines the identity, languages, AI preferences,
   business settings and automation capabilities
   for the Yassir Technologic assistant.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */

const yassirTechnologicConfig = {

    /* ======================================================
       ASSISTANT
    ====================================================== */

    id:
        "yassir-technologic",

    assistantName:
        "Yassir AI",

    /* ======================================================
       COMPANY
    ====================================================== */

    company: {

        name:
            "Yassir Technologic",

        /*
         * We will add the definitive production URL
         * once the corporate domain is confirmed.
         */

        website:
            null,

        email:
            "yassir.technologic@gmail.com"

    },

    /* ======================================================
       LANGUAGES
    ====================================================== */

    languages: [

        "es",

        "en"

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
            700

    },

    /* ======================================================
       BUSINESS
    ====================================================== */

    business: {

        type:
            "technology-services",

        services: [

            "Automatización de procesos",

            "Inteligencia Artificial",

            "Chatbots con Inteligencia Artificial",

            "Machine Learning",

            "Software a medida",

            "Desarrollo web",

            "Integraciones y APIs",

            "Dashboards y analítica de datos",

            "Soluciones SaaS",

            "Consultoría tecnológica"

        ]

    },

    /* ======================================================
       COMMERCIAL
    ====================================================== */

    commercial: {

        goal:
            "Convertir consultas en oportunidades comerciales cualificadas.",

        consultation:
            true,

        customProposal:
            true

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
            false,

        sendWhatsAppToBusiness:
            false,

        sendWhatsAppToCustomer:
            false,

        scheduleAppointments:
            false

    }

};

export default yassirTechnologicConfig;