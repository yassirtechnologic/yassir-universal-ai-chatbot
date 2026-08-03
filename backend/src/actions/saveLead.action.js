/* ======================================================
   YASSIR TECH

   File:
   saveLead.action.js

   Description:
   Save Lead Action.

   Responsibility:
   Executes the lead persistence process.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import { saveLead } from "../services/lead.service.js";

/* ======================================================
   Execute Save Lead
====================================================== */

export const executeSaveLead = async ({
    lead = {},
    language = "es"
}) => {

    console.log("\n------------------------------");
    console.log("💾 SAVE LEAD ACTION");
    console.log("------------------------------");

    try {

        const result =
            await saveLead(
                lead,
                language
            );

        console.log(
            "✅ Save Lead Result:",
            result
        );

        return result;

    }

    catch (error) {

        console.error(
            "❌ Save Lead Error:",
            error.message
        );

        return {

            success: false,

            error:
                error.message

        };

    }

};