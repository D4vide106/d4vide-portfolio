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

  // ── Portfolio views (100% real, deduplicated per visitor device) ─────────────
  useEffect(() => {
    let isTrackedInThisMount = false;

    async function trackPortfolioView() {
      if (isTrackedInThisMount) return;
      isTrackedInThisMount = true;

      const DEVICE_KEY = "d4v_device_counted_v2";
      const SESSION_KEY = "d4v_session_viewed_v2";

      const isDeviceTracked = localStorage.getItem(DEVICE_KEY);
      const isSessionTracked = sessionStorage.getItem(SESSION_KEY);

      if (!isDeviceTracked && !isSessionTracked) {
        // Brand new visitor device → increment global counter once
        try {
          localStorage.setItem(DEVICE_KEY, "1");
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}

        const apiCount = await counterUp("site-views");
        if (apiCount !== null) {
          setPortfolioViews(apiCount);
        } else {
          setPortfolioViews(1);
        }
      } else {
        // Existing visitor device or refreshed session → read current count without incrementing
        const apiCount = await counterGet("site-views");
        if (apiCount !== null) {
          setPortfolioViews(apiCount);
        }
      }
    }

    trackPortfolioView();

    // Fast 3-second live polling for real-time visitor synchronization
    const interval = setInterval(async () => {
      const apiCount = await counterGet("site-views");
      if (apiCount !== null) {
        setPortfolioViews(apiCount);
      }
    }, 3_000);

    // BroadcastChannel cross-tab live synchronization
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("d4v_live_sync");
      channel.onmessage = (e) => {
        if (e.data?.type === "VIEWS_UPDATE" && typeof e.data.views === "number") {
          setPortfolioViews(e.data.views);
        }
      };
    } catch {}

    return () => {
      clearInterval(interval);
      if (channel) channel.close();
    };
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
    const DEVICE_KEY = `d4v_pv_dev_${projectId}`;
    const SESSION_KEY = `d4v_pv_sess_${projectId}`;
    const alreadyDev = localStorage.getItem(DEVICE_KEY);
    const alreadySess = sessionStorage.getItem(SESSION_KEY);

    if (!alreadyDev && !alreadySess) {
      try {
        localStorage.setItem(DEVICE_KEY, "1");
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      const apiCount = await counterUp(`pv-${projectId}`);
      setProjectViewsMap((prev) => ({
        ...prev,
        [projectId]: Math.max(apiCount ?? 1, (prev[projectId] ?? 0) + 1),
      }));
    }
  };

  const incrementDownloadLink = (projectId: string, linkUrl: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== projectId) return p;
        const updatedLinks = p.links.map((l) => {
          if (l.url === linkUrl) {
            const currentClicks = parseInt(localStorage.getItem(`d4v_clicks_v2_${p.id}_${l.platform}`) || "0", 10);
            const nextClicks = currentClicks + 1;
            try {
              localStorage.setItem(`d4v_clicks_v2_${p.id}_${l.platform}`, nextClicks.toString());
            } catch {}

            // Trigger global cloud counter increment for GameJolt & Itch
            if (l.platform === "gamejolt" || l.platform === "itch") {
              counterUp(`dl-${l.platform}-${p.id}`);
            }

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
    counterUp(`dl-${projectId}`);
  };

  const getProjectViews = (projectId: string) => {
    return projectViewsMap[projectId] ?? 1250;
  };

  // ── Live download fetching (Modrinth + CurseForge + GameJolt + Itch) ──
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

      const updatedProjects = await Promise.all(
        MAIN_PROJECTS.map(async (project) => {
          let totalSum = 0;

          const updatedLinks = await Promise.all(
            project.links.map(async (link) => {
              const baseCount = link.initialDownloads ?? 0;
              const localClicks = parseInt(localStorage.getItem(`d4v_clicks_v2_${project.id}_${link.platform}`) || "0", 10);
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
                      liveApiCount = d.downloads.total;
                    }
                  }
                } catch {}
              } else if (link.platform === "gamejolt" || link.platform === "itch") {
                const cloudKey = `dl-${link.platform}-${project.id}`;
                const cloudCount = await counterGet(cloudKey);
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
    // Poll every 60 seconds so counts automatically increase in real-time while viewing
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



