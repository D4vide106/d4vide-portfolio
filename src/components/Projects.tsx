"use client";

import { useState, useMemo, useEffect } from "react";
import { FiDownload, FiSearch, FiEye, FiGlobe, FiTag, FiExternalLink, FiGithub, FiUsers, FiStar } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio, SiRoblox } from "react-icons/si";
import { FaCube } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Projects.module.css";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";
import AnimatedNumber from "./AnimatedNumber";
import ProjectDetailModal from "./ProjectDetailModal";

const PLATFORM_NAMES: Record<string, string> = {
  curseforge: "CurseForge",
  modrinth: "Modrinth",
  gamejolt: "GameJolt",
  itch: "Itch.io",
  github: "GitHub",
  web: "Web App",
  roblox: "Roblox",
};

export default function Projects({ dict: propDict }: { dict?: any }) {
  const { dict: contextDict } = useLanguage();
  const dict = contextDict.projects || propDict;
  const modalDict = contextDict.projectsModal || propDict;
  const projectDataDict = (contextDict as any)?.projectData || {};
  const { projects, incrementProjectViews, getProjectViews, portfolioViews, incrementDownloadLink } = useLiveStats();
  
  const [selectedCategory, setSelectedCategory] = useState<"all" | "minecraft" | "roblox">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);

  const [assetPrefix, setAssetPrefix] = useState("/d4vide-portfolio");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/d4vide-portfolio")) {
        setAssetPrefix("/d4vide-portfolio");
      } else {
        setAssetPrefix("");
      }
    }
  }, []);

  const getLogoUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${assetPrefix}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const getProjectTitle = (p: UnifiedProject) => {
    return projectDataDict[p.id]?.title || p.title;
  };

  const getProjectDescription = (p: UnifiedProject) => {
    return projectDataDict[p.id]?.description || p.description;
  };

  // Category counts
  const counts = useMemo(() => {
    const all = projects.length;
    const minecraft = projects.filter((p) => p.category === "minecraft").length;
    const roblox = projects.filter((p) => p.category === "roblox").length;
    return { all, minecraft, roblox };
  }, [projects]);

  // Contextual sub-filters based on selected macro category
  const subFilterOptions = useMemo(() => {
    if (selectedCategory === "minecraft") {
      return [
        { key: "All", label: modalDict?.all || "Tutti" },
        { key: "Modpack", label: modalDict?.modpack || "Modpack" },
        { key: "Mod", label: modalDict?.mod || "Mod & Datapack" },
        { key: "Resource Pack", label: modalDict?.resourcepack || "Resource Pack" },
        { key: "Plugin", label: modalDict?.plugin || "Plugin" },
        { key: "Server", label: modalDict?.server || "Server" },
      ];
    }
    if (selectedCategory === "roblox") {
      return [
        { key: "All", label: modalDict?.all || "Tutti" },
        { key: "Obby", label: modalDict?.robloxObby || "Obby & Platformer" },
        { key: "Social", label: modalDict?.robloxSocial || "Social Hangout" },
        { key: "Runner", label: modalDict?.robloxRunner || "Endless Runner" },
        { key: "Climber", label: modalDict?.robloxClimber || "Climber" },
      ];
    }
    // "all"
    return [
      { key: "All", label: modalDict?.all || "Tutti" },
      { key: "Minecraft", label: "Minecraft" },
      { key: "Roblox", label: "Roblox" },
      { key: "Modpack", label: modalDict?.modpack || "Modpack" },
      { key: "Mod", label: modalDict?.mod || "Mod & Datapack" },
      { key: "Obby", label: modalDict?.robloxObby || "Obby" },
    ];
  }, [selectedCategory, modalDict]);

  // Filter projects by category, search and sub-filter
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }

      // 2. Search Query
      const localizedTitle = getProjectTitle(p);
      const localizedDesc = getProjectDescription(p);
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        localizedTitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        localizedDesc.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      // 3. Sub-Filter
      if (filterType === "All") return true;

      const pType = p.type.toLowerCase();
      const fType = filterType.toLowerCase();

      if (fType === "minecraft") return p.category === "minecraft";
      if (fType === "roblox") return p.category === "roblox";
      if (fType === "mod") {
        return pType.includes("mod") && !pType.includes("modpack");
      }
      if (fType === "obby") {
        return pType.includes("obby") || (p.tags && p.tags.some((t) => t.toLowerCase().includes("obby")));
      }
      if (fType === "social") {
        return pType.includes("social") || (p.tags && p.tags.some((t) => t.toLowerCase().includes("social")));
      }
      if (fType === "runner") {
        return pType.includes("runner");
      }
      if (fType === "climber") {
        return pType.includes("climber");
      }
      return pType.includes(fType);
    });
  }, [projects, searchQuery, selectedCategory, filterType, projectDataDict]);

  // Determine if marquee animation should run (Only if 4 or more projects exist)
  const isMarqueeMode = filteredProjects.length >= 4;

  // Duplicate cards for marquee mode
  const row1Projects = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    const half = Math.ceil(filteredProjects.length / 2);
    const slice1 = filteredProjects.slice(0, half);
    return [...slice1, ...slice1, ...slice1, ...slice1];
  }, [filteredProjects]);

  const row2Projects = useMemo(() => {
    if (filteredProjects.length === 0) return [];
    const half = Math.ceil(filteredProjects.length / 2);
    const slice2 = filteredProjects.slice(half).length > 0 ? filteredProjects.slice(half) : filteredProjects;
    return [...slice2, ...slice2, ...slice2, ...slice2];
  }, [filteredProjects]);

  const handleOpenProjectModal = (project: UnifiedProject) => {
    setSelectedProject(project);
    incrementProjectViews(project.id);
  };

  const getPlatformIcon = (platform: string, size = 16) => {
    switch (platform) {
      case "modrinth": return <SiModrinth size={size} />;
      case "curseforge": return <SiCurseforge size={size} />;
      case "gamejolt": return <SiGamejolt size={size} />;
      case "itch": return <SiItchdotio size={size} />;
      case "github": return <FiGithub size={size} />;
      case "web": return <FiExternalLink size={size} />;
      case "roblox": return <SiRoblox size={size} color="#ff3b30" />;
      default: return <FaCube size={size} />;
    }
  };

  const getUniquePlatforms = (project: UnifiedProject) => {
    const seen = new Set<string>();
    return project.links.filter((l) => {
      if (seen.has(l.platform)) return false;
      seen.add(l.platform);
      return true;
    });
  };

  const groupLinksByPlatform = (project: UnifiedProject) => {
    const groups: Record<string, typeof project.links> = {};
    for (const link of project.links) {
      if (!groups[link.platform]) groups[link.platform] = [];
      groups[link.platform].push(link);
    }
    return groups;
  };

  const renderProjectCard = (project: UnifiedProject, keyPrefix = "") => {
    const uniquePlatforms = getUniquePlatforms(project);
    const pTitle = getProjectTitle(project);
    const pDesc = getProjectDescription(project);
    const isRoblox = project.category === "roblox";

    return (
      <div
        key={`${keyPrefix}${project.id}`}
        onClick={() => handleOpenProjectModal(project)}
        className={isMarqueeMode ? styles.modrinthCard : styles.modrinthCardStill}
      >
        <div className={styles.cardHeader}>
          <div className={styles.logoBox}>
            <img
              src={getLogoUrl(project.icon_url)}
              alt={pTitle}
              className={styles.projectLogo}
              onError={(e) => {
                if (project.fallback_icon_url && (e.currentTarget as HTMLImageElement).src !== project.fallback_icon_url) {
                  (e.currentTarget as HTMLImageElement).src = project.fallback_icon_url;
                }
              }}
            />
          </div>
          <div className={styles.titleArea}>
            <div className={styles.badgeRow}>
              <span className={`${styles.typeBadge} ${isRoblox ? styles.robloxTypeBadge : ""}`}>
                {project.type}
              </span>
              {isRoblox && (
                <span className={styles.robloxBrandPill}>
                  <SiRoblox size={10} /> Roblox
                </span>
              )}
            </div>
            <h4 className={styles.cardTitle}>{pTitle}</h4>
            {isRoblox && project.robloxStats && (
              <span className={styles.cardAuthor}>
                by {project.robloxStats.creatorName}
              </span>
            )}
          </div>
        </div>

        <p className={styles.cardDesc}>{pDesc}</p>

        <div className={styles.cardFooter}>
          {isRoblox ? (
            <div className={styles.robloxCardStats}>
              <div className={styles.visitStat} title="Visite totali">
                <FiEye size={12} />
                <span>{project.downloads.toLocaleString()}</span>
              </div>
              {project.robloxStats?.ratingPercent !== undefined && (
                <span className={styles.ratingStat} title="Valutazione positiva">
                  ⭐ {project.robloxStats.ratingPercent}%
                </span>
              )}
            </div>
          ) : (
            <div className={styles.downloadStat} title="Download totali">
              <FiDownload size={13} />
              <span>{project.downloads.toLocaleString()}</span>
            </div>
          )}

          <div className={styles.platformsRow}>
            {uniquePlatforms.map((link, pIdx) => {
              const platformName = PLATFORM_NAMES[link.platform] || link.platform;
              return (
                <span key={pIdx} className={styles.platformIcon} title={platformName}>
                  {getPlatformIcon(link.platform, 14)}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      
      {/* Centered Controls Bar Container */}
      <div className={styles.controlsWrapper}>
        
        {/* 1. Macro Ecosystem Switch: Tutti | Minecraft | Roblox */}
        <div className={styles.categoryPillsContainer}>
          <button
            className={`${styles.categoryPill} ${selectedCategory === "all" ? styles.activeCategoryPill : ""}`}
            onClick={() => {
              setSelectedCategory("all");
              setFilterType("All");
            }}
          >
            <FiGlobe size={13} />
            <span>{modalDict?.allCategories || "Tutti"}</span>
            <span className={styles.countBubble}>{counts.all}</span>
          </button>

          <button
            className={`${styles.categoryPill} ${selectedCategory === "minecraft" ? styles.activeCategoryPillMinecraft : ""}`}
            onClick={() => {
              setSelectedCategory("minecraft");
              setFilterType("All");
            }}
          >
            <FaCube size={12} color="#30d158" />
            <span>{modalDict?.minecraftCategory || "Minecraft"}</span>
            <span className={styles.countBubble}>{counts.minecraft}</span>
          </button>

          <button
            className={`${styles.categoryPill} ${selectedCategory === "roblox" ? styles.activeCategoryPillRoblox : ""}`}
            onClick={() => {
              setSelectedCategory("roblox");
              setFilterType("All");
            }}
          >
            <SiRoblox size={12} color="#ff3b30" />
            <span>{modalDict?.robloxCategory || "Roblox"}</span>
            <span className={styles.countBubble}>{counts.roblox}</span>
          </button>
        </div>

        {/* 2. Sub-filters & Search Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.filtersGroup}>
            {subFilterOptions.map((typeItem) => (
              <button
                key={typeItem.key}
                className={`${styles.filterBtn} ${filterType === typeItem.key ? styles.activeFilter : ""}`}
                onClick={() => setFilterType(typeItem.key)}
              >
                {typeItem.label}
              </button>
            ))}
          </div>

          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={modalDict?.searchPlaceholder || "SEARCH PROJECTS..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* MOBILE FEED (Clean native cards for touch screens <= 768px) */}
      <div className={styles.mobileProjectsContainer}>
        {filteredProjects.map((project) => {
          const uniquePlatforms = getUniquePlatforms(project);
          const pTitle = getProjectTitle(project);
          const pDesc = getProjectDescription(project);
          const isRoblox = project.category === "roblox";

          return (
            <div
              key={`m-${project.id}`}
              onClick={() => handleOpenProjectModal(project)}
              className={styles.mobileCard}
            >
              <div className={styles.cardHeader}>
                <div className={styles.logoBox}>
                  <img
                    src={getLogoUrl(project.icon_url)}
                    alt={pTitle}
                    className={styles.projectLogo}
                    onError={(e) => {
                      if (project.fallback_icon_url && (e.currentTarget as HTMLImageElement).src !== project.fallback_icon_url) {
                        (e.currentTarget as HTMLImageElement).src = project.fallback_icon_url;
                      }
                    }}
                  />
                </div>
                <div className={styles.titleArea}>
                  <div className={styles.badgeRow}>
                    <span className={`${styles.typeBadge} ${isRoblox ? styles.robloxTypeBadge : ""}`}>
                      {project.type}
                    </span>
                    {isRoblox && (
                      <span className={styles.robloxBrandPill}>
                        <SiRoblox size={10} /> Roblox
                      </span>
                    )}
                  </div>
                  <h4 className={styles.cardTitle}>{pTitle}</h4>
                  {isRoblox && project.robloxStats && (
                    <span className={styles.cardAuthor}>
                      by {project.robloxStats.creatorName}
                    </span>
                  )}
                </div>
              </div>

              <p className={styles.cardDesc}>{pDesc}</p>

              <div className={styles.cardFooter}>
                {isRoblox ? (
                  <div className={styles.robloxCardStats}>
                    <div className={styles.visitStat} title="Visite totali">
                      <FiEye size={12} />
                      <span>{project.downloads.toLocaleString()}</span>
                    </div>
                    {project.robloxStats?.ratingPercent !== undefined && (
                      <span className={styles.ratingStat}>
                        ⭐ {project.robloxStats.ratingPercent}%
                      </span>
                    )}
                  </div>
                ) : (
                  <div className={styles.downloadStat}>
                    <FiDownload size={13} />
                    <span>{project.downloads.toLocaleString()}</span>
                  </div>
                )}

                <div className={styles.platformsRow}>
                  {uniquePlatforms.map((link, pIdx) => {
                    const platformName = PLATFORM_NAMES[link.platform] || link.platform;
                    return (
                      <span key={pIdx} className={styles.platformIcon} title={platformName}>
                        {getPlatformIcon(link.platform, 14)}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP VIEW: Still Centered Grid (<4 projects) vs Marquee Showcase (>=4 projects) */}
      <div className={styles.desktopProjectsWrapper}>
        {!isMarqueeMode ? (
          <div className={styles.staticCenteredContainer}>
            <div className={styles.staticCenteredGrid}>
              {filteredProjects.map((project) => renderProjectCard(project, "still-"))}
            </div>
          </div>
        ) : (
          <div className={styles.marqueeFullBleedSection}>
            
            {/* Marquee Row 1 (Scrolling Left) */}
            <div className={styles.marqueeRowContainer}>
              <div className={`${styles.marqueeTrack} ${styles.marqueeLeft}`}>
                {row1Projects.map((project, idx) => renderProjectCard(project, `r1-${idx}-`))}
              </div>
            </div>

            {/* Marquee Row 2 (Scrolling Right) */}
            <div className={styles.marqueeRowContainer}>
              <div className={`${styles.marqueeTrack} ${styles.marqueeRight}`}>
                {row2Projects.map((project, idx) => renderProjectCard(project, `r2-${idx}-`))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        portfolioViews={portfolioViews}
        getProjectViews={getProjectViews}
        incrementDownloadLink={incrementDownloadLink}
        projectDataDict={projectDataDict}
        modalDict={modalDict}
      />
    </section>
  );
}
