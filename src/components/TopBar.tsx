"use client";

import { useState, useEffect, useRef } from "react";
import { FiGlobe, FiMenu, FiX, FiChevronDown, FiCheck } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import styles from "./TopBar.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/dictionaries";

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export default function TopBar({ dict: propDict }: { dict?: any; currentLang?: string }) {
  const { lang, setLang, dict: contextDict } = useLanguage();
  const dict = contextDict.nav || propDict;

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

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
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
          <a href="#hero" className={styles.brandLink} onClick={handleLinkClick}>
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
              <a href="#projects" className={styles.menuLink} onClick={handleLinkClick}>
                {dict.projects || "WORKS"}
              </a>
            </li>
            <li>
              <a href="#about" className={styles.menuLink} onClick={handleLinkClick}>
                {dict.about || "ABOUT"}
              </a>
            </li>
            <li>
              <a href="#youtube" className={styles.menuLink} onClick={handleLinkClick}>
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
              <span className={styles.currentFlag}>{currentLangObj.flag}</span>
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
                    <span className={styles.itemFlag}>{item.flag}</span>
                    <span className={styles.itemName}>{item.name}</span>
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
            <a href="#projects" className={styles.mobileNavLink} onClick={handleLinkClick}>
              {dict.projects || "WORKS"}
            </a>
            <a href="#about" className={styles.mobileNavLink} onClick={handleLinkClick}>
              {dict.about || "ABOUT"}
            </a>
            <a href="#youtube" className={styles.mobileNavLink} onClick={handleLinkClick}>
              {dict.media || "MEDIA"}
            </a>
          </nav>

          <div className={styles.mobileActionsRow}>
            <a
              href="https://discord.gg/7T3u9a9"
              target="_blank"
              rel="noreferrer"
              className={styles.mobileDiscordBtn}
              onClick={handleLinkClick}
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
                  <span>{item.flag}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
