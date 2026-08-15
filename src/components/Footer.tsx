"use client";

import { SiYoutube, SiDiscord, SiGithub, SiCurseforge, SiModrinth } from "react-icons/si";
import styles from "./Footer.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer({ dict: propDict }: { dict?: any }) {
  const { dict: contextDict } = useLanguage();
  const dict = contextDict.footer || propDict;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.metaLeft}>
          <span className={styles.brandText}>D4VIDE106</span>
          <span className={styles.subText}>{dict?.tagline || "FOR CREATORS AND GAMERS"}</span>
        </div>

        <div className={styles.socials}>
          <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="YouTube">
            <SiYoutube size={16} />
          </a>
          <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Discord">
            <SiDiscord size={16} />
          </a>
          <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="GitHub">
            <SiGithub size={16} />
          </a>
          <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Modrinth">
            <SiModrinth size={16} />
          </a>
          <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="CurseForge">
            <SiCurseforge size={16} />
          </a>
        </div>
        
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} D4VIDE106. {dict?.rights ? dict.rights.toUpperCase() : "ALL RIGHTS RESERVED."}
        </p>
      </div>
    </footer>
  );
}
