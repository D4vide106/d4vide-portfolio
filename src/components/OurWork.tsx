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
    views: "16.5K",
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
    views: "34.5K",
    href: "https://www.tiktok.com/@d4vide106/video/7667237797316807958",
    videoUrl: "/videos/tiktok/sdob.mp4",
    posterUrl: "/videos/tiktok/sdob.jpg",
  },
  {
    id: "tt-minecraft-ai",
    title: "Minecraft House WITH AI??",
    server: "@d4vide106",
    category: "TikTok",
    views: "14.2K",
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
  const [isMuted, setIsMuted] = useState(true);

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

  // Handle autoplay when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented, ensure muted and retry
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      }
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  const toggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && video.paused) {
      video.play().catch(() => {});
    }
  };

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
          muted={isMuted}
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

        {/* Audio Toggle Button */}
        <button
          type="button"
          onClick={toggleSound}
          className={`${styles.soundBtn} ${!isMuted ? styles.soundBtnActive : ""}`}
          aria-label={isMuted ? "Attiva audio" : "Silenzia audio"}
          title={isMuted ? "Attiva audio" : "Silenzia audio"}
        >
          {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
        </button>
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
  const trackRef = useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Triple items for continuous wrap-around feel
  const displayItems = [...WORK_ITEMS, ...WORK_ITEMS, ...WORK_ITEMS];

  // Observe section visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smooth continuous auto-scroll
  useEffect(() => {
    if (!isSectionVisible || isDragging || isHovered) return;

    const track = trackRef.current;
    if (!track) return;

    let animationFrameId: number;

    const step = () => {
      if (track) {
        track.scrollLeft += 0.65;
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 4) {
          track.scrollLeft = track.scrollWidth / 3;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isSectionVisible, isDragging, isHovered]);

  // Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    setStartX(e.pageX - track.offsetLeft);
    setScrollLeftState(track.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Drag Events
  const handleTouchStart = (e: React.TouchEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - track.offsetLeft);
    setScrollLeftState(track.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const track = trackRef.current;
    if (!track) return;
    const x = e.touches[0].pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeftState - walk;
  };

  // Arrow Nav Click Handlers
  const scrollPrev = () => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: -280, behavior: "smooth" });
  };

  const scrollNext = () => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: 280, behavior: "smooth" });
  };

  return (
    <section id="work" ref={sectionRef} className={styles.workSection}>
      <div className={styles.container}>
        {/* Header (EnderClub Style) */}
        <div className={styles.headerWrapper}>
          <div className={styles.pillTag}>
            <span className={styles.pulseDot} />
            <span>{dict.tag || "CREATOR SHOWCASE"}</span>
          </div>
          <h2 className={styles.sectionTitle}>{dict.title || "I miei video"}</h2>
          <p className={styles.sectionSubtitle}>
            {dict.subtitle ||
              "Una selezione dei miei migliori video, trailer e progetti."}
          </p>
        </div>

        {/* Carousel Stage */}
        <div
          className={styles.carouselStage}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            handleMouseUpOrLeave();
          }}
        >
          {/* Side Fade Gradient Masks */}
          <div className={styles.fadeMaskLeft} />
          <div className={styles.fadeMaskRight} />

          {/* Scrollable Track */}
          <div
            ref={trackRef}
            className={`${styles.scrollTrack} ${isDragging ? styles.isDragging : ""}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            onTouchCancel={handleMouseUpOrLeave}
          >
            {displayItems.map((item, idx) => (
              <WorkCard
                key={`${item.id}-${idx}`}
                item={item}
                isSectionVisible={isSectionVisible}
              />
            ))}
          </div>
        </div>

        {/* Navigation Arrows for Convenience */}
        <div className={styles.navButtonsRow}>
          <button
            type="button"
            onClick={scrollPrev}
            className={styles.arrowBtn}
            aria-label="Video precedenti"
            title="Video precedenti"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className={styles.arrowBtn}
            aria-label="Video successivi"
            title="Video successivi"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
