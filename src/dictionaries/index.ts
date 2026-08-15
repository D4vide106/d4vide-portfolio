import it from "./it.json";
import en from "./en.json";
import es from "./es.json";

export type Language = "it" | "en" | "es";

export const dictionaries = {
  it,
  en,
  es,
};

export type Dictionary = typeof it;

export function getDictionarySync(lang: Language): Dictionary {
  return dictionaries[lang] || dictionaries.it;
}
