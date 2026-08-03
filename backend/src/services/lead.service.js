/* ======================================================
   YASSIR TECH

   File:
   lead.service.js

   Description:
   Lead persistence service.

   Responsibility:
   Stores validated leads into the local database
   (JSON for development).

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

import fs from "fs";
import path from "path";
import crypto from "crypto";

const leadsFile = path.join(
    process.cwd(),
    "backend",
    "data",
    "leads.json"
);

/* ======================================================
   Ensure storage exists
====================================================== */

const ensureStorage = () => {

    const dir = path.dirname(leadsFile);

    if (!fs.existsSync(dir)) {

        fs.mkdirSync(dir, {
            recursive: true
        });

    }

    if (!fs.existsSync(leadsFile)) {

        fs.writeFileSync(
            leadsFile,
            "[]"
        );

    }

};

/* ======================================================
   Read Leads
====================================================== */

const readLeads = () => {

    ensureStorage();

    return JSON.parse(

        fs.readFileSync(
            leadsFile,
            "utf8"
        )

    );

};

/* ======================================================
   Save Leads
====================================================== */

const writeLeads = (leads) => {

    fs.writeFileSync(

        leadsFile,

        JSON.stringify(
            leads,
            null,
            2
        )

    );

};

/* ======================================================
   Save Lead
====================================================== */

export const saveLead = async (
    lead,
    language = "es"
) => {

    try {

        const leads =
            readLeads();

        /* ==========================
           Avoid duplicates
        ========================== */

        const exists =
            leads.find(

                l =>

                    l.telefono === lead.telefono ||

                    (

                        lead.email &&

                        l.email === lead.email

                    )

            );

        if (exists) {

            return {

                saved: false,

                reason: "Lead already exists",

                lead: exists

            };

        }

        /* ==========================
           Create Lead Record
        ========================== */

        const newLead = {

            id:
                crypto.randomUUID(),

            createdAt:
                new Date().toISOString(),

            status:
                "Nuevo",

            source:
                "Website Chatbot",

            language,

            nombre:
                lead.nombre || null,

            telefono:
                lead.telefono || null,

            email:
                lead.email || null,

            evento:
                lead.evento || null,

            fecha:
                lead.fecha || null,

            ciudad:
                lead.ciudad || null,

            invitados:
                lead.invitados || null,

            presupuesto:
                lead.presupuesto || null,

            servicios:
                lead.servicios || [],

            comentarios:
                lead.comentarios || null

        };

        leads.push(
            newLead
        );

        writeLeads(
            leads
        );

        return {

            saved: true,

            lead: newLead

        };

    }

    catch (error) {

        console.error(
            "❌ Lead Service:",
            error
        );

        return {

            saved: false,

            error:
                error.message

        };

    }

};
