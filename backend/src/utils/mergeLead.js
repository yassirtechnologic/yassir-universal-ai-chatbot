/* ======================================================
   YASSIR TECH

   File:
   mergeLead.js

   Description:
   Merges lead information coming from multiple sources.

   Responsibility:
   Creates one final lead object using the best
   available information.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

const isValidValue = (value) => {

    if (value === null) return false;
    if (value === undefined) return false;

    if (typeof value === "string") {
        return value.trim() !== "";
    }

    return true;

};

export const mergeLead = (...sources) => {

    const result = {};

    for (const source of sources) {

        if (!source) continue;

        for (const key of Object.keys(source)) {

            if (
                isValidValue(source[key])
            ) {

                result[key] = source[key];

            }

        }

    }

    return result;

};