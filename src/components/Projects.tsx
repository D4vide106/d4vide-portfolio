"use client";

import { useState, useMemo } from "react";
import { FiDownload, FiSearch, FiEye, FiGlobe, FiTag, FiExternalLink } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FaCube } from "react-icons/fa";
import styles from "./Projects.module.css";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";
import AnimatedNumber from "./AnimatedNumber";

const PLATFORM_NAMES: Record<string, string> = {
  curseforge: "CurseForge",
  modrinth: "Modrinth",
  gamejolt: "GameJolt",
  itch: "Itch.io",
};

export default function Projects({ dict }: { dict?: any }) {
  const { projects, incrementProjectViews, getProjectViews, portfolioViews, incrementDownloadLink } = useLiveStats();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
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

  const getPlatformIcon = (platform: string, size = 17) => {
    switch (platform) {
      case "modrinth": return <SiModrinth size={size} />;
      case "curseforge": return <SiCurseforge size={size} />;
      case "gamejolt": return <SiGamejolt size={size} />;
      case "itch": return <SiItchdotio size={size} />;
      default: return <FaCube size={size} />;
    }
  };

  // Unique platforms deduplicated
  const getUniquePlatforms = (project: UnifiedProject) => {
    const seen = new Set<string>();
    return project.links.filter((l) => {
      if (seen.has(l.platform)) return false;
      seen.add(l.platform);
      return true;
    });
  };

  // Group links by platform
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
      <div className={styles.container}>
        
        {/* Clean Controls & Category Filters Header */}
        <div className={styles.galleryHeader}>
          <div className={styles.headerTitleArea}>
            <span className={styles.sectionBadge}>WORKS GALLERY</span>
            <h3 className={styles.galleryTitle}>EXPLORE ALL PROJECTS</h3>
          </div>

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
                placeholder="SEARCH PROJECTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {/* Clean Project Grid */}
        <div className={styles.staticGrid}>
          {filteredProjects.map((project) => {
            const uniquePlatforms = getUniquePlatforms(project);
            return (
              <div
                key={project.id}
                onClick={() => handleOpenProjectModal(project)}
                className={styles.modCard}
              >
                <div className={styles.cardTop}>
                  <div className={styles.logoBox}>
                    <img
                      src={project.icon_url}
                      alt={project.title}
                      className={styles.projectLogo}
                    />
                  </div>
                  <div className={styles.cardHeaderInfo}>
                    <span className={styles.typeBadge}>{project.type}</span>
                    <h4 className={styles.cardTitle}>{project.title}</h4>
                  </div>
                </div>

                <p className={styles.cardDesc}>{project.description}</p>

                {project.tags && project.tags.length > 0 && (
                  <div className={styles.tagsRow}>
                    {project.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className={styles.tagChip}>#{tag}</span>
                    ))}
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <div className={styles.downloadStat}>
                    <FiDownload size={14} />
                    <span>{project.downloads.toLocaleString()}</span>
                  </div>

                  <div className={styles.platformsRow}>
                    {uniquePlatforms.map((link, idx) => {
                      const platformName = PLATFORM_NAMES[link.platform] || link.platform;
                      return (
                        <span key={idx} className={styles.platformIcon} title={platformName}>
                          {getPlatformIcon(link.platform, 15)}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (() => {
        const grouped = groupLinksByPlatform(selectedProject);
        return (
          <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalMacHeader}>
                <div className={styles.modalTrafficLights}>
                  <span className={`${styles.trafficDot} ${styles.dotRed}`} onClick={() => setSelectedProject(null)} />
                  <span className={`${styles.trafficDot} ${styles.dotYellow}`} />
                  <span className={`${styles.trafficDot} ${styles.dotGreen}`} />
                </div>
                <span className={styles.macHeaderTitle}>{selectedProject.title}</span>
                <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)}>×</button>
              </div>

              {/* Modal Main Header */}
              <div className={styles.modalHeader}>
                <img src={selectedProject.icon_url} alt={selectedProject.title} className={styles.modalLogo} />
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
                    <FiDownload style={{ color: "#30d158" }} /> TOTAL DOWNLOADS
                  </div>
                  <div className={styles.modalStatNumber}>
                    <AnimatedNumber value={selectedProject.downloads} />
                  </div>
                </div>
                <div className={styles.modalStatBlock}>
                  <div className={styles.modalStatLabel}>
                    <FiEye style={{ color: "#64d2ff" }} /> VIEWS PROGETTO
                  </div>
                  <div className={styles.modalStatNumber}>
                    <AnimatedNumber value={getProjectViews(selectedProject.id)} />
                  </div>
                </div>
                <div className={styles.modalStatBlock}>
                  <div className={styles.modalStatLabel}>
                    <FiGlobe style={{ color: "#bf5af2" }} /> VIEWS PORTFOLIO
                  </div>
                  <div className={styles.modalStatNumber}>
                    <AnimatedNumber value={portfolioViews} />
                  </div>
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

              {/* Platforms */}
              <div className={styles.modalPlatformsSection}>
                <div className={styles.sectionLabel}>
                  <FiExternalLink size={12} /> PIATTAFORME & DOWNLOAD
                </div>
                <div className={styles.platformGroupsGrid}>
                  {Object.entries(grouped).map(([platform, links]) => {
                    const platformName = PLATFORM_NAMES[platform] || platform;
                    const platformTotal = links.reduce((sum, l) => sum + (l.initialDownloads || 0), 0);
                    return (
                      <div key={platform} className={styles.platformGroup}>
                        <div className={styles.platformGroupHeader}>
                          <span className={styles.platformGroupIcon}>{getPlatformIcon(platform, 18)}</span>
                          <span className={styles.platformGroupName}>{platformName}</span>
                          {platformTotal > 0 && (
                            <span className={styles.platformGroupTotal}>
                              <FiDownload size={11} /> {platformTotal.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className={styles.platformEditions}>
                          {links.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.editionBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedProject) {
                                  incrementDownloadLink(selectedProject.id, link.url);
                                }
                              }}
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
