/* ======================================================
   YASSIR TECH

   File:
   recommendationEngine.js

   Description:
   Recommendation Engine.

   Responsibility:
   Generates intelligent recommendations
   based on the customer information.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import { eventAdvisor } from "./eventAdvisor.js";

/* ======================================================
   Recommendation Engine
====================================================== */

export const recommendationEngine = (

    lead = {}

) => {

    /* ==========================================
       Event Recommendation
    ========================================== */

    if (

        lead.evento

    ) {

        const recommendation =

            eventAdvisor(

                lead.evento

            );

        if (

            recommendation

        ) {

            return recommendation;

        }

    }

    return null;

};