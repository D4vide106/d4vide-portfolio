"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { FiDownloadCloud, FiEye, FiX, FiAward, FiShield } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import { useLiveStats } from "@/context/LiveStatsContext";
import { useLanguage } from "@/context/LanguageContext";
import AnimatedNumber from "./AnimatedNumber";
import styles from "./TotalDownloads.module.css";

export default function TotalDownloads() {
  const { totalDownloads, portfolioViews, platformTotals } = useLiveStats();
  const { dict: contextDict } = useLanguage();
  const modalDict = contextDict.projectsModal || {};
  const statsDict = contextDict.stats || {};

  const [showTooltip, setShowTooltip] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [assetPrefix, setAssetPrefix] = useState("/d4vide-portfolio");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/d4vide-portfolio")) {
        setAssetPrefix("/d4vide-portfolio");
      } else {
        setAssetPrefix("");
      }
    }
  }, []);

  // Keyboard shortcut (Escape) to close modal & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCertModal(false);
      }
    };
    if (showCertModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showCertModal]);

  return (
    <>
      <div className={styles.statsContainer}>
        {/* 1. CURSEFORGE 100K CERTIFICATE BADGE (Click to open clean modal) */}
        <div 
          className={styles.certificateBadge}
          onClick={() => setShowCertModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowCertModal(true);
            }
          }}
          title={statsDict.clickToView || "Clicca per visualizzare il certificato ufficiale CurseForge"}
          aria-label="Visualizza certificato 100K CurseForge"
        >
          <div className={styles.certThumbPill}>
            <img 
              src={`${assetPrefix}/curseforge-legend-thumb.webp`} 
              alt="Certificato CurseForge 100K"
              className={styles.certThumbImg}
              width={16}
              height={22}
            />
          </div>
          <SiCurseforge className={styles.curseforgeIcon} />
          <span className={styles.badgeLabel}>
            <strong>100K</strong> {statsDict.certificateBadge || "CERTIFICATO"}
          </span>
          <span className={styles.liveDotOrange} />
        </div>

        {/* 2. DOWNLOADS BADGE WITH HOVER BREAKDOWN TOOLTIP */}
        <div 
          className={styles.downloadsBadge}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          tabIndex={0}
          role="button"
          aria-label="Statistiche download totali"
        >
          <FiDownloadCloud className={styles.icon} />
          <span>
            <strong><AnimatedNumber value={totalDownloads} /></strong> {modalDict.totalDownloads || "DOWNLOAD TOTALI"}
          </span>
          <span className={styles.liveDot} />

          {/* Minimal Platform Breakdown Tooltip */}
          {showTooltip && (
            <div className={styles.platformTooltip}>
              <div className={styles.tooltipHeader}>
                {statsDict.downloadsByPlatform || "DOWNLOAD PER PIATTAFORMA"}
              </div>
              <div className={styles.breakdownList}>
                <div className={styles.tooltipRow}>
                  <span className={styles.platformLabel}>
                    <SiCurseforge color="#f16436" size={13} /> CurseForge
                  </span>
                  <span className={styles.platformVal}>
                    <AnimatedNumber value={platformTotals.curseforge || 0} />
                  </span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.platformLabel}>
                    <SiModrinth color="#1bd96a" size={13} /> Modrinth
                  </span>
                  <span className={styles.platformVal}>
                    <AnimatedNumber value={platformTotals.modrinth || 0} />
                  </span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.platformLabel}>
                    <SiGamejolt color="#2fcc71" size={13} /> GameJolt
                  </span>
                  <span className={styles.platformVal}>
                    <AnimatedNumber value={platformTotals.gamejolt || 0} />
                  </span>
                </div>
                <div className={styles.tooltipRow}>
                  <span className={styles.platformLabel}>
                    <SiItchdotio color="#fa5c5c" size={13} /> Itch.io
                  </span>
                  <span className={styles.platformVal}>
                    <AnimatedNumber value={platformTotals.itch || 0} />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. PORTFOLIO VIEWS BADGE */}
        <div className={styles.viewsBadge}>
          <FiEye className={styles.viewIcon} />
          <span>
            <strong><AnimatedNumber value={portfolioViews} /></strong> {modalDict.portfolioViews || "PORTFOLIO VIEWS"}
          </span>
          <span className={styles.liveDotBlue} />
        </div>
      </div>

      {/* 4. CLEAN CERTIFICATE LIGHTBOX MODAL (Rendered to body via createPortal) */}
      {showCertModal && mounted && typeof document !== "undefined" && createPortal(
        <div 
          className={styles.certModalBackdrop}
          onClick={() => setShowCertModal(false)}
        >
          <button 
            className={styles.closeModalBtn}
            onClick={() => setShowCertModal(false)}
            title="Chiudi (Esc)"
            aria-label="Chiudi modale"
          >
            <FiX />
          </button>

          <div 
            className={styles.certImageFrame}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={`${assetPrefix}/curseforge-legend-certificate.webp`} 
              alt="CurseForge Legends Forgeborn Certificate - D4vide106"
              className={styles.modalCertImg}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />

            {/* Ghost Shield: transparent protective overlay */}
            <div 
              className={styles.ghostShield} 
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
