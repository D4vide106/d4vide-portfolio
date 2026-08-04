"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { FiExternalLink, FiDownload, FiClock } from "react-icons/fi";
import { SiCurseforge, SiModrinth } from "react-icons/si";
import { FaCube, FaCubes, FaServer, FaCode } from "react-icons/fa";
import styles from "./Projects.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Known CurseForge slugs. 
// Some are on Modrinth as well, some are CF exclusive.
const CF_SLUGS = [
  "project-boss-rpg",
  "project-horror",
  "structural-beyond",
  "bosstweak-3d"
];

export default function Projects({ dict }: { dict: any }) {
  // Fetch Modrinth projects
  const { data: modrinthProjects } = useSWR(
    "https://api.modrinth.com/v2/user/D4vide106/projects",
    fetcher
  );

  const [cfData, setCfData] = useState<Record<string, any>>({});
  const [loadingCF, setLoadingCF] = useState(true);

  useEffect(() => {
    async function fetchCF() {
      const dataMap: Record<string, any> = {};
      for (const slug of CF_SLUGS) {
        // Try all types since we don't know exactly what type each CF project is via CFWidget
        for (const type of ["modpacks", "mc-mods", "texture-packs"]) {
          try {
            const res = await fetch(`https://api.cfwidget.com/minecraft/${type}/${slug}`);
            if (res.ok) {
              const data = await res.json();
              if (data.id) {
                dataMap[slug] = data;
                break; // Found it
              }
            }
          } catch (e) {}
        }
      }
      setCfData(dataMap);
      setLoadingCF(false);
    }
    fetchCF();
  }, []);

  // Merge projects
  const mergedProjects: any[] = [];
  const handledCFSlugs = new Set();

  if (modrinthProjects) {
    modrinthProjects.forEach((mp: any) => {
      // Find matching CF project if it exists. 
      // Typically, CF slug might match Modrinth slug, or we can just try to match title/slug.
      // For D4vide106, 'project-boss-rpg' on CF is 'project-boss-rpg-forge-br' on Modrinth sometimes. 
      // We will match by best effort. For simplicity, we just use the slug or assume known mapping.
      
      let cfTotal = 0;
      let hasCF = false;

      // Try to find matching CF data
      const cfMatch = cfData[mp.slug] || Object.values(cfData).find((cf: any) => cf.title === mp.title || mp.title.includes(cf.name));
      
      if (cfMatch) {
        cfTotal = cfMatch.downloads?.total || 0;
        hasCF = true;
        
        // Find which slug this was to mark as handled
        const slugKey = Object.keys(cfData).find(key => cfData[key] === cfMatch);
        if (slugKey) handledCFSlugs.add(slugKey);
      }

      mergedProjects.push({
        id: mp.id,
        title: mp.title,
        description: mp.description,
        icon_url: mp.icon_url,
        project_type: mp.project_type,
        categories: mp.categories || [],
        downloads: mp.downloads + cfTotal,
        updated: mp.updated,
        modrinthUrl: `https://modrinth.com/${mp.project_type}/${mp.slug}`,
        cfUrl: cfMatch?.urls?.curseforge,
        hasModrinth: true,
        hasCF: hasCF
      });
    });
  }

  // Add CF only projects
  Object.keys(cfData).forEach(slug => {
    if (!handledCFSlugs.has(slug)) {
      const cf = cfData[slug];
      mergedProjects.push({
        id: cf.id,
        title: cf.title || cf.name,
        description: cf.summary || "CurseForge Project",
        icon_url: cf.thumbnail,
        project_type: cf.type === "Modpacks" ? "modpack" : cf.type === "Mods" ? "mod" : "resourcepack",
        categories: cf.categories ? cf.categories.map((c: any) => c.name || c) : [],
        downloads: cf.downloads?.total || 0,
        updated: cf.created_at, // CFWidget API doesn't always provide accurate updated_at on root, fallback to created
        modrinthUrl: null,
        cfUrl: cf.urls?.curseforge || cf.urls?.project,
        hasModrinth: false,
        hasCF: true
      });
    }
  });

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
          {mergedProjects.map((project: any) => {
            const projectType = project.project_type || "mod";
            const mainLink = project.modrinthUrl || project.cfUrl;

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
                    {project.hasModrinth && <SiModrinth size={18} color="#1bd96a" title="Modrinth" />}
                    {project.hasCF && <SiCurseforge size={18} color="#f16436" title="CurseForge" />}
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
                  {project.categories.slice(0, 3).map((cat: string) => (
                    <span key={cat} className={styles.tagBadge}>{cat}</span>
                  ))}
                </div>
                
                <div className={styles.cardFooter}>
                  <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                      <FiDownload className={styles.statIcon} /> 
                      <span className={styles.statValue}>{project.downloads.toLocaleString()}</span>
                    </div>
                    <div className={styles.statItem}>
                      <FiClock className={styles.statIcon} /> 
                      <span className={styles.statValue}>{project.updated ? new Date(project.updated).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={mainLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.readMore}
                  >
                    {dict.viewProject || "View Project"} <FiExternalLink />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
