"use client";
import { useState, useEffect, useRef } from "react";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import { FaCube } from "react-icons/fa";
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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const velocityRef = useRef(0.15);
  const angleRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Smooth 2D Constellation Rotation Loop with Momentum Physics
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 16;
      lastTime = now;

      if (Math.abs(velocityRef.current) > 0.15) {
        velocityRef.current *= 0.95; // decelerate scroll wheel boost
      } else if (Math.abs(velocityRef.current) < 0.05) {
        velocityRef.current = 0.15 * Math.sign(velocityRef.current || 1);
      }

      const activeVel = isHoveredRef.current ? velocityRef.current * 0.1 : velocityRef.current;
      angleRef.current += activeVel * delta;

      setRotationAngle(angleRef.current);
      reqIdRef.current = requestAnimationFrame(animate);
    };

    reqIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, []);

  // Prevent page scroll and control constellation rotation via native non-passive wheel listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault(); // Stop page scrolling!
      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      velocityRef.current = scrollDirection * (Math.abs(velocityRef.current) + 0.6);

      if (Math.abs(velocityRef.current) > 3.5) {
        velocityRef.current = 3.5 * Math.sign(velocityRef.current);
      }
    };

    container.addEventListener("wheel", handleWheelNative, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheelNative);
    };
  }, []);

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
    <div ref={containerRef} className={styles.carouselSection}>
      <div className={styles.headerArea}>
        <span className={styles.sectionCaption}>PROJECT CONSTELLATION</span>
        <h2 className={styles.sectionTitle}>FEATURED WORKS</h2>
        <p className={styles.scrollHint}>[ SCROLL MOUSE WHEEL TO ROTATE & CHANGE DIRECTION ]</p>
      </div>

      {/* 2D Circular Constellation Ring Stage (Matching Image 2 & 3) */}
      <div className={styles.stage2D}>
        <div className={styles.ringCenterEmblem}>
          <img 
            src="https://mc-heads.net/avatar/_D4vide106_/64" 
            alt="_D4vide106_" 
            className={styles.centerAvatarHead} 
          />
        </div>

        <div className={styles.constellationTrack}>
          {projects.map((project, idx) => {
            const count = projects.length;
            const stepAngle = 360 / count;
            const currentItemAngle = (stepAngle * idx + rotationAngle) % 360;
            const rad = (currentItemAngle * Math.PI) / 180;

            // 2D Circle Coordinates on Screen Plane (Facing front directly)
            const radiusX = 370; // horizontal ellipse radius
            const radiusY = 220; // vertical ellipse radius
            const x = Math.cos(rad) * radiusX;
            const y = Math.sin(rad) * radiusY;

            const isCurrentHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <div
                key={project.id || idx}
                className={`${styles.card2D} ${isCurrentHovered ? styles.cardHovered : ""} ${isAnyHovered && !isCurrentHovered ? styles.cardDimmed : ""}`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0px) scale(${isCurrentHovered ? 1.3 : 1})`,
                  zIndex: isCurrentHovered ? 999 : Math.round((Math.sin(rad) + 1) * 100),
                  opacity: isAnyHovered ? (isCurrentHovered ? 1 : 0.25) : 0.85,
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
                    className={styles.cardImg2D}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback icon rendering if any CDN blocks loading
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector(`.${styles.fallbackSquare}`);
                        if (fallback) fallback.classList.remove(styles.hiddenFallback);
                      }
                    }}
                  />
                  <div className={`${styles.fallbackSquare} ${styles.hiddenFallback}`}>
                    <FaCube size={32} color="#ffffff" />
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Detail Modal Popup */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)}>×</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalLogoWrapper}>
                <img 
                  src={selectedProject.icon_url} 
                  alt={selectedProject.title} 
                  className={styles.modalLogo}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalCategoryBadge}>{selectedProject.type}</span>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
              </div>
            </div>

            <div className={styles.modalLinks}>
              <span className={styles.platformHeader}>AVAILABLE PLATFORMS & EDITIONS</span>
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


