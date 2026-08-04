"use client";
import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { FiDownload, FiClock, FiSearch } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FaCube, FaCubes, FaServer, FaCode } from "react-icons/fa";
import styles from "./Projects.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CF_SLUGS = [
  // ⬇️ ADD YOUR MISSING CURSEFORGE BEDROCK / DATAPACK SLUGS HERE ⬇️
  // Example: "my-bedrock-addon",
  "project-boss-rpg",
  "project-horror",
  "structural-beyond",
  "bosstweak-3d",
  "project-the-rpg-reborn",
  "project-gunparty",
  "project-realistic-rpg",
  "pmaintanceuniversal",
  "kart-deadline"
];

// Known projects that are also on GameJolt and Itch.io
const MULTIPLATFORM_SLUGS = ["structural-beyond", "structural-beyond-sbd", "sdob", "kart-deadline", "spiral-dungeon-of-babel"];

const CUSTOM_PROJECTS = [
  {
    id: "kart-deadline",
    title: "Kart Deadline",
    slug: "kart-deadline",
    description: "A fast-paced kart racing game available on GameJolt and Itch.io.",
    icon_url: "", // Can be filled later
    project_type: "game",
    categories: ["Game", "Racing"],
    downloads: 150, // Static estimate
    updated: new Date().toISOString(),
    modrinthUrl: null,
    cfUrl: null,
    hasModrinth: false,
    hasCF: false,
    isMultiplatform: true
  },
  {
    id: "sdob",
    title: "Spiral Dungeon of Babel",
    slug: "spiral-dungeon-of-babel",
    description: "A dungeon crawler game on GameJolt and Itch.io.",
    icon_url: "",
    project_type: "game",
    categories: ["Game", "RPG"],
    downloads: 500,
    updated: new Date().toISOString(),
    modrinthUrl: null,
    cfUrl: null,
    hasModrinth: false,
    hasCF: false,
    isMultiplatform: true
  }
];

export default function Projects({ dict }: { dict: any }) {
  const { data: modrinthProjects } = useSWR(
    "https://api.modrinth.com/v2/user/D4vide106/projects",
    fetcher
  );

  const [cfData, setCfData] = useState<Record<string, any>>({});
  const [loadingCF, setLoadingCF] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("downloads");
  const [filterType, setFilterType] = useState("All");
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    async function fetchCF() {
      const dataMap: Record<string, any> = {};
      const allSlugs = new Set(CF_SLUGS);
      if (modrinthProjects) {
        modrinthProjects.forEach((p: any) => allSlugs.add(p.slug));
      }

      const slugTypeMap: Record<string, string> = {
        "pmaintanceuniversal": "mc-addons",
        "project-boss-rpg": "mc-mods",
        "project-horror": "mc-mods",
        "structural-beyond": "mc-mods",
        "bosstweak-3d": "mc-mods",
        "project-the-rpg-reborn": "mc-mods",
        "project-gunparty": "mc-mods",
        "project-realistic-rpg": "mc-mods"
      };

      for (const slug of Array.from(allSlugs)) {
        // If it's a known multiplatform game, skip CF check completely
        if (["kart-deadline", "spiral-dungeon-of-babel", "sdob"].includes(slug)) continue;
        
        const type = slugTypeMap[slug] || "mc-mods"; // Fallback to mc-mods
        try {
          const res = await fetch(`https://api.cfwidget.com/minecraft/${type}/${slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data.id) {
              dataMap[slug] = data;
            }
          }
        } catch (e) {}
      }
      setCfData(dataMap);
      setLoadingCF(false);
    }
    fetchCF();
  }, [modrinthProjects]);

  const mergedProjects = useMemo(() => {
    const list: any[] = [];
    const handledCFSlugs = new Set();

    if (modrinthProjects) {
      modrinthProjects.forEach((mp: any) => {
        let cfTotal = 0;
        let hasCF = false;

        const cfMatch = cfData[mp.slug] || Object.values(cfData).find((cf: any) => cf.title === mp.title || mp.title.includes(cf.name));
        
        if (cfMatch) {
          cfTotal = cfMatch.downloads?.total || 0;
          hasCF = true;
          const slugKey = Object.keys(cfData).find(key => cfData[key] === cfMatch);
          if (slugKey) handledCFSlugs.add(slugKey);
        }

        list.push({
          id: mp.id,
          title: mp.title,
          slug: mp.slug,
          description: mp.description,
          icon_url: mp.icon_url,
          project_type: mp.project_type,
          categories: mp.categories || [],
          downloads: mp.downloads + cfTotal,
          updated: mp.updated,
          modrinthUrl: `https://modrinth.com/${mp.project_type}/${mp.slug}`,
          cfUrl: cfMatch?.urls?.curseforge,
          hasModrinth: true,
          hasCF: hasCF,
          isMultiplatform: MULTIPLATFORM_SLUGS.includes(mp.slug)
        });
      });
    }

    Object.keys(cfData).forEach(slug => {
      if (!handledCFSlugs.has(slug)) {
        const cf = cfData[slug];
        list.push({
          id: cf.id,
          title: cf.title || cf.name,
          slug: slug,
          description: cf.summary || "CurseForge Project",
          icon_url: cf.thumbnail,
          project_type: cf.type === "Modpacks" ? "modpack" : cf.type === "Mods" ? "mod" : "resourcepack",
          categories: cf.categories ? cf.categories.map((c: any) => c.name || c) : [],
          downloads: cf.downloads?.total || 0,
          updated: cf.created_at,
          modrinthUrl: null,
          cfUrl: cf.urls?.curseforge || cf.urls?.project,
          hasModrinth: false,
          hasCF: true,
          isMultiplatform: MULTIPLATFORM_SLUGS.includes(slug)
        });
      }
    });

    let filtered = list.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Add custom projects
    CUSTOM_PROJECTS.forEach(cp => {
      // Avoid duplicates if they somehow loaded from Modrinth/CF
      if (!filtered.find((p: any) => p.slug === cp.slug || p.title === cp.title)) {
        if (cp.title.toLowerCase().includes(searchQuery.toLowerCase()) || cp.description.toLowerCase().includes(searchQuery.toLowerCase())) {
          filtered.push(cp);
        }
      }
    });

    if (filterType !== "All") {
      filtered = filtered.filter(p => {
        const type = filterType.toLowerCase();
        if (type === "datapack") {
          return p.categories.some((c: string) => c.toLowerCase().includes("datapack")) || p.title.toLowerCase().includes("datapack");
        }
        if (type === "resourcepack") {
          return p.project_type === "resourcepack" || p.categories.some((c: string) => c.toLowerCase().includes("resource pack"));
        }
        if (type === "bedrock / addon") {
          return p.categories.some((c: string) => c.toLowerCase().includes("addon") || c.toLowerCase().includes("bedrock")) || p.title.toLowerCase().includes("bedrock") || p.title.toLowerCase().includes("addon");
        }
        return p.project_type === type || p.categories.some((c: string) => c.toLowerCase() === type);
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "date") return new Date(b.updated).getTime() - new Date(a.updated).getTime();
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

    return filtered;
  }, [modrinthProjects, cfData, searchQuery, sortBy, filterType]);

  const isFiltered = searchQuery !== "" || filterType !== "All" || sortBy !== "downloads";

  const getCategoryIcon = (type: string) => {
    switch(type) {
      case "modpack": return <FaCubes />;
      case "plugin": return <FaServer />;
      case "datapack": return <FaCode />;
      case "bedrock / addon": return <FaCube />;
      default: return <FaCube />;
    }
  };

  const renderCard = (project: any, index: number) => {
    const projectType = project.project_type || "mod";
    
    return (
      <div onClick={() => setSelectedProject(project)} key={`${project.id}-${index}`} className={styles.modrinthCard}>
        <div className={styles.cardHeader}>
          <div className={styles.logoWrapper}>
            {project.icon_url ? (
              <img src={project.icon_url} alt={project.title} className={styles.projectLogo} />
            ) : (
              <div className={styles.projectLogoPlaceholder}>{getCategoryIcon(projectType)}</div>
            )}
          </div>
          
          <div className={styles.titleArea}>
            <h4 className={styles.cardTitle}>{project.title}</h4>
            <p className={styles.cardDesc}>{project.description}</p>
            
            <div className={styles.tagsContainer}>
              <span className={styles.typeBadge}>
                {getCategoryIcon(projectType)} {projectType}
              </span>
              {project.categories.slice(0, 3).map((cat: string) => (
                <span key={cat} className={styles.tagBadge}>{cat}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className={styles.cardFooter}>
          <div className={styles.statsLeft}>
            <div className={styles.statItem}>
              <FiDownload className={styles.statIcon} /> 
              <span className={styles.statValue}>{project.downloads.toLocaleString()}</span>
            </div>
            <div className={styles.statItem}>
              <FiClock className={styles.statIcon} /> 
              <span className={styles.statValue}>{project.updated ? new Date(project.updated).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>
          <div className={styles.platforms}>
            {project.hasModrinth && <SiModrinth size={16} color="#1bd96a" title="Modrinth" />}
            {project.hasCF && <SiCurseforge size={16} color="#f16436" title="CurseForge" />}
            {project.isMultiplatform && <SiItchdotio size={16} color="#fa5c5c" title="Itch.io" />}
            {project.isMultiplatform && <SiGamejolt size={16} color="#ccff00" title="GameJolt" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.container}>
        
        <div className={styles.controlsBar}>
          <div className={styles.filtersGroup}>
            {["All", "Mod", "Modpack", "Datapack", "Resourcepack", "Bedrock / Addon", "Game"].map(type => (
              <button 
                key={type}
                className={`${styles.filterBtn} ${filterType === type ? styles.activeFilter : ""}`}
                onClick={() => setFilterType(type)}
              >
                {type === "All" ? "All" : `${type}s`.replace("Addons", "Addon").replace("Games", "Games")}
              </button>
            ))}
          </div>

          <div className={styles.searchAndSort}>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.sortBox}>
              <span className={styles.sortLabel}>Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="downloads">Downloads</option>
                <option value="date">Recently Updated</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeWrapper}>
            <div className={isFiltered ? styles.staticGrid : styles.marqueeTrack}>
              {isFiltered ? (
                mergedProjects.length > 0 ? (
                  mergedProjects.map((p: any, i: number) => renderCard(p, i))
                ) : (
                  <div className={styles.emptyState}>No projects found for this filter.</div>
                )
              ) : (
                [...mergedProjects, ...mergedProjects].map((p: any, i: number) => renderCard(p, i))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)}>×</button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalLogoWrapper}>
                {selectedProject.icon_url ? (
                  <img src={selectedProject.icon_url} alt={selectedProject.title} className={styles.modalLogo} />
                ) : (
                  <div className={styles.projectLogoPlaceholder}>{getCategoryIcon(selectedProject.project_type)}</div>
                )}
              </div>
              <div className={styles.modalTitleArea}>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
              </div>
            </div>

            <div className={styles.modalLinks}>
              <h3>Available Platforms</h3>
              <div className={styles.platformButtons}>
                {selectedProject.hasModrinth && (
                  <a href={selectedProject.modrinthUrl} target="_blank" rel="noreferrer" className={styles.platformBtn} style={{ "--btn-color": "#1bd96a", "--btn-bg": "rgba(27, 217, 106, 0.1)" } as any}>
                    <SiModrinth size={24} /> Download on Modrinth
                  </a>
                )}
                {selectedProject.hasCF && (
                  <a href={selectedProject.cfUrl} target="_blank" rel="noreferrer" className={styles.platformBtn} style={{ "--btn-color": "#f16436", "--btn-bg": "rgba(241, 100, 54, 0.1)" } as any}>
                    <SiCurseforge size={24} /> Download on CurseForge
                  </a>
                )}
                {selectedProject.isMultiplatform && (
                  <a href={`https://d4vide106.itch.io/${selectedProject.slug}`} target="_blank" rel="noreferrer" className={styles.platformBtn} style={{ "--btn-color": "#fa5c5c", "--btn-bg": "rgba(250, 92, 92, 0.1)" } as any}>
                    <SiItchdotio size={24} /> View on Itch.io
                  </a>
                )}
                {selectedProject.isMultiplatform && (
                  <a href="https://gamejolt.com/@D4vide106/games" target="_blank" rel="noreferrer" className={styles.platformBtn} style={{ "--btn-color": "#ccff00", "--btn-bg": "rgba(204, 255, 0, 0.1)" } as any}>
                    <SiGamejolt size={24} /> View on GameJolt
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
