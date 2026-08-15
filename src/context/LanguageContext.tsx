"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, Dictionary, getDictionarySync } from "@/dictionaries";
import { FiX } from "react-icons/fi";
import styles from "./LanguageToast.module.css";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dict: Dictionary;
}

const FLAG_URLS: Record<Language, string> = {
  it: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="%23009246"/><rect x="1" width="1" height="2" fill="%23fff"/><rect x="2" width="1" height="2" fill="%23ce2b37"/></svg>`,
  en: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="s"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="t"><path d="M30 15h30v15zH0zM0 0h30v15z"/></clipPath><g clip-path="url(%23s)"><path d="M0 0v30h60V0z" fill="%23012169"/><path d="M0 0l60 30m0-30L0 30" stroke="%23fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(%23t)" stroke="%23C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="%23fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="%23C8102E" stroke-width="6"/></g></svg>`,
  es: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23c60b1e"/><rect y="0.5" width="3" height="1" fill="%23ffc400"/></svg>`,
  fr: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="%23002395"/><rect x="1" width="1" height="2" fill="%23fff"/><rect x="2" width="1" height="2" fill="%23ed2939"/></svg>`,
  de: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><rect width="5" height="3" fill="%23000"/><rect y="1" width="5" height="2" fill="%23dd0000"/><rect y="2" width="5" height="1" fill="%23ffce00"/></svg>`,
  ja: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><circle cx="1.5" cy="1" r="0.6" fill="%23bc002d"/></svg>`,
  ru: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><rect y="0.666" width="3" height="1.334" fill="%230039a6"/><rect y="1.333" width="3" height="0.667" fill="%23d52b1e"/></svg>`,
  pt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23ff0000"/><rect width="1.2" height="2" fill="%23006600"/><circle cx="1.2" cy="1" r="0.4" fill="%23ffcc00"/></svg>`,
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "it",
  setLang: () => {},
  dict: getDictionarySync("it"),
});

const SUPPORTED_LANGS: Language[] = ["it", "en", "es", "fr", "de", "ja", "ru", "pt"];

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLang?: Language }> = ({
  children,
  initialLang = "en",
}) => {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastFlagUrl, setToastFlagUrl] = useState<string>(FLAG_URLS.en);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio_lang") as Language | null;
      if (saved && SUPPORTED_LANGS.includes(saved)) {
        setLangState(saved);
      } else if (typeof navigator !== "undefined") {
        const userLang = navigator.language.toLowerCase();
        let detected: Language = "en";
        let isSupported = false;

        if (userLang.startsWith("it")) {
          detected = "it";
          isSupported = true;
        } else if (userLang.startsWith("es")) {
          detected = "es";
          isSupported = true;
        } else if (userLang.startsWith("fr")) {
          detected = "fr";
          isSupported = true;
        } else if (userLang.startsWith("de")) {
          detected = "de";
          isSupported = true;
        } else if (userLang.startsWith("ja")) {
          detected = "ja";
          isSupported = true;
        } else if (userLang.startsWith("ru")) {
          detected = "ru";
          isSupported = true;
        } else if (userLang.startsWith("pt")) {
          detected = "pt";
          isSupported = true;
        } else if (userLang.startsWith("en")) {
          detected = "en";
          isSupported = true;
        }

        setLangState(detected);
        setToastFlagUrl(FLAG_URLS[detected]);

        const currentDict = getDictionarySync(detected);
        const toastDict = currentDict.toast;

        let msg = "";
        if (isSupported) {
          if (detected === "it") msg = toastDict.detectedIt;
          else if (detected === "es") msg = toastDict.detectedEs;
          else if (detected === "fr") msg = toastDict.detectedFr;
          else if (detected === "de") msg = toastDict.detectedDe;
          else if (detected === "ja") msg = toastDict.detectedJa;
          else if (detected === "ru") msg = toastDict.detectedRu;
          else if (detected === "pt") msg = toastDict.detectedPt;
          else msg = toastDict.detectedEn;
        } else {
          msg = toastDict.fallback;
        }

        setToastMessage(msg);
        setToastVisible(true);

        const timer = setTimeout(() => {
          setToastVisible(false);
        }, 6000);

        return () => clearTimeout(timer);
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
      
      {/* Sleek Floating Glass Toast Notification */}
      {toastVisible && toastMessage && (
        <div className={styles.toastContainer} role="alert">
          <div className={styles.toastCard}>
            <div className={styles.toastIconWrap}>
              <img
                src={toastFlagUrl}
                alt="Flag"
                style={{ width: 18, height: 13, objectFit: "cover", borderRadius: 3 }}
              />
            </div>
            <p className={styles.toastText}>{toastMessage}</p>
            <button
              onClick={() => setToastVisible(false)}
              className={styles.toastCloseBtn}
              aria-label="Close notification"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
