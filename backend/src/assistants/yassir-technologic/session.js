/* ==========================================================
   YASSIR TECHNOLOGIC

   File:
   session.js

   Description:
   Yassir Technologic conversation session manager.

   Responsibility:
   Stores and manages isolated commercial conversation
   state, lead qualification, contact intent,
   persistence status and notification status.

   Author:
   Yassir Technologic

   Version:
   2.1.0
========================================================== */


/* ==========================================================
   IMPORTS
========================================================== */

import {
    createEmptyTechLead,
    isTechLeadQualified
} from "./leadSchema.js";


/* ==========================================================
   SESSION STORE
========================================================== */

/*
 * Current implementation:
 * in-memory session storage.
 *
 * This storage is intentionally isolated behind this
 * module so it can later be replaced by PostgreSQL,
 * Redis or another persistent storage system.
 */

const sessions =
    new Map();


/* ==========================================================
   VALIDATE CONVERSATION ID
========================================================== */

function normalizeConversationId(
    conversationId
) {

    if (
        typeof conversationId !== "string"
    ) {

        throw new TypeError(
            "conversationId must be a string."
        );

    }


    const normalized =
        conversationId.trim();


    if (!normalized) {

        throw new Error(
            "conversationId is required."
        );

    }


    return normalized;

}


/* ==========================================================
   CREATE PERSISTENCE STATE
========================================================== */

function createPersistenceState() {

    return {

        saved:
            false,

        leadId:
            null,

        savedAt:
            null,

        updatedAt:
            null

    };

}


/* ==========================================================
   CREATE CONTACT STATE
========================================================== */

/*
 * Contact intent is kept separate from lead qualification.
 *
 * A visitor may provide contact information without
 * explicitly requesting commercial follow-up.
 */

function createContactState() {

    return {

        requested:
            false,

        requestedAt:
            null

    };

}


/* ==========================================================
   CREATE NOTIFICATION STATE
========================================================== */

function createNotificationState() {

    return {

        /* ==================================================
           BUSINESS EMAIL
        ================================================== */

        businessEmailSent:
            false,

        businessEmailSentAt:
            null,


        /* ==================================================
           CUSTOMER EMAIL
        ================================================== */

        customerEmailSent:
            false,

        customerEmailSentAt:
            null

    };

}


/* ==========================================================
   CREATE SESSION
========================================================== */

function createSession(
    conversationId
) {

    const now =
        new Date().toISOString();


    return {

        conversationId,

        language:
            "es",

        lead:
            createEmptyTechLead(),

        qualified:
            false,

        qualifiedAt:
            null,

        contact:
            createContactState(),

        persistence:
            createPersistenceState(),

        notifications:
            createNotificationState(),

        createdAt:
            now,

        updatedAt:
            now

    };

}


/* ==========================================================
   GET SESSION
========================================================== */

export function getTechSession(
    conversationId
) {

    const id =
        normalizeConversationId(
            conversationId
        );


    if (
        !sessions.has(id)
    ) {

        sessions.set(
            id,
            createSession(id)
        );

    }


    return sessions.get(id);

}


/* ==========================================================
   UPDATE SESSION
========================================================== */

export function updateTechSession(
    conversationId,
    updates = {}
) {

    const session =
        getTechSession(
            conversationId
        );


    if (
        !updates ||
        typeof updates !== "object" ||
        Array.isArray(updates)
    ) {

        return session;

    }


    const updatedSession = {

        ...session,

        ...updates,

        /*
         * Protected fields.
         */

        conversationId:
            session.conversationId,

        createdAt:
            session.createdAt,

        updatedAt:
            new Date().toISOString()

    };


    /* ======================================================
       QUALIFICATION
    ====================================================== */

    if (
        updates.lead
    ) {

        const qualified =
            isTechLeadQualified(
                updates.lead
            );


        updatedSession.qualified =
            qualified;


        /*
         * Store the first moment at which the opportunity
         * became qualified.
         */

        if (
            qualified &&
            !session.qualifiedAt
        ) {

            updatedSession.qualifiedAt =
                new Date().toISOString();

        } else {

            updatedSession.qualifiedAt =
                session.qualifiedAt;

        }

    }


    /* ======================================================
       PROTECT CONTACT STATE
    ====================================================== */

    updatedSession.contact = {

        ...session.contact,

        ...(updates.contact || {})

    };


    /* ======================================================
       PROTECT PERSISTENCE STATE
    ====================================================== */

    updatedSession.persistence = {

        ...session.persistence,

        ...(updates.persistence || {})

    };


    /* ======================================================
       PROTECT NOTIFICATION STATE
    ====================================================== */

    updatedSession.notifications = {

        ...session.notifications,

        ...(updates.notifications || {})

    };


    sessions.set(
        session.conversationId,
        updatedSession
    );


    return updatedSession;

}


/* ==========================================================
   UPDATE LANGUAGE
========================================================== */

export function updateTechSessionLanguage(
    conversationId,
    language
) {

    const normalizedLanguage =
        language === "en"
            ? "en"
            : "es";


    return updateTechSession(
        conversationId,
        {

            language:
                normalizedLanguage

        }
    );

}


/* ==========================================================
   UPDATE LEAD
========================================================== */

export function updateTechSessionLead(
    conversationId,
    lead
) {

    return updateTechSession(
        conversationId,
        {

            lead

        }
    );

}


/* ==========================================================
   MARK CONTACT REQUESTED
========================================================== */

export function markTechContactRequested(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return updateTechSession(
        conversationId,
        {

            contact: {

                ...session.contact,

                requested:
                    true,

                requestedAt:
                    session.contact
                        ?.requestedAt ||
                    new Date().toISOString()

            }

        }
    );

}

/* ==========================================================
   MARK CONTACT REJECTED
========================================================== */

/*
 * Allows the visitor to withdraw a previous
 * request for commercial contact.
 */

export function markTechContactRejected(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return updateTechSession(
        conversationId,
        {

            contact: {

                ...session.contact,

                requested:
                    false,

                requestedAt:
                    null

            }

        }
    );

}

/* ==========================================================
   HAS CONTACT BEEN REQUESTED
========================================================== */

export function hasTechContactBeenRequested(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return (
        session.contact
            ?.requested === true
    );

}


/* ==========================================================
   MARK LEAD AS PERSISTED
========================================================== */

export function markTechLeadPersisted(
    conversationId,
    persistedLead
) {

    const session =
        getTechSession(
            conversationId
        );


    const now =
        new Date().toISOString();


    return updateTechSession(
        conversationId,
        {

            persistence: {

                ...session.persistence,

                saved:
                    true,

                leadId:
                    persistedLead?.id ||
                    session.persistence.leadId ||
                    null,

                savedAt:
                    session.persistence.savedAt ||
                    now,

                updatedAt:
                    now

            }

        }
    );

}


/* ==========================================================
   HAS LEAD BEEN PERSISTED
========================================================== */

export function hasTechLeadBeenPersisted(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return Boolean(
        session.persistence?.saved
    );

}


/* ==========================================================
   MARK BUSINESS EMAIL SENT
========================================================== */

export function markTechBusinessEmailSent(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return updateTechSession(
        conversationId,
        {

            notifications: {

                ...session.notifications,

                businessEmailSent:
                    true,

                businessEmailSentAt:
                    session.notifications
                        ?.businessEmailSentAt ||
                    new Date().toISOString()

            }

        }
    );

}


/* ==========================================================
   MARK CUSTOMER EMAIL SENT
========================================================== */

export function markTechCustomerEmailSent(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return updateTechSession(
        conversationId,
        {

            notifications: {

                ...session.notifications,

                customerEmailSent:
                    true,

                customerEmailSentAt:
                    session.notifications
                        ?.customerEmailSentAt ||
                    new Date().toISOString()

            }

        }
    );

}


/* ==========================================================
   SHOULD SEND BUSINESS EMAIL
========================================================== */

/*
 * Business notification is allowed only when:
 *
 * - opportunity is qualified
 * - lead has been persisted
 * - visitor explicitly requested contact
 * - notification has not been sent before
 */

export function shouldSendTechBusinessEmail(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return (

        session.qualified === true &&

        session.persistence
            ?.saved === true &&

        session.contact
            ?.requested === true &&

        session.notifications
            ?.businessEmailSent !== true

    );

}


/* ==========================================================
   SHOULD SEND CUSTOMER EMAIL
========================================================== */

/*
 * Customer confirmation additionally requires
 * a valid email to exist in the lead.
 */

export function shouldSendTechCustomerEmail(
    conversationId
) {

    const session =
        getTechSession(
            conversationId
        );


    return (

        session.qualified === true &&

        session.persistence
            ?.saved === true &&

        session.contact
            ?.requested === true &&

        Boolean(
            session.lead?.email
        ) &&

        session.notifications
            ?.customerEmailSent !== true

    );

}


/* ==========================================================
   RESET SESSION
========================================================== */

export function resetTechSession(
    conversationId
) {

    const id =
        normalizeConversationId(
            conversationId
        );


    const newSession =
        createSession(
            id
        );


    sessions.set(
        id,
        newSession
    );


    return newSession;

}


/* ==========================================================
   DELETE SESSION
========================================================== */

export function deleteTechSession(
    conversationId
) {

    const id =
        normalizeConversationId(
            conversationId
        );


    return sessions.delete(
        id
    );

}


/* ==========================================================
   SESSION EXISTS
========================================================== */

export function hasTechSession(
    conversationId
) {

    if (
        typeof conversationId !== "string" ||
        !conversationId.trim()
    ) {

        return false;

    }


    return sessions.has(
        conversationId.trim()
    );

}