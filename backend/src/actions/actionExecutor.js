/* ======================================================
   YASSIR TECH

   File:
   actionExecutor.js

   Description:
   Central Action Executor.

   Responsibility:
   Executes all automatic actions generated
   by the Conversation Engine.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import { executeSaveLead } from "./saveLead.action.js";
import { executeSendBusinessEmail } from "./sendBusinessEmail.action.js";
import { executeSendCustomerEmail } from "./sendCustomerEmail.action.js";
import { createCalendarEventAction } from "./createCalendarEvent.action.js";

// Próximas acciones
// import { executeSendBusinessWhatsApp } from "./sendBusinessWhatsApp.action.js";
// import { executeScheduleMeeting } from "./scheduleMeeting.action.js";

/* ======================================================
   Execute Actions
====================================================== */

export const executeActions = async ({
    actions = [],
    lead = {},
    language = "es"
}) => {

    console.log("\n====================================");
    console.log("⚙️ ACTION EXECUTOR");
    console.log("====================================");

    const results = [];

    for (const action of actions) {

        try {

            console.log(`➡️ Ejecutando: ${action}`);

            switch (action) {

                case "SAVE_LEAD": {

                    const result =
                        await executeSaveLead({
                            lead,
                            language
                        });

                    results.push({
                        action,
                        success: true,
                        result
                    });

                    break;
                }

                case "SEND_BUSINESS_EMAIL": {

                    const result =
                        await executeSendBusinessEmail({
                            lead
                        });

                    results.push({
                        action,
                        success: true,
                        result
                    });

                    break;
                }

                /*
                Próximas acciones
                */

                case "SEND_CLIENT_EMAIL": {

                    const result =
                        await executeSendCustomerEmail({

                            lead,

                            language

                        });

                    results.push({

                        action,

                        success: true,

                        result

                    });

                    break;

                }
                case "SEND_BUSINESS_WHATSAPP":

                    console.log("📱 WhatsApp Business (pendiente)");

                    results.push({
                        action,
                        success: true,
                        pending: true
                    });

                    break;

                case "CREATE_CALENDAR_EVENT": {

                    const result =
                        await createCalendarEventAction(
                            lead
                        );

                    results.push({

                        action,

                        success: result.success,

                        result

                    });

                    break;

                }

                default:

                    console.warn(
                        `⚠️ Acción desconocida: ${action}`
                    );

                    results.push({
                        action,
                        success: false,
                        reason: "Unknown action"
                    });

            }

        } catch (error) {

            console.error(
                `❌ Error ejecutando ${action}:`,
                error.message
            );

            results.push({
                action,
                success: false,
                error: error.message
            });

        }

    }

    console.log("====================================");
    console.log("✅ ACTION EXECUTOR FINALIZADO");
    console.log("====================================\n");

    return results;

};