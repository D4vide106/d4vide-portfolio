"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MAIN_PROJECTS, UnifiedProject } from "@/data/projectsData";

const COUNTER_NS = "d4vide106-portfolio";
const BASE_SITE_VIEWS = 28500; // base offset to add to API count

interface LiveStatsContextType {
  projects: UnifiedProject[];
  totalDownloads: number;
  portfolioViews: number;
  projectViewsMap: Record<string, number>;
  incrementProjectViews: (projectId: string) => void;
  getProjectViews: (projectId: string) => number;
  isLiveUpdating: boolean;
}

const LiveStatsContext = createContext<LiveStatsContextType>({
  projects: MAIN_PROJECTS,
  totalDownloads: MAIN_PROJECTS.reduce((acc, p) => acc + p.downloads, 0),
  portfolioViews: BASE_SITE_VIEWS,
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
  const [portfolioViews, setPortfolioViews] = useState<number>(BASE_SITE_VIEWS);
  const [projectViewsMap, setProjectViewsMap] = useState<Record<string, number>>({});
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(false);

  // ── Portfolio views (real, session-deduplicated) ─────────────
  useEffect(() => {
    async function trackPortfolioView() {
      const SESSION_KEY = "d4v_session_counted";
      const already = sessionStorage.getItem(SESSION_KEY);

      if (!already) {
        // First visit this session → increment global counter
        sessionStorage.setItem(SESSION_KEY, "1");
        const count = await counterUp("site-views");
        if (count !== null) {
          setPortfolioViews(BASE_SITE_VIEWS + count);
        }
      } else {
        // Already counted this session → just read current value
        const count = await counterGet("site-views");
        if (count !== null) {
          setPortfolioViews(BASE_SITE_VIEWS + count);
        }
      }
    }

    trackPortfolioView();

    // Refresh portfolio views every 30s (live updates from other visitors)
    const interval = setInterval(async () => {
      const count = await counterGet("site-views");
      if (count !== null) setPortfolioViews(BASE_SITE_VIEWS + count);
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  // ── Project views (real, per-project, session-deduplicated) ──
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

      // Fetch current counts for all projects in parallel (read-only)
      const entries = await Promise.all(
        Object.entries(BASE_VIEWS).map(async ([id, base]) => {
          const count = await counterGet(`pv-${id}`);
          return [id, base + (count ?? 0)] as [string, number];
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
    const SESSION_KEY = `d4v_pv_${projectId}`;
    const already = sessionStorage.getItem(SESSION_KEY);

    let newCount: number;

    if (!already) {
      sessionStorage.setItem(SESSION_KEY, "1");
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
      newCount = (BASE_VIEWS[projectId] ?? 1000) + (apiCount ?? 0);
    } else {
      // Already counted → just bump the local display (+1 for UX)
      newCount = (projectViewsMap[projectId] ?? 1000) + 1;
    }

    setProjectViewsMap((prev) => ({ ...prev, [projectId]: newCount }));
  };

  const getProjectViews = (projectId: string) => {
    return projectViewsMap[projectId] ?? 1250;
  };

  // ── Live download fetching (Modrinth + CurseForge via proxy) ──
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
                    if (typeof d.downloads === "number") liveCount = d.downloads;
                  }
                } catch {}
              } else if (link.cfPath) {
                try {
                  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.cfwidget.com/${link.cfPath}`)}`;
                  let res = await fetch(proxyUrl);
                  if (!res.ok) res = await fetch(`https://api.cfwidget.com/${link.cfPath}`);
                  if (res.ok) {
                    const d = await res.json();
                    if (d.downloads?.total) liveCount = d.downloads.total;
                  }
                } catch {}
              }
              // GameJolt / Itch.io: no public API, keep initial value (0 = hidden)

              totalSum += liveCount;
              return { ...link, initialDownloads: liveCount };
            })
          );

          return {
            ...project,
            downloads: Math.max(project.downloads, totalSum),
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

  const totalDownloads = projects.reduce((acc, p) => acc + p.downloads, 0);

  return (
    <LiveStatsContext.Provider
      value={{
        projects,
        totalDownloads,
        portfolioViews,
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
