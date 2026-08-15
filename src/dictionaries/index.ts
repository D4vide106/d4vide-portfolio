import it from "./it.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import de from "./de.json";
import ja from "./ja.json";
import ru from "./ru.json";
import pt from "./pt.json";

export type Language = "it" | "en" | "es" | "fr" | "de" | "ja" | "ru" | "pt";

export const dictionaries = {
  it,
  en,
  es,
  fr,
  de,
  ja,
  ru,
  pt,
};

export type Dictionary = typeof it;

export function getDictionarySync(lang: Language): Dictionary {
  return dictionaries[lang] || dictionaries.en;
}
