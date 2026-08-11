"use client";

import { useState, useEffect, useRef } from "react";
import { FaCube } from "react-icons/fa";
import styles from "./CipherCarousel.module.css";
import { UnifiedProject } from "@/data/projectsData";

export default function CipherCarousel({
  projects,
  onSelectProject,
}: {
  projects: UnifiedProject[];
  onSelectProject?: (project: UnifiedProject) => void;
}) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // Allow smooth constellation rotation via mouse wheel without trapping page scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelNative = (e: WheelEvent) => {
      const scrollDirection = e.deltaY > 0 ? 1 : -1;
      velocityRef.current = scrollDirection * (Math.abs(velocityRef.current) + 0.5);

      if (Math.abs(velocityRef.current) > 3.0) {
        velocityRef.current = 3.0 * Math.sign(velocityRef.current);
      }
    };

    container.addEventListener("wheel", handleWheelNative, { passive: true });
    return () => {
      container.removeEventListener("wheel", handleWheelNative);
    };
  }, []);

  const handleCardClick = (project: UnifiedProject) => {
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  return (
    <div ref={containerRef} className={styles.carouselSection}>
      {/* 2D Circular Constellation Ring Stage */}
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

            const radiusX = 340; // horizontal ellipse radius
            const radiusY = 160; // vertical ellipse radius (comfortable top & bottom clearance)
            const x = Math.cos(rad) * radiusX;
            const y = Math.sin(rad) * radiusY;

            const isCurrentHovered = hoveredIndex === idx;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <div
                key={project.id || idx}
                className={`${styles.card2D} ${
                  isCurrentHovered ? styles.cardHovered : ""
                } ${isAnyHovered && !isCurrentHovered ? styles.cardDimmed : ""}`}
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0px) scale(${
                    isCurrentHovered ? 1.25 : 1
                  })`,
                  zIndex: isCurrentHovered ? 999 : Math.round((Math.sin(rad) + 1) * 100),
                  opacity: isAnyHovered ? (isCurrentHovered ? 1 : 0.3) : 0.85,
                  cursor: "pointer"
                }}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  isHoveredRef.current = true;
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  isHoveredRef.current = false;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(project);
                }}
              >
                <div className={styles.cardImageContainer}>
                  <img
                    src={project.icon_url}
                    alt={project.title}
                    className={styles.cardImg2D}
                    referrerPolicy="no-referrer"
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
                    <FaCube size={32} color="#ffffff" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
