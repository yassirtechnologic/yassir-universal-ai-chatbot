/* ======================================================
   YASSIR TECH

   File:
   leadExtractor.js

   Description:
   Intelligent lead extractor.

   Responsibility:
   Extracts structured lead information from the
   conversation using deterministic rules.

   Author:
   Yassir Tech

   Version:
   3.0.0
====================================================== */

const EVENT_TYPES = [
    "boda",
    "cumpleaños",
    "cumple",
    "bautizo",
    "comunión",
    "aniversario",
    "evento corporativo",
    "corporativo",
    "graduación",
    "fiesta"
];

export const extractLead = (messages = []) => {

    const lead = {

        nombre: null,

        telefono: null,

        email: null,

        evento: null,

        fecha: null,

        ciudad: null,

        invitados: null,

        presupuesto: null

    };

    const conversation = messages
        .map(m => m.content || "")
        .join(" ");

    /* ===========================
       EMAIL
    =========================== */

    const emailMatch =
        conversation.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

    if (emailMatch)
        lead.email = emailMatch[0];

    /* ===========================
       PHONE
    =========================== */

    const phoneMatch =
        conversation.match(/(\+?\d[\d\s-]{8,})/);

    if (phoneMatch)
        lead.telefono =
            phoneMatch[1].replace(/\s/g, "");

    /* ===========================
       NAME
    =========================== */

    const nameMatch =
        conversation.match(
            /(me llamo|mi nombre es|soy)\s+([A-Za-zÁÉÍÓÚÑáéíóúñ ]+)/i
        );

    if (nameMatch)
        lead.nombre =
            nameMatch[2].trim();

    /* ===========================
       EVENT
    =========================== */

    for (const event of EVENT_TYPES) {

        if (
            conversation.toLowerCase().includes(event)
        ) {

            lead.evento = event;

            break;

        }

    }

    return lead;

};