"use client";

import { FiDownloadCloud, FiEye } from "react-icons/fi";
import { useLiveStats } from "@/context/LiveStatsContext";
import styles from "./TotalDownloads.module.css";

export default function TotalDownloads() {
  const { totalDownloads, portfolioViews } = useLiveStats();

  return (
    <div className={styles.statsContainer}>
      <div className={styles.downloadsBadge}>
        <FiDownloadCloud className={styles.icon} />
        <span>
          <strong>{totalDownloads.toLocaleString()}</strong> TOTAL DOWNLOADS
        </span>
        <span className={styles.liveDot} title="Download aggiornati in tempo reale" />
      </div>

      <div className={styles.viewsBadge}>
        <FiEye className={styles.viewIcon} />
        <span>
          <strong>{portfolioViews.toLocaleString()}</strong> PORTFOLIO VIEWS
        </span>
        <span className={styles.liveDotBlue} title="Visitatori reali tracciati globalmente" />
      </div>
    </div>
  );
}


