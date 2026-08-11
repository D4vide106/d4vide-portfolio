"use client";

import { useState } from "react";
import { SiCurseforge, SiModrinth, SiYoutube, SiDiscord, SiGithub, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FiArrowUpRight, FiPlayCircle, FiCompass, FiBox, FiGrid } from "react-icons/fi";
import styles from "./Hero.module.css";
import TotalDownloads from "./TotalDownloads";
import DraggableTerminal from "./DraggableTerminal";
import Minecraft3DRoom from "./Minecraft3DRoom";

export default function Hero({ dict, aboutDict }: { dict: any; aboutDict: any }) {
  const [heroMode, setHeroMode] = useState<"3d" | "bento">("3d");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.container}>
        
        {/* ── TOP HERO CONTROL BAR ─────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.06)", padding: "5px", borderRadius: "9999px", border: "1px solid rgba(255,255,255,0.12)", gap: "6px" }}>
            <button
              onClick={() => setHeroMode("3d")}
              style={{
                padding: "0.6rem 1.6rem",
                borderRadius: "9999px",
                fontFamily: "var(--font-body)",
                fontSize: "0.74rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                border: "none",
                cursor: "pointer",
                background: heroMode === "3d" ? "#ffffff" : "transparent",
                color: heroMode === "3d" ? "#000000" : "#a1a1a6",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <FiBox size={15} /> 3D MINECRAFT SANCTUM ROOM
            </button>

            <button
              onClick={() => setHeroMode("bento")}
              style={{
                padding: "0.6rem 1.6rem",
                borderRadius: "9999px",
                fontFamily: "var(--font-body)",
                fontSize: "0.74rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                border: "none",
                cursor: "pointer",
                background: heroMode === "bento" ? "#ffffff" : "transparent",
                color: heroMode === "bento" ? "#000000" : "#a1a1a6",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <FiGrid size={15} /> BENTO DASHBOARD
            </button>
          </div>
        </div>

        {/* ── MODE 1: 3D MINECRAFT SANCTUM ROOM ───────────────────── */}
        {heroMode === "3d" && (
          <Minecraft3DRoom 
            onOpenTerminal={() => setIsTerminalOpen(true)}
          />
        )}

        {/* ── MODE 2: TOP BENTO DASHBOARD ROW ──────────────────────── */}
        {heroMode === "bento" && (
          <div className={styles.topDashboardRow}>
            {/* Top Left: Terminal */}
            <div className={styles.topLeftCol}>
              <div className={styles.bentoBadge}>
                <span className={styles.badgeDotGreen} /> TERMINAL CONTROL
              </div>
              <div className={styles.terminalWrapper}>
                <DraggableTerminal inlineMode={true} />
              </div>
            </div>

            {/* Top Center: Headline */}
            <div className={styles.topCenterCol}>
              <div className={styles.editorialHeader}>
                <div className={styles.captionTag}>PORTFOLIO 2026</div>
                <h1 className={styles.heroTitle}>D4VIDE106</h1>
                <p className={styles.heroSubtitle}>
                  System Designer & Minecraft Mod Creator
                </p>
                
                <div className={styles.heroCtaGroup}>
                  <a href="#projects" className={styles.primaryCtaBtn}>
                    <FiCompass size={16} />
                    <span>EXPLORE WORKS</span>
                  </a>
                  <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.secondaryCtaBtn}>
                    <SiDiscord size={15} />
                    <span>DISCORD</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Top Right: Counters */}
            <div className={styles.topRightCol}>
              <div className={styles.bentoBadge}>
                <span className={styles.badgeDotBlue} /> LIVE METRICS
              </div>
              <div className={styles.metricsCard}>
                <TotalDownloads />
              </div>
            </div>
          </div>
        )}

        {/* ── BOTTOM PROFILE & SHOWCASE ROW ────────────────────────── */}
        <div className={styles.bottomProfileRow} id="about">
          
          {/* Bottom Left: 3D Character Avatar Card */}
          <div className={styles.bottomLeftCol}>
            <div className={styles.avatarCard}>
              <div className={styles.skinGlow} />
              <div className={styles.skinBadge}>
                <span className={styles.onlinePulse} />
                <span>ACTIVE CREATOR</span>
              </div>
              <img 
                src="https://mc-heads.net/body/_D4vide106_/right" 
                alt="_D4vide106_" 
                className={styles.skinImage} 
              />
            </div>
          </div>

          {/* Bottom Center: Bio Card + Vertical Divider + Links & Socials Matrix */}
          <div className={styles.bottomCenterCol}>
            <div className={styles.bioCard}>
              <div className={styles.bioCardHeader}>
                <span className={styles.bioTag}>ABOUT CREATOR</span>
                <span className={styles.bioStatusText}>SYSTEM ARCHITECT</span>
              </div>

              <p className={styles.bioText}>
                {aboutDict?.aboutDesc1 || "I am a Minecraft mod developer and content creator pushing the boundaries of what is possible inside procedural worlds."} 
                {" "}
                {aboutDict?.aboutDesc2 || "Passionate about building deep RPG mechanics, intricate structures, and custom tools for creators worldwide."}
              </p>
              
              {/* Elegant Vertical Divider Line */}
              <div className={styles.dividerContainer}>
                <div className={styles.dividerLine} />
                <span className={styles.dividerGlowDot} />
                <div className={styles.dividerLine} />
              </div>

              {/* Social Matrix */}
              <div className={styles.socialsSection}>
                <span className={styles.socialsHeader}>LINKS & SOCIALS</span>
                <div className={styles.socialBar}>
                  <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="Modrinth">
                    <SiModrinth size={18} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" className={styles.socialLink} title="CurseForge">
                    <SiCurseforge size={18} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="YouTube">
                    <SiYoutube size={18} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" className={styles.socialLink} title="Discord">
                    <SiDiscord size={18} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://d4vide106.itch.io" target="_blank" rel="noreferrer" className={styles.socialLink} title="Itch.io">
                    <SiItchdotio size={18} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://gamejolt.com/@D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GameJolt">
                    <SiGamejolt size={18} />
                  </a>
                  <span className={styles.socialSep}>|</span>
                  <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" className={styles.socialLink} title="GitHub">
                    <SiGithub size={18} />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Right: YouTube Video Showcase Card */}
          <div className={styles.bottomRightCol} id="youtube">
            <div className={styles.youtubeCard}>
              <div className={styles.ytHeader}>
                <div className={styles.ytHeaderTitle}>
                  <FiPlayCircle className={styles.ytIcon} />
                  <span>LATEST BROADCAST</span>
                </div>
                <a href="https://www.youtube.com/@d4vide106" target="_blank" rel="noreferrer" className={styles.ytChannelLink}>
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
                ></iframe>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
