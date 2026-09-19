"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SiTiktok, SiYoutube } from "react-icons/si";
import {
  FiArrowUpRight,
  FiChevronUp,
  FiChevronDown,
  FiCheckCircle,
  FiEye,
} from "react-icons/fi";
import { resolveAssetUrl } from "@/data/projectsData";
import mediaStatsJson from "@/data/mediaStats.json";
import styles from "./TikTokVideoWidget.module.css";

export interface VideoItem {
  id: string;
  statsKey: string;
  title: string;
  defaultViews: string;
  url: string;
  videoUrl: string;
  posterUrl: string;
  isLandscape?: boolean;
}

// Exactly and ONLY the 4 videos requested by the user
const VIDEOS: VideoItem[] = [
  {
    id: "v-slip-and-drift",
    statsKey: "slip-and-drift",
    title: "SLIP & DRIFT • Drift Physics",
    defaultViews: "20.6K",
    url: "https://www.tiktok.com/@d4vide106/video/7685559777451101472",
    videoUrl: "/videos/tiktok/slip-and-drift.mp4",
    posterUrl: "/videos/tiktok/slip-and-drift.jpg",
  },
  {
    id: "v-boss-rpg-ignis",
    statsKey: "boss-rpg-ignis",
    title: "Project Boss RPG • Ignis Boss 🔥",
    defaultViews: "26.1K",
    url: "https://www.tiktok.com/@d4vide106/video/7438210380779752736",
    videoUrl: "/videos/tiktok/boss-rpg-ignis.mp4",
    posterUrl: "/videos/tiktok/boss-rpg-ignis.jpg",
    isLandscape: true,
  },
  {
    id: "v-sdob",
    statsKey: "sdob",
    title: "Spiral Dungeon of Babel • Backrooms?",
    defaultViews: "2.7K",
    url: "https://www.tiktok.com/@d4vide106/video/7667237797316807958",
    videoUrl: "/videos/tiktok/sdob.mp4",
    posterUrl: "/videos/tiktok/sdob.jpg",
  },
  {
    id: "v-minecraft-ai",
    statsKey: "minecraft-ai-house",
    title: "Minecraft House WITH AI??",
    defaultViews: "2.3K",
    url: "https://www.tiktok.com/@d4vide106/video/7609025952693226774",
    videoUrl: "/videos/tiktok/minecraft-ai-house.mp4",
    posterUrl: "/videos/tiktok/minecraft-ai-house.jpg",
  },
];

export default function TikTokVideoWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [playProgress, setPlayProgress] = useState(0); // 0 to 100%
  const [liveStats, setLiveStats] = useState<Record<string, { formattedViews: string; totalViews: number }>>(
    mediaStatsJson.items || {}
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isWheelingRef = useRef(false);
  const touchStartYRef = useRef(0);

  const currentVideo = VIDEOS[currentIndex];

  // Observe visibility in viewport (strictly pause when offscreen)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting && entry.intersectionRatio > 0;
        setIsInView(inView);
        if (!inView) {
          videoRefs.current.forEach((v) => {
            if (v && !v.paused) v.pause();
          });
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) {
        videoRefs.current.forEach((v) => {
          if (v && !v.paused) v.pause();
        });
      } else if (isInView) {
        const active = videoRefs.current[currentIndex];
        if (active && active.paused) active.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [currentIndex, isInView]);

  // Fetch dynamic live views update from public media_stats or TikTok API
  useEffect(() => {
    async function updateViews() {
      try {
        const res = await fetch("/media_stats.json");
        if (res.ok) {
          const data = await res.json();
          if (data?.items) {
            setLiveStats(data.items);
          }
        }
      } catch {}
    }
    updateViews();
    // Periodically re-check views every 60s
    const interval = setInterval(updateViews, 60000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < VIDEOS.length - 1 ? prev + 1 : 0));
    setPlayProgress(0);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : VIDEOS.length - 1));
    setPlayProgress(0);
  }, []);

  // When currentIndex changes, prepare new video
  useEffect(() => {
    setPlayProgress(0);
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      if (idx === currentIndex) {
        video.muted = true;
        video.currentTime = 0;
        if (isInView) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  // When isInView changes, immediately play or pause without resetting progress
  useEffect(() => {
    const activeVideo = videoRefs.current[currentIndex];
    if (!activeVideo) return;

    if (isInView) {
      activeVideo.muted = true;
      activeVideo.play().catch(() => {});
    } else {
      videoRefs.current.forEach((v) => {
        if (v && !v.paused) v.pause();
      });
    }
  }, [isInView, currentIndex]);

  // Track progress of active playing video for stories bar & automatic advance
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration && !isNaN(video.duration)) {
      const pct = (video.currentTime / video.duration) * 100;
      setPlayProgress(pct);
    }
  };

  // Automatic advance to next video when current video ends
  const handleVideoEnded = () => {
    goToNext();
  };

  // Real vertical wheel scrolling (TikTok feed style)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isWheelingRef.current) return;
      if (Math.abs(e.deltaY) < 18) return;

      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }

      isWheelingRef.current = true;
      setTimeout(() => {
        isWheelingRef.current = false;
      }, 420);
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => stage.removeEventListener("wheel", handleWheel);
  }, [goToNext, goToPrev]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartYRef.current - touchEndY;
    if (Math.abs(deltaY) > 35) {
      if (deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  const handleStageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.closest(`.${styles.progressBarTrack}`)) {
      return;
    }
    if (currentVideo?.url) {
      window.open(currentVideo.url, "_blank", "noopener,noreferrer");
    }
  };

  const currentViews = liveStats[currentVideo.statsKey]?.formattedViews || currentVideo.defaultViews;

  return (
    <div className={styles.widgetCard} ref={containerRef}>
      {/* Widget Header with Direct Links */}
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitle}>
          <SiTiktok className={styles.ttIcon} />
          <span>SHORTS</span>
        </div>
        <div className={styles.headerRightLinks}>
          <a
            href="https://www.youtube.com/@D4vide106/shorts"
            target="_blank"
            rel="noreferrer"
            className={styles.ytShortsLinkBtn}
            title="Apri YouTube Shorts @D4vide106"
          >
            <SiYoutube size={12} color="#ff0033" />
            <span>Shorts</span>
          </a>
          <a
            href="https://www.tiktok.com/@d4vide106"
            target="_blank"
            rel="noreferrer"
            className={styles.profileLinkBtn}
            title="Apri profilo TikTok @d4vide106"
          >
            <span>@d4vide106</span>
            <FiArrowUpRight size={13} />
          </a>
        </div>
      </div>

      {/* Video Player Stage: Real Vertical TikTok Feed (Always playing, clean, click opens video page) */}
      <div
        ref={stageRef}
        className={styles.videoStage}
        onClick={handleStageClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        title={`Apri ${currentVideo.title} su TikTok`}
      >
        {/* Story Progress Indicators at Top (Fills up smoothly as video plays) */}
        <div className={styles.progressBars}>
          {VIDEOS.map((v, idx) => {
            const fillWidth =
              idx < currentIndex ? "100%" : idx === currentIndex ? `${playProgress}%` : "0%";
            return (
              <div
                key={v.id}
                className={`${styles.progressBarTrack} ${idx === currentIndex ? styles.activeTrack : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                  setPlayProgress(0);
                }}
                title={v.title}
              >
                <div
                  className={styles.progressBarFill}
                  style={{
                    width: fillWidth,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Vertical Reel Track (Transitions Up & Down like real TikTok) */}
        <div
          className={styles.videoReelTrack}
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {VIDEOS.map((video, idx) => (
            <div key={video.id} className={styles.videoSlide}>
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={resolveAssetUrl(video.videoUrl)}
                poster={resolveAssetUrl(video.posterUrl)}
                className={`${styles.videoElement} ${video.isLandscape ? styles.landscapeVideo : ""}`}
                playsInline
                muted
                preload="metadata"
                onTimeUpdate={idx === currentIndex ? handleTimeUpdate : undefined}
                onEnded={handleVideoEnded}
              />
            </div>
          ))}
        </div>

        {/* Dark Vignette Gradients */}
        <div className={styles.vignetteTop} />
        <div className={styles.vignetteBottom} />

        {/* Vertical Navigation Arrows (TikTok Style Up / Down) */}
        <div className={styles.verticalNavGroup}>
          <button
            type="button"
            className={styles.navArrowBtn}
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            aria-label="Video precedente"
            title="Video precedente (Scorri su)"
          >
            <FiChevronUp size={18} />
          </button>

          <button
            type="button"
            className={styles.navArrowBtn}
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Video successivo"
            title="Video successivo (Scorri giù)"
          >
            <FiChevronDown size={18} />
          </button>
        </div>

        {/* Clean Bottom Metadata with Real Combined Views */}
        <div className={styles.bottomMeta}>
          <div className={styles.creatorRow}>
            <span className={styles.creatorHandle}>@d4vide106</span>
            <FiCheckCircle size={12} className={styles.verifiedIcon} />
            <span className={styles.viewsBadge}>
              <FiEye size={11} /> {currentViews}
            </span>
          </div>

          <h4 className={styles.videoTitle}>{currentVideo.title}</h4>
        </div>
      </div>
    </div>
  );
}
