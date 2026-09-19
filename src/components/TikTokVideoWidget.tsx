"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { SiTiktok } from "react-icons/si";
import {
  FiArrowUpRight,
  FiVolume2,
  FiVolume1,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiChevronUp,
  FiChevronDown,
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
  isLandscape?: boolean;
}

// Exactly and ONLY the 4 TikTok videos requested by the user
const VIDEOS: VideoItem[] = [
  {
    id: "v-slip-and-drift",
    title: "SLIP & DRIFT • Drift Physics",
    views: "16.5K",
    url: "https://www.tiktok.com/@d4vide106/video/7685559777451101472",
    videoUrl: "/videos/tiktok/slip-and-drift.mp4",
    posterUrl: "/videos/tiktok/slip-and-drift.jpg",
  },
  {
    id: "v-boss-rpg-ignis",
    title: "Project Boss RPG • Ignis Boss 🔥",
    views: "26.1K",
    url: "https://www.tiktok.com/@d4vide106/video/7438210380779752736",
    videoUrl: "/videos/tiktok/boss-rpg-ignis.mp4",
    posterUrl: "/videos/tiktok/boss-rpg-ignis.jpg",
    isLandscape: true,
  },
  {
    id: "v-sdob",
    title: "Spiral Dungeon of Babel • Backrooms?",
    views: "34.5K",
    url: "https://www.tiktok.com/@d4vide106/video/7667237797316807958",
    videoUrl: "/videos/tiktok/sdob.mp4",
    posterUrl: "/videos/tiktok/sdob.jpg",
  },
  {
    id: "v-minecraft-ai",
    title: "Minecraft House WITH AI??",
    views: "14.2K",
    url: "https://www.tiktok.com/@d4vide106/video/7609025952693226774",
    videoUrl: "/videos/tiktok/minecraft-ai-house.mp4",
    posterUrl: "/videos/tiktok/minecraft-ai-house.jpg",
  },
];

export default function TikTokVideoWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  // Default unmuted volume at comfortable 35% to prevent audio from exploding
  const [volume, setVolume] = useState(0.35);
  const [showPlayBadge, setShowPlayBadge] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isWheelingRef = useRef(false);
  const touchStartYRef = useRef(0);

  const currentVideo = VIDEOS[currentIndex];

  // Observe visibility in viewport
  useEffect(() => {
    const el = containerRef.current;
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

  // Update active video playback and audio
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;

      if (idx === currentIndex) {
        video.muted = isMuted;
        video.volume = volume;
        if (isInView && isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // If browser restricts unmuted autoplay, fallback to muted
              video.muted = true;
              setIsMuted(true);
              video.play().catch(() => {});
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isInView, isPlaying, isMuted, volume]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < VIDEOS.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : VIDEOS.length - 1));
    setIsPlaying(true);
  }, []);

  // Real vertical wheel scrolling on video stage (like TikTok vertical feed)
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

  // Toggle play/pause
  const togglePlay = (e: React.MouseEvent) => {
    // Only toggle if not clicking interactive controls
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input") || target.closest("a")) {
      return;
    }

    const activeVideo = videoRefs.current[currentIndex];
    if (!activeVideo) return;

    if (activeVideo.paused) {
      activeVideo.play().catch(() => {});
      setIsPlaying(true);
    } else {
      activeVideo.pause();
      setIsPlaying(false);
    }

    setShowPlayBadge(true);
    setTimeout(() => setShowPlayBadge(false), 700);
  };

  // Toggle mute / unmute with safe volume level
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const activeVideo = videoRefs.current[currentIndex];
    if (activeVideo) {
      activeVideo.muted = nextMuted;
      if (!nextMuted) {
        const safeVol = volume > 0 ? volume : 0.35;
        activeVideo.volume = safeVol;
        if (volume === 0) setVolume(0.35);
        if (activeVideo.paused) {
          activeVideo.play().catch(() => {});
          setIsPlaying(true);
        }
      }
    }
  };

  // Adjustable volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);

    const activeVideo = videoRefs.current[currentIndex];
    if (newVol > 0) {
      setIsMuted(false);
      if (activeVideo) {
        activeVideo.muted = false;
        activeVideo.volume = newVol;
      }
    } else {
      setIsMuted(true);
      if (activeVideo) {
        activeVideo.muted = true;
      }
    }
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

      {/* Video Player Stage: Real Vertical TikTok Feed */}
      <div
        ref={stageRef}
        className={styles.videoStage}
        onClick={togglePlay}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
              title={v.title}
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

        {/* Clean, Adjustable Volume Control (Prevents Audio Explosion) */}
        <div className={styles.volumeControlWrap} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={styles.volumeBtn}
            onClick={toggleMute}
            title={isMuted ? "Attiva audio" : "Silenzia audio"}
            aria-label={isMuted ? "Attiva audio" : "Silenzia audio"}
          >
            {isMuted || volume === 0 ? (
              <FiVolumeX size={15} />
            ) : volume < 0.5 ? (
              <FiVolume1 size={15} />
            ) : (
              <FiVolume2 size={15} />
            )}
          </button>
          <div className={styles.volumeSliderContainer}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
              title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              aria-label="Regola volume"
            />
            <span className={styles.volumePercentText}>
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
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
                muted={isMuted}
                loop
                preload="metadata"
              />
            </div>
          ))}
        </div>

        {/* Dark Vignette Gradients */}
        <div className={styles.vignetteTop} />
        <div className={styles.vignetteBottom} />

        {/* Central Play/Pause Pulse Icon */}
        <div
          className={`${styles.centerPlayBadge} ${showPlayBadge || !isPlaying ? styles.visiblePlayBadge : ""}`}
        >
          {isPlaying ? <FiPause size={28} /> : <FiPlay size={28} style={{ marginLeft: 3 }} />}
        </div>

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

        {/* Clean Bottom Metadata (No Hashtags, No Watch Button) */}
        <div className={styles.bottomMeta}>
          <div className={styles.creatorRow}>
            <span className={styles.creatorHandle}>@d4vide106</span>
            <FiCheckCircle size={12} className={styles.verifiedIcon} />
            <span className={styles.viewsBadge}>
              <FiEye size={11} /> {currentVideo.views}
            </span>
          </div>

          <h4 className={styles.videoTitle}>{currentVideo.title}</h4>
        </div>
      </div>
    </div>
  );
}
