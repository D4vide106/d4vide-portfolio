"use client";

import { useState } from "react";
import { 
  SiCurseforge, 
  SiModrinth, 
  SiYoutube, 
  SiDiscord, 
  SiGithub, 
  SiGamejolt, 
  SiItchdotio,
  SiInstagram,
  SiTiktok 
} from "react-icons/si";
import { FiArrowUpRight, FiPlayCircle, FiDownload, FiEye, FiGlobe, FiTag, FiExternalLink } from "react-icons/fi";
import { FaCube } from "react-icons/fa";
import styles from "./Hero.module.css";
import TotalDownloads from "./TotalDownloads";
import CipherCarousel from "./CipherCarousel";
import { useLanguage } from "@/context/LanguageContext";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";
import AnimatedNumber from "./AnimatedNumber";

const PLATFORM_NAMES: Record<string, string> = {
  curseforge: "CurseForge",
  modrinth: "Modrinth",
  gamejolt: "GameJolt",
  itch: "Itch.io",
};

const SOCIAL_LINKS = [
  { name: "Modrinth", handle: "@D4vide106", url: "https://modrinth.com/user/D4vide106", icon: SiModrinth, color: "#1bd96a" },
  { name: "CurseForge", handle: "@d4vide106", url: "https://www.curseforge.com/members/d4vide106/projects", icon: SiCurseforge, color: "#f16436" },
  { name: "YouTube", handle: "@d4vide106", url: "https://youtube.com/@d4vide106", icon: SiYoutube, color: "#ff453a" },
  { name: "Instagram", handle: "@d4vide106", url: "https://instagram.com/d4vide106", icon: SiInstagram, color: "#e1306c" },
  { name: "TikTok", handle: "@d4vide106", url: "https://tiktok.com/@d4vide106", icon: SiTiktok, color: "#00f2fe" },
  { name: "Discord", handle: "@d4vide106", url: "https://discord.gg/7T3u9a9", icon: SiDiscord, color: "#5865f2" },
  { name: "Itch.io", handle: "@d4vide106", url: "https://d4vide106.itch.io", icon: SiItchdotio, color: "#fa5c5c" },
  { name: "GameJolt", handle: "@D4vide106", url: "https://gamejolt.com/@D4vide106", icon: SiGamejolt, color: "#2fcc71" },
  { name: "GitHub", handle: "@D4vide106", url: "https://github.com/D4vide106", icon: SiGithub, color: "#ffffff" },
];

export default function Hero({ dict: propDict, aboutDict: propAboutDict }: { dict?: any; aboutDict?: any }) {
  const { dict: contextDict } = useLanguage();
  const dict = contextDict.hero || propDict;
  const aboutDict = contextDict.aboutSection || propAboutDict;
  const modalDict = contextDict.projectsModal || {};
  const statsDict = contextDict.stats || {};
  const ytDict = contextDict.youtube || {};
  const { projects, incrementProjectViews, getProjectViews, portfolioViews, incrementDownloadLink } = useLiveStats();
  const [selectedConstellationProject, setSelectedConstellationProject] = useState<UnifiedProject | null>(null);

  const handleSelectConstellationProject = (project: UnifiedProject) => {
    setSelectedConstellationProject(project);
    incrementProjectViews(project.id);
  };

  const getPlatformIcon = (platform: string, size = 16) => {
    switch (platform) {
      case "modrinth": return <SiModrinth size={size} />;
      case "curseforge": return <SiCurseforge size={size} />;
      case "gamejolt": return <SiGamejolt size={size} />;
      case "itch": return <SiItchdotio size={size} />;
      default: return <FaCube size={size} />;
    }
  };

  const groupLinksByPlatform = (project: UnifiedProject) => {
    const groups: Record<string, typeof project.links> = {};
    for (const link of project.links) {
      if (!groups[link.platform]) groups[link.platform] = [];
      groups[link.platform].push(link);
    }
    return groups;
  };

  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.container}>
        
        {/* ── 1. CLEAN 3D CONSTELLATION HERO (NO CLUTTER TEXT) ─────── */}
        <div className={styles.topConstellationHero}>
          <h1 className={styles.heroTitle}>D4VIDE106</h1>
          
          {/* Spacious 3D Project Constellation Orbit */}
          <div className={styles.constellationWrapper}>
            <CipherCarousel 
              projects={projects} 
              onSelectProject={handleSelectConstellationProject}
            />
          </div>
        </div>

        {/* ── 2. PYRAMID PROFILE & ABOUT SHOWCASE (NO BACKGROUND BOX) ── */}
        <div className={styles.pyramidProfileShowcase} id="about">
          
          {/* Center: Avatar, Title, Subtitle, Bio Text & Inline Cross-Fading Social Buttons */}
          <div className={styles.centerPyramidCol}>
            <div className={styles.pyramidAvatarWrap}>
              <div className={styles.pyramidOnlineDot} />
              <img 
                src="https://mc-heads.net/avatar/_D4vide106_/96" 
                alt="_D4vide106_" 
                className={styles.pyramidAvatarImg} 
              />
            </div>

            <div className={styles.pyramidTitleGroup}>
              <span className={styles.pyramidTag}>{dict.creatorProfile || "CREATOR PROFILE"}</span>
              <h2 className={styles.pyramidName}>D4VIDE106</h2>
              <span className={styles.pyramidRole}>{dict.systemRole || "System Designer & Minecraft Mod Creator"}</span>
            </div>

            <p className={styles.pyramidBioText}>
              {aboutDict?.aboutDesc1 || "I am a Minecraft mod developer and content creator pushing the boundaries of procedural worlds, custom boss progression, RPG mechanics, and world generation."}
              <br />
              {aboutDict?.aboutDesc2 || "Passionate about building deep RPG experiences, intricate structures, and custom tools for creators worldwide."}
            </p>

            {/* Inline Cross-Fading Fixed-Width Social Buttons (Zero Jitter, Zero Tooltips) */}
            <div className={styles.socialHorizontalRow}>
              {SOCIAL_LINKS.map((soc) => {
                const IconComp = soc.icon;
                return (
                  <a
                    key={soc.name}
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socialPillBtn}
                    style={{ "--hover-color": soc.color } as React.CSSProperties}
                  >
                    <IconComp className={styles.socIcon} />
                    <div className={styles.textContainer}>
                      <span className={styles.socNameDefault}>{soc.name}</span>
                      <span className={styles.socHandleHover}>{soc.handle}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── 3. LIVE STATS & METRICS (TRANSPARENT / NO BACKGROUND BOX) ── */}
          <div className={styles.transparentMetricsContainer}>
            <div className={styles.metricsLabelHeader}>
              <span className={styles.greenDot} />
              <span className={styles.cardTag}>{statsDict.liveStatsHeader || "LIVE STATS & METRICS"}</span>
            </div>
            <TotalDownloads />
          </div>

          {/* ── 4. CENTERED YOUTUBE LATEST BROADCAST ────────────────── */}
          <div className={styles.centeredYoutubeWrapper} id="youtube">
            <div className={styles.youtubeCard}>
              <div className={styles.ytHeader}>
                <div className={styles.ytTitle}>
                  <FiPlayCircle className={styles.ytIcon} />
                  <span>{ytDict.latestBroadcast || "LATEST BROADCAST"}</span>
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
          </div>

        </div>

      </div>

      {/* Constellation Selected Project Detail Modal */}
      {selectedConstellationProject && (() => {
        const grouped = groupLinksByPlatform(selectedConstellationProject);
        return (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem"
          }} onClick={() => setSelectedConstellationProject(null)}>
            <div style={{
              background: "rgba(20, 20, 26, 0.95)",
              backdropFilter: "blur(28px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "680px",
              padding: "2rem",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9)",
              color: "#ffffff",
              position: "relative"
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                paddingBottom: "0.8rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
              }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56", cursor: "pointer" }} onClick={() => setSelectedConstellationProject(null)} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
                </div>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.8rem", fontWeight: 700, color: "#86868b" }}>{selectedConstellationProject.title}</span>
                <button style={{ background: "none", border: "none", color: "#86868b", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }} onClick={() => setSelectedConstellationProject(null)}>×</button>
              </div>

              {/* Modal Main Header */}
              <div style={{ display: "flex", gap: "1.2rem", marginBottom: "1.5rem" }}>
                <img src={selectedConstellationProject.icon_url} alt={selectedConstellationProject.title} style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.15)" }} />
                <div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: "#64d2ff", textTransform: "uppercase" }}>{selectedConstellationProject.type}</span>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", fontWeight: 800, margin: "0.2rem 0" }}>{selectedConstellationProject.title}</h2>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "#a1a1a6", margin: 0 }}>{selectedConstellationProject.description}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.2rem", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: "#86868b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FiDownload style={{ color: "#30d158" }} /> {modalDict?.totalDownloads || "TOTAL DOWNLOADS"}
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>
                    <AnimatedNumber value={selectedConstellationProject.downloads} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: "#86868b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FiEye style={{ color: "#64d2ff" }} /> {modalDict?.projectViews || "PROJECT VIEWS"}
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>
                    <AnimatedNumber value={getProjectViews(selectedConstellationProject.id)} />
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", color: "#86868b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FiGlobe style={{ color: "#bf5af2" }} /> {modalDict?.portfolioViews || "PORTFOLIO VIEWS"}
                  </div>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, color: "#ffffff" }}>
                    <AnimatedNumber value={portfolioViews} />
                  </div>
                </div>
              </div>

              {/* Tags */}
              {selectedConstellationProject.tags && selectedConstellationProject.tags.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.18em", color: "#86868b", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FiTag size={12} /> {modalDict?.tagsAndSpecs || "TAGS & SPECS"}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {selectedConstellationProject.tags.map((tag, idx) => (
                      <span key={idx} style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#64d2ff", background: "rgba(100, 210, 255, 0.08)", border: "1px solid rgba(100, 210, 255, 0.16)", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.64rem", fontWeight: 700, letterSpacing: "0.18em", color: "#86868b", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FiExternalLink size={12} /> {modalDict?.platformsAndDownloads || "PLATFORMS & DOWNLOADS"}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                  {Object.entries(grouped).map(([platform, links]) => {
                    const platformName = PLATFORM_NAMES[platform] || platform;
                    const platformTotal = links.reduce((sum, l) => sum + (l.initialDownloads || 0), 0);
                    return (
                      <div key={platform} style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "0.9rem 1.1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                          <span>{getPlatformIcon(platform, 18)}</span>
                          <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.85rem", fontWeight: 700 }}>{platformName}</span>
                          {platformTotal > 0 && (
                            <span style={{ marginLeft: "auto", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#30d158", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                              <FiDownload size={11} /> {platformTotal.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                          {links.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.85rem", background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "9999px", color: "#e4e4e7", fontFamily: "var(--font-body)", fontSize: "0.72rem", textDecoration: "none" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedConstellationProject) {
                                  incrementDownloadLink(selectedConstellationProject.id, link.url);
                                }
                              }}
                            >
                              <span>{link.label.replace(`${platformName} `, "")}</span>
                              {link.initialDownloads !== undefined && link.initialDownloads > 0 && (
                                <span style={{ fontWeight: 700, color: "#30d158" }}>
                                  {link.initialDownloads.toLocaleString()}
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        );
      })()}
    </section>
  );
}
