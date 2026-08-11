"use client";

import { SiCurseforge, SiModrinth, SiYoutube, SiDiscord, SiGithub, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FiArrowUpRight, FiPlayCircle, FiCompass } from "react-icons/fi";
import styles from "./Hero.module.css";
import TotalDownloads from "./TotalDownloads";
import DraggableTerminal from "./DraggableTerminal";
import Projects from "./Projects";

export default function Hero({ dict, aboutDict, projectsDict }: { dict: any; aboutDict: any; projectsDict?: any }) {
  return (
    <section id="hero" className={styles.splitSection}>
      <div className={styles.container}>
        
        {/* ── LEFT SIDEBAR (STICKY HERO PANEL) ──────────────────────── */}
        <aside className={styles.leftStickyPanel}>
          <div className={styles.stickyContent}>
            
            {/* Header Avatar & Identity */}
            <div className={styles.identityHeader}>
              <div className={styles.avatarWrapper}>
                <div className={styles.onlineDot} />
                <img 
                  src="https://mc-heads.net/avatar/_D4vide106_/64" 
                  alt="_D4vide106_" 
                  className={styles.avatarHead} 
                />
              </div>

              <div className={styles.titleArea}>
                <span className={styles.creatorTag}>CREATOR PORTFOLIO</span>
                <h1 className={styles.brandTitle}>D4VIDE106</h1>
                <p className={styles.brandSubtitle}>System Designer & Minecraft Mod Creator</p>
              </div>
            </div>

            {/* Bio Description */}
            <p className={styles.bioExcerpt}>
              {aboutDict?.aboutDesc1 || "I am a Minecraft mod developer and content creator pushing the boundaries of procedural worlds, custom boss progression, RPG mechanics, and world generation."}
            </p>

            {/* Live Metrics Widget */}
            <div className={styles.metricsWidget}>
              <div className={styles.widgetHeader}>
                <span className={styles.greenPulse} /> LIVE METRICS
              </div>
              <TotalDownloads />
            </div>

            {/* Terminal Control Center */}
            <div className={styles.terminalWidget}>
              <div className={styles.widgetHeader}>
                <span className={styles.bluePulse} /> TERMINAL CONTROL
              </div>
              <DraggableTerminal inlineMode={true} />
            </div>

            {/* Social Matrix */}
            <div className={styles.socialsWidget}>
              <span className={styles.socialsTitle}>LINKS & SOCIALS</span>
              <div className={styles.socialBar}>
                <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="Modrinth">
                  <SiModrinth size={17} />
                </a>
                <span className={styles.sep}>|</span>
                <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialLink} title="CurseForge">
                  <SiCurseforge size={17} />
                </a>
                <span className={styles.sep}>|</span>
                <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="YouTube">
                  <SiYoutube size={17} />
                </a>
                <span className={styles.sep}>|</span>
                <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.socialLink} title="Discord">
                  <SiDiscord size={17} />
                </a>
                <span className={styles.sep}>|</span>
                <a href="https://d4vide106.itch.io" target="_blank" rel="noreferrer" className={styles.socialLink} title="Itch.io">
                  <SiItchdotio size={17} />
                </a>
                <span className={styles.sep}>|</span>
                <a href="https://gamejolt.com/@D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GameJolt">
                  <SiGamejolt size={17} />
                </a>
                <span className={styles.sep}>|</span>
                <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GitHub">
                  <SiGithub size={17} />
                </a>
              </div>
            </div>

          </div>
        </aside>

        {/* ── RIGHT CONTENT COLUMN (SCROLLABLE SHOWCASE) ───────────── */}
        <main className={styles.rightContentPanel}>
          
          {/* Section 1: Featured Works & 3D Project Constellation */}
          <div className={styles.contentSection} id="projects">
            <Projects dict={projectsDict || dict} />
          </div>

          {/* Section 2: Media Broadcast Showcase */}
          <div className={styles.contentSection} id="youtube">
            <div className={styles.youtubeCard}>
              <div className={styles.ytHeader}>
                <div className={styles.ytTitle}>
                  <FiPlayCircle className={styles.ytIcon} />
                  <span>LATEST BROADCAST</span>
                </div>
                <a href="https://www.youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.ytBtn}>
                  YOUTUBE <FiArrowUpRight size={13} />
                </a>
              </div>
              <div className={styles.videoWrapper}>
                <iframe 
                  src="https://www.youtube.com/embed/8fnO7HA9wRY" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>
          </div>

          {/* Section 3: About & Creator Story */}
          <div className={styles.contentSection} id="about">
            <div className={styles.aboutCard}>
              <div className={styles.aboutHeader}>
                <span className={styles.aboutTag}>CREATOR STORY</span>
                <span className={styles.aboutMono}>SYSTEM ARCHITECT</span>
              </div>
              <p className={styles.aboutText}>
                {aboutDict?.aboutDesc1 || "I am a Minecraft mod developer and content creator pushing the boundaries of what is possible inside procedural worlds."} 
                {" "}
                {aboutDict?.aboutDesc2 || "Passionate about building deep RPG mechanics, intricate structures, and custom tools for creators worldwide."}
              </p>
            </div>
          </div>

        </main>

      </div>
    </section>
  );
}
