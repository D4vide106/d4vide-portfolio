"use client";

import { useState } from "react";
import styles from "./NavigationPopup.module.css";

export default function NavigationPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

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
        <ul className={styles.menuList}>
          <li><a href="#hero" onClick={toggleMenu}>Home</a></li>
          <li><a href="#projects" onClick={toggleMenu}>Minecraft Projects</a></li>
          <li><a href="#about" onClick={toggleMenu}>About Me</a></li>
        </ul>
      </nav>
      
      {isOpen && <div className={styles.overlay} onClick={toggleMenu} />}
    </>
  );
}
