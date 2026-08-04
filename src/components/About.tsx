"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { FiGlobe, FiMapPin, FiUser, FiInfo } from "react-icons/fi";
import styles from "./About.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CF_PROJECTS = ["project-boss-rpg"];

export default function About({ dict }: { dict: any }) {
  const { data: modrinthProjects } = useSWR(
    "https://api.modrinth.com/v2/user/D4vide106/projects",
    fetcher
  );

  const [cfTotal, setCfTotal] = useState(0);

  useEffect(() => {
    async function fetchCF() {
      let total = 0;
      for (const slug of CF_PROJECTS) {
        try {
          const res = await fetch(`https://api.cfwidget.com/minecraft/modpacks/${slug}`);
          const data = await res.json();
          if (data.downloads?.total) {
            total += data.downloads.total;
          }
        } catch (e) {}
      }
      setCfTotal(total);
    }
    fetchCF();
  }, []);

  let modrinthTotal = 0;
  if (modrinthProjects) {
    modrinthTotal = modrinthProjects.reduce((acc: number, proj: any) => acc + (proj.downloads || 0), 0);
  }

  const grandTotal = modrinthTotal + cfTotal;

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.twoCol}>
          
          <div className={styles.leftCol}>
            <div className={styles.skinWrapper}>
              {/* Dynamic 3D skin from mc-heads using username D4vide106 */}
              <img 
                src="https://mc-heads.net/body/D4vide106/right" 
                alt="D4vide106 Minecraft Skin" 
                className={styles.skinImage}
              />
            </div>
            
            <div className={styles.statsBox}>
              <div className={styles.statRow}>
                <FiGlobe className={styles.statIcon} />
                <span className={styles.statLabel}>{dict.aboutStats?.bornIn || "Born in"}:</span>
                <span className={styles.statValue}>Italy 🇮🇹</span>
              </div>
              <div className={styles.statRow}>
                <FiMapPin className={styles.statIcon} />
                <span className={styles.statLabel}>{dict.aboutStats?.livingIn || "Living in"}:</span>
                <span className={styles.statValue}>Italy 🇮🇹</span>
              </div>
              <div className={styles.statRow}>
                <FiUser className={styles.statIcon} />
                <span className={styles.statLabel}>{dict.aboutStats?.age || "Age"}:</span>
                <span className={styles.statValue}>21</span>
              </div>
              <div className={styles.statRow}>
                <FiInfo className={styles.statIcon} />
                <span className={styles.statLabel}>{dict.aboutStats?.gender || "Gender"}:</span>
                <span className={styles.statValue}>Male</span>
              </div>
            </div>
          </div>
          
          <div className={styles.rightCol}>
            <h2 className={styles.title}>{dict.aboutTitle || "Who the hell am I?"}</h2>
            
            <div className={styles.totalDownloadsBadge}>
              <span className={styles.dlLabel}>Total Downloads:</span> 
              <span className={styles.dlValue}>
                {grandTotal > 0 ? grandTotal.toLocaleString() + "+" : "Loading..."}
              </span>
            </div>
            
            <div className={styles.description}>
              <p>{dict.aboutDesc1 || "I am a Minecraft mod developer and content creator..."}</p>
              <br/>
              <p>{dict.aboutDesc2 || "I have a particular passion for modpacks and structures..."}</p>
              <br/>
              <p>{dict.aboutDesc3 || "You can also check out my videos on my YouTube channel where I occasionally post updates and gameplay!"}</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
