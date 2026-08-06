/* ======================================================
   YASSIR TECH

   File:
   serviceAdvisor.js

   Description:
   Service Advisor.

   Responsibility:
   Recommends complementary services
   according to the customer's interests.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

const SERVICE_RELATIONS = {

    catering: [

        "Decoración",

        "Fotografía",

        "Barra libre"

    ],

    decoración: [

        "Iluminación",

        "Fotografía",

        "Centro de mesa"

    ],

    dj: [

        "Iluminación",

        "Máquina de humo",

        "Pista de baile"

    ],

    fotografía: [

        "Vídeo",

        "Drone",

        "Álbum Premium"

    ],

    música: [

        "DJ",

        "Iluminación",

        "Escenario"

    ]

};

/* ======================================================
   Service Advisor
====================================================== */

export const serviceAdvisor = (

    services = []

) => {

    if (

        !Array.isArray(

            services

        ) ||

        !services.length

    ) {

        return null;

    }

    const recommendations =

        new Set();

    services.forEach(

        service => {

            const related =

                SERVICE_RELATIONS[

                    service.toLowerCase()

                ];

            if (

                related

            ) {

                related.forEach(

                    item =>

                        recommendations.add(

                            item

                        )

                );

            }

        }

    );

    return {

        message:

            "✨ Basándonos en los servicios que te interesan, también solemos recomendar:",

        recommendations:

            [...recommendations]

    };

};