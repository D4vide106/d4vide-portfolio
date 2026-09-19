"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SiTiktok, SiYoutube } from "react-icons/si";
import { FiArrowUpRight, FiVolume2, FiVolumeX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { resolveAssetUrl } from "@/data/projectsData";
import styles from "./OurWork.module.css";

export interface WorkItem {
  id: string;
  title: string;
  server?: string;
  category: "TikTok" | "Shorts";
  views: string;
  href: string;
  videoUrl: string;
  fallbackVideoUrl?: string;
  posterUrl: string;
  featured?: boolean;
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: "tt-slip-and-drift",
    title: "SLIP & DRIFT • Drift Physics",
    server: "@d4vide106",
    category: "TikTok",
    views: "20.6K",
    href: "https://www.tiktok.com/@d4vide106/video/7685559777451101472",
    videoUrl: "/videos/tiktok/slip-and-drift.mp4",
    posterUrl: "/videos/tiktok/slip-and-drift.jpg",
    featured: true,
  },
  {
    id: "tt-boss-rpg-ignis",
    title: "Project: Boss RPG • Ignis Boss 🔥",
    server: "Minecraft Modpack",
    category: "TikTok",
    views: "26.1K",
    href: "https://www.tiktok.com/@d4vide106/video/7438210380779752736",
    videoUrl: "/videos/tiktok/boss-rpg-ignis.mp4",
    posterUrl: "/videos/tiktok/boss-rpg-ignis.jpg",
  },
  {
    id: "tt-sdob",
    title: "Spiral Dungeon of Babel • Backrooms?",
    server: "@d4vide106",
    category: "TikTok",
    views: "2.7K",
    href: "https://www.tiktok.com/@d4vide106/video/7667237797316807958",
    videoUrl: "/videos/tiktok/sdob.mp4",
    posterUrl: "/videos/tiktok/sdob.jpg",
  },
  {
    id: "tt-minecraft-ai",
    title: "Minecraft House WITH AI??",
    server: "@d4vide106",
    category: "TikTok",
    views: "2.3K",
    href: "https://www.tiktok.com/@d4vide106/video/7609025952693226774",
    videoUrl: "/videos/tiktok/minecraft-ai-house.mp4",
    posterUrl: "/videos/tiktok/minecraft-ai-house.jpg",
  },
];

interface WorkCardProps {
  item: WorkItem;
  isSectionVisible: boolean;
}

function WorkCard({ item, isSectionVisible }: WorkCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Monitor visibility in viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldPlay = isSectionVisible && isInView;

  // Handle autoplay when in view (always muted)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <a
      ref={cardRef}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.cardLink} ${item.featured ? styles.featuredCard : ""}`}
      draggable="false"
      title={`${item.title} (${item.views} views) — Guarda su ${item.category}`}
    >
      <div className={styles.cardContainer}>
        {/* Poster Image */}
        <img
          src={resolveAssetUrl(item.posterUrl)}
          alt={item.title}
          loading="lazy"
          className={`${styles.posterImage} ${isLoaded ? styles.posterHidden : ""}`}
          draggable="false"
        />

        {/* Real Video Element */}
        <video
          ref={videoRef}
          src={resolveAssetUrl(item.videoUrl)}
          className={styles.videoElement}
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoaded(true)}
          onError={(e) => {
            if (item.fallbackVideoUrl && e.currentTarget.src !== item.fallbackVideoUrl) {
              e.currentTarget.src = item.fallbackVideoUrl;
            }
          }}
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className={styles.cardOverlay} />

        {/* Platform Badge */}
        <div className={styles.platformBadge}>
          {item.category === "TikTok" ? <SiTiktok size={10} /> : <SiYoutube size={10} />}
          <span>{item.category}</span>
        </div>
      </div>

      {/* Meta Text below Card */}
      <div className={styles.cardMeta}>
        <span className={styles.viewsText}>{item.views}</span>
        <span className={styles.serverText}>
          <span>{item.server || item.title}</span>
          <FiArrowUpRight className={styles.openIcon} />
        </span>
      </div>
    </a>
  );
}

export default function OurWork({ dict: propDict }: { dict?: any }) {
  const { dict: contextDict } = useLanguage();
  const dict = contextDict.work || propDict || {};

  const sectionRef = useRef<HTMLElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  // Repeated items to provide seamless continuous ribbon
  const trackItems = [...WORK_ITEMS, ...WORK_ITEMS];

  // Observe section visibility with strict threshold: 0 to pause immediately when offscreen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      { threshold: 0 }
    );

    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) {
        setIsSectionVisible(false);
      } else if (el) {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsSectionVisible(inView);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className={styles.workSection}>
      <div className={styles.container}>
        {/* Header (EnderClub Style) */}
        <div className={styles.headerWrapper}>
          <h2 className={styles.sectionTitle}>{dict.title || "I miei video"}</h2>
          <p className={styles.sectionSubtitle}>
            {dict.subtitle ||
              "Una selezione dei miei migliori video, trailer e progetti."}
          </p>
        </div>

        {/* Continuous Seamless Infinite Marquee Stage */}
        <div className={styles.carouselStage}>
          {/* Side Fade Gradient Masks */}
          <div className={styles.fadeMaskLeft} />
          <div className={styles.fadeMaskRight} />

          {/* Infinite Dual Track */}
          <div className={styles.marqueeTrackWrap}>
            <div className={`${styles.marqueeTrack} ${!isSectionVisible ? styles.marqueePaused : ""}`}>
              {trackItems.map((item, idx) => (
                <WorkCard
                  key={`track1-${item.id}-${idx}`}
                  item={item}
                  isSectionVisible={isSectionVisible}
                />
              ))}
            </div>
            <div className={`${styles.marqueeTrack} ${!isSectionVisible ? styles.marqueePaused : ""}`} aria-hidden="true">
              {trackItems.map((item, idx) => (
                <WorkCard
                  key={`track2-${item.id}-${idx}`}
                  item={item}
                  isSectionVisible={isSectionVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
