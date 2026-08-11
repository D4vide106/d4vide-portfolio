"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MAIN_PROJECTS, UnifiedProject } from "@/data/projectsData";

const COUNTER_NS = "d4vide106-portfolio-pure-v4";

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

// ── Reliable Global Counter API Helpers with Failover ────────────────────────
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

export const LiveStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<UnifiedProject[]>(MAIN_PROJECTS);
  const [portfolioViews, setPortfolioViews] = useState<number>(1);
  const [projectViewsMap, setProjectViewsMap] = useState<Record<string, number>>({});
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(false);

  // ── 100% PURE REAL PORTFOLIO VIEWS (Starts at 1, increments on real visits) ──
  useEffect(() => {
    let isTracked = false;

    async function initPortfolioViews() {
      if (isTracked) return;
      isTracked = true;

      const DEVICE_KEY = "d4v_port_dev_v4";
      const isDeviceTracked = localStorage.getItem(DEVICE_KEY);

      let localAddon = parseInt(localStorage.getItem("d4v_port_addon_v4") || "0", 10);

      if (!isDeviceTracked) {
        localAddon += 1;
        try {
          localStorage.setItem(DEVICE_KEY, "1");
          localStorage.setItem("d4v_port_addon_v4", localAddon.toString());
        } catch {}

        const apiCount = await counterUp("site-views");
        const total = Math.max(apiCount !== null ? apiCount : localAddon, 1);
        setPortfolioViews(total);
      } else {
        const apiCount = await counterGet("site-views");
        const total = Math.max(apiCount !== null ? apiCount : localAddon, 1);
        setPortfolioViews(total);
      }
    }

    initPortfolioViews();

    // Live polling for cross-visitor view updates
    const interval = setInterval(async () => {
      const apiCount = await counterGet("site-views");
      if (apiCount !== null) {
        setPortfolioViews(apiCount);
      }
    }, 4_000);

    return () => clearInterval(interval);
  }, []);

  // ── 100% PURE REAL PROJECT VIEWS (Starts at 1, increments when visitors view a project) ──
  useEffect(() => {
    async function loadProjectViews() {
      const map: Record<string, number> = {};

      await Promise.all(
        projects.map(async (project) => {
          const localAddon = parseInt(localStorage.getItem(`d4v_pv_addon_v4_${project.id}`) || "0", 10);
          const cloudCount = await counterGet(`pv-${project.id}`);

          const finalViews = Math.max(cloudCount !== null ? cloudCount : localAddon, 1);
          map[project.id] = finalViews;
        })
      );

      setProjectViewsMap(map);
    }

    loadProjectViews();
  }, [projects]);

  // Real-time live increment when a project modal or card is clicked by a visitor
  const incrementProjectViews = async (projectId: string) => {
    const localAddon = parseInt(localStorage.getItem(`d4v_pv_addon_v4_${projectId}`) || "0", 10) + 1;
    try {
      localStorage.setItem(`d4v_pv_addon_v4_${projectId}`, localAddon.toString());
    } catch {}

    const apiCount = await counterUp(`pv-${projectId}`);
    const nextViews = Math.max(apiCount !== null ? apiCount : localAddon, 1);

    setProjectViewsMap((prev) => ({
      ...prev,
      [projectId]: nextViews,
    }));
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
            const currentClicks = parseInt(localStorage.getItem(`d4v_clicks_v4_${p.id}_${l.platform}`) || "0", 10);
            const nextClicks = currentClicks + 1;
            try {
              localStorage.setItem(`d4v_clicks_v4_${p.id}_${l.platform}`, nextClicks.toString());
            } catch {}

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

  // ── Live download fetching (Modrinth + Official CurseForge API + GameJolt + Itch) ──
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

      // Pre-fetch official CurseForge API projects with API Key
      const curseforgeMap: Record<string, number> = {};
      try {
        const cfRes = await fetch("https://api.curseforge.com/v1/mods/search?gameId=432&searchFilter=D4vide106", {
          headers: {
            "x-api-key": "$2a$10$Dn9qGY8YZ6sbf5HnUpG0VOYbTcl1OAeGYri.LUdqUYxfHw8qTyeEi",
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
              const localClicks = parseInt(localStorage.getItem(`d4v_clicks_v4_${project.id}_${link.platform}`) || "0", 10);
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
                    if (!res.ok) {
                      res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.cfwidget.com/${link.cfPath}`)}`);
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
