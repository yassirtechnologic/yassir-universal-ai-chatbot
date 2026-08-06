/* ======================================================
   YASSIR TECH

   File:
   budgetAdvisor.js

   Description:
   Budget Advisor.

   Responsibility:
   Provides recommendations according
   to the customer's estimated budget.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

export const budgetAdvisor = (

    budget

) => {

    if (

        !budget ||

        isNaN(budget)

    ) {

        return null;

    }

    budget = Number(

        budget

    );

    /* ==========================================
       Low Budget
    ========================================== */

    if (

        budget < 1000

    ) {

        return {

            level: "LOW",

            message:

                "💡 Con este presupuesto podemos preparar una propuesta sencilla y bien optimizada.",

            recommendations: [

                "Decoración básica",

                "DJ",

                "Fotografía"

            ]

        };

    }

    /* ==========================================
       Medium Budget
    ========================================== */

    if (

        budget <= 3000

    ) {

        return {

            level: "MEDIUM",

            message:

                "✨ Con este presupuesto podemos ofrecer un evento muy completo y totalmente personalizado.",

            recommendations: [

                "Decoración Premium",

                "Catering",

                "DJ",

                "Fotografía"

            ]

        };

    }

    /* ==========================================
       Premium Budget
    ========================================== */

    return {

        level: "PREMIUM",

        message:

            "👑 Con este presupuesto podemos diseñar una experiencia exclusiva con todos nuestros servicios Premium.",

        recommendations: [

            "Decoración Premium",

            "Catering Gourmet",

            "DJ",

            "Música en directo",

            "Fotografía",

            "Vídeo",

            "Barra libre"

        ]

    };

};