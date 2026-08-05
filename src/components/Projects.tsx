"use client";

import { useState, useMemo } from "react";
import { FiDownload, FiSearch, FiEye, FiGlobe, FiTag } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FaCube } from "react-icons/fa";
import styles from "./Projects.module.css";
import CipherCarousel from "./CipherCarousel";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";

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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "modrinth":
        return <SiModrinth size={18} />;
      case "curseforge":
        return <SiCurseforge size={18} />;
      case "gamejolt":
        return <SiGamejolt size={18} />;
      case "itch":
        return <SiItchdotio size={18} />;
      default:
        return <FaCube size={18} />;
    }
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
            {filteredProjects.map((project) => (
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
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#111",
                      }}
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

                {/* Project Tags Preview */}
                {project.tags && project.tags.length > 0 && (
                  <div className={styles.tagsRow}>
                    {project.tags.slice(0, 4).map((tag, idx) => (
                      <span key={idx} className={styles.tagChip}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.cardFooter}>
                  <div className={styles.statItem}>
                    <FiDownload /> <span>{project.downloads.toLocaleString()}</span>
                    <span className={styles.livePulseDot} title="Live Real-time Download Sum" />
                  </div>
                  <div className={styles.platforms}>
                    {project.links.map((link, idx) => (
                      <span key={idx} title={link.label}>
                        {getPlatformIcon(link.platform)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Detail Modal Popup */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)}>
              ×
            </button>

            <div className={styles.modalHeader}>
              <div className={styles.modalLogoWrapper}>
                <img
                  src={selectedProject.icon_url}
                  alt={selectedProject.title}
                  className={styles.modalLogo}
                />
              </div>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalCategoryBadge}>{selectedProject.type}</span>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
              </div>
            </div>

            {/* Real-Time Live Stats Grid in Modal */}
            <div className={styles.modalStatsGrid}>
              <div className={styles.modalStatCard}>
                <div className={styles.modalStatHeader}>
                  <FiDownload className={styles.statIconGlow} />
                  <span>TOTAL LIVE DOWNLOADS</span>
                </div>
                <strong className={styles.modalStatValue}>
                  {selectedProject.downloads.toLocaleString()}
                </strong>
                <span className={styles.modalStatSub}>Sum across all platforms & editions</span>
              </div>

              <div className={styles.modalStatCard}>
                <div className={styles.modalStatHeader}>
                  <FiEye className={styles.statIconBlue} />
                  <span>PROJECT VIEWS</span>
                </div>
                <strong className={styles.modalStatValue}>
                  {getProjectViews(selectedProject.id).toLocaleString()}
                </strong>
                <span className={styles.modalStatSub}>Real-time project views</span>
              </div>

              <div className={styles.modalStatCard}>
                <div className={styles.modalStatHeader}>
                  <FiGlobe className={styles.statIconPurple} />
                  <span>PORTFOLIO VIEWS</span>
                </div>
                <strong className={styles.modalStatValue}>
                  {portfolioViews.toLocaleString()}
                </strong>
                <span className={styles.modalStatSub}>Live site visitor count</span>
              </div>
            </div>

            {/* Project Tags Section */}
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className={styles.modalTagsSection}>
                <div className={styles.sectionHeaderLabel}>
                  <FiTag size={13} />
                  <span>PROJECT TAGS & SPECIFICATIONS</span>
                </div>
                <div className={styles.modalTagsList}>
                  {selectedProject.tags.map((tag, idx) => (
                    <span key={idx} className={styles.modalTagBadge}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Platforms & Editions Buttons */}
            <div className={styles.modalLinksSection}>
              <h3>AVAILABLE PLATFORMS & EDITIONS</h3>
              <div className={styles.platformButtonsGrid}>
                {selectedProject.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.platformLinkBtn}
                  >
                    <div className={styles.platformBtnLeft}>
                      {getPlatformIcon(link.platform)}
                      <span>{link.label}</span>
                    </div>
                    {typeof link.initialDownloads === "number" && link.initialDownloads > 0 && (
                      <span className={styles.platformDownloadBadge}>
                        <FiDownload size={12} /> {link.initialDownloads.toLocaleString()}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
