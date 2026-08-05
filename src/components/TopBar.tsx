"use client";
import { FiGlobe } from "react-icons/fi";
import styles from "./TopBar.module.css";

export default function TopBar({ dict, currentLang }: { dict: any; currentLang: string }) {
  const toggleLang = () => {
    const nextLang = currentLang === 'en' ? 'it' : 'en';
    window.location.href = `/d4vide-portfolio/${nextLang}`;
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <a href="#hero">
            <span className={styles.brandMain}>D4VIDE106</span>
            <span className={styles.brandSub}> // CREATOR</span>
          </a>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            <li><a href="#projects">WORKS</a></li>
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#youtube">MEDIA</a></li>
          </ul>
        </nav>
        
        <div className={styles.actions}>
          <button onClick={toggleLang} className={styles.langBtn} aria-label="Switch Language">
            <FiGlobe size={14} />
            <span>{currentLang.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
}


