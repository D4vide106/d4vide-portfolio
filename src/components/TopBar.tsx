"use client";
import { FiHome, FiUser, FiCode, FiGlobe } from "react-icons/fi";
import { SiCurseforge } from "react-icons/si";
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
          <a href="#hero">D4vide106</a>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            <li><a href="#hero"><FiUser size={18} /> {dict.about || "About Me"}</a></li>
            <li><a href="#projects"><SiCurseforge size={18} /> {dict.projects || "Projects"}</a></li>
          </ul>
        </nav>
        
        <div className={styles.actions}>
          <button onClick={toggleLang} className={styles.langBtn} aria-label="Switch Language">
            <FiGlobe size={18} />
            <span>{currentLang === 'en' ? 'IT' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
