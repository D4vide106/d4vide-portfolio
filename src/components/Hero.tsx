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
  SiTiktok,
  SiRoblox 
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
import ProjectDetailModal from "./ProjectDetailModal";

const PLATFORM_NAMES: Record<string, string> = {
  curseforge: "CurseForge",
  modrinth: "Modrinth",
  gamejolt: "GameJolt",
  itch: "Itch.io",
  roblox: "Roblox",
};

const SOCIAL_LINKS = [
  { name: "Roblox", handle: "Infinity Project Studio's", url: "https://www.roblox.com/communities/33742489/Infinity-Project-Studios", icon: SiRoblox, color: "#e2231a" },
  { name: "Modrinth", handle: "@D4vide106", url: "https://modrinth.com/user/D4vide106", icon: SiModrinth, color: "#1bd96a" },
  { name: "CurseForge", handle: "@d4vide106", url: "https://www.curseforge.com/members/d4vide106/projects", icon: SiCurseforge, color: "#f16436" },
  { name: "YouTube", handle: "@d4vide106", url: "https://youtube.com/@d4vide106", icon: SiYoutube, color: "#ff453a" },
  { name: "Instagram", handle: "@d4vide106", url: "https://instagram.com/d4vide106", icon: SiInstagram, color: "#e1306c" },
  { name: "TikTok", handle: "@d4vide106", url: "https://tiktok.com/@d4vide106", icon: SiTiktok, color: "#00f2fe" },
  { name: "Discord", handle: "@d4vide106", url: "https://discord.gg/f8kP4WsVSW", icon: SiDiscord, color: "#5865f2" },
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
      case "roblox": return <SiRoblox size={size} color="#e2231a" />;
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

            <div className={styles.pyramidBioText}>
              <p className={styles.bioParagraph}>
                {aboutDict?.aboutDesc1}
              </p>
              <p className={styles.bioParagraph}>
                {aboutDict?.aboutDesc2}
              </p>
            </div>

            {/* Redesigned Sleek Dynamic Social Capsule Bar */}
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
                    style={{ "--brand-color": soc.color } as React.CSSProperties}
                  >
                    <span className={styles.socIconWrap}>
                      <IconComp className={styles.socIcon} />
                    </span>
                    <span className={styles.socName}>{soc.name}</span>
                    <FiArrowUpRight className={styles.socArrow} />
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
      <ProjectDetailModal
        project={selectedConstellationProject}
        onClose={() => setSelectedConstellationProject(null)}
        portfolioViews={portfolioViews}
        getProjectViews={getProjectViews}
        incrementDownloadLink={incrementDownloadLink}
        projectDataDict={contextDict.projectData || {}}
        modalDict={modalDict}
      />
    </section>
  );
}
