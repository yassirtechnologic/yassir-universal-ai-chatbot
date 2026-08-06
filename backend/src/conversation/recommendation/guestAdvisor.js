/* ======================================================
   YASSIR TECH

   File:
   guestAdvisor.js

   Description:
   Guest Advisor.

   Responsibility:
   Provides recommendations according
   to the estimated number of guests.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

export const guestAdvisor = (

    guests

) => {

    if (

        !guests ||

        isNaN(guests)

    ) {

        return null;

    }

    guests = Number(

        guests

    );

    /* ==========================================
       Small Event
    ========================================== */

    if (

        guests <= 30

    ) {

        return {

            size: "SMALL",

            message:

                "🎉 Será un evento íntimo, ideal para crear un ambiente cercano y personalizado.",

            recommendations: [

                "Decoración personalizada",

                "Fotografía",

                "Música ambiental"

            ]

        };

    }

    /* ==========================================
       Medium Event
    ========================================== */

    if (

        guests <= 100

    ) {

        return {

            size: "MEDIUM",

            message:

                "🎊 Con este número de invitados recomendamos una planificación completa para garantizar una experiencia fluida.",

            recommendations: [

                "Catering",

                "DJ",

                "Fotografía",

                "Decoración"

            ]

        };

    }

    /* ==========================================
       Large Event
    ========================================== */

    return {

        size: "LARGE",

        message:

            "🏆 Para un evento de estas dimensiones recomendamos una organización integral y un equipo dedicado.",

        recommendations: [

            "Catering Premium",

            "DJ",

            "Música en directo",

            "Fotografía",

            "Vídeo",

            "Coordinador del evento"

        ]

    };

};