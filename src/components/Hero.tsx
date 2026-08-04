import { SiCurseforge, SiModrinth, SiYoutube, SiDiscord, SiGithub, SiTiktok, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FiCode, FiTerminal, FiLayout, FiYoutube } from "react-icons/fi";
import styles from "./Hero.module.css";
import TotalDownloads from "./TotalDownloads";

export default function Hero({ dict, aboutDict }: { dict: any, aboutDict: any }) {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroBg}></div>
      <div className={styles.heroOverlay}></div>
      
      <div className={styles.container}>
        
        <div className={styles.avatarCol}>
          <div className={styles.glow}></div>
          <img 
            src="https://mc-heads.net/body/_D4vide106_/right" 
            alt="_D4vide106_" 
            className={styles.avatarImage} 
          />
        </div>
        
        <div className={styles.title}>
          <h1 className={styles.nameRow}>
            <span className={styles.namePurple}>_D4vide</span>
            <span className={styles.nameWhite}>106_</span>
          </h1>
        </div>

        <p className={styles.description}>
          {aboutDict.aboutDesc1 || "I am a Minecraft mod developer and content creator."} 
          {aboutDict.aboutDesc2 || " I have a particular passion for creating immersive RPG experiences."}
        </p>

        <div className={styles.actionButtons}>
          <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.primaryBtn}>
            <FiCode size={20} />
            My Projects
          </a>
          <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.secondaryBtn}>
            <SiDiscord size={20} />
            Discord
          </a>
        </div>
        
        <TotalDownloads />

        <div className={styles.socials}>
          <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#1bd96a"} as any} title="Modrinth">
            <SiModrinth size={22} />
          </a>
          <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#f16436"} as any} title="CurseForge">
            <SiCurseforge size={22} />
          </a>
          <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ff0000"} as any} title="YouTube">
            <SiYoutube size={22} />
          </a>
          <a href="https://tiktok.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ff0050"} as any} title="TikTok">
            <SiTiktok size={22} />
          </a>
          <a href="https://d4vide106.itch.io" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#fa5c5c"} as any} title="Itch.io">
            <SiItchdotio size={22} />
          </a>
          <a href="https://gamejolt.com/@D4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ccff00"} as any} title="GameJolt">
            <SiGamejolt size={22} />
          </a>
          <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialBtn} style={{"--hover-color": "#ffffff"} as any} title="GitHub">
            <SiGithub size={22} />
          </a>
        </div>
        
        <div className={styles.youtubeSection}>
          <div className={styles.ytHeader}>
            <FiYoutube className={styles.ytHeaderIcon} />
            <h4>Latest on YouTube</h4>
            <a href="https://www.youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.ytHeaderLink}>View All</a>
          </div>
          <div className={styles.ytVideoGrid}>
            <div className={styles.videoWrapper}>
              <iframe 
                src="https://www.youtube.com/embed/8fnO7HA9wRY" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

      </div>

      <div className={styles.wavyDivider}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1380,20 1440,40 L1440,80 L0,80 Z" fill="#0d0b14" fillOpacity="1"></path>
          <path d="M0,55 C200,20 400,70 600,45 C800,20 1000,65 1200,45 C1320,33 1400,55 1440,50 L1440,80 L0,80 Z" fill="#0d0b14" fillOpacity="1"></path>
        </svg>
      </div>
    </section>
  );
}
