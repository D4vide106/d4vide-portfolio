"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { FiExternalLink, FiDownload, FiClock } from "react-icons/fi";
import { SiCurseforge, SiModrinth } from "react-icons/si";
import { FaCube, FaCubes, FaServer, FaCode } from "react-icons/fa";
import styles from "./Projects.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CF_PROJECTS = [
  "project-boss-rpg",
  "project-horror",
  "structural-beyond",
  "bosstweak-3d"
];

export default function Projects({ dict }: { dict: any }) {
  const { data: modrinthProjects } = useSWR(
    "https://api.modrinth.com/v2/user/D4vide106/projects",
    fetcher
  );

  const [cfDownloads, setCfDownloads] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchCF() {
      const downloadsMap: Record<string, number> = {};
      for (const slug of CF_PROJECTS) {
        for (const type of ["modpacks", "mc-mods", "texture-packs"]) {
          try {
            const res = await fetch(`https://api.cfwidget.com/minecraft/${type}/${slug}`);
            if (res.ok) {
              const data = await res.json();
              if (data.downloads?.total) {
                downloadsMap[slug] = data.downloads.total;
                break;
              }
            }
          } catch (e) {}
        }
      }
      setCfDownloads(downloadsMap);
    }
    fetchCF();
  }, []);

  const projects = modrinthProjects || [];

  const getCategoryIcon = (type: string) => {
    switch(type) {
      case "modpack": return <FaCubes />;
      case "plugin": return <FaServer />;
      case "datapack": return <FaCode />;
      default: return <FaCube />;
    }
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          My <span className={styles.highlight}>Projects</span>
        </h2>
        
        <div className={styles.grid}>
          {projects.map((project: any) => {
            const cfTotal = cfDownloads[project.slug] || 0;
            const totalProjDownloads = project.downloads + cfTotal;
            const projectType = project.project_type || "mod";

            return (
              <div key={project.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.logoWrapper}>
                    {project.icon_url ? (
                      <img src={project.icon_url} alt={project.title} className={styles.projectLogo} />
                    ) : (
                      <div className={styles.projectLogoPlaceholder}>{getCategoryIcon(projectType)}</div>
                    )}
                  </div>
                  <div className={styles.platforms}>
                    {cfTotal > 0 && <SiCurseforge size={16} title="CurseForge" />}
                    <SiModrinth size={16} title="Modrinth" />
                  </div>
                </div>
                
                <h4 className={styles.cardTitle}>{project.title}</h4>
                <p className={styles.cardDesc}>
                  {project.description}
                </p>

                <div className={styles.tagsContainer}>
                  <span className={styles.typeBadge}>
                    {getCategoryIcon(projectType)} {projectType.toUpperCase()}
                  </span>
                  {project.categories && project.categories.map((cat: string) => (
                    <span key={cat} className={styles.tagBadge}>{cat}</span>
                  ))}
                </div>
                
                <div className={styles.statsRow}>
                  <div className={styles.statItem} title={`Modrinth: ${project.downloads} | CurseForge: ${cfTotal}`}>
                    <FiDownload /> {totalProjDownloads.toLocaleString()}
                  </div>
                  <div className={styles.statItem}>
                    <FiClock /> {project.updated ? new Date(project.updated).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                
                <a 
                  href={`https://modrinth.com/${projectType}/${project.slug}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.readMore}
                >
                  {dict.viewProject} <FiExternalLink />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
