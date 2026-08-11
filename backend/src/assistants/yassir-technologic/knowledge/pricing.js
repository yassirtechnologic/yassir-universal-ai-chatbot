/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   pricing.js

   Description:
   Yassir Technologic pricing knowledge.

   Responsibility:
   Defines how the Yassir Technologic assistant should
   communicate about pricing, budgets and commercial
   proposals without inventing unsupported amounts.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */

const pricing = {

    /* ======================================================
       PRICING POLICY
    ====================================================== */

    policy: [

        "No proporcionar precios cerrados sin conocer primero el alcance real del proyecto.",

        "Explicar que el precio depende de la complejidad, funcionalidades, integraciones, automatizaciones y requisitos técnicos.",

        "No inventar tarifas, descuentos, promociones ni condiciones comerciales.",

        "Cuando no exista un precio oficial disponible, ofrecer una evaluación o propuesta personalizada.",

        "Diferenciar cuando sea necesario entre desarrollo inicial, mantenimiento, infraestructura y servicios externos.",

        "Aclarar que servicios de terceros pueden generar costes adicionales independientes de Yassir Technologic.",

        "Evitar comprometer fechas, presupuestos o alcances sin haber analizado previamente el proyecto.",

        "Solicitar únicamente la información necesaria para comprender el proyecto antes de recomendar una solución.",

        "Priorizar soluciones proporcionales a las necesidades reales del cliente en lugar de recomendar tecnología innecesaria.",

        "Comunicar siempre los presupuestos como propuestas adaptadas al alcance y objetivos concretos del cliente."

    ],


    /* ======================================================
       COST FACTORS
    ====================================================== */

    costFactors: [

        "Alcance funcional",

        "Complejidad técnica",

        "Número de funcionalidades",

        "Integraciones con sistemas externos",

        "Automatizaciones necesarias",

        "Uso de Inteligencia Artificial",

        "Volumen y tratamiento de datos",

        "Diseño de interfaces",

        "Infraestructura y despliegue",

        "Seguridad y permisos",

        "Mantenimiento y soporte",

        "Servicios o APIs de terceros"

    ],


    /* ======================================================
       COMMERCIAL RESPONSE
    ====================================================== */

    guidance: {

        unknownPrice:
            "Para ofrecer un presupuesto responsable necesitamos conocer primero el alcance y los requisitos principales del proyecto.",

        customProposal:
            "Podemos analizar tu caso y preparar una propuesta personalizada según las necesidades reales de tu negocio.",

        thirdPartyCosts:
            "Algunas soluciones pueden utilizar servicios externos, APIs, infraestructura cloud u otras plataformas cuyos costes se gestionan de forma independiente."

    }

};

export default pricing;