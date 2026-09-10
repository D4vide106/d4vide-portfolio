"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MAIN_PROJECTS, UnifiedProject } from "@/data/projectsData";

interface LiveStatsContextType {
  projects: UnifiedProject[];
  totalDownloads: number;
  portfolioViews: number;
  platformTotals: Record<string, number>;
  projectViewsMap: Record<string, number>;
  incrementProjectViews: (projectId: string) => void;
  incrementDownloadLink: (projectId: string, linkUrl: string) => void;
  getProjectViews: (projectId: string) => number;
  isLiveUpdating: boolean;
}

const LiveStatsContext = createContext<LiveStatsContextType>({
  projects: MAIN_PROJECTS,
  totalDownloads: MAIN_PROJECTS.reduce((acc, p) => acc + p.downloads, 0),
  portfolioViews: 1,
  platformTotals: {},
  projectViewsMap: {},
  incrementProjectViews: () => {},
  incrementDownloadLink: () => {},
  getProjectViews: () => 1,
  isLiveUpdating: false,
});

// ── Reliable Global CountAPI Helpers with Failover ────────────────────────
const COUNT_API_BASE = "https://countapi.mileshilliard.com/api/v1";

async function countHit(key: string): Promise<number | null> {
  try {
    const res = await fetch(`${COUNT_API_BASE}/hit/${key}`);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.value === "number" ? data.value : null;
  } catch {
    return null;
  }
}

async function countGet(key: string): Promise<number | null> {
  try {
    const res = await fetch(`${COUNT_API_BASE}/get/${key}`);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.value === "number" ? data.value : null;
  } catch {
    return null;
  }
}

export const LiveStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<UnifiedProject[]>(MAIN_PROJECTS);
  const [portfolioViews, setPortfolioViews] = useState<number>(1);
  const [projectViewsMap, setProjectViewsMap] = useState<Record<string, number>>({});
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(false);

  // ── 1. REAL UNIQUE PORTFOLIO VIEWS (Per-person unique visit) ──
  useEffect(() => {
    const GLOBAL_PORTFOLIO_KEY = "d4vide106_portfolio_views_v5";
    const VISITOR_RECORDED_KEY = "d4v_unique_visitor_v5";

    async function trackPortfolioVisit() {
      let isRecorded = false;
      try {
        isRecorded = localStorage.getItem(VISITOR_RECORDED_KEY) === "true";
      } catch {}

      if (!isRecorded) {
        // First time this unique user visits the site: increment global counter
        const hitVal = await countHit(GLOBAL_PORTFOLIO_KEY);
        if (hitVal !== null) {
          setPortfolioViews(hitVal);
          try {
            localStorage.setItem(VISITOR_RECORDED_KEY, "true");
          } catch {}
        } else {
          // Fallback if offline
          setPortfolioViews((prev) => Math.max(prev, 1));
        }
      } else {
        // Returning visitor: retrieve current global count without re-incrementing
        const getVal = await countGet(GLOBAL_PORTFOLIO_KEY);
        if (getVal !== null) {
          setPortfolioViews(getVal);
        }
      }
    }

    trackPortfolioVisit();

    // Live polling for cross-visitor updates every 15 seconds
    const interval = setInterval(async () => {
      const liveCount = await countGet(GLOBAL_PORTFOLIO_KEY);
      if (liveCount !== null) {
        setPortfolioViews(liveCount);
      }
    }, 15_000);

    return () => clearInterval(interval);
  }, []);

  // ── 2. REAL PROJECT VIEWS INITIALIZATION ──
  useEffect(() => {
    async function loadAllProjectViews() {
      const map: Record<string, number> = {};

      await Promise.all(
        projects.map(async (project) => {
          const key = `d4vide106_pv5_${project.id}`;
          const val = await countGet(key);
          map[project.id] = val !== null ? Math.max(val, 1) : 1;
        })
      );

      setProjectViewsMap(map);
    }

    loadAllProjectViews();
  }, [projects]);

  // ── 3. REAL UNIQUE PROJECT VIEW INCREMENT (1 view per unique person) ──
  const incrementProjectViews = async (projectId: string) => {
    const STORAGE_KEY = `d4v_proj_viewed_v5_${projectId}`;
    let alreadyViewed = false;
    try {
      alreadyViewed = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {}

    const key = `d4vide106_pv5_${projectId}`;

    if (!alreadyViewed) {
      // First time this visitor views this specific project: increment
      const nextVal = await countHit(key);
      if (nextVal !== null) {
        try {
          localStorage.setItem(STORAGE_KEY, "true");
        } catch {}
        setProjectViewsMap((prev) => ({
          ...prev,
          [projectId]: nextVal,
        }));
      }
    } else {
      // Returning view: get live count without inflating
      const liveVal = await countGet(key);
      if (liveVal !== null) {
        setProjectViewsMap((prev) => ({
          ...prev,
          [projectId]: liveVal,
        }));
      }
    }
  };

  const getProjectViews = (projectId: string) => {
    return projectViewsMap[projectId] ?? 1;
  };

  const incrementDownloadLink = (projectId: string, linkUrl: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== projectId) return p;
        const updatedLinks = p.links.map((l) => {
          if (l.url === linkUrl) {
            const currentClicks = parseInt(localStorage.getItem(`d4v_clicks_v5_${p.id}_${l.platform}`) || "0", 10);
            const nextClicks = currentClicks + 1;
            try {
              localStorage.setItem(`d4v_clicks_v5_${p.id}_${l.platform}`, nextClicks.toString());
            } catch {}

            countHit(`d4v_dl_${l.platform}_${p.id}`);

            return { ...l, initialDownloads: (l.initialDownloads || 0) + 1 };
          }
          return l;
        });
        const newTotalSum = updatedLinks.reduce((sum, l) => sum + (l.initialDownloads || 0), 0);
        return {
          ...p,
          downloads: newTotalSum,
          links: updatedLinks,
        };
      })
    );
    countHit(`d4v_dl_total_${projectId}`);
  };

  // ── 4. Live download fetching (Modrinth + Official CurseForge API + GameJolt + Itch) ──
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveDownloads() {
      setIsLiveUpdating(true);

      // Pre-fetch all Modrinth user projects in 1 batch request
      const modrinthUserMap: Record<string, number> = {};
      try {
        const mrUserRes = await fetch("https://api.modrinth.com/v2/user/D4vide106/projects");
        if (mrUserRes.ok) {
          const mrProjects = await mrUserRes.json();
          if (Array.isArray(mrProjects)) {
            mrProjects.forEach((p: { id?: string; slug?: string; downloads?: number }) => {
              if (typeof p.downloads === "number") {
                if (p.id) modrinthUserMap[p.id] = p.downloads;
                if (p.slug) modrinthUserMap[p.slug] = p.downloads;
              }
            });
          }
        }
      } catch {}

      // Pre-fetch official CurseForge API projects with user's API Key / Token
      const curseforgeMap: Record<string, number> = {};
      const cfToken = process.env.NEXT_PUBLIC_CURSEFORGE_API_TOKEN || "f1e674d8-a08d-4a3e-bbc3-472cd774bf8e";

      try {
        const cfRes = await fetch("https://api.curseforge.com/v1/mods/search?gameId=432&searchFilter=D4vide106", {
          headers: {
            "x-api-key": cfToken,
            "X-Api-Token": cfToken,
            "Accept": "application/json"
          }
        });
        if (cfRes.ok) {
          const cfData = await cfRes.json();
          if (Array.isArray(cfData?.data)) {
            cfData.data.forEach((m: { slug?: string; name?: string; downloadCount?: number }) => {
              if (typeof m.downloadCount === "number") {
                if (m.slug) curseforgeMap[m.slug] = m.downloadCount;
                if (m.name) curseforgeMap[m.name.toLowerCase()] = m.downloadCount;
              }
            });
          }
        }
      } catch {}

      const updatedProjects = await Promise.all(
        MAIN_PROJECTS.map(async (project) => {
          let totalSum = 0;

          const updatedLinks = await Promise.all(
            project.links.map(async (link) => {
              const baseCount = link.initialDownloads ?? 0;
              let localClicks = 0;
              try {
                localClicks = parseInt(localStorage.getItem(`d4v_clicks_v5_${project.id}_${link.platform}`) || "0", 10);
              } catch {}

              let liveApiCount: number | null = null;

              if (link.mrId) {
                if (modrinthUserMap[link.mrId] !== undefined) {
                  liveApiCount = modrinthUserMap[link.mrId];
                } else {
                  try {
                    const res = await fetch(`https://api.modrinth.com/v2/project/${link.mrId}`);
                    if (res.ok) {
                      const d = await res.json();
                      if (typeof d.downloads === "number") {
                        liveApiCount = d.downloads;
                      }
                    }
                  } catch {}
                }
              } else if (link.cfPath) {
                const slug = link.cfPath.split("/").pop();
                if (slug && curseforgeMap[slug] !== undefined) {
                  liveApiCount = curseforgeMap[slug];
                } else {
                  try {
                    let res = await fetch(`https://api.cfwidget.com/${link.cfPath}`);
                    if (!res.ok) {
                      res = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://api.cfwidget.com/${link.cfPath}`)}`);
                    }
                    if (res.ok) {
                      const d = await res.json();
                      if (d.downloads?.total && typeof d.downloads.total === "number") {
                        liveApiCount = d.downloads.total;
                      }
                    }
                  } catch {}
                }
              } else if (link.platform === "gamejolt" || link.platform === "itch") {
                const cloudKey = `d4v_dl_${link.platform}_${project.id}`;
                const cloudCount = await countGet(cloudKey);
                if (cloudCount !== null) {
                  liveApiCount = baseCount + cloudCount;
                }
              }

              const linkTotal = (liveApiCount !== null ? liveApiCount : baseCount) + localClicks;
              totalSum += linkTotal;
              return { ...link, initialDownloads: linkTotal };
            })
          );

          return {
            ...project,
            downloads: totalSum,
            links: updatedLinks,
          };
        })
      );

      if (isMounted) {
        setProjects(updatedProjects);
        setIsLiveUpdating(false);
      }
    }

    fetchLiveDownloads();
    const interval = setInterval(fetchLiveDownloads, 60_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const totalDownloads = useMemo(
    () => projects.reduce((acc, p) => acc + p.downloads, 0),
    [projects]
  );

  const platformTotals = useMemo(() => {
    const totals: Record<string, number> = {
      curseforge: 0,
      modrinth: 0,
      gamejolt: 0,
      itch: 0,
      github: 0,
      web: 0,
    };
    projects.forEach((p) => {
      p.links.forEach((l) => {
        if (totals[l.platform] !== undefined) {
          totals[l.platform] += l.initialDownloads || 0;
        } else {
          totals[l.platform] = l.initialDownloads || 0;
        }
      });
    });
    return totals;
  }, [projects]);

  return (
    <LiveStatsContext.Provider
      value={{
        projects,
        totalDownloads,
        portfolioViews,
        platformTotals,
        projectViewsMap,
        incrementProjectViews,
        incrementDownloadLink,
        getProjectViews,
        isLiveUpdating,
      }}
    >
      {children}
    </LiveStatsContext.Provider>
  );
};

export const useLiveStats = () => useContext(LiveStatsContext);
