"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  FiCheckCircle,
  FiArrowLeft,
  FiArrowRight,
  FiMessageSquare,
  FiSmile,
  FiLock,
  FiUnlock,
  FiKey,
  FiShield,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import styles from "./WikiSection.module.css";
import { useLanguage } from "@/context/LanguageContext";
import { useLiveStats } from "@/context/LiveStatsContext";
import { UnifiedProject } from "@/data/projectsData";
import { DEFAULT_WIKI_DATA, WikiArticle } from "@/data/wikiData";
import MarkdownViewer from "./MarkdownViewer";
import WikiEditorModal from "./WikiEditorModal";

export default function WikiSection({ dict: propDict }: { dict?: any }) {
  const { dict: contextDict } = useLanguage();
  const wikiDict = (contextDict as any)?.wiki || propDict;
  const projectDataDict = (contextDict as any)?.projectData || {};
  const { projects } = useLiveStats();

  // Active Project State
  const [selectedProjectId, setSelectedProjectId] = useState<string>("project-boss-rpg");
  const [projectDropdownOpen, setProjectDropdownOpen] = useState<boolean>(false);

  // Wiki Data State (Default + localStorage Custom Articles)
  const [allWikiArticles, setAllWikiArticles] = useState<Record<string, WikiArticle[]>>(DEFAULT_WIKI_DATA);

  // Active Selected Article State
  const [activeArticleId, setActiveArticleId] = useState<string>("pbr-getting-started");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Creator Access Control State (Restricted to D4VIDE106 Site Creator)
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [passcodeModalOpen, setPasscodeModalOpen] = useState<boolean>(false);
  const [inputPasscode, setInputPasscode] = useState<string>("");
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Editor Modal State
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<WikiArticle | undefined>(undefined);

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
    // Creator secret passcode validation (default: "d4vide106")
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

  // Load custom wiki articles from localStorage
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
    } catch {}
  }, []);

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

  // Get Current Active Project
  const currentProject: UnifiedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Get Current Project's Articles
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

  // Ensure activeArticleId belongs to current project, otherwise select first available
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

  // Filtered Articles based on search query
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
    <section id="wiki" className={styles.wikiContainer}>
      {/* 1. Top Wiki Header Navbar */}
      <div className={styles.wikiTopNavbar}>
        <div className={styles.wikiBrandGroup}>
          <FiBookOpen size={20} className={styles.wikiBrandIcon} />
          <span className={styles.wikiBrandTitle}>PROJECT WIKIS & DOCS</span>
          <span className={styles.wikiVersionBadge}>v4.2</span>
        </div>

        {/* Center: Project Dropdown Selector */}
        <div className={styles.projectDropdownWrapper}>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className={styles.projectDropdownBtn}
          >
            <img src={currentProject.icon_url} alt={currentProject.title} className={styles.projBtnLogo} />
            <span className={styles.projBtnTitle}>{getLocalizedProjectTitle(currentProject)}</span>
            <FiChevronDown size={14} className={styles.projBtnChevron} />
          </button>

          {projectDropdownOpen && (
            <div className={styles.projectMenuModal}>
              <div className={styles.menuTitleLabel}>SELECT PROJECT WIKI:</div>
              {projects.map((p) => {
                const localizedTitle = getLocalizedProjectTitle(p);
                return (
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
                    <img src={p.icon_url} alt={localizedTitle} className={styles.menuItemLogo} />
                    <div className={styles.menuItemText}>
                      <span className={styles.menuItemName}>{localizedTitle}</span>
                      <span className={styles.menuItemBadge}>{p.type}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Search, Creator Access / Editor & GitHub Link */}
        <div className={styles.wikiTopActions}>
          <div className={styles.wikiSearchBox}>
            <FiSearch size={14} className={styles.searchIcon} />
            <input
              type="text"
              placeholder={wikiDict?.searchPlaceholder || "Search wiki guides... (Ctrl+K)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {isCreator ? (
            <div className={styles.creatorActiveGroup}>
              <span className={styles.creatorBadge}>
                <span className={styles.creatorBadgeDot} /> CREATOR ACTIVE
              </span>
              <button
                onClick={() => handleOpenEditor()}
                className={styles.newWikiBtn}
              >
                <FiPlus size={15} />
                <span>{wikiDict?.createWikiBtn || "New Wiki Guide"}</span>
              </button>
              <button
                onClick={handleLogoutCreator}
                className={styles.logoutBtn}
                title="Lock Creator Mode"
              >
                <FiLogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPasscodeModalOpen(true)}
              className={styles.creatorLockBtn}
              title="Creator Authentication Required to Edit"
            >
              <FiLock size={14} />
              <span>Creator Access</span>
            </button>
          )}

          <a
            href="https://github.com/D4vide106"
            target="_blank"
            rel="noreferrer"
            className={styles.githubWikiBtn}
            title="GitHub Wiki Repository"
          >
            <FiGithub size={16} />
          </a>
        </div>
      </div>

      {/* Search Overlay Results if user is typing */}
      {searchQuery.trim() !== "" && (
        <div className={styles.searchResultsOverlay}>
          <div className={styles.searchResultsHeader}>
            <span>SEARCH RESULTS FOR &quot;{searchQuery}&quot;:</span>
            <button onClick={() => setSearchQuery("")} className={styles.clearSearchBtn}>Clear</button>
          </div>
          <div className={styles.searchResultsList}>
            {searchResults.length === 0 ? (
              <div className={styles.noResultsText}>No wiki articles match your query.</div>
            ) : (
              searchResults.map(({ article, projectTitle }) => (
                <button
                  key={article.id}
                  onClick={() => {
                    setSelectedProjectId(article.projectId);
                    setActiveArticleId(article.id);
                    setSearchQuery("");
                  }}
                  className={styles.searchResultRow}
                >
                  <span className={styles.resProjectBadge}>{projectTitle}</span>
                  <span className={styles.resCategory}>{article.category}</span>
                  <span className={styles.resTitle}>{article.title}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. Main Three-Column Layout (Sidebar, Content, TOC) */}
      <div className={styles.wikiMainBody}>
        {/* Left Navigation Sidebar */}
        <aside className={styles.wikiSidebar}>
          <div className={styles.sidebarHeader}>
            <FiLayers size={14} />
            <span>CATEGORIES</span>
          </div>

          <div className={styles.categoryTreeList}>
            {Object.entries(categoriesMap).map(([categoryName, articles]) => (
              <div key={categoryName} className={styles.categoryBlock}>
                <div className={styles.categoryHeader}>
                  <FiChevronRight size={12} className={styles.catChevron} />
                  <span>{categoryName}</span>
                </div>
                <div className={styles.categoryArticles}>
                  {articles.map((art) => {
                    const isActive = art.id === activeArticleId;
                    return (
                      <button
                        key={art.id}
                        onClick={() => setActiveArticleId(art.id)}
                        className={`${styles.sidebarArtItem} ${
                          isActive ? styles.sidebarArtItemActive : ""
                        }`}
                      >
                        <span className={styles.artDot} />
                        <span className={styles.artTitle}>{art.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Main Article Content */}
        <main className={styles.wikiArticleCenter}>
          {activeArticle ? (
            <>
              {/* Breadcrumb Navigation */}
              <div className={styles.breadcrumbBar}>
                <span>Wiki</span>
                <span className={styles.breadDivider}>/</span>
                <span className={styles.breadHighlight}>{getLocalizedProjectTitle(currentProject)}</span>
                <span className={styles.breadDivider}>/</span>
                <span>{activeArticle.category}</span>
                <span className={styles.breadDivider}>/</span>
                <span className={styles.breadActive}>{activeArticle.title}</span>
              </div>

              {/* Article Top Title & Metadata */}
              <div className={styles.articleHeaderMeta}>
                <div className={styles.titleCategoryRow}>
                  <span className={styles.articleCatTag}>{activeArticle.category}</span>
                  <h1 className={styles.articleMainTitle}>{activeArticle.title}</h1>
                </div>

                <div className={styles.articleMetaActions}>
                  <div className={styles.timeInfo}>
                    <FiClock size={13} />
                    <span>Last updated {activeArticle.lastUpdated}</span>
                  </div>

                  <div className={styles.articleBtnsGroup}>
                    <button
                      onClick={() => handleOpenEditor(activeArticle)}
                      className={styles.editPageBtn}
                    >
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
              <div className={styles.renderedContentArea}>
                <MarkdownViewer content={activeArticle.content} />
              </div>

              {/* Footer Previous / Next Navigation */}
              <div className={styles.prevNextNavRow}>
                {prevArticle ? (
                  <button
                    onClick={() => setActiveArticleId(prevArticle.id)}
                    className={styles.prevNavBtn}
                  >
                    <FiArrowLeft size={14} />
                    <div>
                      <span className={styles.navLabel}>Previous page</span>
                      <span className={styles.navTitle}>{prevArticle.title}</span>
                    </div>
                  </button>
                ) : <div />}

                {nextArticle ? (
                  <button
                    onClick={() => setActiveArticleId(nextArticle.id)}
                    className={styles.nextNavBtn}
                  >
                    <div>
                      <span className={styles.navLabel}>Next page</span>
                      <span className={styles.navTitle}>{nextArticle.title}</span>
                    </div>
                    <FiArrowRight size={14} />
                  </button>
                ) : <div />}
              </div>

              {/* Community Feedback Mockup (Identical to Screenshots) */}
              <div className={styles.communityFeedbackBlock}>
                <div className={styles.feedbackHeader}>
                  <FiSmile size={18} color="#ffcc00" />
                  <span>Was this wiki page helpful?</span>
                </div>
                <div className={styles.reactionsRow}>
                  <button className={styles.reactBtn}>👍 Useful (14)</button>
                  <button className={styles.reactBtn}>❤️ Amazing (9)</button>
                  <button className={styles.reactBtn}>🚀 Epic (22)</button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyArticleState}>
              <p>No wiki articles available for this project yet.</p>
              <button
                onClick={() => handleOpenEditor()}
                className={styles.newWikiBtn}
              >
                Create First Article
              </button>
            </div>
          )}
        </main>

        {/* Right Sidebar: Table of Contents ("On this page") */}
        <aside className={styles.wikiTocSidebar}>
          <div className={styles.tocHeader}>
            <span>ON THIS PAGE</span>
          </div>

          <div className={styles.tocList}>
            {tableOfContents.length === 0 ? (
              <span className={styles.tocEmpty}>No headings on this page</span>
            ) : (
              tableOfContents.map((head, idx) => (
                <a
                  key={idx}
                  href={`#${head.slug}`}
                  className={`${styles.tocItem} ${
                    head.level === 2 ? styles.tocLevel2 : head.level === 3 ? styles.tocLevel3 : ""
                  }`}
                >
                  {head.text}
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
              <FiShield size={32} color="#64d2ff" />
            </div>

            <h3 className={styles.passcodeTitle}>Creator Access Verification</h3>
            <p className={styles.passcodeSubtitle}>
              The Wiki Markdown Editor is restricted exclusively to the site owner <strong>D4VIDE106</strong>.
              Please enter your Creator Secret Passcode to unlock authoring tools.
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
