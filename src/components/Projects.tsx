"use client";

import { useState, useMemo } from "react";
import { FiDownload, FiSearch, FiEye, FiGlobe, FiTag, FiExternalLink } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FaCube } from "react-icons/fa";
import styles from "./Projects.module.css";
import CipherCarousel from "./CipherCarousel";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";

const PLATFORM_NAMES: Record<string, string> = {
  curseforge: "CurseForge",
  modrinth: "Modrinth",
  gamejolt: "GameJolt",
  itch: "Itch.io",
};

export default function Projects({ dict }: { dict: any }) {
  const { projects, incrementProjectViews, getProjectViews, portfolioViews } = useLiveStats();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      if (!matchesSearch) return false;
      if (filterType === "All") return true;
      return p.type.toLowerCase().includes(filterType.toLowerCase());
    });
  }, [projects, searchQuery, filterType]);

  const handleOpenProjectModal = (project: UnifiedProject) => {
    setSelectedProject(project);
    incrementProjectViews(project.id);
  };

  const getPlatformIcon = (platform: string, size = 18) => {
    switch (platform) {
      case "modrinth": return <SiModrinth size={size} />;
      case "curseforge": return <SiCurseforge size={size} />;
      case "gamejolt": return <SiGamejolt size={size} />;
      case "itch": return <SiItchdotio size={size} />;
      default: return <FaCube size={size} />;
    }
  };

  // Get unique platforms for a project (deduplicated)
  const getUniquePlatforms = (project: UnifiedProject) => {
    const seen = new Set<string>();
    return project.links.filter((l) => {
      if (seen.has(l.platform)) return false;
      seen.add(l.platform);
      return true;
    });
  };

  // Group links by platform in the modal
  const groupLinksByPlatform = (project: UnifiedProject) => {
    const groups: Record<string, typeof project.links> = {};
    for (const link of project.links) {
      if (!groups[link.platform]) groups[link.platform] = [];
      groups[link.platform].push(link);
    }
    return groups;
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.topControlBar}>
        <div className={styles.viewToggleGroup}>
          <button
            className={`${styles.viewBtn} ${viewMode === "carousel" ? styles.activeViewBtn : ""}`}
            onClick={() => setViewMode("carousel")}
          >
            3D CONSTELLATION
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === "grid" ? styles.activeViewBtn : ""}`}
            onClick={() => setViewMode("grid")}
          >
            GRID ARCHIVE
          </button>
        </div>
      </div>

      {viewMode === "carousel" ? (
        <div className={styles.carouselWrapper}>
          <CipherCarousel projects={filteredProjects} onSelectProject={handleOpenProjectModal} />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.controlsBar}>
            <div className={styles.filtersGroup}>
              {["All", "Modpack", "Mod", "Resource Pack", "Plugin", "Server"].map((type) => (
                <button
                  key={type}
                  className={`${styles.filterBtn} ${filterType === type ? styles.activeFilter : ""}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="SEARCH WORKS & TAGS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.staticGrid}>
            {filteredProjects.map((project) => {
              const uniquePlatforms = getUniquePlatforms(project);
              return (
                <div
                  key={project.id}
                  onClick={() => handleOpenProjectModal(project)}
                  className={styles.modrinthCard}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.logoWrapper}>
                      <img
                        src={project.icon_url}
                        alt={project.title}
                        className={styles.projectLogo}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector(".fallbackLogo");
                            if (fallback) fallback.classList.remove("hidden");
                          }
                        }}
                      />
                      <div
                        className="fallbackLogo hidden"
                        style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}
                      >
                        <FaCube size={24} color="#ffffff" />
                      </div>
                    </div>
                    <div className={styles.titleArea}>
                      <span className={styles.projectTypeTag}>{project.type}</span>
                      <h4 className={styles.cardTitle}>{project.title}</h4>
                      <p className={styles.cardDesc}>{project.description}</p>
                    </div>
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className={styles.tagsRow}>
                      {project.tags.slice(0, 4).map((tag, idx) => (
                        <span key={idx} className={styles.tagChip}>#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <div className={styles.statItem}>
                      <FiDownload />
                      <span>{project.downloads.toLocaleString()}</span>
                      <span className={styles.livePulseDot} title="Somma live in tempo reale" />
                    </div>
                    {/* DEDUPLICATED platform icons */}
                    <div className={styles.platforms}>
                      {uniquePlatforms.map((link, idx) => (
                        <span key={idx} className={styles.platformIcon} title={PLATFORM_NAMES[link.platform] || link.platform}>
                          {getPlatformIcon(link.platform, 16)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Detail Modal */}
      {selectedProject && (() => {
        const grouped = groupLinksByPlatform(selectedProject);
        return (
          <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalMacHeader}>
                <div className={styles.modalTrafficLights}>
                  <span className={`${styles.trafficDot} ${styles.dotRed}`} onClick={() => setSelectedProject(null)} title="Close" />
                  <span className={`${styles.trafficDot} ${styles.dotYellow}`} title="Minimize" />
                  <span className={`${styles.trafficDot} ${styles.dotGreen}`} title="Zoom" />
                </div>
                <span className={styles.macHeaderTitle}>{selectedProject.title}</span>
                <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)}>×</button>
              </div>

              {/* Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalLogoWrapper}>
                  <img src={selectedProject.icon_url} alt={selectedProject.title} className={styles.modalLogo} />
                </div>
                <div className={styles.modalTitleArea}>
                  <span className={styles.modalCategoryBadge}>{selectedProject.type}</span>
                  <h2>{selectedProject.title}</h2>
                  <p>{selectedProject.description}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className={styles.modalStatsRow}>
                <div className={styles.modalStatBlock}>
                  <div className={styles.modalStatLabel}>
                    <FiDownload className={styles.statIconGreen} /> TOTAL DOWNLOADS
                  </div>
                  <div className={styles.modalStatNumber}>{selectedProject.downloads.toLocaleString()}</div>
                  <div className={styles.modalStatSub}>Tutte le piattaforme sommate</div>
                </div>
                <div className={styles.modalStatDivider} />
                <div className={styles.modalStatBlock}>
                  <div className={styles.modalStatLabel}>
                    <FiEye className={styles.statIconBlue} /> VIEWS PROGETTO
                  </div>
                  <div className={styles.modalStatNumber}>{getProjectViews(selectedProject.id).toLocaleString()}</div>
                  <div className={styles.modalStatSub}>Visualizzazioni reali del progetto</div>
                </div>
                <div className={styles.modalStatDivider} />
                <div className={styles.modalStatBlock}>
                  <div className={styles.modalStatLabel}>
                    <FiGlobe className={styles.statIconPurple} /> VIEWS PORTFOLIO
                  </div>
                  <div className={styles.modalStatNumber}>{portfolioViews.toLocaleString()}</div>
                  <div className={styles.modalStatSub}>Visitatori live del sito</div>
                </div>
              </div>

              {/* Tags */}
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className={styles.modalTagsSection}>
                  <div className={styles.sectionLabel}>
                    <FiTag size={12} /> TAG & SPECIFICHE
                  </div>
                  <div className={styles.modalTagsList}>
                    {selectedProject.tags.map((tag, idx) => (
                      <span key={idx} className={styles.modalTagBadge}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms grouped */}
              <div className={styles.modalPlatformsSection}>
                <div className={styles.sectionLabel}>
                  <FiExternalLink size={12} /> PIATTAFORME & EDIZIONI
                </div>
                <div className={styles.platformGroupsGrid}>
                  {Object.entries(grouped).map(([platform, links]) => {
                    const platformName = PLATFORM_NAMES[platform] || platform;
                    const platformTotal = links.reduce((sum, l) => sum + (l.initialDownloads || 0), 0);
                    return (
                      <div key={platform} className={styles.platformGroup}>
                        {/* Platform Header */}
                        <div className={styles.platformGroupHeader}>
                          <span className={styles.platformGroupIcon}>{getPlatformIcon(platform, 20)}</span>
                          <span className={styles.platformGroupName}>{platformName}</span>
                          {platformTotal > 0 && (
                            <span className={styles.platformGroupTotal}>
                              <FiDownload size={11} /> {platformTotal.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {/* Edition links */}
                        <div className={styles.platformEditions}>
                          {links.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.editionBtn}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>{link.label.replace(`${platformName} `, "")}</span>
                              {link.initialDownloads !== undefined && link.initialDownloads > 0 && (
                                <span className={styles.editionDownloads}>
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
