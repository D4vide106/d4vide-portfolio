import { Play, Gamepad2, MessageCircle, GitBranch } from "lucide-react";
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
            <Play size={20} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="Twitch">
            <Gamepad2 size={20} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="Discord">
            <MessageCircle size={20} />
          </a>
          <a href="#" className={styles.socialLink} aria-label="GitHub">
            <GitBranch size={20} />
          </a>
        </div>
        
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} D4vide106. {dict.rights}
        </p>
      </div>
    </footer>
  );
}
