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
   1.1.0
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

        servicioInteres:
            []

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
   COMMERCIAL NEED CHECK
========================================================== */

/*
 * A commercial need exists when at least one
 * meaningful opportunity signal has been identified.
 *
 * The visitor does not need to describe a "problem"
 * explicitly.
 *
 * Examples:
 *
 * "Pierdo mucho tiempo respondiendo consultas."
 * -> problema
 *
 * "Quiero implementar un chatbot."
 * -> objetivo / servicioInteres
 *
 * "Necesito integrar mi sistema de reservas."
 * -> servicioInteres
 */

export function hasTechCommercialNeed(
    lead = {}
) {

    const hasProblem =
        Boolean(
            lead.problema
        );


    const hasObjective =
        Boolean(
            lead.objetivo
        );


    const hasServiceInterest =
        Array.isArray(
            lead.servicioInteres
        ) &&
        lead.servicioInteres.length > 0;


    return (

        hasProblem ||

        hasObjective ||

        hasServiceInterest

    );

}


/* ==========================================================
   BASIC QUALIFICATION CHECK
========================================================== */

/*
 * A lead is considered basically qualified when:
 *
 * - we have identified a real commercial need
 *
 * AND
 *
 * - the visitor has provided at least one
 *   reliable contact method
 *
 * A commercial need may be expressed as:
 *
 * - a business problem
 * - an objective
 * - interest in an official Yassir Technologic service
 *
 * We intentionally do NOT require every field.
 *
 * The chatbot should behave like a natural commercial
 * assistant, not like a rigid form.
 */

export function isTechLeadQualified(
    lead = {}
) {

    const hasCommercialNeed =
        hasTechCommercialNeed(
            lead
        );


    const hasContact =
        hasTechLeadContact(
            lead
        );


    return (

        hasCommercialNeed &&

        hasContact

    );

}