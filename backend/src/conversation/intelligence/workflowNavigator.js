/* ======================================================
   YASSIR TECH

   File:
   workflowNavigator.js

   Description:
   Workflow Navigator.

   Responsibility:
   Moves the workflow to the next logical step
   when the current field is skipped.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

const FLOW = [

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

export const getNextWorkflow = (workflow) => {

    if (!workflow?.missingField) {

        return workflow;

    }

    const index =
        FLOW.indexOf(
            workflow.missingField
        );

    if (index === -1) {

        return workflow;

    }

    const nextField =
        FLOW[index + 1];

    if (!nextField) {

        return {

            completed: true,

            missingField: null,

            next: "FINISH"

        };

    }

    return {

        completed: false,

        missingField: nextField,

        next: `ASK_${nextField.toUpperCase()}`

    };

};