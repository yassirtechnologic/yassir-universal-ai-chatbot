/* ======================================================
   YASSIR TECH

   File:
   commercialBrain.js

   Description:
   Commercial Brain.

   Responsibility:
   Coordinates every commercial decision
   before generating the assistant response.

   This is the main brain of the assistant.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import { decisionBrain } from "./decisionBrain.js";

/* ======================================================
   Commercial Brain
====================================================== */

export const commercialBrain = (

    context = {}

) => {

    const {

        lead = {},

        workflow,

        intent,

        message,

        session

    } = context;

    /* ==========================================
       Decision Brain
    ========================================== */

    const decision =

        decisionBrain({

            lead,

            workflow,

            intent,

            message,

            session

        });

    return {

        decision,

        lead,

        workflow,

        intent

    };

};