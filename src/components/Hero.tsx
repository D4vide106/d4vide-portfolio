import { User } from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero({ dict }: { dict: any }) {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <div className={styles.glow}></div>
          <div className={styles.placeholderImage}>
            <User size={80} color="var(--accent-color)" />
          </div>
        </div>
        
        <h1 className={styles.title}>
          <span className={styles.greeting}>{dict.greeting}</span>
          <span className={styles.name}>D4vide106</span>
          <span className={styles.aka}>AKA Davide</span>
        </h1>
        
        <p className={styles.subtitle}>
          {dict.role}
        </p>
        
        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
          <span className={styles.scrollText}>{dict.scroll}</span>
        </div>
      </div>
    </section>
  );
}
