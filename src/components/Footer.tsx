import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          D4vide106
        </div>
        
        <div className={styles.socials}>
          <a href="#" className={styles.socialLink} aria-label="YouTube">
            YT
          </a>
          <a href="#" className={styles.socialLink} aria-label="Twitch">
            TW
          </a>
          <a href="#" className={styles.socialLink} aria-label="Discord">
            DS
          </a>
          <a href="#" className={styles.socialLink} aria-label="GitHub">
            GH
          </a>
        </div>
        
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Davide (D4vide106). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
