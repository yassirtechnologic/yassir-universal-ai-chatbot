/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   leadSchema.js

   Description:
   Yassir Technologic commercial lead schema.

   Responsibility:
   Defines the normalized structure used to represent
   potential commercial opportunities generated through
   Yassir AI conversations.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   EMPTY LEAD
========================================================== */

export const EMPTY_TECH_LEAD = {

    /* ======================================================
       CONTACT
    ====================================================== */

    nombre:
        null,

    empresa:
        null,

    email:
        null,

    telefono:
        null,


    /* ======================================================
       BUSINESS
    ====================================================== */

    tipoNegocio:
        null,


    /* ======================================================
       OPPORTUNITY
    ====================================================== */

    problema:
        null,

    servicioInteres:
        [],

    objetivo:
        null,

    presupuesto:
        null,

    plazo:
        null,


    /* ======================================================
       ADDITIONAL CONTEXT
    ====================================================== */

    comentarios:
        null

};


/* ==========================================================
   LEAD FIELDS
========================================================== */

export const TECH_LEAD_FIELDS = [

    "nombre",

    "empresa",

    "email",

    "telefono",

    "tipoNegocio",

    "problema",

    "servicioInteres",

    "objetivo",

    "presupuesto",

    "plazo",

    "comentarios"

];


/* ==========================================================
   CREATE EMPTY LEAD
========================================================== */

export function createEmptyTechLead() {

    return {

        ...EMPTY_TECH_LEAD,

        servicioInteres: []

    };

}


/* ==========================================================
   CONTACT CHECK
========================================================== */

export function hasTechLeadContact(
    lead = {}
) {

    return Boolean(

        lead.email ||

        lead.telefono

    );

}


/* ==========================================================
   BASIC QUALIFICATION CHECK
========================================================== */

/*
 * A lead is considered basically qualified when:
 *
 * - we understand the business problem
 * - and the visitor has provided at least one
 *   reliable contact method
 *
 * We intentionally do NOT require every field.
 * The chatbot should not behave like a rigid form.
 */

export function isTechLeadQualified(
    lead = {}
) {

    const hasProblem =
        Boolean(
            lead.problema
        );


    const hasContact =
        hasTechLeadContact(
            lead
        );


    return (
        hasProblem &&
        hasContact
    );

}