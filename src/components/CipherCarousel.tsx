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
  const [dimensions, setDimensions] = useState({ radiusX: 340, radiusY: 160 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const velocityRef = useRef(0.15);
  const angleRef = useRef(0);
  const isHoveredRef = useRef(false);
  const touchStartRef = useRef(0);

  // Dynamic Responsive Ellipse Radius for Mobile vs Desktop
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w <= 480) {
        setDimensions({
          radiusX: Math.max(95, Math.min(125, (w - 70) / 2)),
          radiusY: 52
        });
      } else if (w <= 768) {
        setDimensions({
          radiusX: Math.max(130, Math.min(170, (w - 90) / 2)),
          radiusY: 70
        });
      } else {
        setDimensions({
          radiusX: 340,
          radiusY: 160
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartRef.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      const deltaX = e.touches[0].clientX - touchStartRef.current;
      touchStartRef.current = e.touches[0].clientX;
      velocityRef.current = deltaX * 0.15;
    }
  };

  const handleCardClick = (project: UnifiedProject) => {
    if (onSelectProject) {
      onSelectProject(project);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.carouselSection}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
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

            const radiusX = dimensions.radiusX;
            const radiusY = dimensions.radiusY;
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
