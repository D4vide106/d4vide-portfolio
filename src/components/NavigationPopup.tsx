"use client";

import { useState } from "react";
import { FiHome, FiCode, FiUser, FiGlobe } from "react-icons/fi";
import { SiCurseforge } from "react-icons/si";
import styles from "./NavigationPopup.module.css";

export default function NavigationPopup({ dict, currentLang }: { dict: any; currentLang: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleLang = () => {
    const nextLang = currentLang === 'en' ? 'it' : 'en';
    window.location.href = `/d4vide-portfolio/${nextLang}`;
  };

  return (
    <>
      <button 
        className={`${styles.menuButton} glass`} 
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <div className={`${styles.hamburger} ${isOpen ? styles.open : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <nav className={`${styles.popupMenu} ${isOpen ? styles.open : ""} glass`}>
        <div className={styles.langSwitch}>
          <button onClick={toggleLang} className={styles.langBtn} aria-label="Switch Language">
            <FiGlobe size={18} />
            <span>{currentLang === 'en' ? 'IT' : 'EN'}</span>
          </button>
        </div>
        <ul className={styles.menuList}>
          <li><a href="#hero" onClick={toggleMenu}><FiHome size={20} /> {dict.home}</a></li>
          <li><a href="#journey" onClick={toggleMenu}><FiCode size={20} /> {dict.journey}</a></li>
          <li><a href="#projects" onClick={toggleMenu}><SiCurseforge size={20} /> {dict.projects}</a></li>
          <li><a href="#about" onClick={toggleMenu}><FiUser size={20} /> {dict.about}</a></li>
        </ul>
      </nav>
      
      {isOpen && <div className={styles.overlay} onClick={toggleMenu} />}
    </>
  );
}
