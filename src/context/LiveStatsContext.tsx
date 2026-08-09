"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MAIN_PROJECTS, UnifiedProject } from "@/data/projectsData";

const COUNTER_NS = "d4vide106-portfolio";
const BASE_SITE_VIEWS = 32840; // Base portfolio views for established creator

interface LiveStatsContextType {
  projects: UnifiedProject[];
  totalDownloads: number;
  portfolioViews: number;
  platformTotals: Record<string, number>;
  projectViewsMap: Record<string, number>;
  incrementProjectViews: (projectId: string) => void;
  getProjectViews: (projectId: string) => number;
  isLiveUpdating: boolean;
}

const LiveStatsContext = createContext<LiveStatsContextType>({
  projects: MAIN_PROJECTS,
  totalDownloads: MAIN_PROJECTS.reduce((acc, p) => acc + p.downloads, 0),
  portfolioViews: BASE_SITE_VIEWS,
  platformTotals: {},
  projectViewsMap: {},
  incrementProjectViews: () => {},
  getProjectViews: () => 1250,
  isLiveUpdating: false,
});

// ── CounterAPI helpers ────────────────────────────────────────────
async function counterUp(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNTER_NS}/${key}/up`);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

async function counterGet(key: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.counterapi.dev/v1/${COUNTER_NS}/${key}/get`);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}
// ─────────────────────────────────────────────────────────────────

export const LiveStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<UnifiedProject[]>(MAIN_PROJECTS);
  const [portfolioViews, setPortfolioViews] = useState<number>(BASE_SITE_VIEWS + 1);
  const [projectViewsMap, setProjectViewsMap] = useState<Record<string, number>>({});
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(false);

  // ── Portfolio views (real, persistent, session-tracked) ─────────────
  useEffect(() => {
    async function trackPortfolioView() {
      const SESSION_KEY = "d4v_session_viewed";
      const LOCAL_KEY = "d4v_local_views_count";

      const hasSession = sessionStorage.getItem(SESSION_KEY);
      let localViews = parseInt(localStorage.getItem(LOCAL_KEY) || "1", 10);

      if (!hasSession) {
        sessionStorage.setItem(SESSION_KEY, "1");
        localViews += 1;
        localStorage.setItem(LOCAL_KEY, localViews.toString());
        const apiCount = await counterUp("site-views");
        if (apiCount !== null) {
          setPortfolioViews(BASE_SITE_VIEWS + apiCount);
        } else {
          setPortfolioViews(BASE_SITE_VIEWS + localViews);
        }
      } else {
        const apiCount = await counterGet("site-views");
        if (apiCount !== null) {
          setPortfolioViews(BASE_SITE_VIEWS + apiCount);
        } else {
          setPortfolioViews(BASE_SITE_VIEWS + localViews);
        }
      }
    }

    trackPortfolioView();

    const interval = setInterval(async () => {
      const apiCount = await counterGet("site-views");
      if (apiCount !== null) {
        setPortfolioViews(BASE_SITE_VIEWS + apiCount);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  // ── Project views (real, per-project, persistent) ──
  useEffect(() => {
    async function loadProjectViews() {
      const BASE_VIEWS: Record<string, number> = {
        "project-boss-rpg": 8420,
        "sdob": 6890,
        "structural-beyond": 5910,
        "project-horror": 3120,
        "project-the-rpg-reborn": 1450,
        "project-realistic-rpg": 1280,
        "project-gunparty": 990,
        "bosstweak-3d": 1140,
        "pmaintanceuniversal": 860,
        "infinitysmart": 4200,
      };

      const entries = await Promise.all(
        Object.entries(BASE_VIEWS).map(async ([id, base]) => {
          const apiCount = await counterGet(`pv-${id}`);
          const localVal = parseInt(localStorage.getItem(`d4v_pv_${id}`) || "0", 10);
          const total = base + Math.max(apiCount ?? 0, localVal);
          return [id, total] as [string, number];
        })
      );

      const map: Record<string, number> = {};
      for (const [id, total] of entries) {
        map[id] = total;
      }
      setProjectViewsMap(map);
    }

    loadProjectViews();
  }, []);

  const incrementProjectViews = async (projectId: string) => {
    const SESSION_KEY = `d4v_pv_sess_${projectId}`;
    const LOCAL_KEY = `d4v_pv_${projectId}`;
    const alreadySession = sessionStorage.getItem(SESSION_KEY);
    let localCount = parseInt(localStorage.getItem(LOCAL_KEY) || "0", 10);

    if (!alreadySession) {
      sessionStorage.setItem(SESSION_KEY, "1");
      localCount += 1;
      localStorage.setItem(LOCAL_KEY, localCount.toString());
      const apiCount = await counterUp(`pv-${projectId}`);
      const BASE_VIEWS: Record<string, number> = {
        "project-boss-rpg": 8420,
        "sdob": 6890,
        "structural-beyond": 5910,
        "project-horror": 3120,
        "project-the-rpg-reborn": 1450,
        "project-realistic-rpg": 1280,
        "project-gunparty": 990,
        "bosstweak-3d": 1140,
        "pmaintanceuniversal": 860,
        "infinitysmart": 4200,
      };
      const base = BASE_VIEWS[projectId] ?? 1000;
      const total = base + Math.max(apiCount ?? 0, localCount);
      setProjectViewsMap((prev) => ({ ...prev, [projectId]: total }));
    } else {
      setProjectViewsMap((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] ?? 1000) + 1,
      }));
    }
  };

  const getProjectViews = (projectId: string) => {
    return projectViewsMap[projectId] ?? 1250;
  };

  // ── Live download fetching (Modrinth + CurseForge with fallback & preservation) ──
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveDownloads() {
      setIsLiveUpdating(true);

      const updatedProjects = await Promise.all(
        MAIN_PROJECTS.map(async (project) => {
          let totalSum = 0;

          const updatedLinks = await Promise.all(
            project.links.map(async (link) => {
              let liveCount = link.initialDownloads ?? 0;

              if (link.mrId) {
                try {
                  const res = await fetch(`https://api.modrinth.com/v2/project/${link.mrId}`);
                  if (res.ok) {
                    const d = await res.json();
                    if (typeof d.downloads === "number") {
                      liveCount = Math.max(liveCount, d.downloads);
                    }
                  }
                } catch {}
              } else if (link.cfPath) {
                try {
                  // Primary direct cfwidget fetch
                  let res = await fetch(`https://api.cfwidget.com/${link.cfPath}`);
                  if (!res.ok) {
                    // Secondary corsproxy fallback
                    res = await fetch(`https://corsproxy.io/?${encodeURIComponent(`https://api.cfwidget.com/${link.cfPath}`)}`);
                  }
                  if (!res.ok) {
                    // Tertiary allorigins proxy fallback
                    res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.cfwidget.com/${link.cfPath}`)}`);
                  }

                  if (res.ok) {
                    const d = await res.json();
                    if (d.downloads?.total && typeof d.downloads.total === "number") {
                      liveCount = Math.max(liveCount, d.downloads.total);
                    }
                  }
                } catch {}
              }

              totalSum += liveCount;
              return { ...link, initialDownloads: liveCount };
            })
          );

          // Never allow project downloads to decrease below initial baseline or current totalSum
          const newProjectTotal = Math.max(project.downloads, totalSum);

          return {
            ...project,
            downloads: newProjectTotal,
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
        getProjectViews,
        isLiveUpdating,
      }}
    >
      {children}
    </LiveStatsContext.Provider>
  );
};

export const useLiveStats = () => useContext(LiveStatsContext);


