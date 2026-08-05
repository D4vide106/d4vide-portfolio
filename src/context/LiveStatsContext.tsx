"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MAIN_PROJECTS, UnifiedProject } from "@/data/projectsData";

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
  portfolioViews: 28490,
  projectViewsMap: {},
  incrementProjectViews: () => {},
  getProjectViews: () => 1250,
  isLiveUpdating: false,
});

export const LiveStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<UnifiedProject[]>(MAIN_PROJECTS);
  const [portfolioViews, setPortfolioViews] = useState<number>(28490);
  const [projectViewsMap, setProjectViewsMap] = useState<Record<string, number>>({});
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(false);

  // Initialize Portfolio Views and Project Views from localStorage & increment site visits
  useEffect(() => {
    try {
      const storedViews = localStorage.getItem("d4v_portfolio_views");
      let currentViews = storedViews ? parseInt(storedViews, 10) : 28490;
      if (isNaN(currentViews) || currentViews < 28490) currentViews = 28490;
      
      // Increment site view count on initial load
      currentViews += 1;
      localStorage.setItem("d4v_portfolio_views", currentViews.toString());
      setPortfolioViews(currentViews);

      // Load project views
      const storedProjViews = localStorage.getItem("d4v_project_views_map");
      if (storedProjViews) {
        setProjectViewsMap(JSON.parse(storedProjViews));
      } else {
        const initialMap: Record<string, number> = {
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
        localStorage.setItem("d4v_project_views_map", JSON.stringify(initialMap));
        setProjectViewsMap(initialMap);
      }
    } catch (e) {}
  }, []);

  const incrementProjectViews = (projectId: string) => {
    setProjectViewsMap((prev) => {
      const current = prev[projectId] || 1000;
      const updated = current + 1;
      const nextMap = { ...prev, [projectId]: updated };
      try {
        localStorage.setItem("d4v_project_views_map", JSON.stringify(nextMap));
      } catch (e) {}
      return nextMap;
    });

    setPortfolioViews((prev) => {
      const nextViews = prev + 1;
      try {
        localStorage.setItem("d4v_portfolio_views", nextViews.toString());
      } catch (e) {}
      return nextViews;
    });
  };

  const getProjectViews = (projectId: string) => {
    return projectViewsMap[projectId] || 1250;
  };

  // Real-time live download fetching across all project endpoints (Modrinth & CurseForge)
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveStats() {
      setIsLiveUpdating(true);

      const updatedProjects = await Promise.all(
        MAIN_PROJECTS.map(async (project) => {
          let updatedLinksSum = 0;

          const updatedLinks = await Promise.all(
            project.links.map(async (link) => {
              let liveCount = link.initialDownloads || 0;

              if (link.mrId) {
                try {
                  const mrRes = await fetch(`https://api.modrinth.com/v2/project/${link.mrId}`);
                  if (mrRes.ok) {
                    const mrData = await mrRes.json();
                    if (typeof mrData.downloads === "number") {
                      liveCount = mrData.downloads;
                    }
                  }
                } catch (e) {}
              } else if (link.cfPath) {
                try {
                  // Try AllOrigins CORS proxy first, fallback to direct fetch
                  const cfProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://api.cfwidget.com/${link.cfPath}`)}`;
                  let cfRes = await fetch(cfProxyUrl);
                  if (!cfRes.ok) {
                    cfRes = await fetch(`https://api.cfwidget.com/${link.cfPath}`);
                  }
                  if (cfRes.ok) {
                    const cfData = await cfRes.json();
                    if (cfData.downloads && typeof cfData.downloads.total === "number") {
                      liveCount = cfData.downloads.total;
                    }
                  }
                } catch (e) {}
              }

              updatedLinksSum += liveCount;
              return { ...link, initialDownloads: liveCount };
            })
          );

          const finalSum = Math.max(project.downloads, updatedLinksSum);
          return {
            ...project,
            downloads: finalSum,
            links: updatedLinks,
          };
        })
      );

      if (isMounted) {
        setProjects(updatedProjects);
        setIsLiveUpdating(false);
      }
    }

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 60000); // refresh every 60s

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
