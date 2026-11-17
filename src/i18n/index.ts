import type { Locale } from "@/site.config";
import { en } from "./en";
import { th } from "./th";
import type { Dict } from "./types";

const dictionaries: Record<Locale, Dict> = { en, th };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}

export type { Dict };
