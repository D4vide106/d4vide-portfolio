"use client";

import React, { useState, useEffect, useRef } from "react";
import { SiTiktok } from "react-icons/si";
import {
  FiArrowUpRight,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiEye,
} from "react-icons/fi";
import { resolveAssetUrl } from "@/data/projectsData";
import styles from "./TikTokVideoWidget.module.css";

export interface VideoItem {
  id: string;
  title: string;
  views: string;
  url: string;
  videoUrl: string;
  posterUrl: string;
  hashtags: string[];
}

const VIDEOS: VideoItem[] = [
  {
    id: "v-slip-and-drift",
    title: "SLIP & DRIFT • Drift Physics",
    views: "16.5K",
    url: "https://www.tiktok.com/@d4vide106/video/7685559777451101472",
    videoUrl: "/videos/tiktok/slip-and-drift.mp4",
    posterUrl: "/videos/tiktok/slip-and-drift.jpg",
    hashtags: ["#Roblox", "#Drifting", "#SlipAndDrift"],
  },
  {
    id: "v-sdob",
    title: "Spiral Dungeon of Babel • SDoB",
    views: "34.5K",
    url: "https://modrinth.com/modpack/spiral-dungeon-of-babel",
    videoUrl: "/videos/my-work/sdob.mp4",
    posterUrl: "/videos/my-work/sdob.jpg",
    hashtags: ["#Minecraft", "#Mod", "#SDoB"],
  },
  {
    id: "v-boss-rpg-ignis",
    title: "Project: Boss RPG • Ignis Boss 🔥",
    views: "26.1K",
    url: "https://www.tiktok.com/@d4vide106/video/7438210380779752736",
    videoUrl: "/videos/tiktok/boss-rpg-ignis.mp4",
    posterUrl: "/videos/tiktok/boss-rpg-ignis.jpg",
    hashtags: ["#BossRPG", "#MinecraftModpack", "#RPG"],
  },
  {
    id: "v-infinitysmart",
    title: "InfinitySmart Survival SMP",
    views: "52.3K",
    url: "https://discord.gg/f8kP4WsVSW",
    videoUrl: "/videos/my-work/infinitysmart.mp4",
    posterUrl: "/videos/my-work/infinitysmart.jpg",
    hashtags: ["#MinecraftServer", "#SMP", "#Crossplay"],
  },
  {
    id: "v-minecraft-ai",
    title: "Minecraft House WITH AI",
    views: "14.2K",
    url: "https://www.tiktok.com/@d4vide106/video/7609025952693226774",
    videoUrl: "/videos/tiktok/minecraft-ai-house.mp4",
    posterUrl: "/videos/tiktok/minecraft-ai-house.jpg",
    hashtags: ["#MinecraftAI", "#Building", "#Viral"],
  },
  {
    id: "v-stiamo-tornando",
    title: "Stiamo Tornando! • Official",
    views: "28.4K",
    url: "https://youtube.com/@d4vide106",
    videoUrl: "/videos/my-work/stiamo-tornando.mp4",
    posterUrl: "/videos/my-work/stiamo-tornando.jpg",
    hashtags: ["#D4vide106", "#ContentCreator", "#Teaser"],
  },
];

export default function TikTokVideoWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentVideo = VIDEOS[currentIndex];

  // Viewport intersection observer to play/pause when in view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView && isPlaying) {
      video.play().catch(() => {
        // Fallback to muted autoplay if browser blocks audio
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [isInView, isPlaying, currentIndex]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 800);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const prevVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? VIDEOS.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const nextVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === VIDEOS.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  return (
    <div className={styles.widgetCard} ref={containerRef}>
      {/* Widget Header */}
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitle}>
          <SiTiktok className={styles.ttIcon} />
          <span>TIKTOK & SHORTS</span>
        </div>
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

      {/* Video Player Stage */}
      <div className={styles.videoStage} onClick={togglePlay}>
        {/* Story Progress Indicators at Top */}
        <div className={styles.progressBars}>
          {VIDEOS.map((v, idx) => (
            <div
              key={v.id}
              className={`${styles.progressBarTrack} ${idx === currentIndex ? styles.activeTrack : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
                setIsPlaying(true);
              }}
            >
              <div
                className={styles.progressBarFill}
                style={{
                  width: idx < currentIndex ? "100%" : idx === currentIndex ? "100%" : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Real HTML5 Video Element */}
        <video
          ref={videoRef}
          key={currentVideo.id}
          src={resolveAssetUrl(currentVideo.videoUrl)}
          poster={resolveAssetUrl(currentVideo.posterUrl)}
          className={styles.videoElement}
          playsInline
          muted={isMuted}
          loop
          preload="auto"
        />

        {/* Dark Vignette Gradients */}
        <div className={styles.vignetteTop} />
        <div className={styles.vignetteBottom} />

        {/* Central Play/Pause Pulse Icon */}
        <div
          className={`${styles.centerPlayBadge} ${showPlayIcon || !isPlaying ? styles.visiblePlayBadge : ""}`}
        >
          {isPlaying ? <FiPause size={28} /> : <FiPlay size={28} style={{ marginLeft: 3 }} />}
        </div>

        {/* Navigation Arrows */}
        <button
          className={styles.navArrowLeft}
          onClick={prevVideo}
          aria-label="Video precedente"
          title="Precedente"
        >
          <FiChevronLeft size={20} />
        </button>

        <button
          className={styles.navArrowRight}
          onClick={nextVideo}
          aria-label="Video successivo"
          title="Successivo"
        >
          <FiChevronRight size={20} />
        </button>

        {/* Compact Mute / Unmute Button */}
        <button
          className={styles.muteButton}
          onClick={toggleMute}
          title={isMuted ? "Attiva audio" : "Silenzia audio"}
          aria-label={isMuted ? "Attiva audio" : "Silenzia audio"}
        >
          {isMuted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
        </button>

        {/* Bottom Metadata Overlay */}
        <div className={styles.bottomMeta}>
          <div className={styles.creatorRow}>
            <span className={styles.creatorHandle}>@d4vide106</span>
            <FiCheckCircle size={12} className={styles.verifiedIcon} />
            <span className={styles.viewsBadge}>
              <FiEye size={11} /> {currentVideo.views}
            </span>
          </div>

          <h4 className={styles.videoTitle}>{currentVideo.title}</h4>

          <div className={styles.hashtagsRow}>
            {currentVideo.hashtags.map((tag, i) => (
              <span key={i} className={styles.hashtagPill}>
                {tag}
              </span>
            ))}
          </div>

          <a
            href={currentVideo.url}
            target="_blank"
            rel="noreferrer"
            className={styles.watchOnTikTokBtn}
            onClick={(e) => e.stopPropagation()}
          >
            <span>Guarda su TikTok</span>
            <FiArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
