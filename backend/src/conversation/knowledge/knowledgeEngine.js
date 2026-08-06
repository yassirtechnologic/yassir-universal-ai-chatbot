/* ======================================================
   YASSIR TECH

   File:
   knowledgeEngine.js

   Description:
   Knowledge Engine.

   Responsibility:
   Retrieves information from the Knowledge Base
   according to the detected user intent.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import { companyKnowledge } from "./company.js";
import { servicesKnowledge } from "./services.js";

/* ======================================================
   Knowledge Engine
====================================================== */

export const knowledgeEngine = (

    decision

) => {

    console.log(

        "🟢 KNOWLEDGE DECISION:",

        decision

    );

    switch (

        decision.action

    ) {

        /* ==========================================
           Company Services
        ========================================== */

        case "ANSWER_SERVICE":

            return {

                success: true,

                reply:
                    "Actualmente ofrecemos los siguientes servicios:\n\n• " +
                    companyKnowledge.services.join("\n• ")

            };

        /* ==========================================
           Prices
        ========================================== */

        case "ANSWER_PRICE":

            return {

                success: true,

                reply:
                    "Cada evento se organiza de forma totalmente personalizada.\n\n" +
                    "El presupuesto depende del tipo de evento, el número de invitados, la ubicación, la fecha y los servicios que desees contratar.\n\n" +
                    "No utilizamos tarifas fijas porque queremos ofrecer una propuesta adaptada exactamente a tus necesidades.\n\n" +
                    "😊 Elaboramos presupuestos totalmente gratuitos y sin ningún compromiso."

            };

        /* ==========================================
           Company Location
        ========================================== */

        case "ANSWER_LOCATION":

            return {

                success: true,

                reply:
                    `Nuestra sede principal se encuentra en ${companyKnowledge.headquarters}.`

            };

        /* ==========================================
           Availability
        ========================================== */

        case "ANSWER_AVAILABILITY":

            return {

                success: true,

                reply:
                    "Podemos comprobar la disponibilidad para la fecha de tu evento. 😊 ¿Podrías indicarme qué fecha tienes prevista?"

            };

        /* ==========================================
           Unknown Knowledge
        ========================================== */

        default:

            console.log(

                "⚠️ KNOWLEDGE ENGINE: Acción no soportada:",

                decision

            );

            return null;

    }

};