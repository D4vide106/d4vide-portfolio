"use client";

import { useState, useEffect, useRef } from "react";
import { FiGlobe, FiMenu, FiX, FiChevronDown, FiCheck } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import styles from "./TopBar.module.css";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { Language } from "@/dictionaries";

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

  // Handle incoming section scroll from Wiki navigation (e.g., ?section=projects)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section");
      if (sec) {
        setTimeout(() => {
          const el = document.getElementById(sec);
          if (el) {
            const yOffset = -90;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
          window.history.replaceState(null, "", window.location.pathname);
        }, 350);
      }
    }
  }, []);

  const handleSelectLang = (code: Language) => {
    setLang(code);
    setLangDropdownOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const repoPrefix = window.location.pathname.startsWith("/d4vide-portfolio")
      ? "/d4vide-portfolio"
      : "";

    if (targetId === "wiki") {
      window.location.href = `${repoPrefix}/wiki/`;
      return;
    }

    if (window.location.pathname.includes("/wiki")) {
      window.location.href = `${repoPrefix}/`;
      return;
    }

    if (targetId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const yOffset = -90;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }

    try {
      window.history.replaceState(null, "", window.location.pathname);
    } catch {}
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
              <a href="#wiki" className={styles.menuLink} onClick={(e) => handleNavClick(e, "wiki")}>
                {dict.wiki || "WIKI"}
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
            <li>
              <a href="#contact" className={styles.menuLink} onClick={(e) => handleNavClick(e, "contact")}>
                {dict.contact || "CONTATTI"}
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Discord Quick CTA, Language Switcher Dropdown & Mobile Toggle */}
        <div className={styles.actions}>
          <a
            href="https://discord.gg/7T3u9a9"
            target="_blank"
            rel="noreferrer"
            className={styles.discordIconBtn}
            title="Discord Community"
            aria-label="Discord Community"
          >
            <SiDiscord size={18} />
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
            <a href="#wiki" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, "wiki")}>
              {dict.wiki || "WIKI"}
            </a>
            <a href="#about" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, "about")}>
              {dict.about || "ABOUT"}
            </a>
            <a href="#youtube" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, "youtube")}>
              {dict.media || "MEDIA"}
            </a>
            <a href="#contact" className={styles.mobileNavLink} onClick={(e) => handleNavClick(e, "contact")}>
              {dict.contact || "CONTATTI"}
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
