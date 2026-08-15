"use client";

import React, { useState, useEffect, useMemo } from "react";
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
} from "react-icons/fi";
import styles from "./WikiSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";
import { DEFAULT_WIKI_DATA, WikiArticle } from "@/data/wikiData";
import MarkdownViewer from "./MarkdownViewer";
import WikiEditorModal from "./WikiEditorModal";

export default function WikiSection({ dict: propDict, standalone }: { dict?: any; standalone?: boolean }) {
  const { dict: contextDict } = useLanguage();
  const wikiDict = (contextDict as any)?.wiki || propDict;
  const projectDataDict = (contextDict as any)?.projectData || {};
  const { projects } = useLiveStats();

  // Active Project & Dropdown State
  const [selectedProjectId, setSelectedProjectId] = useState<string>("project-boss-rpg");
  const [projectDropdownOpen, setProjectDropdownOpen] = useState<boolean>(false);

  // Wiki Articles Data State
  const [allWikiArticles, setAllWikiArticles] = useState<Record<string, WikiArticle[]>>(DEFAULT_WIKI_DATA);

  // Active Selected Article State
  const [activeArticleId, setActiveArticleId] = useState<string>("pbr-getting-started");

  // Search Query State
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
      setPasscodeError("Invalid Creator Secret Passcode. Access denied.");
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
          setAllWikiArticles((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      }
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlProj = params.get("project");
        const urlArt = params.get("article");
        if (urlProj) {
          setSelectedProjectId(urlProj);
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
        url.searchParams.set("project", selectedProjectId);
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
    const updatedArticle: WikiArticle = {
      ...newArt,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setAllWikiArticles((prev) => {
      const projArticles = prev[newArt.projectId] || [];
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
        [newArt.projectId]: updatedProjArticles,
      };

      try {
        localStorage.setItem("d4v_custom_wikis_v1", JSON.stringify(next));
      } catch {}

      return next;
    });

    setSelectedProjectId(newArt.projectId);
    setActiveArticleId(newArt.id);
  };

  // Current Active Project Object
  const currentProject: UnifiedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Current Project Articles List
  const currentProjectArticles: WikiArticle[] = useMemo(() => {
    return allWikiArticles[selectedProjectId] || DEFAULT_WIKI_DATA[selectedProjectId] || [];
  }, [allWikiArticles, selectedProjectId]);

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
    return (
      currentProjectArticles.find((a) => a.id === activeArticleId) ||
      currentProjectArticles[0] || {
        id: "default",
        projectId: selectedProjectId,
        category: "Getting Started",
        title: "Overview",
        slug: "overview",
        lastUpdated: "2026-08-15",
        content: "# Documentation\n\nSelect or create an article from the sidebar.",
      }
    );
  }, [currentProjectArticles, activeArticleId, selectedProjectId]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: { article: WikiArticle; projectTitle: string }[] = [];

    Object.entries(allWikiArticles).forEach(([projId, articles]) => {
      const proj = projects.find((p) => p.id === projId);
      const projTitle = proj ? proj.title : projId;
      articles.forEach((art) => {
        if (
          art.title.toLowerCase().includes(query) ||
          art.content.toLowerCase().includes(query) ||
          art.category.toLowerCase().includes(query)
        ) {
          results.push({ article: art, projectTitle: projTitle });
        }
      });
    });

    return results;
  }, [searchQuery, allWikiArticles, projects]);

  // Extract Table of Contents (Headings) from active article content
  const tableOfContents = useMemo(() => {
    if (!activeArticle?.content) return [];
    const headings: { text: string; slug: string; level: number }[] = [];
    const lines = activeArticle.content.split("\n");

    lines.forEach((line) => {
      if (line.startsWith("# ")) {
        const text = line.replace(/^#\s+/, "").trim();
        headings.push({ text, slug: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"), level: 1 });
      } else if (line.startsWith("## ")) {
        const text = line.replace(/^##\s+/, "").trim();
        headings.push({ text, slug: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"), level: 2 });
      } else if (line.startsWith("### ")) {
        const text = line.replace(/^###\s+/, "").trim();
        headings.push({ text, slug: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"), level: 3 });
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

  return (
    <section id="wiki" className={`${styles.wikiRoot} ${spotlightOn ? styles.spotlightActive : ""}`}>
      {/* 1. D4VIDE WIKIS Header Control Bar */}
      <div className={styles.wikiHeaderBar}>
        <div className={styles.headerLeftBrand}>
          <FiBookOpen size={18} className={styles.brandIcon} />
          <span className={styles.brandTitle}>D4VIDE WIKIS & DOCS</span>
          <span className={styles.versionBadge}>v4.2</span>
        </div>

        {/* Project Dropdown Selector */}
        <div className={styles.projectDropdownWrap}>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className={styles.projectSelectBtn}
          >
            <img src={currentProject.icon_url} alt="" className={styles.projBtnLogo} />
            <span className={styles.projBtnTitle}>{getLocalizedProjectTitle(currentProject)}</span>
            <FiChevronDown size={14} />
          </button>

          {projectDropdownOpen && (
            <div className={styles.projectSelectMenu}>
              <div className={styles.menuHeaderLabel}>SELECT PROJECT WIKI:</div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProjectId(p.id);
                    setProjectDropdownOpen(false);
                  }}
                  className={`${styles.projectMenuItem} ${
                    selectedProjectId === p.id ? styles.projectMenuItemActive : ""
                  }`}
                >
                  <img src={p.icon_url} alt="" className={styles.menuItemLogo} />
                  <span>{getLocalizedProjectTitle(p)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className={styles.headerSearchWrap}>
          <FiSearch size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={wikiDict?.searchPlaceholder || "Search wiki guides... (Ctrl+K)"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.headerSearchInput}
          />
        </div>

        {/* Actions: Creator Mode & Layout Switcher */}
        <div className={styles.headerRightActions}>
          {isCreator ? (
            <div className={styles.creatorGroup}>
              <span className={styles.creatorBadge}>CREATOR ACTIVE</span>
              <button onClick={() => handleOpenEditor()} className={styles.newGuideBtn}>
                <FiPlus size={14} />
                <span>New Guide</span>
              </button>
              <button onClick={handleLogoutCreator} className={styles.logoutIconBtn} title="Logout Creator">
                <FiLogOut size={13} />
              </button>
            </div>
          ) : (
            <button onClick={() => setPasscodeModalOpen(true)} className={styles.creatorLockBtn} title="Creator Passcode">
              <FiLock size={14} />
              <span>Creator Access</span>
            </button>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/D4vide106"
            target="_blank"
            rel="noreferrer"
            className={styles.actionIconBtn}
            title="GitHub Repository"
          >
            <FiGithub size={16} />
          </a>

          {/* Layout & Spotlight Switcher Popup */}
          <div className={styles.layoutSwitchWrap}>
            <button
              onClick={() => setLayoutMenuOpen(!layoutMenuOpen)}
              className={`${styles.layoutToggleBtn} ${layoutMenuOpen ? styles.layoutToggleBtnActive : ""}`}
              title="Layout Switch & Spotlight Settings"
            >
              <FiSliders size={15} />
              <FiChevronDown size={12} />
            </button>

            {layoutMenuOpen && (
              <div className={styles.layoutMenuCard}>
                <div className={styles.menuSecTitle}>
                  <FiSliders size={14} />
                  <span>Layout Switch</span>
                  <FiHelpCircle size={13} color="#86868b" />
                </div>
                <div className={styles.layoutGrid}>
                  <button
                    onClick={() => setLayoutMode("original")}
                    className={`${styles.layoutSegBtn} ${layoutMode === "original" ? styles.layoutSegBtnActive : ""}`}
                  >
                    <FiMinimize2 size={13} />
                    <span>Original</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode("expand")}
                    className={`${styles.layoutSegBtn} ${layoutMode === "expand" ? styles.layoutSegBtnActive : ""}`}
                  >
                    <FiMaximize2 size={13} />
                    <span>Expand All</span>
                  </button>
                </div>

                <hr className={styles.menuDivider} />

                <div className={styles.menuSecTitle}>
                  <FiSun size={14} />
                  <span>Spotlight Focus</span>
                  <FiHelpCircle size={13} color="#86868b" />
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
      </div>

      {/* Search Overlay Results */}
      {searchQuery.trim() !== "" && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchHeader}>
            <span>SEARCH RESULTS FOR &quot;{searchQuery}&quot;:</span>
            <button onClick={() => setSearchQuery("")} className={styles.clearBtn}>Clear</button>
          </div>
          <div className={styles.searchList}>
            {searchResults.length === 0 ? (
              <div className={styles.noResults}>No wiki articles match your query.</div>
            ) : (
              searchResults.map(({ article, projectTitle }) => (
                <button
                  key={article.id}
                  onClick={() => {
                    setSelectedProjectId(article.projectId);
                    setActiveArticleId(article.id);
                    setSearchQuery("");
                  }}
                  className={styles.searchRow}
                >
                  <span className={styles.projTag}>{projectTitle}</span>
                  <span className={styles.catTag}>{article.category}</span>
                  <span className={styles.artTitle}>{article.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. Main Three-Column Grid View */}
      <div className={`${styles.wikiBodyGrid} ${layoutMode === "expand" ? styles.gridExpand : ""}`}>
        {/* Left Sidebar Navigation (With Vertical Indicator Lines) */}
        <aside className={styles.leftSidebar}>
          <div className={styles.sidebarTitle}>CATEGORIES</div>
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
                        onClick={() => setActiveArticleId(art.id)}
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

        {/* Center Main Article Display */}
        <main className={styles.centerArticlePane}>
          {activeArticle ? (
            <>
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
                    <span>Last updated {activeArticle.lastUpdated}</span>
                  </div>

                  <div className={styles.actionBtns}>
                    <button onClick={() => handleOpenEditor(activeArticle)} className={styles.editPageBtn}>
                      <FiEdit3 size={13} />
                      <span>{isCreator ? "Edit this page" : "Unlock Editor"}</span>
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
                  <button onClick={() => setActiveArticleId(prevArticle.id)} className={styles.prevNavBtn}>
                    <FiArrowLeft size={14} />
                    <div>
                      <span className={styles.navSubLabel}>PREVIOUS</span>
                      <span className={styles.navTitleLabel}>{prevArticle.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextArticle ? (
                  <button onClick={() => setActiveArticleId(nextArticle.id)} className={styles.nextNavBtn}>
                    <div>
                      <span className={styles.navSubLabel}>NEXT</span>
                      <span className={styles.navTitleLabel}>{nextArticle.title}</span>
                    </div>
                    <FiArrowRight size={14} />
                  </button>
                ) : <div />}
              </div>

              {/* Community Reaction Feedback */}
              <div className={styles.feedbackRow}>
                <FiSmile size={16} color="#eab308" />
                <span>Was this wiki page helpful?</span>
                <div className={styles.reactGroup}>
                  <button className={styles.reactBtn}>👍 Useful (14)</button>
                  <button className={styles.reactBtn}>❤️ Amazing (9)</button>
                  <button className={styles.reactBtn}>🚀 Epic (22)</button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyArticleState}>
              <p>No wiki articles available for this project.</p>
            </div>
          )}
        </main>

        {/* Right Sidebar: Table of Contents ("On this page") */}
        <aside className={styles.rightTocSidebar}>
          <div className={styles.tocHeaderTitle}>ON THIS PAGE</div>
          <div className={styles.tocGuideLines}>
            {tableOfContents.length === 0 ? (
              <span className={styles.tocEmpty}>No headings on page</span>
            ) : (
              tableOfContents.map((head, idx) => (
                <a
                  key={idx}
                  href={`#${head.slug}`}
                  onClick={() => setActiveHeadingSlug(head.slug)}
                  className={`${styles.tocItemLink} ${
                    activeHeadingSlug === head.slug ? styles.tocItemLinkActive : ""
                  } ${head.level === 2 ? styles.tocLvl2 : head.level === 3 ? styles.tocLvl3 : ""}`}
                >
                  <span className={styles.tocActiveLine} />
                  <span>{head.text}</span>
                </a>
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
            <button className={styles.passcodeCloseBtn} onClick={() => setPasscodeModalOpen(false)}>
              <FiX size={18} />
            </button>

            <div className={styles.passcodeIconHeader}>
              <FiShield size={30} color="#64d2ff" />
            </div>

            <h3 className={styles.passcodeTitle}>Creator Access Verification</h3>
            <p className={styles.passcodeSubtitle}>
              The Wiki Markdown Editor is restricted exclusively to the site owner <strong>D4VIDE106</strong>.
              Enter your Creator Secret Passcode to unlock authoring tools.
            </p>

            <form onSubmit={handleVerifyCreatorPasscode} className={styles.passcodeForm}>
              <div className={styles.passcodeInputBox}>
                <FiKey size={15} className={styles.keyIcon} />
                <input
                  type="password"
                  placeholder="Enter Secret Key..."
                  value={inputPasscode}
                  onChange={(e) => setInputPasscode(e.target.value)}
                  className={styles.passcodeInput}
                  autoFocus
                />
              </div>

              {passcodeError && <div className={styles.passcodeErrorText}>{passcodeError}</div>}

              <button type="submit" className={styles.unlockBtn}>
                <FiUnlock size={14} />
                <span>Unlock Creator Mode</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
