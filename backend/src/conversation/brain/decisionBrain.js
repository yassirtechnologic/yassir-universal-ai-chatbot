/* ======================================================
   YASSIR TECH

   File:
   decisionBrain.js

   Description:
   Decision Brain.

   Responsibility:
   Determines which engine should process
   the user's message before generating
   the final response.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

export const decisionBrain = (

    context = {}

) => {

    const {

        workflow,

        intent,

        lead

    } = context;

    /* ==========================================
       Conversation Finished
    ========================================== */

    if (

        workflow?.completed

    ) {

        return {

            type: "FINISH"

        };

    }

    /* ==========================================
       Commercial Knowledge
    ========================================== */

    switch (intent) {

        case "ASK_SERVICE":

            return {

                type: "KNOWLEDGE",

                action: "ANSWER_SERVICE"

            };

        case "ASK_PRICE":

            return {

                type: "KNOWLEDGE",

                action: "ANSWER_PRICE"

            };

        case "ASK_LOCATION":

            return {

                type: "KNOWLEDGE",

                action: "ANSWER_LOCATION"

            };

        case "ASK_AVAILABILITY":

            return {

                type: "KNOWLEDGE",

                action: "ANSWER_AVAILABILITY"

            };

    }

    /* ==========================================
       Lead Recommendation
    ========================================== */

    if (

        lead.evento ||

        lead.presupuesto ||

        lead.invitados ||

        lead.servicios?.length

    ) {

        return {

            type: "RECOMMENDATION"

        };

    }

    /* ==========================================
       Continue Workflow
    ========================================== */

    return {

        type: "WORKFLOW"

    };

};