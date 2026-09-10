"use client";

import { 
  SiYoutube, 
  SiDiscord, 
  SiGithub, 
  SiCurseforge, 
  SiModrinth,
  SiItchdotio,
  SiGamejolt,
  SiInstagram,
  SiTiktok 
} from "react-icons/si";
import styles from "./Footer.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer({ dict: propDict }: { dict?: any }) {
  const { dict: contextDict } = useLanguage();
  const dict = contextDict.footer || propDict;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandRow}>
          <span className={styles.brandText}>D4VIDE106</span>
        </div>

        <div className={styles.socials}>
          <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="YouTube" title="YouTube">
            <SiYoutube size={16} />
          </a>
          <a href="https://discord.gg/f8kP4WsVSW" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Discord" title="Discord">
            <SiDiscord size={16} />
          </a>
          <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="GitHub" title="GitHub">
            <SiGithub size={16} />
          </a>
          <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Modrinth" title="Modrinth">
            <SiModrinth size={16} />
          </a>
          <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="CurseForge" title="CurseForge">
            <SiCurseforge size={16} />
          </a>
          <a href="https://d4vide106.itch.io" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Itch.io" title="Itch.io">
            <SiItchdotio size={16} />
          </a>
          <a href="https://gamejolt.com/@D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="GameJolt" title="GameJolt">
            <SiGamejolt size={16} />
          </a>
          <a href="https://instagram.com/d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram" title="Instagram">
            <SiInstagram size={16} />
          </a>
          <a href="https://tiktok.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="TikTok" title="TikTok">
            <SiTiktok size={16} />
          </a>
        </div>
        
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} D4VIDE106. {dict?.rights ? dict.rights.toUpperCase() : "TUTTI I DIRITTI RISERVATI."}
        </p>
      </div>
    </footer>
  );
}
