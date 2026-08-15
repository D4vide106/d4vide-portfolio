"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FiBookOpen,
  FiSearch,
  FiEdit3,
  FiGithub,
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiPlus,
  FiLayers,
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
  FiFileText,
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

  // Layout & Spotlight Control State (Matching Stonecutter Screenshots)
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
      {/* 1. Stonecutter / VitePress-Grade Top Navbar */}
      <header className={styles.stoneNavbar}>
        <div className={styles.navLeftBrand}>
          <FiBookOpen size={18} className={styles.brandIcon} />
          <span className={styles.brandName}>Stonecutter Wiki</span>
        </div>

        {/* Center: Search Box */}
        <div className={styles.navCenterSearch}>
          <div className={styles.searchBoxInputWrap}>
            <FiSearch size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={wikiDict?.searchPlaceholder || "Search Ctrl+K"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.stoneSearchInput}
            />
          </div>
        </div>

        {/* Right Actions: Links, Project Selector, Layout & Spotlight Popup */}
        <div className={styles.navRightActions}>
          {/* Project Dropdown Selector (Stonecutter style: 0.9.7 ˅) */}
          <div className={styles.stoneProjDropdownWrap}>
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              className={styles.stoneProjBtn}
            >
              <img src={currentProject.icon_url} alt="" className={styles.stoneProjIcon} />
              <span className={styles.stoneProjName}>{getLocalizedProjectTitle(currentProject)}</span>
              <FiChevronDown size={14} />
            </button>

            {projectDropdownOpen && (
              <div className={styles.stoneProjMenu}>
                <div className={styles.menuLabel}>PROJECT VERSION WIKIS</div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProjectId(p.id);
                      setProjectDropdownOpen(false);
                    }}
                    className={`${styles.stoneProjMenuItem} ${
                      selectedProjectId === p.id ? styles.stoneProjMenuItemActive : ""
                    }`}
                  >
                    <img src={p.icon_url} alt="" className={styles.menuProjLogo} />
                    <span>{getLocalizedProjectTitle(p)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* GitHub Link */}
          <a
            href="https://github.com/D4vide106"
            target="_blank"
            rel="noreferrer"
            className={styles.stoneIconLink}
            title="GitHub Repository"
          >
            <FiGithub size={16} />
          </a>

          {/* Creator Control Button */}
          {isCreator ? (
            <div className={styles.creatorWrap}>
              <span className={styles.creatorTag}>CREATOR</span>
              <button onClick={() => handleOpenEditor()} className={styles.stoneNewBtn}>
                <FiPlus size={14} />
              </button>
              <button onClick={handleLogoutCreator} className={styles.stoneLogoutBtn} title="Logout">
                <FiLogOut size={13} />
              </button>
            </div>
          ) : (
            <button onClick={() => setPasscodeModalOpen(true)} className={styles.stoneLockBtn} title="Creator Passcode">
              <FiLock size={14} />
            </button>
          )}

          {/* Layout & Spotlight Control Menu Button (Matching Screenshots #2, #3, #4!) */}
          <div className={styles.layoutSwitchWrap}>
            <button
              onClick={() => setLayoutMenuOpen(!layoutMenuOpen)}
              className={`${styles.stoneLayoutBtn} ${layoutMenuOpen ? styles.stoneLayoutBtnActive : ""}`}
              title="Layout Switch & Spotlight Settings"
            >
              <FiSliders size={16} />
              <FiChevronDown size={12} />
            </button>

            {layoutMenuOpen && (
              <div className={styles.layoutMenuCard}>
                {/* Layout Switch Section */}
                <div className={styles.layoutSecHeader}>
                  <FiSliders size={14} />
                  <span>Layout Switch</span>
                  <FiHelpCircle size={13} color="#86868b" />
                </div>
                <div className={styles.layoutBtnsGrid}>
                  <button
                    onClick={() => setLayoutMode("original")}
                    className={`${styles.layoutSegBtn} ${layoutMode === "original" ? styles.layoutSegBtnActive : ""}`}
                  >
                    <FiMinimize2 size={14} />
                    <span>Original</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode("expand")}
                    className={`${styles.layoutSegBtn} ${layoutMode === "expand" ? styles.layoutSegBtnActive : ""}`}
                  >
                    <FiMaximize2 size={14} />
                    <span>Expand All</span>
                  </button>
                </div>

                <hr className={styles.menuDivider} />

                {/* Spotlight Section */}
                <div className={styles.layoutSecHeader}>
                  <FiSun size={14} />
                  <span>Spotlight</span>
                  <FiHelpCircle size={13} color="#86868b" />
                </div>
                <div className={styles.spotlightToggleRow}>
                  <button
                    onClick={() => setSpotlightOn(true)}
                    className={`${styles.spotToggleBtn} ${spotlightOn ? styles.spotToggleBtnActive : ""}`}
                  >
                    ON
                  </button>
                  <button
                    onClick={() => setSpotlightOn(false)}
                    className={`${styles.spotToggleBtn} ${!spotlightOn ? styles.spotToggleBtnActive : ""}`}
                  >
                    OFF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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

      {/* 2. Main Documentation View (Left Sidebar, Article Body, Right TOC) */}
      <div className={`${styles.wikiBodyGrid} ${layoutMode === "expand" ? styles.wikiGridExpand : ""}`}>
        {/* Left Sidebar Navigation (With Vertical Indicator Lines like Stonecutter) */}
        <aside className={styles.stoneSidebar}>
          <div className={styles.sidebarTree}>
            {Object.entries(categoriesMap).map(([categoryName, articles]) => (
              <div key={categoryName} className={styles.sidebarCategoryGroup}>
                <div className={styles.sidebarCategoryTitle}>{categoryName}</div>
                <div className={styles.sidebarCategoryList}>
                  {articles.map((art) => {
                    const isActive = art.id === activeArticleId;
                    return (
                      <button
                        key={art.id}
                        onClick={() => setActiveArticleId(art.id)}
                        className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ""}`}
                      >
                        <span className={styles.activeLine} />
                        <span className={styles.itemTitle}>{art.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Main Content Area */}
        <main className={styles.stoneContentArea}>
          {activeArticle ? (
            <>
              {/* Breadcrumb Navigation */}
              <div className={styles.stoneBreadcrumb}>
                <span>Wiki</span>
                <span className={styles.breadSep}>/</span>
                <span className={styles.breadProject}>{getLocalizedProjectTitle(currentProject)}</span>
                <span className={styles.breadSep}>/</span>
                <span>{activeArticle.category}</span>
                <span className={styles.breadSep}>/</span>
                <span className={styles.breadCurrent}>{activeArticle.title}</span>
              </div>

              {/* Main Article Title Bar */}
              <div className={styles.stoneArticleHeader}>
                <div className={styles.tagTitleRow}>
                  <span className={styles.categoryBadge}>{activeArticle.category}</span>
                  <h1 className={styles.mainTitle}>{activeArticle.title}</h1>
                </div>

                <div className={styles.metaRow}>
                  <div className={styles.timeTag}>
                    <FiClock size={13} />
                    <span>Last edited {activeArticle.lastUpdated}</span>
                  </div>

                  <div className={styles.actionBtns}>
                    <button onClick={() => handleOpenEditor(activeArticle)} className={styles.editBtn}>
                      <FiEdit3 size={13} />
                      <span>{isCreator ? "Edit this page" : "Unlock Editor"}</span>
                    </button>
                    <a
                      href="https://github.com/D4vide106"
                      target="_blank"
                      rel="noreferrer"
                      className={styles.githubBtn}
                    >
                      <FiExternalLink size={13} />
                      <span>GitHub Wiki</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Render Full Markdown Body */}
              <div className={styles.renderedMarkdown}>
                <MarkdownViewer content={activeArticle.content} />
              </div>

              {/* Footer Previous / Next Navigation */}
              <div className={styles.navFooterRow}>
                {prevArticle ? (
                  <button onClick={() => setActiveArticleId(prevArticle.id)} className={styles.prevBtn}>
                    <FiArrowLeft size={14} />
                    <div>
                      <span className={styles.subLabel}>Previous</span>
                      <span className={styles.btnTitle}>{prevArticle.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextArticle ? (
                  <button onClick={() => setActiveArticleId(nextArticle.id)} className={styles.nextBtn}>
                    <div>
                      <span className={styles.subLabel}>Next</span>
                      <span className={styles.btnTitle}>{nextArticle.title}</span>
                    </div>
                    <FiArrowRight size={14} />
                  </button>
                ) : <div />}
              </div>

              {/* Community Feedback Row */}
              <div className={styles.feedbackRow}>
                <FiSmile size={16} color="#eab308" />
                <span>Was this page helpful?</span>
                <div className={styles.reactBtns}>
                  <button className={styles.rBtn}>👍 14</button>
                  <button className={styles.rBtn}>❤️ 9</button>
                  <button className={styles.rBtn}>🚀 22</button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>No articles found for this project.</p>
            </div>
          )}
        </main>

        {/* Right Sidebar: Table of Contents ("On this page") */}
        <aside className={styles.stoneTocSidebar}>
          <div className={styles.tocTitle}>On this page</div>
          <div className={styles.tocTree}>
            {tableOfContents.length === 0 ? (
              <span className={styles.tocEmpty}>No headings on page</span>
            ) : (
              tableOfContents.map((head, idx) => (
                <a
                  key={idx}
                  href={`#${head.slug}`}
                  onClick={() => setActiveHeadingSlug(head.slug)}
                  className={`${styles.tocLink} ${
                    activeHeadingSlug === head.slug ? styles.tocLinkActive : ""
                  } ${head.level === 2 ? styles.tocLevel2 : head.level === 3 ? styles.tocLevel3 : ""}`}
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

            <h3 className={styles.passcodeTitle}>Creator Authentication</h3>
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
