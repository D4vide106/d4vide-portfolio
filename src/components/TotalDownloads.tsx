"use client";

import { useState } from "react";
import { FiDownloadCloud, FiEye } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import { useLiveStats } from "@/context/LiveStatsContext";
import AnimatedNumber from "./AnimatedNumber";
import styles from "./TotalDownloads.module.css";

export default function TotalDownloads() {
  const { totalDownloads, portfolioViews, platformTotals } = useLiveStats();
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
          <strong><AnimatedNumber value={totalDownloads} /></strong> TOTAL DOWNLOADS
        </span>
        <span className={styles.liveDot} title="Download aggiornati in tempo reale" />

        {/* Hover Platform Breakdown Tooltip */}
        {showTooltip && (
          <div className={styles.platformTooltip}>
            <div className={styles.tooltipHeader}>DOWNLOAD PER PIATTAFORMA</div>
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

      <div className={styles.viewsBadge} title="Visitatori reali unici del portfolio tracciati via API">
        <FiEye className={styles.viewIcon} />
        <span>
          <strong><AnimatedNumber value={portfolioViews} /></strong> PORTFOLIO VIEWS
        </span>
        <span className={styles.liveDotBlue} />
      </div>
    </div>
  );
}



