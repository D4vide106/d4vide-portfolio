"use client";

import { SiCurseforge, SiModrinth, SiYoutube, SiDiscord, SiGithub, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FiArrowUpRight, FiPlayCircle, FiCompass } from "react-icons/fi";
import styles from "./Hero.module.css";
import TotalDownloads from "./TotalDownloads";
import DraggableTerminal from "./DraggableTerminal";
import CipherCarousel from "./CipherCarousel";
import Projects from "./Projects";
import { useLiveStats } from "@/context/LiveStatsContext";

export default function Hero({ dict, aboutDict }: { dict: any; aboutDict: any }) {
  const { projects } = useLiveStats();

  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.container}>
        
        {/* ── 1. PRIMARY HERO SHOWCASE (FIRST THING VISITORS SEE) ───── */}
        <div className={styles.topConstellationHero}>
          <div className={styles.editorialHeader}>
            <span className={styles.captionTag}>FEATURED WORKS</span>
            <h1 className={styles.heroTitle}>D4VIDE106</h1>
            <p className={styles.heroSubtitle}>
              System Designer & Minecraft Mod Creator
            </p>
            <p className={styles.constellationHint}>
              Scroll mouse wheel or drag cards to orbit through featured Minecraft mods & projects
            </p>
          </div>

          {/* Spacious 3D Project Constellation Orbit */}
          <div className={styles.constellationWrapper}>
            <CipherCarousel projects={projects} />
          </div>
        </div>

        {/* ── 2. PROJECT GALLERY & FILTER GRID (RIGHT BELOW CONSTELLATION) ── */}
        <div className={styles.gridShowcaseSection}>
          <Projects dict={dict} />
        </div>

        {/* ── 3. CREATOR PROFILE & MEDIA SHOWCASE (2-COLUMN CLEAN GRID) ── */}
        <div className={styles.lowerShowcaseGrid} id="about">
          
          {/* Left Column: Bio, Metrics, Terminal & Socials */}
          <div className={styles.leftShowcaseCol}>
            
            {/* Identity & Bio Card */}
            <div className={styles.bioCard}>
              <div className={styles.cardHeader}>
                <div className={styles.avatarWrap}>
                  <span className={styles.onlineDot} />
                  <img 
                    src="https://mc-heads.net/avatar/_D4vide106_/64" 
                    alt="_D4vide106_" 
                    className={styles.avatarImg} 
                  />
                </div>
                <div className={styles.identityText}>
                  <span className={styles.cardTag}>CREATOR PROFILE</span>
                  <h3 className={styles.cardTitle}>ABOUT D4VIDE106</h3>
                </div>
              </div>

              <p className={styles.bioText}>
                {aboutDict?.aboutDesc1 || "I am a Minecraft mod developer and content creator pushing the boundaries of procedural worlds, custom boss progression, RPG mechanics, and world generation."}
                {" "}
                {aboutDict?.aboutDesc2 || "Passionate about building deep RPG experiences, intricate structures, and custom tools for creators worldwide."}
              </p>

              {/* Social Matrix */}
              <div className={styles.socialsSection}>
                <span className={styles.socialsLabel}>LINKS & SOCIALS</span>
                <div className={styles.socialBar}>
                  <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="Modrinth">
                    <SiModrinth size={17} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialLink} title="CurseForge">
                    <SiCurseforge size={17} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="YouTube">
                    <SiYoutube size={17} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.socialLink} title="Discord">
                    <SiDiscord size={17} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://d4vide106.itch.io" target="_blank" rel="noreferrer" className={styles.socialLink} title="Itch.io">
                    <SiItchdotio size={17} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://gamejolt.com/@D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GameJolt">
                    <SiGamejolt size={17} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GitHub">
                    <SiGithub size={17} />
                  </a>
                </div>
              </div>
            </div>

            {/* Live Metrics Widget */}
            <div className={styles.metricsWidget}>
              <div className={styles.widgetTag}>
                <span className={styles.greenDot} /> LIVE METRICS
              </div>
              <TotalDownloads />
            </div>

          </div>

          {/* Right Column: YouTube Broadcast & Terminal Control */}
          <div className={styles.rightShowcaseCol}>
            
            {/* YouTube Broadcast Showcase */}
            <div className={styles.youtubeCard} id="youtube">
              <div className={styles.ytHeader}>
                <div className={styles.ytTitle}>
                  <FiPlayCircle className={styles.ytIcon} />
                  <span>LATEST BROADCAST</span>
                </div>
                <a href="https://www.youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.ytBtn}>
                  YOUTUBE <FiArrowUpRight size={13} />
                </a>
              </div>
              <div className={styles.videoFrame}>
                <iframe 
                  src="https://www.youtube.com/embed/8fnO7HA9wRY" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>

            {/* Terminal Control Console Widget */}
            <div className={styles.terminalCard}>
              <div className={styles.widgetTag}>
                <span className={styles.blueDot} /> TERMINAL CONTROL
              </div>
              <DraggableTerminal inlineMode={true} />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
