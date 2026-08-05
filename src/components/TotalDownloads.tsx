"use client";
import { useState, useEffect } from "react";
import { FiDownloadCloud } from "react-icons/fi";
import styles from "./TotalDownloads.module.css";

export default function TotalDownloads() {
  const [total, setTotal] = useState<number>(100342);

  useEffect(() => {
    async function fetchTotal() {
      try {
        const mrRes = await fetch("https://api.modrinth.com/v2/user/D4vide106/projects");
        if (mrRes.ok) {
          const mrData = await mrRes.json();
          const modrinthSum = mrData.reduce((acc: number, p: any) => acc + (p.downloads || 0), 0);
          setTotal((prev) => Math.max(prev, modrinthSum + 85000));
        }
      } catch (e) {}
    }
    fetchTotal();
  }, []);

  return (
    <div className={styles.downloadsBadge}>
      <FiDownloadCloud className={styles.icon} />
      <span>
        <strong>{total.toLocaleString()}</strong> TOTAL DOWNLOADS
      </span>
    </div>
  );
}

