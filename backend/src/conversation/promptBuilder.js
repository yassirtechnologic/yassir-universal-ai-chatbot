/* ======================================================
   YASSIR TECH

   File:
   promptBuilder.js

   Description:
   Builds the complete system prompt.

   Responsibility:
   Combines business information and AI instructions.

   Author:
   Yassir Tech

   Version:
   3.0.0
====================================================== */

import promptES from "../prompts/events.es.js";
import promptEN from "../prompts/events.en.js";
import promptDE from "../prompts/events.de.js";

import chatbotConfig from "../config/chatbot.config.js";

import company from "../knowledge/company.js";
import services from "../knowledge/services.js";
import pricing from "../knowledge/pricing.js";
import faq from "../knowledge/faq.js";

export const buildPrompt = (language = "es") => {

    let basePrompt = promptES;

    if (language === "en") basePrompt = promptEN;
    if (language === "de") basePrompt = promptDE;

    return `

${basePrompt}

==============================
COMPANY
==============================

${JSON.stringify(company, null, 2)}

==============================
SERVICES
==============================

${JSON.stringify(services, null, 2)}

==============================
PRICING
==============================

${JSON.stringify(pricing, null, 2)}

==============================
FAQ
==============================

${JSON.stringify(faq, null, 2)}

==============================
CHATBOT CONFIGURATION
==============================

${JSON.stringify(chatbotConfig, null, 2)}

`;

};