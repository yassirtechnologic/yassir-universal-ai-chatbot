/* ======================================================
   YASSIR TECH

   File:
   eventAdvisor.js

   Description:
   Event Advisor.

   Responsibility:
   Provides intelligent recommendations
   according to the event type.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

const EVENT_RECOMMENDATIONS = {

    boda: {

        services: [

            "Decoración Premium",
            "Catering",
            "Fotografía",
            "Vídeo",
            "DJ",
            "Música en directo",
            "Barra libre"

        ],

        message:

            "💍 Para una boda solemos recomendar un servicio completo para que no tengas que preocuparte por nada."

    },

    cumpleaños: {

        services: [

            "Decoración",
            "Animación",
            "DJ",
            "Catering"

        ],

        message:

            "🎂 Para un cumpleaños podemos adaptar todos los servicios al número de invitados y al presupuesto."

    },

    bautizo: {

        services: [

            "Decoración",
            "Catering",
            "Fotografía"

        ],

        message:

            "👶 Para un bautizo solemos preparar un ambiente familiar y elegante."

    },

    comunión: {

        services: [

            "Decoración",
            "Animación",
            "Fotografía",
            "Catering"

        ],

        message:

            "✨ Para una comunión recomendamos una combinación de animación y catering."

    },

    corporativo: {

        services: [

            "Catering",
            "Audiovisuales",
            "Fotografía",
            "Decoración"

        ],

        message:

            "🏢 Para eventos corporativos diseñamos soluciones totalmente personalizadas."

    }

};

/* ======================================================
   Event Advisor
====================================================== */

export const eventAdvisor = (

    eventType = ""

) => {

    const event =

        eventType

            .toLowerCase()

            .trim();

    return (

        EVENT_RECOMMENDATIONS[event] ||

        null

    );

};