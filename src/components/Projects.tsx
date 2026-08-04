"use client";
import useSWR from "swr";
import { FiExternalLink, FiDownload, FiClock, FiPackage } from "react-icons/fi";
import { SiCurseforge } from "react-icons/si";
import styles from "./Projects.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Projects({ dict }: { dict: any }) {
  const { data: modrinthProjects, error } = useSWR(
    "https://api.modrinth.com/v2/user/D4vide106/projects",
    fetcher
  );

  // Fallback static projects if fetch fails or is loading
  const projects = modrinthProjects || [
    {
      id: "boss-rpg",
      title: "Project: Boss RPG [FORGE]",
      description: "An RPG full of biomes and bosses to dominate!",
      downloads: 11454,
      updated: "2024-09-28T16:04:35.685333Z",
      project_type: "modpack",
      slug: "project-boss-rpg",
    },
    {
      id: "structural-beyond",
      title: "Structural Beyond",
      description: "An immersive mod that adds vanilla-style structures.",
      downloads: 382,
      updated: "2026-07-16T22:43:42.402356Z",
      project_type: "mod",
      slug: "structural-beyond",
    },
  ];

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          {dict.title} <span className={styles.highlight}>{dict.highlight}</span>
        </h2>
        
        <div className={styles.grid}>
          {projects.map((project: any) => (
            <div key={project.id} className={`${styles.card} glass`}>
              <div className={styles.cardContent}>
                <div className={styles.headerRow}>
                  <span className={styles.category}>
                    <FiPackage /> {project.project_type?.toUpperCase() || "MOD"}
                  </span>
                  <SiCurseforge color="var(--accent-color)" size={18} title="Available on CurseForge & Modrinth" />
                </div>
                
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>
                  {project.description}
                </p>
                
                <div className={styles.statsRow}>
                  <div className={styles.statItem}>
                    <FiDownload /> {project.downloads?.toLocaleString() || 0}
                  </div>
                  <div className={styles.statItem}>
                    <FiClock /> {project.updated ? new Date(project.updated).toLocaleDateString() : "N/A"}
                  </div>
                </div>
                
                <a 
                  href={`https://modrinth.com/${project.project_type || 'mod'}/${project.slug}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.readMore}
                  style={{ marginTop: '1rem', display: 'inline-flex' }}
                >
                  {dict.viewProject} <FiExternalLink />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
