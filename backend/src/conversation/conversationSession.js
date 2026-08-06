/* ======================================================
   YASSIR TECH

   File:
   conversationSession.js

   Description:
   Conversation Session Manager.

   Responsibility:
   Creates, stores and manages the complete
   state of every conversation.

   This file becomes the single source of truth
   for the conversation engine.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

const sessions = new Map();

/* ======================================================
   Create Session
====================================================== */

const createSession = (

    conversationId

) => ({

    id: conversationId,

    language: "es",

    lead: {},

    workflow: {

        completed: false,

        currentField: null,

        nextField: null,

        completedFields: [],

        skippedFields: []

    },

    memory: {},

    history: [],

    intent: null,

    actions: [],

    finished: false,

    createdAt: new Date(),

    updatedAt: new Date()

});

/* ======================================================
   Get Session
====================================================== */

export const getConversationSession = (

    conversationId

) => {

    if (

        !sessions.has(conversationId)

    ) {

        sessions.set(

            conversationId,

            createSession(

                conversationId

            )

        );

    }

    return sessions.get(

        conversationId

    );

};

/* ======================================================
   Update Session
====================================================== */

export const updateConversationSession = (

    conversationId,

    updates = {}

) => {

    const session =

        getConversationSession(

            conversationId

        );

    Object.assign(

        session,

        updates

    );

    session.updatedAt =

        new Date();

    return session;

};

/* ======================================================
   Update Lead
====================================================== */

export const updateLead = (

    conversationId,

    lead = {}

) => {

    const session =

        getConversationSession(

            conversationId

        );

    session.lead = {

        ...session.lead,

        ...lead

    };

    session.updatedAt =

        new Date();

    return session;

};

/* ======================================================
   Update Workflow
====================================================== */

export const updateWorkflow = (

    conversationId,

    workflow = {}

) => {

    const session =

        getConversationSession(

            conversationId

        );

    session.workflow = {

        ...session.workflow,

        ...workflow

    };

    session.updatedAt =

        new Date();

    return session;

};

/* ======================================================
   Add History Message
====================================================== */

export const addHistoryMessage = (

    conversationId,

    message

) => {

    const session =

        getConversationSession(

            conversationId

        );

    session.history.push(

        message

    );

    session.updatedAt =

        new Date();

    return session;

};

/* ======================================================
   Finish Conversation
====================================================== */

export const finishConversation = (

    conversationId

) => {

    const session =

        getConversationSession(

            conversationId

        );

    session.finished = true;

    session.updatedAt =

        new Date();

    return session;

};

/* ======================================================
   Delete Session
====================================================== */

export const clearConversationSession = (

    conversationId

) => {

    sessions.delete(

        conversationId

    );

};

/* ======================================================
   Get All Sessions
   (Debug Only)
====================================================== */

export const getAllSessions = () =>

    sessions;