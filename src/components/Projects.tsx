"use client";
import { useState, useMemo } from "react";
import { FiDownload, FiSearch } from "react-icons/fi";
import { SiCurseforge, SiModrinth, SiGamejolt, SiItchdotio } from "react-icons/si";
import { FaCube, FaCubes, FaServer, FaCode, FaGamepad } from "react-icons/fa";
import styles from "./Projects.module.css";
import CipherCarousel from "./CipherCarousel";

export interface ProjectLink {
  label: string;
  url: string;
  platform: "modrinth" | "curseforge" | "gamejolt" | "itch";
}

export interface UnifiedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon_url: string;
  type: string;
  downloads: number;
  updated: string;
  links: ProjectLink[];
}

export const MAIN_PROJECTS: UnifiedProject[] = [
  {
    id: "project-boss-rpg",
    title: "PROJECT BOSS RPG",
    slug: "project-boss-rpg",
    description: "An epic RPG modpack with unique boss progression, custom gear, and questlines.",
    icon_url: "https://cdn.modrinth.com/data/6qXHHAYn/365235145c0d9cc2cd208c674761ade3f3d1b825.png",
    type: "Modpack",
    downloads: 5420,
    updated: "2025-06-12",
    links: [
      { label: "CurseForge (Modpack)", url: "https://www.curseforge.com/minecraft/modpacks/project-boss-rpg", platform: "curseforge" },
      { label: "Modrinth (Modpack)", url: "https://modrinth.com/modpack/project-boss-rpg", platform: "modrinth" }
    ]
  },
  {
    id: "sdob",
    title: "SPIRAL DUNGEON OF BABEL",
    slug: "spiral-dungeon-of-babel",
    description: "Explore the tallest dungeon tower ever created! Available for Minecraft Java, Bedrock, and Datapack.",
    icon_url: "https://cdn.modrinth.com/data/5Zdqv8rG/22f82f9f215c73845bedc57059c0c8143977d76f.png",
    type: "Mod / Datapack / Addon",
    downloads: 6800,
    updated: "2026-07-18",
    links: [
      { label: "CurseForge (Java Mod)", url: "https://www.curseforge.com/minecraft/mc-mods/sdob", platform: "curseforge" },
      { label: "CurseForge (Datapack)", url: "https://www.curseforge.com/minecraft/texture-packs/spiral-dungeon-of-babel-sdob-datapack", platform: "curseforge" },
      { label: "CurseForge (Bedrock Addon)", url: "https://www.curseforge.com/minecraft-bedrock/addons/spiral-dungeon-of-babel-sdob-bedrock", platform: "curseforge" },
      { label: "Modrinth (Mod)", url: "https://modrinth.com/mod/sdob", platform: "modrinth" },
      { label: "GameJolt", url: "https://gamejolt.com/games/sdob/953274", platform: "gamejolt" },
      { label: "Itch.io", url: "https://d4vide106.itch.io/sdob-mc", platform: "itch" }
    ]
  },
  {
    id: "structural-beyond",
    title: "STRUCTURAL BEYOND",
    slug: "structural-beyond",
    description: "Adds dozens of unique, breathtaking structures to your world across Java, Bedrock, and Datapacks!",
    icon_url: "https://cdn.modrinth.com/data/6Yica65F/6a4532c2cd308d8791e5ba2afc12d4aca1d07d65.png",
    type: "Mod / Datapack / Addon",
    downloads: 12400,
    updated: "2026-07-17",
    links: [
      { label: "CurseForge (Java Mod)", url: "https://www.curseforge.com/minecraft/mc-mods/structural-beyond", platform: "curseforge" },
      { label: "CurseForge (Datapack)", url: "https://www.curseforge.com/minecraft/data-packs/structural-beyond-sbd", platform: "curseforge" },
      { label: "CurseForge (Resourcepack)", url: "https://www.curseforge.com/minecraft/texture-packs/structural-beyond-sbrd", platform: "curseforge" },
      { label: "CurseForge (Bedrock Addon)", url: "https://www.curseforge.com/minecraft-bedrock/addons/structural-beyond-sb-bedrock", platform: "curseforge" },
      { label: "Modrinth (Mod)", url: "https://modrinth.com/mod/structural-beyond", platform: "modrinth" },
      { label: "Modrinth (Datapack)", url: "https://modrinth.com/datapack/structural-beyond-sbd", platform: "modrinth" },
      { label: "GameJolt", url: "https://gamejolt.com/games/structural_beyond_mc/944658", platform: "gamejolt" },
      { label: "Itch.io", url: "https://d4vide106.itch.io/structuralbeyond-mc", platform: "itch" }
    ]
  },
  {
    id: "project-horror",
    title: "PROJECT HORROR",
    slug: "project-horror",
    description: "Terrifying survival horror experience packed with scariest entities, custom atmosphere, and mechanics.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/994/340/256/256/638509827334101640.png",
    type: "Modpack",
    downloads: 4800,
    updated: "2023-11-11",
    links: [
      { label: "CurseForge (Modpack)", url: "https://www.curseforge.com/minecraft/modpacks/project-horror", platform: "curseforge" }
    ]
  },
  {
    id: "project-the-rpg-reborn",
    title: "PROJECT THE RPG REBORN",
    slug: "project-the-rpg-reborn",
    description: "Incredible RPG experience alone or with friends featuring leveling, magic, dungeons, and bosses.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/965/108/256/256/638463726503298813.png",
    type: "Modpack",
    downloads: 1780,
    updated: "2024-11-21",
    links: [
      { label: "CurseForge (Modpack)", url: "https://www.curseforge.com/minecraft/modpacks/project-the-rpg-reborn", platform: "curseforge" }
    ]
  },
  {
    id: "project-realistic-rpg",
    title: "PROJECT REALISTIC RPG",
    slug: "project-realistic-rpg",
    description: "Realistic survival experience with health, weapons, medkits, temperature, and immersive mechanics.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/1172/959/256/256/638744641399341869.png",
    type: "Modpack",
    downloads: 1315,
    updated: "2025-03-24",
    links: [
      { label: "CurseForge (Modpack)", url: "https://www.curseforge.com/minecraft/modpacks/project-realistic-rpg", platform: "curseforge" }
    ]
  },
  {
    id: "project-gunparty",
    title: "PROJECT GUNPARTY",
    slug: "project-gunparty",
    description: "Action-packed multiplayer gun warfare and deathmatch experience inside Minecraft.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/1408/864/256/256/638912980924519123.png",
    type: "Modpack",
    downloads: 950,
    updated: "2024-08-15",
    links: [
      { label: "CurseForge (Modpack)", url: "https://www.curseforge.com/minecraft/modpacks/project-gunparty", platform: "curseforge" }
    ]
  },
  {
    id: "bosstweak-3d",
    title: "BOSSTWEAK 3D+",
    slug: "bosstweak-3d",
    description: "Official resource pack of Boss RPG: corrects visual problems, improves textures, and adds 3D models.",
    icon_url: "https://media.forgecdn.net/avatars/thumbnails/1221/657/256/256/638800200916334761.png",
    type: "Resource Pack",
    downloads: 1354,
    updated: "2025-04-13",
    links: [
      { label: "CurseForge (Texture Pack)", url: "https://www.curseforge.com/minecraft/texture-packs/bosstweak-3d", platform: "curseforge" }
    ]
  },
  {
    id: "pmaintanceuniversal",
    title: "PROJECT MAINTENANCE UNIVERSAL",
    slug: "pmaintanceuniversal",
    description: "Universal server maintenance plugin for Minecraft Java servers with customizable MOTDs.",
    icon_url: "https://cdn.modrinth.com/data/y11fODQe/99a1f5300424ed796792d9454768eaff5d5b7b98.png",
    type: "Plugin",
    downloads: 620,
    updated: "2025-02-10",
    links: [
      { label: "Modrinth (Plugin)", url: "https://modrinth.com/plugin/pmaintanceuniversal", platform: "modrinth" }
    ]
  },
  {
    id: "infinitysmart",
    title: "INFINITYSMART SERVER",
    slug: "infinitysmart",
    description: "Crossplatform European Minecraft Java & Bedrock network featuring InfinitySMP and minigames.",
    icon_url: "https://cdn.modrinth.com/data/c2w1TKgN/4da379944f5c563294a488f7738950ebc6a68c74.png",
    type: "Minecraft Server",
    downloads: 15200,
    updated: "2026-08-01",
    links: [
      { label: "Modrinth (Server)", url: "https://modrinth.com/minecraft_java_server/infinitysmart", platform: "modrinth" }
    ]
  }
];



export default function Projects({ dict }: { dict: any }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [selectedProject, setSelectedProject] = useState<UnifiedProject | null>(null);

  const filteredProjects = useMemo(() => {
    return MAIN_PROJECTS.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (filterType === "All") return true;
      return p.type.toLowerCase().includes(filterType.toLowerCase());
    });
  }, [searchQuery, filterType]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "modrinth": return <SiModrinth size={18} />;
      case "curseforge": return <SiCurseforge size={18} />;
      case "gamejolt": return <SiGamejolt size={18} />;
      case "itch": return <SiItchdotio size={18} />;
      default: return <FaCube size={18} />;
    }
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <div className={styles.topControlBar}>
        <div className={styles.viewToggleGroup}>
          <button 
            className={`${styles.viewBtn} ${viewMode === "carousel" ? styles.activeViewBtn : ""}`} 
            onClick={() => setViewMode("carousel")}
          >
            3D CONSTELLATION
          </button>
          <button 
            className={`${styles.viewBtn} ${viewMode === "grid" ? styles.activeViewBtn : ""}`} 
            onClick={() => setViewMode("grid")}
          >
            GRID ARCHIVE
          </button>
        </div>
      </div>

      {viewMode === "carousel" ? (
        <div className={styles.carouselWrapper}>
          <CipherCarousel projects={filteredProjects} />
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.controlsBar}>
            <div className={styles.filtersGroup}>
              {["All", "Modpack", "Mod", "Resource Pack", "Plugin", "Server"].map((type) => (
                <button 
                  key={type}
                  className={`${styles.filterBtn} ${filterType === type ? styles.activeFilter : ""}`}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="SEARCH WORKS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.staticGrid}>
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)} 
                className={styles.modrinthCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.logoWrapper}>
                    <img 
                      src={project.icon_url} 
                      alt={project.title} 
                      className={styles.projectLogo}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement?.querySelector(".fallbackLogo")?.classList.remove("hidden");
                      }}
                    />
                    <div className="fallbackLogo hidden" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#111" }}>
                      <FaCube size={24} color="#ffffff" />
                    </div>
                  </div>
                  <div className={styles.titleArea}>
                    <span className={styles.projectTypeTag}>{project.type}</span>
                    <h4 className={styles.cardTitle}>{project.title}</h4>
                    <p className={styles.cardDesc}>{project.description}</p>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <div className={styles.statItem}>
                    <FiDownload /> <span>{project.downloads.toLocaleString()}</span>
                  </div>
                  <div className={styles.platforms}>
                    {project.links.map((link, idx) => (
                      <span key={idx} title={link.label}>
                        {getPlatformIcon(link.platform)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal Popup */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setSelectedProject(null)}>×</button>

            <div className={styles.modalHeader}>
              <div className={styles.modalLogoWrapper}>
                <img src={selectedProject.icon_url} alt={selectedProject.title} className={styles.modalLogo} />
              </div>
              <div className={styles.modalTitleArea}>
                <span className={styles.modalCategoryBadge}>{selectedProject.type}</span>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.description}</p>
              </div>
            </div>

            <div className={styles.modalLinksSection}>
              <h3>AVAILABLE PLATFORMS & EDITIONS</h3>
              <div className={styles.platformButtonsGrid}>
                {selectedProject.links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noreferrer" className={styles.platformLinkBtn}>
                    {getPlatformIcon(link.platform)}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
