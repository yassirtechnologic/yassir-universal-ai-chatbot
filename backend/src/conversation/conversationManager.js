/* ======================================================
   YASSIR TECH

   File:
   conversationManager.js

   Description:
   Central conversation engine.

   Responsibility:
   Coordinates the complete conversation flow.

   Author:
   Yassir Tech

   Version:
   4.1.0
====================================================== */

import { detectLanguage } from "./languageDetector.js";
import { extractLead } from "./leadExtractor.js";
import { buildPrompt } from "./promptBuilder.js";
import { getWorkflowState } from "./workflowManager.js";
import { buildWorkflowResponse } from "./responseBuilder.js";
import { smartDecision } from "./intelligence/smartDecision.js";

import { sendToOpenAI } from "../services/openai.service.js";
import { mergeLead } from "../utils/mergeLead.js";
import { extractLeadWithAI } from "../services/leadExtraction.service.js";
import { executeActions } from "../actions/actionExecutor.js";
import {

    getConversationState,

    updateConversationState,

    clearConversationState

} from "./state/conversationState.js";
import { runWorkflowEngine } from "./engine/workflowEngine.js";

// Próximas fases
// import { extractLeadWithAI } from "../services/leadExtraction.service.js";
// import { executeActions } from "../actions/actionExecutor.js";

export const processConversation = async ({

    conversationId,

    messages = [],

}) => {

    /* ==========================================
       Último mensaje del usuario
    ========================================== */

    const lastUserMessage =
        messages.at(-1)?.content || "";

    /* ==========================================
       Idioma
    ========================================== */

    const language =
        detectLanguage(lastUserMessage);

    const conversationState =
        getConversationState(
            conversationId
        );

    console.log(
        "🧠 Conversation State:",
        conversationState
    );

    /* ==========================================
       Prompt del sistema
    ========================================== */

    const systemPrompt =
        buildPrompt(language);

    /* ==========================================
       Historial para GPT
    ========================================== */

    const conversation = [

        {
            role: "system",
            content: systemPrompt,
        },

        ...messages,

    ];

    /* ==========================================
       Extracción mediante reglas
    ========================================== */

    const regexLead =
        extractLead(messages);

    console.log("🟡 Regex Lead:", regexLead);

    /* ==========================================
    Extracción mediante IA
    ========================================== */

    const aiLead =
        await extractLeadWithAI(
            messages
        );

    console.log("🟢 AI Lead:", aiLead);

    /* ==========================================
       Lead Final
    ========================================== */

    const lead =
        mergeLead(regexLead, aiLead);

    console.log("🔵 Lead Final:", lead);

    /* ==========================================
       Estado del Workflow
    ========================================== */

    const workflow =
        getWorkflowState(lead);

    console.log("🟣 Workflow:", workflow);

    const decision =
        smartDecision(
            lastUserMessage,
            workflow
        );

    console.log(
        "🧠 Smart Decision:",
        decision
    );

    /* ==========================================
       Primera interacción
    ========================================== */

    const isFirstMessage =
        messages.filter(m => m.role === "user").length === 1;

    if (isFirstMessage) {

        const intro =
            "¡Hola! 👋 Soy Yassir, el asistente virtual de Eventos York & Katy.\n\n" +
            "Será un placer ayudarte a organizar un evento inolvidable.\n\n" +
            "Puedo ayudarte con bodas, cumpleaños, bautizos, comuniones, eventos corporativos y mucho más.\n\n" +
            "😊 Antes de comenzar me gustaría conocerte un poco.\n\n";

        const workflowReply =
            buildWorkflowResponse(
                workflow,
                language,
                lead
            );

        return {

            success: true,

            language,

            lead,

            workflow,

            reply:
                intro + workflowReply,

            actions: [],

        };

    }

    /* ==========================================
       Si falta información
       Aún NO usamos GPT
    ========================================== */

    if (!workflow.completed) {

        const engineResult =
            await runWorkflowEngine({

                conversationId,

                lead,

                workflow,

                language,

                lastUserMessage,

                messages

            });

        return {

            success: true,

            language:
                engineResult.language,

            lead:
                engineResult.lead,

            workflow:
                engineResult.workflow,

            reply:
                engineResult.reply,

            actions:
                engineResult.actions

        };

    }

    /* ==========================================
    Workflow completado
    ========================================== */

    const actions = [

        "SAVE_LEAD",

        "SEND_BUSINESS_EMAIL",

        "SEND_CLIENT_EMAIL",

        "SEND_BUSINESS_WHATSAPP",

        "CREATE_CALENDAR_EVENT"

    ];

    /* ==========================================
    Execute Actions
    ========================================== */

    const actionResults =
        await executeActions({

            actions,

            lead,

            language

        });

    console.log(
        "⚙️ Action Results:",
        actionResults
    );

    return {

        success: true,

        language,

        lead,

        workflow,

        reply:
            "🎉 ¡Perfecto! Ya tenemos toda la información necesaria.\n\n" +
            "Muchas gracias por confiar en Eventos York & Katy.\n\n" +
            "Nuestro equipo revisará tu solicitud y muy pronto se pondrá en contacto contigo para preparar una propuesta personalizada.\n\n" +
            "¡Que tengas un excelente día! 😊",

        actions,

    };

};