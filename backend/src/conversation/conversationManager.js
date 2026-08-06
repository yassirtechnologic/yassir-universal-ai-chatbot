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

    getConversationSession,

    updateConversationSession,

    updateLead,

    updateWorkflow,

    addHistoryMessage,

    finishConversation,

    clearConversationSession

} from "./conversationSession.js";
import { runWorkflowEngine } from "./engine/workflowEngine.js";
import { knowledgeEngine } from "./knowledge/knowledgeEngine.js";
import { conversationRouter } from "./conversationRouter.js";
import { commercialBrain } from "./brain/commercialBrain.js";
import { reasoningEngine } from "./brain/reasoningEngine.js";

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
        detectLanguage(
            lastUserMessage
        );

    updateConversationSession(

        conversationId,

        {

            language

        }

    );

    const session =
        getConversationSession(
            conversationId
        );

    /* ==========================================
    Conversación finalizada
    ========================================== */

    if (

        session.finished

    ) {

        return {

            success: true,

            language:

                session.language,

            lead:

                session.lead,

            workflow:

                session.workflow,

            reply:
                "😊 Ya hemos recibido toda la información de tu solicitud.\n\nNuestro equipo se pondrá en contacto contigo lo antes posible.\n\nSi deseas solicitar un nuevo evento, puedes comenzar una conversación nueva. ¡Muchas gracias por confiar en Eventos York & Katy! 🎉",

            actions: []

        };

    }

    console.log(
        "🧠 Conversation Session:",
        session
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
    Lead almacenado en sesión
    ========================================== */

    const previousLead =
        session.lead || {};

    /* ==========================================
    Extracción mediante reglas
    ========================================== */

    const regexLead =
        extractLead(messages);

    console.log(
        "🟡 Regex Lead:",
        regexLead
    );

    /* ==========================================
    Extracción mediante IA
    ========================================== */

    const aiLead =
        await extractLeadWithAI(
            messages
        );

    console.log(
        "🟢 AI Lead:",
        aiLead
    );

    /* ==========================================
    Merge del Lead
    ========================================== */

    const extractedLead =
        mergeLead(
            regexLead,
            aiLead
        );

    const lead =
        mergeLead(
            previousLead,
            extractedLead
        );

    /* ==========================================
    Guardar Lead
    ========================================== */

    updateLead(

        conversationId,

        lead

    );

    console.log(
        "🔵 Lead Final:",
        lead
    );

    /* ==========================================
    Estado del Workflow
    ========================================== */

    const workflow =
        getWorkflowState(
            lead
        );

    updateWorkflow(

        conversationId,

        workflow

    );

    console.log(
        "🟣 Workflow:",
        workflow
    );

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
    Commercial Brain
    ========================================== */

    const brain = commercialBrain({

        lead,

        workflow,

        intent: decision.intent,

        message: lastUserMessage,

        session

    });

    console.log(
        "🧠 Commercial Brain:",
        brain
    );

    /* ==========================================
    Reasoning Engine
    ========================================== */

    const reasoning = reasoningEngine({

        decision: brain.decision,

        lead,

        message: decision,

        workflow,

        language

    });

    console.log(
        "🧠 Reasoning Engine:",
        reasoning
    );

    /* ==========================================
    Reasoning Response
    ========================================== */

    switch (

        reasoning.type

    ) {

        /* ======================================
        Knowledge
        ====================================== */

        case "KNOWLEDGE":

            return {

                success: true,

                language,

                lead,

                workflow,

                reply:

                    reasoning.response.reply +

                    "\n\n😊 Por cierto, continuando con la organización de tu evento...\n\n" +

                    buildWorkflowResponse(

                        workflow,

                        language,

                        lead

                    ),

                actions: []

            };

        /* ======================================
        Recommendation
        ====================================== */

        case "RECOMMENDATION":

            console.log(

                "💡 Recommendation:",

                reasoning.response

            );

            break;

        /* ======================================
        Finish
        ====================================== */

        case "FINISH":

            break;

        /* ======================================
        Workflow
        ====================================== */

        case "WORKFLOW":

        default:

            break;

    }

    /* ==========================================
    Commercial Brain Decision
    ========================================== */

    const router = conversationRouter({

        decision: brain.decision,

        language,

        lead,

        workflow

    });

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

    /* ==========================================
    Finalizar conversación
    ========================================== */

    finishConversation(

        conversationId

    );

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