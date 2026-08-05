"use client";

import { FiDownloadCloud } from "react-icons/fi";
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
        <span className={styles.liveDot} title="Real-time live stats active" />
      </div>

      <div className={styles.viewsBadge}>
        <span className={styles.viewIcon}>👁️</span>
        <span>
          <strong>{portfolioViews.toLocaleString()}</strong> PORTFOLIO VIEWS
        </span>
      </div>
    </div>
  );
}


