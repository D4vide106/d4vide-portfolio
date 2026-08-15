"use client";

import { useState } from "react";
import { FiDownloadCloud, FiEye } from "react-icons/fi";
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

  return (
    <div className={styles.statsContainer}>
      <div 
        className={styles.downloadsBadge}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FiDownloadCloud className={styles.icon} />
        <span>
          <strong><AnimatedNumber value={totalDownloads} /></strong> {modalDict.totalDownloads || "TOTAL DOWNLOADS"}
        </span>
        <span className={styles.liveDot} />

        {/* Hover Platform Breakdown Tooltip */}
        {showTooltip && (
          <div className={styles.platformTooltip}>
            <div className={styles.tooltipHeader}>{statsDict.downloadsByPlatform || "DOWNLOADS BY PLATFORM"}</div>
            <div className={styles.tooltipRow}>
              <span className={styles.platformLabel}><SiModrinth color="#1bd96a" size={13} /> Modrinth</span>
              <span className={styles.platformVal}><AnimatedNumber value={platformTotals.modrinth || 0} /></span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.platformLabel}><SiCurseforge color="#f16436" size={13} /> CurseForge</span>
              <span className={styles.platformVal}><AnimatedNumber value={platformTotals.curseforge || 0} /></span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.platformLabel}><SiItchdotio color="#fa5c5c" size={13} /> Itch.io</span>
              <span className={styles.platformVal}><AnimatedNumber value={platformTotals.itch || 0} /></span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.platformLabel}><SiGamejolt color="#2fcc71" size={13} /> GameJolt</span>
              <span className={styles.platformVal}><AnimatedNumber value={platformTotals.gamejolt || 0} /></span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.viewsBadge}>
        <FiEye className={styles.viewIcon} />
        <span>
          <strong><AnimatedNumber value={portfolioViews} /></strong> {modalDict.portfolioViews || "PORTFOLIO VIEWS"}
        </span>
        <span className={styles.liveDotBlue} />
      </div>
    </div>
  );
}
