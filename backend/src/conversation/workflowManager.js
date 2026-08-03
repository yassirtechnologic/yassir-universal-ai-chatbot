/* ======================================================
   YASSIR TECH

   File:
   workflowManager.js

   Description:
   Commercial conversation workflow.

   Responsibility:
   Determines which customer information
   is still missing before the lead can
   be considered complete.

   Author:
   Yassir Tech

   Version:
   3.0.0
====================================================== */

export const getWorkflowState = (lead = {}) => {

    /* ==========================================
       Orden del flujo comercial
    ========================================== */

    const workflow = [

        "nombre",

        "evento",

        "fecha",

        "telefono",

        "email",

        "ciudad",

        "invitados",

        "presupuesto",

        "servicios",

        "comentarios"

    ];

    /* ==========================================
       Buscar siguiente dato faltante
    ========================================== */

    for (const field of workflow) {

        const value = lead[field];

        if (

            value === null ||

            value === undefined ||

            value === ""

        ) {

            return {

                completed: false,

                missingField: field,

                next: `ASK_${field.toUpperCase()}`

            };

        }

    }

    /* ==========================================
       Lead completo
    ========================================== */

    return {

        completed: true,

        missingField: null,

        next: "FINISH"

    };

};