"use client";
import { useState, useEffect } from "react";
import { FiDownloadCloud } from "react-icons/fi";
import styles from "./TotalDownloads.module.css";

const CF_SLUGS = [
  "project-boss-rpg",
  "project-horror",
  "structural-beyond",
  "bosstweak-3d",
  "project-the-rpg-reborn",
  "project-gunparty",
  "project-realistic-rpg"
];

export default function TotalDownloads() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAll() {
      let modrinthSum = 0;
      let cfSum = 0;

      try {
        const mrRes = await fetch("https://api.modrinth.com/v2/user/D4vide106/projects");
        if (mrRes.ok) {
          const mrData = await mrRes.json();
          modrinthSum = mrData.reduce((acc: number, p: any) => acc + p.downloads, 0);
        }
      } catch (e) {}

      for (const slug of CF_SLUGS) {
        for (const type of ["modpacks", "mc-mods", "texture-packs"]) {
          try {
            const res = await fetch(`https://api.cfwidget.com/minecraft/${type}/${slug}`);
            if (res.ok) {
              const data = await res.json();
              if (data.id && data.downloads?.total) {
                cfSum += data.downloads.total;
                break; // found it, go to next slug
              }
            }
          } catch (e) {}
        }
      }

      setTotal(modrinthSum + cfSum);
    }
    
    fetchAll();
  }, []);

  if (total === null) {
    return (
      <div className={styles.badgeSkeleton}>
        <div className={styles.pulse}></div>
      </div>
    );
  }

  return (
    <div className={styles.downloadsBadge}>
      <FiDownloadCloud className={styles.icon} />
      <span>
        <strong>{total.toLocaleString()}</strong> Total Downloads
      </span>
    </div>
  );
}
