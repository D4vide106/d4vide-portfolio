import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <div className={styles.glow}></div>
          <Image 
            src="/default-avatar.png" // We will generate or add this image later
            alt="D4vide106 Profile"
            width={200}
            height={200}
            className={styles.profileImage}
          />
        </div>
        
        <h1 className={styles.title}>
          <span className={styles.greeting}>Hi, I'm</span>
          <span className={styles.name}>D4vide106</span>
          <span className={styles.aka}>AKA Davide</span>
        </h1>
        
        <p className={styles.subtitle}>
          Content Creator & Minecraft Specialist
        </p>
        
        <div className={styles.scrollIndicator}>
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
          <span className={styles.scrollText}>Scroll Down</span>
        </div>
      </div>
    </section>
  );
}
