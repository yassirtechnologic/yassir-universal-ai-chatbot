/* ======================================================
   YASSIR TECH

   File:
   reasoningEngine.js

   Description:
   Reasoning Engine.

   Responsibility:
   Centralizes the assistant reasoning.

   According to the decision made by the
   Decision Brain it redirects the request
   to the proper engine.

   This file acts as the orchestrator
   of every reasoning module.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import { knowledgeEngine } from "../knowledge/knowledgeEngine.js";
import { recommendationEngine } from "../recommendation/recommendationEngine.js";

/* ======================================================
   Reasoning Engine
====================================================== */

export const reasoningEngine = (

    context = {}

) => {

    const {

        decision = {},

        lead = {},

        workflow = {},

        message = "",

        language = "es"

    } = context;

    /* ==========================================
       Safety Validation
    ========================================== */

    if (

        !decision.type

    ) {

        console.warn(

            "⚠️ REASONING ENGINE: Missing decision type."

        );

        return {

            type: "WORKFLOW",

            response: null

        };

    }

    /* ==========================================
       Route Decision
    ========================================== */

    switch (

        decision.type

    ) {

        /* ======================================
           Knowledge Engine
        ====================================== */

        case "KNOWLEDGE": {

            const response =

                knowledgeEngine(

                    decision

                );

            return {

                type: "KNOWLEDGE",

                response

            };

        }

        /* ======================================
           Recommendation Engine
        ====================================== */

        case "RECOMMENDATION": {

            const response =

                recommendationEngine(

                    lead

                );

            return {

                type: "RECOMMENDATION",

                response

            };

        }

        /* ======================================
           Conversation Finished
        ====================================== */

        case "FINISH":

            return {

                type: "FINISH",

                response: null

            };

        /* ======================================
           Continue Workflow
        ====================================== */

        case "WORKFLOW":

            return {

                type: "WORKFLOW",

                response: null

            };

        /* ======================================
           Unknown Decision
        ====================================== */

        default:

            console.warn(

                "⚠️ REASONING ENGINE: Unknown decision.",

                decision

            );

            return {

                type: "WORKFLOW",

                response: null

            };

    }

};