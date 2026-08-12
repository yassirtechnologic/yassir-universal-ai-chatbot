/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   leadMerger.js

   Description:
   Yassir Technologic commercial lead merger.

   Responsibility:
   Combines previously known commercial lead information
   with newly extracted conversation data without losing
   valid information already collected.

   Author:
   Yassir Technologic

   Version:
   1.0.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import {
    createEmptyTechLead
} from "./leadSchema.js";


/* ==========================================================
   VALUE CHECK
========================================================== */

function hasValue(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return false;

    }


    if (
        typeof value === "string"
    ) {

        return Boolean(
            value.trim()
        );

    }


    if (
        Array.isArray(value)
    ) {

        return value.length > 0;

    }


    return true;

}

/* ==========================================================
   NORMALIZE EMAIL
========================================================== */

/*
 * Defensive email normalization.
 *
 * The lead extractor already normalizes emails, but the
 * merger acts as a second security and data-quality layer.
 *
 * This prevents presentation markup such as:
 *
 * [user@example.com](mailto:user@example.com)
 *
 * from reaching:
 *
 * - session state
 * - persistence
 * - CRM
 * - email notification services
 */

function normalizeEmail(
    value
) {

    if (
        typeof value !== "string"
    ) {

        return null;

    }


    const normalized =
        value.trim();


    if (!normalized) {

        return null;

    }


    const match =
        normalized.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );


    if (!match) {

        return null;

    }


    return match[0]
        .toLowerCase();

}

/* ==========================================================
   NORMALIZE SERVICE ARRAY
========================================================== */

function normalizeServices(
    services
) {

    if (!Array.isArray(services)) {

        return [];

    }


    return services
        .filter((service) => {

            return (
                typeof service === "string" &&
                service.trim()
            );

        })
        .map((service) => {

            return service.trim();

        });

}


/* ==========================================================
   MERGE SERVICES
========================================================== */

function mergeServices(
    previousServices,
    newServices
) {

    const previous =
        normalizeServices(
            previousServices
        );


    const incoming =
        normalizeServices(
            newServices
        );


    return [

        ...new Set([

            ...previous,

            ...incoming

        ])

    ];

}


/* ==========================================================
   MERGE FIELD
========================================================== */

/*
 * New valid information takes priority.
 *
 * Null, undefined or empty values never erase
 * previously collected information.
 */

function mergeField(
    previousValue,
    newValue
) {

    if (
        hasValue(
            newValue
        )
    ) {

        return newValue;

    }


    if (
        hasValue(
            previousValue
        )
    ) {

        return previousValue;

    }


    return null;

}


/* ==========================================================
   MERGE TECH LEAD
========================================================== */

export function mergeTechLead(
    previousLead = {},
    extractedLead = {}
) {

    const emptyLead =
        createEmptyTechLead();


    return {

        /* ==================================================
           CONTACT
        ================================================== */

        nombre:
            mergeField(
                previousLead.nombre,
                extractedLead.nombre
            ),

        empresa:
            mergeField(
                previousLead.empresa,
                extractedLead.empresa
            ),

        email:
            mergeField(

                normalizeEmail(
                    previousLead.email
                ),

                normalizeEmail(
                    extractedLead.email
                )

            ),

        telefono:
            mergeField(
                previousLead.telefono,
                extractedLead.telefono
            ),


        /* ==================================================
           BUSINESS
        ================================================== */

        tipoNegocio:
            mergeField(
                previousLead.tipoNegocio,
                extractedLead.tipoNegocio
            ),


        /* ==================================================
           OPPORTUNITY
        ================================================== */

        problema:
            mergeField(
                previousLead.problema,
                extractedLead.problema
            ),

        servicioInteres:
            mergeServices(
                previousLead.servicioInteres,
                extractedLead.servicioInteres
            ),

        objetivo:
            mergeField(
                previousLead.objetivo,
                extractedLead.objetivo
            ),

        presupuesto:
            mergeField(
                previousLead.presupuesto,
                extractedLead.presupuesto
            ),

        plazo:
            mergeField(
                previousLead.plazo,
                extractedLead.plazo
            ),


        /* ==================================================
           ADDITIONAL CONTEXT
        ================================================== */

        comentarios:
            mergeField(
                previousLead.comentarios,
                extractedLead.comentarios
            ),


        /*
         * Defensive fallback.
         *
         * This guarantees that future schema fields can
         * start from their expected empty structure.
         */

        ...Object.keys(emptyLead)
            .filter((key) => {

                return ![
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
                ].includes(key);

            })
            .reduce(
                (result, key) => {

                    result[key] =
                        emptyLead[key];

                    return result;

                },
                {}
            )

    };

}