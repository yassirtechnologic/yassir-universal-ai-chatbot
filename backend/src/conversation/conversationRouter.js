/* ======================================================
   YASSIR TECH

   File:
   conversationRouter.js

   Description:
   Conversation Router.

   Responsibility:
   Routes every customer message to the
   appropriate engine and decides whether
   the workflow should continue.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import { knowledgeEngine } from "./knowledge/knowledgeEngine.js";

import { buildWorkflowResponse } from "./responseBuilder.js";

/* ======================================================
   Conversation Router
====================================================== */

export const conversationRouter = ({

    decision,

    language,

    lead,

    workflow

}) => {

    /* ==========================================
       Knowledge Engine
    ========================================== */

    const knowledgeResponse =

        knowledgeEngine(

            decision

        );

    if (

        knowledgeResponse

    ) {

        let reply =

            knowledgeResponse.reply;

        /* ======================================
           Continue Workflow
        ====================================== */

        if (

            workflow &&

            !workflow.completed

        ) {

            reply +=

                "\n\n😊 Por cierto, continuando con la organización de tu evento...\n\n";

            reply +=

                buildWorkflowResponse(

                    workflow,

                    language,

                    lead

                );

        }

        return {

            handled: true,

            reply

        };

    }

    /* ==========================================
       Not handled
    ========================================== */

    return {

        handled: false

    };

};