/* ======================================================
   YASSIR TECH

   File:
   api.js

   Description:
   Communication layer between the frontend
   and the AI Backend.

   Responsibility:
   Sends the complete conversation together
   with a unique Conversation ID.

   Author:
   Yassir Tech

   Version:
   3.0.0
====================================================== */

const API_URL = "http://yassirbot-backend.onrender.com/api/ai/chat";

/* ======================================================
   Conversation ID
====================================================== */

const STORAGE_KEY = "yassir_conversation_id";

const getConversationId = () => {

    let conversationId =
        localStorage.getItem(STORAGE_KEY);

    if (!conversationId) {

        conversationId =
            crypto.randomUUID();

        localStorage.setItem(

            STORAGE_KEY,

            conversationId

        );

        console.log(
            "🆕 Conversation ID:",
            conversationId
        );

    }

    return conversationId;

};

/* ======================================================
   Reset Conversation
====================================================== */

export const resetConversation = () => {

    localStorage.removeItem(
        STORAGE_KEY
    );

};

/* ======================================================
   Send Conversation
====================================================== */

export const sendMessage = async (payload) => {

    try {

        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                },

                body: JSON.stringify({

                    conversationId:
                        getConversationId(),

                    messages:
                        payload.messages || []

                }),

            });

        const data =
            await response.json();

        if (!response.ok) {

            return {

                reply:

                    data?.reply ||

                    "❌ Error del servidor."

            };

        }

        return data;

    }

    catch (error) {

        console.error(

            "❌ API Error:",

            error

        );

        return {

            reply:
                "❌ No se pudo conectar con el servidor."

        };

    }

};
















