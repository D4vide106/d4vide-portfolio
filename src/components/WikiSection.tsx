"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FiBookOpen,
  FiSearch,
  FiEdit3,
  FiGithub,
  FiChevronDown,
  FiClock,
  FiExternalLink,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiSmile,
  FiLock,
  FiUnlock,
  FiKey,
  FiShield,
  FiLogOut,
  FiX,
  FiSliders,
  FiMaximize2,
  FiMinimize2,
  FiSun,
  FiHelpCircle,
  FiList,
  FiMenu,
} from "react-icons/fi";
import { SiDiscord } from "react-icons/si";
import styles from "./WikiSection.module.css";
import { useLanguage, LANGUAGES } from "@/context/LanguageContext";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";
import { DEFAULT_WIKI_DATA, WikiArticle, slugifyHeading, canonicalProjectId } from "@/data/wikiData";
import MarkdownViewer from "./MarkdownViewer";
import WikiEditorModal from "./WikiEditorModal";

// Helper to localize article data based on selected language
const getLocalizedArticle = (art: WikiArticle, targetLang: string): WikiArticle => {
  if (targetLang === "it" && art.translations?.it) {
    return {
      ...art,
      title: art.translations.it.title || art.title,
      category: art.translations.it.category || art.category,
      content: art.translations.it.content || art.content,
    };
  }
  return art;
};

export default function WikiSection({ dict: propDict, standalone }: { dict?: any; standalone?: boolean }) {
  const { dict: contextDict, lang, setLang } = useLanguage();
  const wikiDict = (contextDict as any)?.wiki || propDict;
  const navDict = (contextDict as any)?.nav || {};
  const projectDataDict = (contextDict as any)?.projectData || {};
  const { projects } = useLiveStats();

  const [wikiLangOpen, setWikiLangOpen] = useState<boolean>(false);
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  // Active Project & Dropdown State
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("project");
      if (p) return canonicalProjectId(p);
    }
    return "project-boss-rpg";
  });
  const [projectDropdownOpen, setProjectDropdownOpen] = useState<boolean>(false);

  // Wiki Articles Data State
  const [allWikiArticles, setAllWikiArticles] = useState<Record<string, WikiArticle[]>>(DEFAULT_WIKI_DATA);

  // Active Selected Article State
  const [activeArticleId, setActiveArticleId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const a = new URLSearchParams(window.location.search).get("article");
      if (a) return a;
    }
    return "pbr-getting-started";
  });

  // Command Palette & Search Query State
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Layout & Spotlight Control State
  const [layoutMode, setLayoutMode] = useState<"original" | "expand">("original");
  const [spotlightOn, setSpotlightOn] = useState<boolean>(false);
  const [layoutMenuOpen, setLayoutMenuOpen] = useState<boolean>(false);

  // Creator Access Control State (Restricted to D4VIDE106 Site Creator)
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState<boolean>(false);
  const [inputPasscode, setInputPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Editor Modal State
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<WikiArticle | undefined>(undefined);

  // Active TOC heading tracker
  const [activeHeadingSlug, setActiveHeadingSlug] = useState<string>("");

  // Mobile Drawer State for Categories & TOC
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [mobileDrawerTab, setMobileDrawerTab] = useState<"guides" | "toc">("guides");

  // Refs for outside click handling, scroll pane & keyboard shortcuts
  const articlePaneRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const layoutMenuRef = useRef<HTMLDivElement>(null);

  // Determine repository base path
  const repoPrefix =
    typeof window !== "undefined" && window.location.pathname.startsWith("/d4vide-portfolio")
      ? "/d4vide-portfolio"
      : "";

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(e.target as Node)) {
        setProjectDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setWikiLangOpen(false);
      }
      if (layoutMenuRef.current && !layoutMenuRef.current.contains(e.target as Node)) {
        setLayoutMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K to toggle Command Palette, Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check creator authentication on mount
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem("d4v_creator_auth");
      if (savedAuth === "true") {
        setIsCreator(true);
      }
    } catch {}
  }, []);

  // Handle Creator Authentication
  const handleVerifyCreatorPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPasscode.trim() === "d4vide106" || inputPasscode.trim() === "d4vide") {
      setIsCreator(true);
      setPasscodeModalOpen(false);
      setInputPasscode("");
      setPasscodeError(null);
      try {
        sessionStorage.setItem("d4v_creator_auth", "true");
      } catch {}
    } else {
      setPasscodeError(
        lang === "it"
          ? "Passcode Segreto non valido. Accesso negato."
          : "Invalid Creator Secret Passcode. Access denied."
      );
    }
  };

  const handleLogoutCreator = () => {
    setIsCreator(false);
    try {
      sessionStorage.removeItem("d4v_creator_auth");
    } catch {}
  };

  const handleOpenEditor = (article?: WikiArticle) => {
    if (!isCreator) {
      setPasscodeModalOpen(true);
      return;
    }
    setEditingArticle(article);
    setEditorOpen(true);
  };

  // Load custom wiki articles from localStorage & read URL query parameters
  useEffect(() => {
    try {
      const saved = localStorage.getItem("d4v_custom_wikis_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          const normalized: Record<string, WikiArticle[]> = {};
          Object.entries(parsed).forEach(([key, arts]) => {
            const normKey = canonicalProjectId(key);
            if (Array.isArray(arts)) {
              normalized[normKey] = arts.map((a: any) => ({
                ...a,
                projectId: normKey,
              }));
            }
          });
          setAllWikiArticles((prev) => ({
            ...prev,
            ...normalized,
          }));
        }
      }
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlProj = params.get("project");
        const urlArt = params.get("article");
        if (urlProj) {
          setSelectedProjectId(canonicalProjectId(urlProj));
        }
        if (urlArt) {
          setActiveArticleId(urlArt);
        }
      }
    } catch {}
  }, []);

  // Sync URL query string when project or article changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        const canonProj = canonicalProjectId(selectedProjectId);
        url.searchParams.set("project", canonProj);
        if (activeArticleId) {
          url.searchParams.set("article", activeArticleId);
        }
        window.history.replaceState(null, "", url.toString());
      }
    } catch {}
  }, [selectedProjectId, activeArticleId]);

  // Save new/edited article to state and localStorage
  const handleSaveArticle = (newArt: {
    id: string;
    projectId: string;
    category: string;
    title: string;
    slug: string;
    content: string;
  }) => {
    const normProjId = canonicalProjectId(newArt.projectId);
    const updatedArticle: WikiArticle = {
      ...newArt,
      projectId: normProjId,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setAllWikiArticles((prev) => {
      const projArticles = prev[normProjId] || [];
      const existingIdx = projArticles.findIndex((a) => a.id === newArt.id);
      let updatedProjArticles: WikiArticle[] = [];

      if (existingIdx >= 0) {
        updatedProjArticles = [...projArticles];
        updatedProjArticles[existingIdx] = updatedArticle;
      } else {
        updatedProjArticles = [...projArticles, updatedArticle];
      }

      const next = {
        ...prev,
        [normProjId]: updatedProjArticles,
      };

      try {
        localStorage.setItem("d4v_custom_wikis_v1", JSON.stringify(next));
      } catch {}

      return next;
    });

    setSelectedProjectId(normProjId);
    setActiveArticleId(newArt.id);
  };

  // Current Active Project Object (always resolved using canonical ID)
  const currentProject: UnifiedProject = useMemo(() => {
    const canonId = canonicalProjectId(selectedProjectId);
    return projects.find((p) => p.id === canonId) || projects[0];
  }, [projects, selectedProjectId]);

  // Current Project Articles List (Fully localized for current language)
  const currentProjectArticles: WikiArticle[] = useMemo(() => {
    const canonId = canonicalProjectId(selectedProjectId);
    const rawArticles =
      allWikiArticles[canonId] ||
      allWikiArticles[selectedProjectId] ||
      DEFAULT_WIKI_DATA[canonId] ||
      DEFAULT_WIKI_DATA[selectedProjectId] ||
      [];
    return rawArticles.map((art) => getLocalizedArticle({ ...art, projectId: canonId }, lang));
  }, [allWikiArticles, selectedProjectId, lang]);

  // Group Articles by Category
  const categoriesMap = useMemo(() => {
    const map: Record<string, WikiArticle[]> = {};
    currentProjectArticles.forEach((art) => {
      const cat = art.category || "General";
      if (!map[cat]) map[cat] = [];
      map[cat].push(art);
    });
    return map;
  }, [currentProjectArticles]);

  // Ensure activeArticleId belongs to current project
  useEffect(() => {
    if (currentProjectArticles.length > 0) {
      const exists = currentProjectArticles.some((a) => a.id === activeArticleId);
      if (!exists) {
        setActiveArticleId(currentProjectArticles[0].id);
      }
    }
  }, [selectedProjectId, currentProjectArticles, activeArticleId]);

  // Active Selected Article Object
  const activeArticle: WikiArticle | undefined = useMemo(() => {
    const canonId = canonicalProjectId(selectedProjectId);
    return (
      currentProjectArticles.find((a) => a.id === activeArticleId) ||
      currentProjectArticles[0] || {
        id: "default",
        projectId: canonId,
        category: "Getting Started",
        title: "Overview",
        slug: "overview",
        lastUpdated: "2026-08-15",
        content: "# Documentation\n\nSelect or create an article from the sidebar.",
      }
    );
  }, [currentProjectArticles, activeArticleId, selectedProjectId]);

  // Search Results (Searches localized articles across all projects, deduplicated by article.id)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(Boolean);
    const results: { article: WikiArticle; projectTitle: string }[] = [];
    const seenArticleIds = new Set<string>();

    Object.entries(allWikiArticles).forEach(([rawProjId, rawArticles]) => {
      const projId = canonicalProjectId(rawProjId);
      const proj = projects.find((p) => p.id === projId);
      const projTitle = proj ? (projectDataDict[proj.id]?.title || proj.title) : projId;

      rawArticles.forEach((rawArt) => {
        if (seenArticleIds.has(rawArt.id)) return;
        const art = getLocalizedArticle({ ...rawArt, projectId: projId }, lang);
        const searchableText = `${art.title} ${art.content} ${art.category} ${projTitle} ${projId}`.toLowerCase();
        const matches = queryWords.every((word) => searchableText.includes(word));

        if (matches) {
          seenArticleIds.add(rawArt.id);
          results.push({ article: art, projectTitle: projTitle });
        }
      });
    });

    return results;
  }, [searchQuery, allWikiArticles, projects, projectDataDict, lang]);

  // Extract Table of Contents (Headings) from active article content
  const tableOfContents = useMemo(() => {
    if (!activeArticle?.content) return [];
    const headings: { text: string; slug: string; level: number }[] = [];
    const lines = activeArticle.content.split("\n");

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        const text = line.replace(/^#\s+/, "").trim();
        headings.push({ text, slug: slugifyHeading(text), level: 1 });
      } else if (line.startsWith("## ")) {
        const text = line.replace(/^##\s+/, "").trim();
        headings.push({ text, slug: slugifyHeading(text), level: 2 });
      } else if (line.startsWith("### ")) {
        const text = line.replace(/^###\s+/, "").trim();
        headings.push({ text, slug: slugifyHeading(text), level: 3 });
      }
    });

    return headings;
  }, [activeArticle]);

  // Previous & Next Article Navigation
  const flatArticles = currentProjectArticles;
  const currentIndex = flatArticles.findIndex((a) => a.id === activeArticleId);
  const prevArticle = currentIndex > 0 ? flatArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < flatArticles.length - 1 ? flatArticles[currentIndex + 1] : null;

  const getLocalizedProjectTitle = (p: UnifiedProject) => {
    return projectDataDict[p.id]?.title || p.title;
  };

  // Portfolio Section Smooth Navigation (no '#' in URL)
  const handleNavToPortfolioSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (sectionId === "wiki") return;
    window.location.href = `${repoPrefix}/?section=${sectionId}`;
  };

  // Smoothly select an article from Categories, Prev/Next, or search
  const handleSelectArticle = (artId: string) => {
    if (artId === activeArticleId) return;
    setActiveArticleId(artId);
    setActiveHeadingSlug("");
    if (articlePaneRef.current) {
      articlePaneRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Smooth scroll to heading in center pane with glowing highlight & no '#' in URL
  const handleTocClick = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    setActiveHeadingSlug(slug);
    const target = document.getElementById(slug);
    const pane = articlePaneRef.current;
    if (target && pane) {
      const paneRect = pane.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const targetTop = targetRect.top - paneRect.top + pane.scrollTop - 24;
      pane.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      // Pulse glowing animation on target heading
      document.querySelectorAll(`.${styles.headingHighlighted}`).forEach((el) => {
        el.classList.remove(styles.headingHighlighted);
      });
      target.classList.add(styles.headingHighlighted);
      setTimeout(() => {
        target.classList.remove(styles.headingHighlighted);
      }, 2000);
    }
  };

  return (
    <section id="wiki" className={`${styles.wikiRoot} ${standalone ? styles.standaloneWiki : ""} ${spotlightOn ? styles.spotlightActive : ""}`}>
      {/* 1. Modern Top Header Bar */}
      <div className={styles.wikiHeaderBar}>
        <div className={`${styles.wikiHeaderInner} ${layoutMode === "expand" ? styles.headerExpand : ""}`}>
          {/* Left: Brand Avatar + Nickname + Project Dropdown Selector */}
          <div className={styles.headerLeftGroup}>
          <a
            href={repoPrefix + "/"}
            className={styles.wikiBrandLink}
            title="D4VIDE106 Portfolio"
          >
            <div className={styles.wikiAvatarWrap}>
              <img
                src="https://mc-heads.net/avatar/_D4vide106_/32"
                alt="_D4vide106_"
                className={styles.wikiAvatarImg}
              />
              <span className={styles.wikiOnlineDot} />
            </div>
            <span className={styles.wikiBrandName}>D4VIDE106</span>
          </a>

          <span className={styles.wikiDivider}>/</span>

          {/* Project Dropdown Selector on the LEFT */}
          <div className={styles.projectDropdownWrap} ref={projectDropdownRef}>
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className={styles.projectSelectBtn}
              aria-label="Select Project"
            >
              <img src={currentProject.icon_url} alt="" className={styles.projBtnLogo} />
              <span className={styles.projBtnTitle}>{getLocalizedProjectTitle(currentProject)}</span>
              <FiChevronDown size={13} className={projectDropdownOpen ? styles.chevronRotated : ""} />
            </button>

            {projectDropdownOpen && (
              <div className={styles.projectSelectMenu}>
                <div className={styles.menuHeaderLabel}>
                  {lang === "it" ? "SELEZIONA PROGETTO:" : "SELECT PROJECT WIKI:"}
                </div>
                {projects.map((p) => {
                  const isCurrent = canonicalProjectId(selectedProjectId) === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setProjectDropdownOpen(false);
                      }}
                      className={`${styles.projectMenuItem} ${
                        isCurrent ? styles.projectMenuItemActive : ""
                      }`}
                    >
                      <img src={p.icon_url} alt="" className={styles.menuItemLogo} />
                      <span>{getLocalizedProjectTitle(p)}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center: Main Portfolio Navigation Buttons */}
        <nav className={styles.headerCenterNav}>
          <a
            href={repoPrefix + "/?section=projects"}
            onClick={(e) => handleNavToPortfolioSection(e, "projects")}
            className={styles.headerNavLink}
          >
            {navDict.projects || (lang === "it" ? "PROGETTI" : "WORKS")}
          </a>
          <span className={`${styles.headerNavLink} ${styles.headerNavLinkActive}`}>
            {navDict.wiki || "WIKI"}
          </span>
          <a
            href={repoPrefix + "/?section=about"}
            onClick={(e) => handleNavToPortfolioSection(e, "about")}
            className={styles.headerNavLink}
          >
            {navDict.about || (lang === "it" ? "CHI SONO" : "ABOUT")}
          </a>
          <a
            href={repoPrefix + "/?section=youtube"}
            onClick={(e) => handleNavToPortfolioSection(e, "youtube")}
            className={styles.headerNavLink}
          >
            {navDict.media || "MEDIA"}
          </a>
          <a
            href={repoPrefix + "/?section=contact"}
            onClick={(e) => handleNavToPortfolioSection(e, "contact")}
            className={styles.headerNavLink}
          >
            {navDict.contact || (lang === "it" ? "CONTATTI" : "CONTACT")}
          </a>
        </nav>

        {/* Right Actions: Search + Creator Access + Discord + GitHub + Language + Layout */}
        {/* Right Actions: Command Palette Trigger + Creator Access + Unified Utility Capsule */}
        <div className={styles.headerRightActions}>
          {/* Sleek Command Palette Trigger Pill */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className={styles.headerSearchTrigger}
            title={lang === "it" ? "Cerca guide (Ctrl+K)" : "Search docs (Ctrl+K)"}
          >
            <FiSearch size={13} className={styles.searchTriggerIcon} />
            <span className={styles.searchTriggerText}>
              {lang === "it" ? "Cerca..." : "Search..."}
            </span>
            <span className={styles.searchKbdShortcut}>Ctrl K</span>
          </button>

          {/* Creator Access Controls */}
          {isCreator ? (
            <div className={styles.creatorActivePill}>
              <span className={styles.creatorStatusDot} title="Creator Authenticated" />
              <button
                onClick={() => handleOpenEditor()}
                className={styles.newGuidePillBtn}
                title={lang === "it" ? "Aggiungi Nuova Guida" : "Add New Guide"}
              >
                <FiPlus size={12} />
                <span>{lang === "it" ? "Nuova Guida" : "New Guide"}</span>
              </button>
              <button
                onClick={handleLogoutCreator}
                className={styles.logoutPillBtn}
                title={lang === "it" ? "Esci dalla modalità Creator" : "Logout Creator"}
              >
                <FiLogOut size={11} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPasscodeModalOpen(true)}
              className={styles.creatorCompactBtn}
              title={lang === "it" ? "Accesso Creator D4VIDE106" : "Creator Access D4VIDE106"}
            >
              <FiLock size={12} />
              <span>Creator</span>
            </button>
          )}

          {/* Unified Glass Utility Capsule: Discord + GitHub + Language + Layout */}
          <div className={styles.headerUtilityPill}>
            {/* Discord */}
            <a
              href="https://discord.gg/7T3u9a9"
              target="_blank"
              rel="noreferrer"
              className={`${styles.utilPillBtn} ${styles.utilDiscordBtn}`}
              title="Discord Community"
              aria-label="Discord Community"
            >
              <SiDiscord size={14} />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/D4vide106"
              target="_blank"
              rel="noreferrer"
              className={styles.utilPillBtn}
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <FiGithub size={14} />
            </a>

            <span className={styles.utilPillDivider} />

            {/* Language Dropdown */}
            <div className={styles.wikiLangWrap} ref={langRef}>
              <button
                onClick={() => setWikiLangOpen(!wikiLangOpen)}
                className={styles.utilLangBtn}
                title="Select Language"
                aria-label="Select Language"
              >
                <img src={currentLangObj.flagUrl} alt={currentLangObj.name} className={styles.wikiFlagImg} />
                <FiChevronDown size={11} className={wikiLangOpen ? styles.chevronRotated : ""} />
              </button>
              {wikiLangOpen && (
                <div className={styles.wikiLangMenu}>
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setWikiLangOpen(false);
                      }}
                      className={`${styles.wikiLangItem} ${lang === item.code ? styles.wikiLangItemActive : ""}`}
                    >
                      <img src={item.flagUrl} alt="" className={styles.wikiFlagImg} />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className={styles.utilPillDivider} />

            {/* Layout & Spotlight Switcher */}
            <div className={styles.layoutSwitchWrap} ref={layoutMenuRef}>
              <button
                onClick={() => setLayoutMenuOpen(!layoutMenuOpen)}
                className={`${styles.utilLayoutBtn} ${layoutMenuOpen ? styles.utilLayoutBtnActive : ""}`}
                title="Layout & Spotlight"
                aria-label="Layout & Spotlight"
              >
                <FiSliders size={13} />
              </button>

              {layoutMenuOpen && (
                <div className={styles.layoutMenuCard}>
                  <div className={styles.menuSecTitle}>
                    <FiSliders size={13} />
                    <span>Layout Switch</span>
                  </div>
                  <div className={styles.layoutGrid}>
                    <button
                      onClick={() => setLayoutMode("original")}
                      className={`${styles.layoutSegBtn} ${layoutMode === "original" ? styles.layoutSegBtnActive : ""}`}
                    >
                      <FiMinimize2 size={12} />
                      <span>Original</span>
                    </button>
                    <button
                      onClick={() => setLayoutMode("expand")}
                      className={`${styles.layoutSegBtn} ${layoutMode === "expand" ? styles.layoutSegBtnActive : ""}`}
                    >
                      <FiMaximize2 size={12} />
                      <span>Expand All</span>
                    </button>
                  </div>

                  <hr className={styles.menuDivider} />

                  <div className={styles.menuSecTitle}>
                    <FiSun size={13} />
                    <span>Spotlight Focus</span>
                  </div>
                  <div className={styles.spotlightToggleRow}>
                    <button
                      onClick={() => setSpotlightOn(true)}
                      className={`${styles.spotBtn} ${spotlightOn ? styles.spotBtnActive : ""}`}
                    >
                      ON
                    </button>
                    <button
                      onClick={() => setSpotlightOn(false)}
                      className={`${styles.spotBtn} ${!spotlightOn ? styles.spotBtnActive : ""}`}
                    >
                      OFF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Guides Index Toggle Button (Visible on screens <= 768px) */}
          <button
            onClick={() => {
              setMobileDrawerTab("guides");
              setMobileDrawerOpen(!mobileDrawerOpen);
            }}
            className={styles.mobileWikiHeaderMenuBtn}
            title={lang === "it" ? "Indice Guide" : "Guides Menu"}
            aria-label="Toggle Guides Menu"
          >
            {mobileDrawerOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
        </div>
      </div>

      {/* Command Palette Spotlight Search Modal */}
      {searchModalOpen && (
        <div className={styles.commandPaletteOverlay} onClick={() => setSearchModalOpen(false)}>
          <div className={styles.commandPaletteDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.commandPaletteInputRow}>
              <FiSearch size={16} className={styles.cmdSearchIcon} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={lang === "it" ? "Cerca guide, comandi, categorie... (Esc per uscire)" : "Search docs, commands, guides... (Esc to exit)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.cmdSearchInput}
                autoFocus
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery("")} className={styles.cmdClearBtn}>
                  <FiX size={14} />
                </button>
              ) : (
                <span className={styles.cmdEscBadge}>ESC</span>
              )}
            </div>

            <div className={styles.cmdResultsList}>
              {searchResults.length === 0 && searchQuery.trim() !== "" ? (
                <div className={styles.cmdNoResults}>
                  {lang === "it"
                    ? "Nessuna guida wiki corrisponde alla tua ricerca."
                    : "No documentation found matching your query."}
                </div>
              ) : searchResults.length === 0 ? (
                <div className={styles.cmdNoResults}>
                  {lang === "it"
                    ? "Digita per cercare in tutte le documentazioni e progetti..."
                    : "Type to search all guides and project documentation..."}
                </div>
              ) : (
                searchResults.map(({ article, projectTitle }) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      const canonProj = canonicalProjectId(article.projectId);
                      setSelectedProjectId(canonProj);
                      handleSelectArticle(article.id);
                      setSearchModalOpen(false);
                      setSearchQuery("");
                    }}
                    className={styles.cmdResultItem}
                  >
                    <div className={styles.cmdItemIcon}>
                      <FiBookOpen size={14} />
                    </div>
                    <div className={styles.cmdItemContent}>
                      <div className={styles.cmdTitleRow}>
                        <span className={styles.cmdItemTitle}>{article.title}</span>
                        <span className={styles.cmdProjectBadge}>{projectTitle}</span>
                      </div>
                      <span className={styles.cmdItemSub}>{article.category}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className={styles.cmdFooter}>
              <div className={styles.cmdFooterHints}>
                <span><kbd>Esc</kbd> {lang === "it" ? "Chiudi" : "Close"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Three-Column Layout: Left (Categories), Center (Article), Right (TOC) */}
      <div className={`${styles.wikiBodyGrid} ${layoutMode === "expand" ? styles.gridExpand : ""}`}>
        {/* Left Sidebar: Categories Navigation (Fixed on screen) */}
        <aside className={styles.leftSidebar}>
          <div className={styles.sidebarTitle}>
            {lang === "it" ? "CATEGORIE" : "CATEGORIES"}
          </div>
          <div className={styles.sidebarTree}>
            {Object.entries(categoriesMap).map(([categoryName, articles]) => (
              <div key={categoryName} className={styles.categoryBlock}>
                <div className={styles.categoryHeader}>{categoryName}</div>
                <div className={styles.categoryGuideLines}>
                  {articles.map((art) => {
                    const isActive = art.id === activeArticleId;
                    return (
                      <button
                        key={art.id}
                        onClick={() => handleSelectArticle(art.id)}
                        className={`${styles.categoryItemBtn} ${isActive ? styles.categoryItemBtnActive : ""}`}
                      >
                        <span className={styles.activeVerticalLine} />
                        <span className={styles.itemTitle}>{art.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Main Article Display (Only this area scrolls independently) */}
        <main ref={articlePaneRef} className={styles.centerArticlePane}>
          {/* Mobile Sticky Sub-Bar for Quick Guide & Indice Navigation (Only on mobile <= 768px) */}
          <div className={styles.mobileWikiSubBar}>
            <button
              onClick={() => {
                setMobileDrawerTab("guides");
                setMobileDrawerOpen(true);
              }}
              className={styles.mobileDrawerBtn}
              title={lang === "it" ? "Apri Indice Guide" : "Open Guides Index"}
            >
              <FiBookOpen size={14} className={styles.mobileSubIcon} />
              <span className={styles.mobileSubText}>
                {activeArticle ? activeArticle.title : (lang === "it" ? "Indice Guide" : "Guides Index")}
              </span>
              <FiChevronDown size={12} className={styles.mobileSubChev} />
            </button>

            <div className={styles.mobileSubRightActions}>
              <button
                onClick={() => setSearchModalOpen(true)}
                className={styles.mobileSubActionBtn}
                title={lang === "it" ? "Cerca guide" : "Search docs"}
              >
                <FiSearch size={14} />
              </button>

              {tableOfContents.length > 0 && (
                <button
                  onClick={() => {
                    setMobileDrawerTab("toc");
                    setMobileDrawerOpen(true);
                  }}
                  className={styles.mobileSubActionBtn}
                  title={lang === "it" ? "Sommario dell'articolo" : "Page Contents"}
                >
                  <FiList size={14} />
                </button>
              )}
            </div>
          </div>

          {activeArticle ? (
            <div key={activeArticle.id} className={`${styles.articleContainer} ${layoutMode === "expand" ? styles.articleContainerExpand : ""}`}>
              {/* Breadcrumb Navigation */}
              <div className={styles.breadcrumbBar}>
                <span>Wiki</span>
                <span className={styles.breadSep}>/</span>
                <span className={styles.breadProj}>{getLocalizedProjectTitle(currentProject)}</span>
                <span className={styles.breadSep}>/</span>
                <span>{activeArticle.category}</span>
                <span className={styles.breadSep}>/</span>
                <span className={styles.breadCurrent}>{activeArticle.title}</span>
              </div>

              {/* Article Top Title & Metadata Bar */}
              <div className={styles.articleTitleMetaRow}>
                <div className={styles.titleCatCol}>
                  <span className={styles.categoryTag}>{activeArticle.category}</span>
                  <h1 className={styles.mainTitle}>{activeArticle.title}</h1>
                </div>

                <div className={styles.metaActionRow}>
                  <div className={styles.timeTag}>
                    <FiClock size={13} />
                    <span>
                      {lang === "it" ? "Ultimo aggiornamento" : "Last updated"}{" "}
                      {activeArticle.lastUpdated}
                    </span>
                  </div>

                  <div className={styles.actionBtns}>
                    <button onClick={() => handleOpenEditor(activeArticle)} className={styles.editPageBtn}>
                      <FiEdit3 size={13} />
                      <span>
                        {isCreator
                          ? (lang === "it" ? "Modifica pagina" : "Edit this page")
                          : (lang === "it" ? "Sblocca Editor" : "Unlock Editor")}
                      </span>
                    </button>
                    <a
                      href="https://github.com/D4vide106"
                      target="_blank"
                      rel="noreferrer"
                      className={styles.githubPageBtn}
                    >
                      <FiExternalLink size={13} />
                      <span>GitHub Wiki</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Render Full Markdown Body */}
              <div className={styles.renderedMarkdownBody}>
                <MarkdownViewer content={activeArticle.content} />
              </div>

              {/* Previous / Next Article Navigation Footer */}
              <div className={styles.prevNextNavRow}>
                {prevArticle ? (
                  <button onClick={() => handleSelectArticle(prevArticle.id)} className={styles.prevNavBtn}>
                    <FiArrowLeft size={14} />
                    <div>
                      <span className={styles.navSubLabel}>
                        {lang === "it" ? "PRECEDENTE" : "PREVIOUS"}
                      </span>
                      <span className={styles.navTitleLabel}>{prevArticle.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextArticle ? (
                  <button onClick={() => handleSelectArticle(nextArticle.id)} className={styles.nextNavBtn}>
                    <div>
                      <span className={styles.navSubLabel}>
                        {lang === "it" ? "SUCCESSIVO" : "NEXT"}
                      </span>
                      <span className={styles.navTitleLabel}>{nextArticle.title}</span>
                    </div>
                    <FiArrowRight size={14} />
                  </button>
                ) : <div />}
              </div>

              {/* Community Reaction Feedback */}
              <div className={styles.feedbackRow}>
                <FiSmile size={16} color="#eab308" />
                <span>
                  {lang === "it"
                    ? "Questa guida ti è stata utile?"
                    : "Was this wiki page helpful?"}
                </span>
                <div className={styles.reactGroup}>
                  <button className={styles.reactBtn}>
                    {lang === "it" ? "👍 Utile (14)" : "👍 Useful (14)"}
                  </button>
                  <button className={styles.reactBtn}>
                    {lang === "it" ? "❤️ Fantastica (9)" : "❤️ Amazing (9)"}
                  </button>
                  <button className={styles.reactBtn}>
                    {lang === "it" ? "🚀 Epica (22)" : "🚀 Epic (22)"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyArticleState}>
              <p>
                {lang === "it"
                  ? "Nessuna guida wiki disponibile per questo progetto."
                  : "No wiki articles available for this project."}
              </p>
            </div>
          )}
        </main>

        {/* Right Sidebar: Table of Contents ("On this page" - Fixed on screen) */}
        <aside className={styles.rightTocSidebar}>
          <div className={styles.tocHeaderTitle}>
            {lang === "it" ? "IN QUESTA PAGINA" : "ON THIS PAGE"}
          </div>
          <div className={styles.tocGuideLines}>
            {tableOfContents.length === 0 ? (
              <span className={styles.tocEmpty}>
                {lang === "it" ? "Nessuna intestazione" : "No headings on page"}
              </span>
            ) : (
              tableOfContents.map((head, idx) => (
                <button
                  key={idx}
                  onClick={(e) => handleTocClick(e, head.slug)}
                  className={`${styles.tocItemLink} ${
                    activeHeadingSlug === head.slug ? styles.tocItemLinkActive : ""
                  } ${head.level === 2 ? styles.tocLvl2 : head.level === 3 ? styles.tocLvl3 : ""}`}
                >
                  <span className={styles.tocActiveLine} />
                  <span>{head.text}</span>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Editor Panel Modal */}
      <WikiEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaveArticle={handleSaveArticle}
        projects={projects}
        initialProjectId={selectedProjectId}
        initialArticle={editingArticle}
      />

      {/* Creator Passcode Verification Modal */}
      {passcodeModalOpen && (
        <div className={styles.passcodeOverlay} onClick={() => setPasscodeModalOpen(false)}>
          <div className={styles.passcodeCard} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.passcodeCloseBtn}
              onClick={() => setPasscodeModalOpen(false)}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>

            <div className={styles.passcodeIconHeader}>
              <FiShield size={30} color="#64d2ff" />
            </div>

            <h3 className={styles.passcodeTitle}>
              {lang === "it" ? "Verifica Accesso Creator" : "Creator Access Verification"}
            </h3>
            <p className={styles.passcodeSubtitle}>
              {lang === "it" ? (
                <>
                  L&apos;editor Markdown della Wiki è riservato esclusivamente al creatore del sito{" "}
                  <strong>D4VIDE106</strong>. Inserisci il passcode segreto per sbloccare gli strumenti di authoring.
                </>
              ) : (
                <>
                  The Wiki Markdown Editor is restricted exclusively to the site owner{" "}
                  <strong>D4VIDE106</strong>. Enter your Creator Secret Passcode to unlock authoring tools.
                </>
              )}
            </p>

            <form onSubmit={handleVerifyCreatorPasscode} className={styles.passcodeForm}>
              <div className={styles.passcodeInputBox}>
                <FiKey size={15} className={styles.keyIcon} />
                <input
                  type="password"
                  placeholder={lang === "it" ? "Inserisci Passcode Segreto..." : "Enter Secret Key..."}
                  value={inputPasscode}
                  onChange={(e) => setInputPasscode(e.target.value)}
                  className={styles.passcodeInput}
                  autoFocus
                />
              </div>

              {passcodeError && <div className={styles.passcodeErrorText}>{passcodeError}</div>}

              <button type="submit" className={styles.unlockBtn}>
                <FiUnlock size={14} />
                <span>{lang === "it" ? "Sblocca Modalità Creator" : "Unlock Creator Mode"}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Off-Canvas Drawer for Categories & TOC (Screens <= 768px) */}
      {mobileDrawerOpen && (
        <div className={styles.mobileDrawerOverlay} onClick={() => setMobileDrawerOpen(false)}>
          <div className={styles.mobileDrawerPanel} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileDrawerHeader}>
              <div className={styles.mobileDrawerTitleGroup}>
                <img src={currentProject.icon_url} alt="" className={styles.drawerProjectLogo} />
                <div className={styles.drawerProjectMeta}>
                  <span className={styles.drawerProjectBadge}>{currentProject.type}</span>
                  <span className={styles.drawerProjectTitle}>{getLocalizedProjectTitle(currentProject)}</span>
                </div>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className={styles.drawerCloseBtn}
                aria-label="Close Drawer"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Switch Tabs: Guides vs On this page */}
            {tableOfContents.length > 0 && (
              <div className={styles.drawerTabsRow}>
                <button
                  onClick={() => setMobileDrawerTab("guides")}
                  className={`${styles.drawerTabBtn} ${mobileDrawerTab === "guides" ? styles.drawerTabBtnActive : ""}`}
                >
                  <FiBookOpen size={12} />
                  <span>{lang === "it" ? "Tutte le Guide" : "All Guides"}</span>
                </button>
                <button
                  onClick={() => setMobileDrawerTab("toc")}
                  className={`${styles.drawerTabBtn} ${mobileDrawerTab === "toc" ? styles.drawerTabBtnActive : ""}`}
                >
                  <FiList size={12} />
                  <span>{lang === "it" ? "In questa Pagina" : "On this Page"}</span>
                </button>
              </div>
            )}

            <div className={styles.drawerScrollBody}>
              {mobileDrawerTab === "guides" ? (
                <div className={styles.sidebarTree}>
                  {Object.entries(categoriesMap).map(([categoryName, articles]) => (
                    <div key={categoryName} className={styles.categoryBlock}>
                      <div className={styles.categoryHeader}>{categoryName}</div>
                      <div className={styles.categoryGuideLines}>
                        {articles.map((art) => {
                          const isActive = art.id === activeArticleId;
                          return (
                            <button
                              key={art.id}
                              onClick={() => {
                                handleSelectArticle(art.id);
                                setMobileDrawerOpen(false);
                              }}
                              className={`${styles.categoryItemBtn} ${isActive ? styles.categoryItemBtnActive : ""}`}
                            >
                              <span className={styles.activeVerticalLine} />
                              <span className={styles.itemTitle}>{art.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.tocDrawerList}>
                  <div className={styles.sidebarTitle}>
                    {lang === "it" ? "SOMMARIO DELL'ARTICOLO" : "PAGE CONTENTS"}
                  </div>
                  {tableOfContents.map((h, i) => (
                    <a
                      key={i}
                      href={`#${h.slug}`}
                      onClick={(e) => {
                        handleTocClick(e, h.slug);
                        setMobileDrawerOpen(false);
                      }}
                      className={`${styles.tocDrawerLink} ${h.level === 3 ? styles.tocDrawerSubLink : ""}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Bottom Footer (Quick Links & Back to Portfolio) */}
            <div className={styles.drawerFooter}>
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setSearchModalOpen(true);
                }}
                className={styles.drawerSearchBtn}
              >
                <FiSearch size={13} />
                <span>{lang === "it" ? "Cerca guide..." : "Search docs..."}</span>
              </button>

              <div className={styles.drawerSocialRow}>
                <a
                  href="https://discord.gg/7T3u9a9"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.drawerSocialIcon}
                  title="Discord"
                >
                  <SiDiscord size={15} />
                </a>
                <a
                  href="https://github.com/D4vide106"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.drawerSocialIcon}
                  title="GitHub"
                >
                  <FiGithub size={15} />
                </a>
                <a
                  href={repoPrefix + "/"}
                  className={styles.drawerHomeLink}
                >
                  {lang === "it" ? "← Torna al Portfolio" : "← Back to Portfolio"}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
