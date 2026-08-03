/* ======================================================
   YASSIR TECH

   File:
   createCalendarEvent.action.js

   Description:
   Calendar Action.

   Responsibility:
   Creates a Google Calendar event.

   Author:
   Yassir Tech

   Version:
   1.0.0
====================================================== */

import {

    createCalendarEvent

} from "../services/calendar.service.js";

export const createCalendarEventAction = async (

    lead

) => {

    return await createCalendarEvent(

        lead

    );

};