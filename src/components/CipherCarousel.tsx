"use client";
import { useState, useEffect, useRef } from "react";
import { FiDownload, FiExternalLink, FiCode, FiServer } from "react-icons/fi";
import { FaCube, FaCubes, FaGamepad } from "react-icons/fa";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import styles from "./CipherCarousel.module.css";

interface ProjectLink {
  label: string;
  url: string;
  platform: "modrinth" | "curseforge" | "gamejolt" | "itch";
}

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_url: string;
  type: string;
  downloads: number;
  updated: string;
  links: ProjectLink[];
}

export default function CipherCarousel({ projects }: { projects: ProjectItem[] }) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const reqIdRef = useRef<number | null>(null);
  const velocityRef = useRef(0.18);
  const angleRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Smooth continuous rotation loop with momentum physics
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 16;
      lastTime = now;

      if (Math.abs(velocityRef.current) > 0.18) {
        velocityRef.current *= 0.95; // decelerate wheel scroll
      } else if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0.18 * Math.sign(velocityRef.current || 1);
      }

      const activeVel = isHoveredRef.current ? velocityRef.current * 0.15 : velocityRef.current;
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
    const scrollDirection = e.deltaY > 0 ? 1 : -1;
    velocityRef.current = scrollDirection * (Math.abs(velocityRef.current) + 0.7);

    if (Math.abs(velocityRef.current) > 4.0) {
      velocityRef.current = 4.0 * Math.sign(velocityRef.current);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "modrinth": return <SiModrinth size={18} />;
      case "curseforge": return <SiCurseforge size={18} />;
      case "gamejolt": return <SiGamejolt size={18} />;
      case "itch": return <SiItchdotio size={18} />;
      default: return <FaCube size={18} />;
    }
  };

  const activeProject = hoveredIndex !== null && projects[hoveredIndex] ? projects[hoveredIndex] : projects[0];

  return (
    <div className={styles.carouselSection} onWheel={handleWheel}>
      <div className={styles.headerArea}>
        <span className={styles.sectionCaption}>PROJECT CONSTELLATION</span>
        <h2 className={styles.sectionTitle}>FEATURED WORKS</h2>
        <p className={styles.scrollHint}>[ SCROLL MOUSE WHEEL TO ROTATE & CHANGE DIRECTION ]</p>
      </div>

      {/* Diagonal 3D Stage Plane (Square Cards & Tilted Circle) */}
      <div className={styles.stage3D}>
        <div className={styles.diagonalPlane}>
          <div className={styles.ringCenterEmblem}>
            <div className={styles.innerSpinGlyph}>D4</div>
          </div>

          <div className={styles.ringTrack}>
            {projects.map((project, idx) => {
              const count = projects.length;
              const stepAngle = 360 / count;
              const currentItemAngle = (stepAngle * idx + rotationAngle) % 360;
              const rad = (currentItemAngle * Math.PI) / 180;

              // 3D Diagonal Ellipse parameters
              const radiusX = 390;
              const radiusY = 140;
              const x = Math.sin(rad) * radiusX;
              const y = Math.cos(rad) * radiusY;
              const scale = (Math.cos(rad) + 2.2) / 3.2;
              const opacity = (Math.cos(rad) + 1.2) / 2.2;
              const zIndex = Math.round((Math.cos(rad) + 1) * 100);

              const isCurrentHovered = hoveredIndex === idx;
              const isAnyHovered = hoveredIndex !== null;

              return (
                <div
                  key={project.id || idx}
                  className={`${styles.cardSquare3D} ${isCurrentHovered ? styles.cardHovered : ""} ${isAnyHovered && !isCurrentHovered ? styles.cardDimmed : ""}`}
                  style={{
                    transform: `translate3d(${x}px, ${y}px, 0px) scale(${isCurrentHovered ? scale * 1.35 : scale})`,
                    zIndex: isCurrentHovered ? 999 : zIndex,
                    opacity: isAnyHovered ? (isCurrentHovered ? 1 : 0.2) : opacity,
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
                  <div className={styles.cardImageContainer}>
                    <img 
                      src={project.icon_url} 
                      alt={project.title} 
                      className={styles.cardImgSquare}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector(`.${styles.fallbackSquare}`);
                          if (fallback) fallback.classList.remove(styles.hiddenFallback);
                        }
                      }}
                    />
                    <div className={`${styles.fallbackSquare} ${styles.hiddenFallback}`}>
                      <FaCube size={36} color="#ffffff" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Bottom Information Bar */}
      {activeProject && (
        <div className={styles.bottomInfoBar}>
          <div className={styles.infoMetaLeft}>
            <span className={styles.infoBadge}>{activeProject.type}</span>
            <span className={styles.infoDownloads}>
              <FiDownload style={{ marginRight: 4 }} /> {activeProject.downloads.toLocaleString()} DOWNLOADS
            </span>
          </div>

          <div className={styles.infoTitleCenter}>
            <span className={styles.infoTitleText}>{activeProject.title}</span>
            <p className={styles.infoDescText}>{activeProject.description}</p>
          </div>

          <div className={styles.infoActionsRight}>
            <button className={styles.viewDetailsBtn} onClick={() => setSelectedProject(activeProject)}>
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
                <img src={selectedProject.icon_url} alt={selectedProject.title} className={styles.modalLogo} />
              </div>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalCategoryBadge}>{selectedProject.type}</span>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
              </div>
            </div>

            <div className={styles.modalLinks}>
              <span className={styles.platformHeader}>AVAILABLE PLATFORMS & DOWNLOADS</span>
              <div className={styles.platformButtons}>
                {selectedProject.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer" className={styles.platformBtn}>
                    {getPlatformIcon(link.platform)}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
