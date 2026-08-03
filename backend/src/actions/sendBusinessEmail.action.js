/* ======================================================
   YASSIR TECH

   File:
   sendBusinessEmail.action.js

   Description:
   Send Business Email Action.

   Responsibility:
   Sends a notification email to the business
   when a new lead has been completed.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import { sendEmailNotification } from "../services/notifyEmail.js";

/* ======================================================
   Execute Business Email
====================================================== */

export const executeSendBusinessEmail = async ({
    lead = {}
}) => {

    console.log("\n------------------------------");
    console.log("📧 BUSINESS EMAIL ACTION");
    console.log("------------------------------");

    try {

        const result =
            await sendEmailNotification(
                lead
            );

        console.log(
            "✅ Business Email:",
            result
        );

        return result;

    }

    catch (error) {

        console.error(
            "❌ Business Email Error:",
            error.message
        );

        return {

            success: false,

            error:
                error.message

        };

    }

};