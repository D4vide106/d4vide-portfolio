"use client";

import { useState, useEffect, useRef } from "react";
import { FiGlobe, FiMenu, FiX, FiChevronDown, FiCheck } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import styles from "./TopBar.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/dictionaries";

export const LANGUAGES: { code: Language; name: string; flagUrl: string }[] = [
  {
    code: "it",
    name: "Italiano",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="%23009246"/><rect x="1" width="1" height="2" fill="%23fff"/><rect x="2" width="1" height="2" fill="%23ce2b37"/></svg>`,
  },
  {
    code: "en",
    name: "English",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="s"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="t"><path d="M30 15h30v15zH0zM0 0h30v15z"/></clipPath><g clip-path="url(%23s)"><path d="M0 0v30h60V0z" fill="%23012169"/><path d="M0 0l60 30m0-30L0 30" stroke="%23fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(%23t)" stroke="%23C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="%23fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="%23C8102E" stroke-width="6"/></g></svg>`,
  },
  {
    code: "es",
    name: "Español",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23c60b1e"/><rect y="0.5" width="3" height="1" fill="%23ffc400"/></svg>`,
  },
  {
    code: "fr",
    name: "Français",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="1" height="2" fill="%23002395"/><rect x="1" width="1" height="2" fill="%23fff"/><rect x="2" width="1" height="2" fill="%23ed2939"/></svg>`,
  },
  {
    code: "de",
    name: "Deutsch",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3"><rect width="5" height="3" fill="%23000"/><rect y="1" width="5" height="2" fill="%23dd0000"/><rect y="2" width="5" height="1" fill="%23ffce00"/></svg>`,
  },
  {
    code: "ja",
    name: "日本語",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><circle cx="1.5" cy="1" r="0.6" fill="%23bc002d"/></svg>`,
  },
  {
    code: "ru",
    name: "Русский",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23fff"/><rect y="0.666" width="3" height="1.334" fill="%230039a6"/><rect y="1.333" width="3" height="0.667" fill="%23d52b1e"/></svg>`,
  },
  {
    code: "pt",
    name: "Português",
    flagUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23ff0000"/><rect width="1.2" height="2" fill="%23006600"/><circle cx="1.2" cy="1" r="0.4" fill="%23ffcc00"/></svg>`,
  },
];

export default function TopBar({ dict: propDict }: { dict?: any; currentLang?: string }) {
  const { lang, setLang, dict: contextDict } = useLanguage();
  const dict = contextDict.nav || propDict;
  const langDict = (contextDict as any)?.languages || {};

  const getLangName = (item: { code: Language; name: string }) => {
    return langDict[item.code] || item.name;
  };

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLang = (code: Language) => {
    setLang(code);
    setLangDropdownOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header
      className={`${styles.topBar} ${scrolled ? styles.topBarScrolled : ""} ${
        mobileMenuOpen ? styles.topBarExpanded : ""
      }`}
    >
      <div className={styles.container}>
        {/* Left: Brand with avatar & live status dot */}
        <div className={styles.logo}>
          <a href="#hero" className={styles.brandLink} onClick={(e) => handleNavClick(e, "hero")}>
            <div className={styles.avatarWrap}>
              <img
                src="https://mc-heads.net/avatar/_D4vide106_/32"
                alt="_D4vide106_"
                className={styles.avatarImg}
              />
              <span className={styles.onlineDot} title="Online & Active" />
            </div>
            <span className={styles.brandMain}>D4VIDE106</span>
          </a>
        </div>

        {/* Center: Apple Segmented Pill Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            <li>
              <a href="#projects" className={styles.menuLink} onClick={(e) => handleNavClick(e, "projects")}>
                {dict.projects || "WORKS"}
              </a>
            </li>
            <li>
              <a href="#about" className={styles.menuLink} onClick={(e) => handleNavClick(e, "about")}>
                {dict.about || "ABOUT"}
              </a>
            </li>
            <li>
              <a href="#youtube" className={styles.menuLink} onClick={(e) => handleNavClick(e, "youtube")}>
                {dict.media || "MEDIA"}
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Quick Community CTA, Language Switcher Dropdown & Mobile Toggle */}
        <div className={styles.actions}>
          <a
            href="https://discord.gg/7T3u9a9"
            target="_blank"
            rel="noreferrer"
            className={styles.discordBtn}
            title="Join Discord Community"
          >
            <SiDiscord size={14} />
            <span className={styles.actionText}>{dict.community || "Community"}</span>
          </a>

          {/* EnderClub-Inspired Dropdown Switcher */}
          <div className={styles.langDropdownWrapper} ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`${styles.langDropdownBtn} ${
                langDropdownOpen ? styles.langDropdownBtnActive : ""
              }`}
              aria-label="Select Language"
            >
              <FiGlobe size={14} className={styles.globeIcon} />
              <img
                src={currentLangObj.flagUrl}
                alt={currentLangObj.name}
                className={styles.flagIconImg}
              />
              <FiChevronDown
                size={12}
                className={`${styles.chevronIcon} ${
                  langDropdownOpen ? styles.chevronRotated : ""
                }`}
              />
            </button>

            {langDropdownOpen && (
              <div className={styles.langMenu}>
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleSelectLang(item.code)}
                    className={`${styles.langMenuItem} ${
                      lang === item.code ? styles.langMenuItemActive : ""
                    }`}
                  >
                    <img
                      src={item.flagUrl}
                      alt={getLangName(item)}
                      className={styles.flagIconImgItem}
                    />
                    <span className={styles.itemName}>{getLangName(item)}</span>
                    {lang === item.code && (
                      <FiCheck size={13} className={styles.checkIcon} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileToggleBtn}
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Apple Glass Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <nav className={styles.mobileNav}>
            <a href="#projects" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, "projects")}>
              {dict.projects || "WORKS"}
            </a>
            <a href="#about" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, "about")}>
              {dict.about || "ABOUT"}
            </a>
            <a href="#youtube" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, "youtube")}>
              {dict.media || "MEDIA"}
            </a>
          </nav>

          <div className={styles.mobileActionsRow}>
            <a
              href="https://discord.gg/7T3u9a9"
              target="_blank"
              rel="noreferrer"
              className={styles.mobileDiscordBtn}
              onClick={() => setMobileMenuOpen(false)}
            >
              <SiDiscord size={15} />
              <span>Discord Community</span>
            </a>

            {/* Mobile Language Selector Row */}
            <div className={styles.mobileLangRow}>
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleSelectLang(item.code)}
                  className={`${styles.mobileLangPill} ${
                    lang === item.code ? styles.mobileLangPillActive : ""
                  }`}
                >
                  <img
                    src={item.flagUrl}
                    alt={getLangName(item)}
                    className={styles.flagIconImgItem}
                  />
                  <span>{getLangName(item)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
