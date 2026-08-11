"use client";

import { useState, useEffect } from "react";
import { FiGlobe, FiMenu, FiX } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import styles from "./TopBar.module.css";

export default function TopBar({ dict, currentLang }: { dict: any; currentLang: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    const nextLang = currentLang === "en" ? "it" : "en";
    window.location.href = `/d4vide-portfolio/${nextLang}`;
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`${styles.topBar} ${scrolled ? styles.topBarScrolled : ""} ${mobileMenuOpen ? styles.topBarExpanded : ""}`}>
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
                MINECRAFT
              </a>
            </li>
            <li>
              <a href="#services" className={styles.menuLink} onClick={handleLinkClick}>
                SERVICES
              </a>
            </li>
            <li>
              <a href="#about" className={styles.menuLink} onClick={handleLinkClick}>
                ABOUT
              </a>
            </li>
            <li>
              <a href="#youtube" className={styles.menuLink} onClick={handleLinkClick}>
                MEDIA
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Quick Community CTA, Language Switcher & Mobile Toggle */}
        <div className={styles.actions}>
          <a
            href="https://discord.gg/7T3u9a9"
            target="_blank"
            rel="noreferrer"
            className={styles.discordBtn}
            title="Join Discord Community"
          >
            <SiDiscord size={14} />
            <span className={styles.actionText}>Community</span>
          </a>

          <button onClick={toggleLang} className={styles.langBtn} aria-label="Switch Language">
            <FiGlobe size={13} />
            <span>{currentLang.toUpperCase()}</span>
          </button>

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
              MINECRAFT PROJECTS
            </a>
            <a href="#services" className={styles.mobileNavLink} onClick={handleLinkClick}>
              SERVICES & BOTS
            </a>
            <a href="#about" className={styles.mobileNavLink} onClick={handleLinkClick}>
              ABOUT ME
            </a>
            <a href="#youtube" className={styles.mobileNavLink} onClick={handleLinkClick}>
              MEDIA & VIDEOS
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
            
            <button onClick={toggleLang} className={styles.mobileLangBtn}>
              <FiGlobe size={15} />
              <span>Language: {currentLang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
