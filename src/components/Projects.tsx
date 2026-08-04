"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { FiExternalLink, FiDownload, FiClock } from "react-icons/fi";
import { SiCurseforge, SiModrinth } from "react-icons/si";
import { FaCube, FaCubes, FaServer, FaCode } from "react-icons/fa";
import styles from "./Projects.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// List of CurseForge IDs or Slugs to fetch extra stats
const CF_PROJECTS = [
  "project-boss-rpg", // Modpack
  "boss-rpg-tweaks", // Example Resource Pack
];

export default function Projects({ dict }: { dict: any }) {
  const { data: modrinthProjects } = useSWR(
    "https://api.modrinth.com/v2/user/D4vide106/projects",
    fetcher
  );

  const [cfDownloads, setCfDownloads] = useState<Record<string, number>>({});
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    async function fetchCF() {
      let totalCF = 0;
      const downloadsMap: Record<string, number> = {};

      for (const slug of CF_PROJECTS) {
        try {
          // CF Widget sometimes needs type, but can often guess by slug or id. Using search or direct:
          // A generic CFWidget endpoint for slugs requires category, e.g. /minecraft/modpacks/project-boss-rpg
          // For simplicity, we just try to fetch the known ones we checked:
          if (slug === "project-boss-rpg") {
            const res = await fetch("https://api.cfwidget.com/minecraft/modpacks/project-boss-rpg");
            const data = await res.json();
            if (data.downloads?.total) {
              downloadsMap[slug] = data.downloads.total;
              totalCF += data.downloads.total;
            }
          }
        } catch (e) {
          console.error("Error fetching CF data", e);
        }
      }
      setCfDownloads(downloadsMap);
    }
    fetchCF();
  }, []);

  const projects = modrinthProjects || [];

  // Group projects
  const groupedProjects = projects.reduce((acc: any, project: any) => {
    const type = project.project_type || "mod";
    if (!acc[type]) acc[type] = [];
    acc[type].push(project);
    return acc;
  }, {} as Record<string, any[]>);

  const categoryTitles: Record<string, string> = {
    mod: "Mods",
    modpack: "Modpacks",
    plugin: "Plugins",
    resourcepack: "Resource Packs",
    datapack: "Data Packs",
  };

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
        
        {Object.entries(groupedProjects).map(([type, items]: [string, any]) => (
          <div key={type} className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>
              {getCategoryIcon(type)} {categoryTitles[type] || type.toUpperCase()}
            </h3>
            <div className={styles.grid}>
              {items.map((project: any) => {
                const cfTotal = cfDownloads[project.slug] || 0;
                const totalProjDownloads = project.downloads + cfTotal;
                return (
                  <div key={project.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={styles.badge}>
                        {getCategoryIcon(type)} {type.toUpperCase()}
                      </span>
                      <div className={styles.platforms}>
                        {cfTotal > 0 && <SiCurseforge size={16} title="CurseForge" />}
                        <SiModrinth size={16} title="Modrinth" />
                      </div>
                    </div>
                    
                    <h4 className={styles.cardTitle}>{project.title}</h4>
                    <p className={styles.cardDesc}>
                      {project.description}
                    </p>
                    
                    <div className={styles.statsRow}>
                      <div className={styles.statItem} title={`Modrinth: ${project.downloads} | CurseForge: ${cfTotal}`}>
                        <FiDownload /> {totalProjDownloads.toLocaleString()}
                      </div>
                      <div className={styles.statItem}>
                        <FiClock /> {project.updated ? new Date(project.updated).toLocaleDateString() : "N/A"}
                      </div>
                    </div>
                    
                    <a 
                      href={`https://modrinth.com/${type}/${project.slug}`}
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
        ))}
      </div>
    </section>
  );
}
