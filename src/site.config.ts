/**
 * Site-wide settings. Contact values are intentionally empty: fill them in
 * before launch. An empty value hides that row in the contact section.
 */
export const site = {
  name: "WealthHarvest",
  url: "https://wealthharvest.dev",
  contact: {
    /** Used for the main call to action as a mailto link. */
    email: "",
    /** Full URL of a messaging channel, for example a LINE Official Account link. */
    messaging: "",
    /** Free text, for example a city and country. */
    location: "",
    /** Full URL of one public social profile. */
    social: "",
  },
} as const;

export const locales = ["en", "th"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
