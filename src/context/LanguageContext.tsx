"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Dictionary, getDictionarySync } from "@/dictionaries";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "it",
  setLang: () => {},
  dict: getDictionarySync("it"),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLang?: Language }> = ({
  children,
  initialLang = "it",
}) => {
  const [lang, setLangState] = useState<Language>(initialLang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio_lang") as Language | null;
      if (saved && (saved === "it" || saved === "en" || saved === "es")) {
        setLangState(saved);
      } else if (typeof navigator !== "undefined") {
        const userLang = navigator.language.toLowerCase();
        if (userLang.startsWith("es")) setLangState("es");
        else if (userLang.startsWith("en")) setLangState("en");
        else setLangState("it");
      }
    } catch {}
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("portfolio_lang", newLang);
    } catch {}
  };

  const dict = getDictionarySync(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, dict }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
