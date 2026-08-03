/* ======================================================
   YASSIR TECH

   File:
   responseBuilder.js

   Description:
   Workflow response builder.

   Responsibility:
   Generates natural responses according to
   the workflow state.

   Author:
   Yassir Tech

   Version:
   3.0.0
====================================================== */

const responses = {

    es: {

        ASK_NOMBRE:
            "😊 Para comenzar, ¿cómo te llamas?",

        ASK_EVENTO:
            "🎉 Perfecto. ¿Qué tipo de evento estás organizando?",

        ASK_FECHA:
            "📅 ¿Para qué fecha está previsto el evento?",

        ASK_TELEFONO:
            "📞 Perfecto. ¿Podrías facilitarme un número de teléfono para que podamos contactar contigo si es necesario?",

        ASK_EMAIL:
            "📧 Muchas gracias. ¿Cuál es tu correo electrónico para poder enviarte el presupuesto y toda la información del evento?",

        ASK_CIUDAD:
            "📍 ¿En qué ciudad se celebrará el evento?",

        ASK_INVITADOS:
            "👥 Aproximadamente, ¿cuántos invitados asistirán?",

        ASK_PRESUPUESTO:
            "💰 ¿Tienes un presupuesto aproximado en mente? Si todavía no lo sabes, no pasa nada, puedes indicármelo más adelante.",

        ASK_SERVICIOS:
            "🎊 ¿Qué servicios necesitas? Por ejemplo: catering, decoración, DJ, música en directo, animación, fotografía, barra libre, etc.",

        ASK_COMENTARIOS:
            "📝 ¿Hay algún detalle adicional que te gustaría que tuviéramos en cuenta para preparar una propuesta lo más personalizada posible?",

        FINISH:
            "🎉 ¡Perfecto! Ya tengo toda la información necesaria. Nuestro equipo revisará tu solicitud y preparará una propuesta personalizada. Muy pronto nos pondremos en contacto contigo. 😊"

    },

    en: {

        ASK_NOMBRE:
            "😊 First of all, what is your name?",

        ASK_EVENTO:
            "🎉 What type of event are you planning?",

        ASK_FECHA:
            "📅 On what date will the event take place?",

        ASK_TELEFONO:
            "📞 Could you please provide your phone number?",

        ASK_EMAIL:
            "📧 What is your email address?",

        ASK_CIUDAD:
            "📍 In which city will the event take place?",

        ASK_INVITADOS:
            "👥 Approximately how many guests are expected?",

        ASK_PRESUPUESTO:
            "💰 Do you have an estimated budget in mind?",

        ASK_SERVICIOS:
            "🎊 Which services are you interested in?",

        ASK_COMENTARIOS:
            "📝 Is there anything else you would like us to know?",

        FINISH:
            "🎉 Perfect! We already have all the information needed."

    },

    de: {

        ASK_NOMBRE:
            "😊 Wie heißen Sie?",

        ASK_EVENTO:
            "🎉 Welche Art von Veranstaltung planen Sie?",

        ASK_FECHA:
            "📅 Wann findet die Veranstaltung statt?",

        ASK_TELEFONO:
            "📞 Könnten Sie uns Ihre Telefonnummer geben?",

        ASK_EMAIL:
            "📧 Wie lautet Ihre E-Mail-Adresse?",

        ASK_CIUDAD:
            "📍 In welcher Stadt findet die Veranstaltung statt?",

        ASK_INVITADOS:
            "👥 Mit wie vielen Gästen rechnen Sie ungefähr?",

        ASK_PRESUPUESTO:
            "💰 Haben Sie bereits ein ungefähres Budget?",

        ASK_SERVICIOS:
            "🎊 Welche Dienstleistungen benötigen Sie?",

        ASK_COMENTARIOS:
            "📝 Gibt es noch etwas, das wir wissen sollten?",

        FINISH:
            "🎉 Perfekt! Wir haben alle notwendigen Informationen."

    }

};

/* ======================================================
   Build Workflow Response
====================================================== */

export const buildWorkflowResponse = (
    workflow,
    language = "es",
    lead = {}
) => {

    const lang =
        responses[language] || responses.es;

    /* ==========================================
    Nombre del cliente
    ========================================== */

    const nombre = lead.nombre
        ? ` ${lead.nombre}`
        : "";

    /* ==========================================
    Respuestas personalizadas
    ========================================== */

    switch (workflow.next) {

        case "ASK_EVENTO":

            return `Encantado de conocerte${nombre}. 😊\n\n${lang.ASK_EVENTO}`;

        case "ASK_FECHA":

            return `Perfecto${nombre}. 👍\n\n${lang.ASK_FECHA}`;

        case "ASK_TELEFONO":

            return `Muy bien${nombre}. Ya tengo anotado el tipo de evento.\n\n${lang.ASK_TELEFONO}`;

        case "ASK_EMAIL":

            return `Gracias${nombre}. 📞 Hemos registrado tu teléfono.\n\n${lang.ASK_EMAIL}`;

        case "ASK_CIUDAD":

            return `Perfecto${nombre}. 📧 Ya tengo tu correo electrónico.\n\n${lang.ASK_CIUDAD}`;

        case "ASK_INVITADOS":

            return `Genial${nombre}. 📍 Ahora necesito saber dónde será el evento.\n\n${lang.ASK_INVITADOS}`;

        case "ASK_PRESUPUESTO":

            return `Perfecto${nombre}. 👥 Ya tengo el número aproximado de invitados.\n\n${lang.ASK_PRESUPUESTO}`;

        case "ASK_SERVICIOS":

            return `Excelente${nombre}. 💰 Ahora cuéntame qué servicios necesitas.\n\n${lang.ASK_SERVICIOS}`;

        case "ASK_COMENTARIOS":

            return `Ya casi terminamos${nombre}. 😊\n\n${lang.ASK_COMENTARIOS}`;

        default:

            return (
                lang[workflow.next] ||
                lang.FINISH
            );

    }

};