/* ======================================================
   YASSIR TECH

   File:
   workflowEngine.js

   Description:
   Central Workflow Engine.

   Responsibility:
   Controls the commercial workflow.

   Author:
   Yassir Tech

   Version:
   4.0.0
====================================================== */

import { buildWorkflowResponse } from "../responseBuilder.js";
import { smartDecision } from "../intelligence/smartDecision.js";
import { getNextWorkflow } from "../intelligence/workflowNavigator.js";

import {

    getConversationState,

    updateConversationState

} from "../state/conversationState.js";

export const runWorkflowEngine = async ({

    conversationId,

    lead,

    workflow,

    language,

    lastUserMessage,

    messages

}) => {

    /* ==========================================
       Analyze User Decision
    ========================================== */

    const decision =
        smartDecision(

            lastUserMessage,

            workflow

        );

    console.log(
        "🧠 Workflow Decision:",
        decision
    );

    /* ==========================================
       Conversation State
    ========================================== */

    const conversationState =
        getConversationState(
            conversationId
        );

    /* ==========================================
       Current Workflow
    ========================================== */

    let currentWorkflow =
        workflow;

    /* ==========================================
       Skip Current Field
    ========================================== */

    if (

        decision.action === "SKIP_FIELD"

    ) {

        console.log(
            "⏭️ Saltando campo:",
            workflow.missingField
        );

        /* ===============================
           Save Pending Field
        =============================== */

        updateConversationState(

            conversationId,

            {

                skippedFields: [

                    ...conversationState.skippedFields,

                    workflow.missingField

                ]

            }

        );

        console.log(
            "📝 Campos pendientes:",
            getConversationState(
                conversationId
            ).skippedFields
        );

        /* ===============================
           Next Workflow
        =============================== */

        currentWorkflow =
            getNextWorkflow(
                workflow
            );

        console.log(
            "➡️ Nuevo Workflow:",
            currentWorkflow
        );

    }

    /* ==========================================
       Build Response
    ========================================== */

    let reply =
        buildWorkflowResponse(

            currentWorkflow,

            language,

            lead

        );

    /* ==========================================
       Friendly Message
    ========================================== */

    if (

        decision.action === "SKIP_FIELD"

    ) {

        reply =
            "😊 No pasa nada, podemos dejar ese dato para más adelante.\n\n" +
            reply;

    }

    /* ==========================================
       Result
    ========================================== */

    return {

        lead,

        workflow:
            currentWorkflow,

        language,

        decision,

        reply,

        actions: [],

        completed:
            currentWorkflow.completed

    };

};