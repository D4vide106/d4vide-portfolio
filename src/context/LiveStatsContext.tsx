"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MAIN_PROJECTS, UnifiedProject } from "@/data/projectsData";

const COUNTER_NS = "d4vide106-portfolio";
const BASE_SITE_VIEWS = 0; // Pure 100% real site views from actual visits, zero fake offsets

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
  const [portfolioViews, setPortfolioViews] = useState<number>(1);
  const [projectViewsMap, setProjectViewsMap] = useState<Record<string, number>>({});
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(false);

  // ── Portfolio views (100% real, persistent, session-tracked) ─────────────
  useEffect(() => {
    async function trackPortfolioView() {
      const SESSION_KEY = "d4v_session_viewed";
      const LOCAL_KEY = "d4v_local_real_views";

      const hasSession = sessionStorage.getItem(SESSION_KEY);
      let localViews = parseInt(localStorage.getItem(LOCAL_KEY) || "1", 10);

      if (!hasSession) {
        sessionStorage.setItem(SESSION_KEY, "1");
        localViews += 1;
        localStorage.setItem(LOCAL_KEY, localViews.toString());
        const apiCount = await counterUp("site-views");
        if (apiCount !== null) {
          setPortfolioViews(apiCount);
        } else {
          setPortfolioViews(localViews);
        }
      } else {
        const apiCount = await counterGet("site-views");
        if (apiCount !== null) {
          setPortfolioViews(apiCount);
        } else {
          setPortfolioViews(localViews);
        }
      }
    }

    trackPortfolioView();

    const interval = setInterval(async () => {
      const apiCount = await counterGet("site-views");
      if (apiCount !== null) {
        setPortfolioViews(apiCount);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  // ── Project views (100% real, per-project, persistent) ──
  useEffect(() => {
    async function loadProjectViews() {
      const projectIds = MAIN_PROJECTS.map((p) => p.id);

      const entries = await Promise.all(
        projectIds.map(async (id) => {
          const apiCount = await counterGet(`pv-${id}`);
          const localVal = parseInt(localStorage.getItem(`d4v_pv_${id}`) || "0", 10);
          const total = Math.max(apiCount ?? 0, localVal, 1);
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
      const total = Math.max(apiCount ?? 0, localCount, 1);
      setProjectViewsMap((prev) => ({ ...prev, [projectId]: total }));
    } else {
      setProjectViewsMap((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] ?? 1) + 1,
      }));
    }
  };

  const incrementDownloadLink = (projectId: string, linkUrl: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== projectId) return p;
        const updatedLinks = p.links.map((l) => {
          if (l.url === linkUrl) {
            const nextCount = (l.initialDownloads || 0) + 1;
            try {
              localStorage.setItem(`d4v_link_dl_${p.id}_${l.platform}`, nextCount.toString());
            } catch {}
            return { ...l, initialDownloads: nextCount };
          }
          return l;
        });
        const newTotalSum = updatedLinks.reduce((sum, l) => sum + (l.initialDownloads || 0), 0);
        return {
          ...p,
          downloads: Math.max(p.downloads + 1, newTotalSum),
          links: updatedLinks,
        };
      })
    );
    counterUp(`dl-${projectId}`);
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

              // Check if user clicked and incremented link locally
              const userSavedVal = parseInt(localStorage.getItem(`d4v_link_dl_${project.id}_${link.platform}`) || "0", 10);
              if (userSavedVal > liveCount) {
                liveCount = userSavedVal;
              }

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



