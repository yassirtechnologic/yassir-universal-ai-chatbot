/* ======================================================
   YASSIR TECH

   File:
   sendCustomerEmail.action.js

   Description:
   Send Customer Email Action.

   Responsibility:
   Sends a confirmation email to the customer
   after the lead has been completed.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import { sendCustomerConfirmation } from "../services/customerEmail.service.js";

/* ======================================================
   Execute Customer Email
====================================================== */

export const executeSendCustomerEmail = async ({
    lead = {},
    language = "es"
}) => {

    console.log("\n------------------------------");
    console.log("📨 CUSTOMER EMAIL ACTION");
    console.log("------------------------------");

    try {

        const result =
            await sendCustomerConfirmation({

                lead,

                language

            });

        console.log(
            "✅ Customer Email:",
            result
        );

        return result;

    }

    catch (error) {

        console.error(
            "❌ Customer Email Error:",
            error.message
        );

        return {

            success: false,

            error:
                error.message

        };

    }

};