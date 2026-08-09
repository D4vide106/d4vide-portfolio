"use client";

import { useState, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import styles from "./TopBar.module.css";

export default function TopBar({ dict, currentLang }: { dict: any; currentLang: string }) {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={`${styles.topBar} ${scrolled ? styles.topBarScrolled : ""}`}>
      <div className={styles.container}>
        {/* Left: Brand with avatar & live status dot */}
        <div className={styles.logo}>
          <a href="#hero" className={styles.brandLink}>
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
              <a href="#projects" className={styles.menuLink}>
                WORKS
              </a>
            </li>
            <li>
              <a href="#about" className={styles.menuLink}>
                ABOUT
              </a>
            </li>
            <li>
              <a href="#youtube" className={styles.menuLink}>
                MEDIA
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Quick Community CTA & Language Switcher */}
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
        </div>
      </div>
    </header>
  );
}
