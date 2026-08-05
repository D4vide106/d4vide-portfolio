"use client";
import { SiCurseforge, SiModrinth, SiYoutube, SiDiscord, SiGithub, SiTiktok, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FiArrowUpRight, FiPlayCircle } from "react-icons/fi";
import styles from "./Hero.module.css";
import TotalDownloads from "./TotalDownloads";

export default function Hero({ dict, aboutDict }: { dict: any, aboutDict: any }) {
  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.container}>
        
        {/* Editorial Top Headline */}
        <div className={styles.editorialHeader}>
          <span className={styles.topCaption}>SYSTEM DESIGNER & GAME CREATOR</span>
          <h1 className={styles.heroTitle}>D4VIDE106</h1>
          <p className={styles.heroSubtitle}>
            FOR CULTURE, MINECRAFT MODDING, AND INDIE GAME CREATION
          </p>
        </div>

        {/* Profile Card & Avatar Row */}
        <div className={styles.aboutRow} id="about">
          <div className={styles.avatarCard}>
            <div className={styles.skinGlow}></div>
            <img 
              src="https://mc-heads.net/body/_D4vide106_/right" 
              alt="_D4vide106_" 
              className={styles.skinImage} 
            />
          </div>

          <div className={styles.bioTextContainer}>
            <span className={styles.bioTag}>[ ABOUT THE CREATOR ]</span>
            <p className={styles.bioDescription}>
              {aboutDict.aboutDesc1 || "I am a Minecraft mod developer and content creator pushing the boundaries of what is possible inside procedural worlds."} 
              {" "}
              {aboutDict.aboutDesc2 || "Passionate about building deep RPG mechanics, intricate structures, and custom tools for creators worldwide."}
            </p>
            
            <div className={styles.downloadsStatWrapper}>
              <TotalDownloads />
            </div>

            <div className={styles.socialBar}>
              <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="Modrinth">
                <SiModrinth size={18} />
              </a>
              <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialLink} title="CurseForge">
                <SiCurseforge size={18} />
              </a>
              <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="YouTube">
                <SiYoutube size={18} />
              </a>
              <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.socialLink} title="Discord">
                <SiDiscord size={18} />
              </a>
              <a href="https://d4vide106.itch.io" target="_blank" rel="noreferrer" className={styles.socialLink} title="Itch.io">
                <SiItchdotio size={18} />
              </a>
              <a href="https://gamejolt.com/@D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GameJolt">
                <SiGamejolt size={18} />
              </a>
              <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GitHub">
                <SiGithub size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* YouTube Showcase Section */}
        <div className={styles.youtubeSection} id="youtube">
          <div className={styles.ytHeader}>
            <div className={styles.ytHeaderTitle}>
              <FiPlayCircle className={styles.ytIcon} />
              <span>LATEST BROADCAST</span>
            </div>
            <a href="https://www.youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.ytChannelLink}>
              VIEW YOUTUBE CHANNEL <FiArrowUpRight />
            </a>
          </div>
          <div className={styles.videoGrid}>
            <div className={styles.videoFrame}>
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
    </section>
  );
}
