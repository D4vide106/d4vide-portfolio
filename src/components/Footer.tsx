import { FaYoutube, FaTwitch, FaDiscord, FaGithub } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer({ dict }: { dict: any }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          D4vide106
        </div>
        
        <div className={styles.socials}>
          <a href="#" className={styles.socialLink} aria-label="YouTube">
            <FaYoutube size={20} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="Twitch">
            <FaTwitch size={20} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="Discord">
            <FaDiscord size={20} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="GitHub">
            <FaGithub size={20} />
          </a>
        </div>
        
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} D4vide106. {dict.rights}
        </p>
      </div>
    </footer>
  );
}
