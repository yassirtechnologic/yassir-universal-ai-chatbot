/* ======================================================
   YASSIR TECH

   File:
   conversationState.js

   Description:
   Conversation State Manager.

   Responsibility:
   Stores the temporary state of each
   conversation while the customer is chatting.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

const conversations = new Map();

/* ======================================================
   Get State
====================================================== */

export const getConversationState = (

    conversationId

) => {

    if (

        !conversations.has(conversationId)

    ) {

        conversations.set(

            conversationId,

            {

                skippedFields: [],

                completedFields: [],

                currentField: null

            }

        );

    }

    return conversations.get(

        conversationId

    );

};

/* ======================================================
   Update State
====================================================== */

export const updateConversationState = (

    conversationId,

    updates

) => {

    const state =

        getConversationState(

            conversationId

        );

    Object.assign(

        state,

        updates

    );

    return state;

};

/* ======================================================
   Reset State
====================================================== */

export const clearConversationState = (

    conversationId

) => {

    conversations.delete(

        conversationId

    );

};