"use client";
import { useState, useEffect, useRef } from "react";
import { FiDownload, FiClock, FiExternalLink, FiLayers, FiCode, FiServer } from "react-icons/fi";
import { FaCube, FaCubes } from "react-icons/fa";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import styles from "./CipherCarousel.module.css";


interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_url: string;
  project_type: string;
  categories: string[];
  downloads: number;
  updated: string;
  modrinthUrl: string | null;
  cfUrl: string | null;
  hasModrinth: boolean;
  hasCF: boolean;
  isMultiplatform: boolean;
}

export default function CipherCarousel({ projects }: { projects: ProjectItem[] }) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [velocity, setVelocity] = useState(0.15); // ambient base speed
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const reqIdRef = useRef<number | null>(null);
  const velocityRef = useRef(0.15);
  const angleRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Smooth continuous animation loop with momentum dampening
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 16;
      lastTime = now;

      // Base friction returning towards smooth ambient drift if user stopped scrolling
      if (Math.abs(velocityRef.current) > 0.15) {
        velocityRef.current *= 0.96; // decelerate fast wheel scroll
      } else if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0.15 * Math.sign(velocityRef.current || 1);
      }

      // Pause/slow down slightly when user is hovering a specific card to make clicking easy
      const activeVel = isHoveredRef.current ? velocityRef.current * 0.2 : velocityRef.current;
      angleRef.current += activeVel * delta;

      setRotationAngle(angleRef.current);
      reqIdRef.current = requestAnimationFrame(animate);
    };

    reqIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, []);

  // Mouse wheel handler ("se uso rotellina cambia direzione")
  const handleWheel = (e: React.WheelEvent) => {
    // Determine scroll direction & apply dynamic impulse
    const scrollDirection = e.deltaY > 0 ? 1 : -1;
    // Boost velocity in the scroll direction
    velocityRef.current = scrollDirection * (Math.abs(velocityRef.current) + 0.6);

    // Limit max rotation speed for smooth aesthetic
    if (Math.abs(velocityRef.current) > 3.5) {
      velocityRef.current = 3.5 * Math.sign(velocityRef.current);
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "modpack": return <FaCubes />;
      case "plugin": return <FiServer />;
      case "datapack": return <FiCode />;
      case "bedrock": return <FaCube />;
      default: return <FaCube />;
    }
  };


  const activeProject = hoveredIndex !== null && projects[hoveredIndex] ? projects[hoveredIndex] : projects[0];

  return (
    <div 
      className={styles.carouselSection} 
      onWheel={handleWheel}
    >
      <div className={styles.headerArea}>
        <div className={styles.sectionCaption}>PROJECT CONSTELLATION</div>
        <h2 className={styles.sectionTitle}>FEATURED WORKS</h2>
        <p className={styles.scrollHint}>[ SCROLL MOUSE WHEEL TO ROTATE & CHANGE DIRECTION ]</p>
      </div>

      {/* 3D Ring Stage (Images 3 & 4 cipher style) */}
      <div className={styles.stage3D}>
        <div className={styles.ringCenterLogo}>
          <div className={styles.innerSpinGlyph}>c</div>
        </div>

        <div className={styles.ringTrack}>
          {projects.map((project, idx) => {
            const count = projects.length;
            const stepAngle = (360 / count);
            const currentItemAngle = (stepAngle * idx + rotationAngle) % 360;
            const rad = (currentItemAngle * Math.PI) / 180;

            // Calculate 3D circular coordinates
            const radiusX = 380; // horizontal ellipse radius
            const radiusY = 120; // tilt radius
            const x = Math.sin(rad) * radiusX;
            const y = Math.cos(rad) * radiusY;
            const scale = (Math.cos(rad) + 2) / 3; // depth scale 0.33 to 1.0
            const opacity = (Math.cos(rad) + 1.2) / 2.2;
            const zIndex = Math.round((Math.cos(rad) + 1) * 100);

            const isCurrentHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <div
                key={project.id || idx}
                className={`${styles.card3D} ${isCurrentHovered ? styles.cardHovered : ""} ${isAnyHovered && !isCurrentHovered ? styles.cardDimmed : ""}`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0px) scale(${isCurrentHovered ? scale * 1.3 : scale})`,
                  zIndex: isCurrentHovered ? 999 : zIndex,
                  opacity: isAnyHovered ? (isCurrentHovered ? 1 : 0.25) : opacity,
                }}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  isHoveredRef.current = true;
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  isHoveredRef.current = false;
                }}
                onClick={() => setSelectedProject(project)}
              >
                <div className={styles.cardImageWrapper}>
                  {project.icon_url ? (
                    <img 
                      src={project.icon_url} 
                      alt={project.title} 
                      className={styles.cardImg} 
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className={styles.fallbackIcon}>{getCategoryIcon(project.project_type)}</div>
                  )}
                  <div className={styles.imageOverlay} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Live Project Info Bar (Matching Image 4 Layout) */}
      {activeProject && (
        <div className={styles.bottomInfoBar}>
          <div className={styles.infoMetaLeft}>
            <span className={styles.infoBadge}>{activeProject.project_type}</span>
            <span className={styles.infoDownloads}>
              <FiDownload style={{ marginRight: 4 }} /> {activeProject.downloads.toLocaleString()} DOWNLOADS
            </span>
          </div>

          <div className={styles.infoTitleCenter}>
            <span className={styles.infoTitleText}>{activeProject.title}</span>
            <p className={styles.infoDescText}>{activeProject.description}</p>
          </div>

          <div className={styles.infoActionsRight}>
            <button 
              className={styles.viewDetailsBtn}
              onClick={() => setSelectedProject(activeProject)}
            >
              EXPLORE WORK <FiExternalLink style={{ marginLeft: 6 }} />
            </button>
          </div>
        </div>
      )}

      {/* Project Modal Popup */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)}>×</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalLogoWrapper}>
                {selectedProject.icon_url ? (
                  <img src={selectedProject.icon_url} alt={selectedProject.title} className={styles.modalLogo} />
                ) : (
                  <div className={styles.modalLogoFallback}>{getCategoryIcon(selectedProject.project_type)}</div>
                )}
              </div>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalCategoryBadge}>{selectedProject.project_type}</span>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
              </div>
            </div>

            <div className={styles.modalStatsRow}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>DOWNLOADS</span>
                <span className={styles.statVal}>{selectedProject.downloads.toLocaleString()}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>UPDATED</span>
                <span className={styles.statVal}>{selectedProject.updated ? new Date(selectedProject.updated).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>

            <div className={styles.modalPlatforms}>
              <span className={styles.platformHeader}>OFFICIAL PLATFORMS & DOWNLOADS</span>
              <div className={styles.platformButtons}>
                {selectedProject.hasModrinth && (
                  <a href={selectedProject.modrinthUrl || "#"} target="_blank" rel="noreferrer" className={styles.modrinthBtn}>
                    <SiModrinth size={20} /> MODRINTH
                  </a>
                )}
                {selectedProject.hasCF && (
                  <a href={selectedProject.cfUrl || "#"} target="_blank" rel="noreferrer" className={styles.cfBtn}>
                    <SiCurseforge size={20} /> CURSEFORGE
                  </a>
                )}
                {selectedProject.isMultiplatform && (
                  <a href={`https://d4vide106.itch.io/${selectedProject.slug}`} target="_blank" rel="noreferrer" className={styles.itchBtn}>
                    <SiItchdotio size={20} /> ITCH.IO
                  </a>
                )}
                {selectedProject.isMultiplatform && (
                  <a href="https://gamejolt.com/@D4vide106/games" target="_blank" rel="noreferrer" className={styles.gjBtn}>
                    <SiGamejolt size={20} /> GAMEJOLT
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
