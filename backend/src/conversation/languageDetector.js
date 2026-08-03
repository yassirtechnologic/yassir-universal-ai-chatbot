/* ======================================================
   YASSIR TECH

   File:
   languageDetector.js

   Description:
   Detects the user's language.

   Responsibility:
   Returns the most probable language code based
   on the user's message.

   Author:
   Yassir Tech

   Version:
   2.0.0
====================================================== */

/**
 * Detect user language.
 *
 * Supported:
 * - es
 * - en
 * - de
 */
export const detectLanguage = (text = "") => {

  const t = String(text)
    .toLowerCase()
    .trim();

  /* ===============================
     🇩🇪 German
  =============================== */

  if (
    /\b(hallo|bitte|hochzeit|veranstaltung|personen|datum|uhr|danke|guten)\b/.test(t)
  ) {
    return "de";
  }

  /* ===============================
     🇬🇧 English
  =============================== */

  if (
    /\b(hello|hi|please|event|price|wedding|people|date|time|thanks)\b/.test(t)
  ) {
    return "en";
  }

  /* ===============================
     🇪🇸 Default
  =============================== */

  return "es";

};