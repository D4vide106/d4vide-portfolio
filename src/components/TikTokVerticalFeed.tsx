"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiPlay,
  FiPause,
  FiChevronLeft,
  FiChevronRight,
  FiVolume2,
  FiVolumeX,
  FiVolume1,
  FiHeart,
  FiEye,
  FiShare2,
  FiMusic,
  FiCheckCircle,
  FiArrowUpRight,
} from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
import { resolveAssetUrl } from "@/data/projectsData";
import styles from "./TikTokVerticalFeed.module.css";

interface TikTokVideoItem {
  id: string;
  title: string;
  description: string;
  hashtags: string[];
  poster: string;
  likes: string;
  views: string;
  url: string;
  sound: string;
}

const TIKTOK_VIDEOS: TikTokVideoItem[] = [
  {
    id: "tt-slip-drift",
    title: "SLIP & DRIFT • Drift Physics Test 🔥",
    description: "Feel every turn. Responsive car physics, high-speed drifting and multiplayer racing on Roblox!",
    hashtags: ["#RobloxDev", "#SlipAndDrift", "#Racing", "#Roblox"],
    poster: "/images/roblox/slip-and-drift-thumb.png",
    likes: "2.4K",
    views: "18.9K",
    url: "https://www.tiktok.com/@d4vide106",
    sound: "SLIP & DRIFT Theme • @d4vide106",
  },
  {
    id: "tt-sdob",
    title: "Spiral Dungeon of Babel • 100+ Floor Tower ⚔️",
    description: "Explore the tallest dungeon ever created in Minecraft Java & Bedrock! Bosses, traps and endless loot.",
    hashtags: ["#Minecraft", "#SDoB", "#Modpack", "#Gaming"],
    poster: "https://cdn.modrinth.com/data/5Zdqv8rG/22f82f9f215c73845bedc57059c0c8143977d76f.png",
    likes: "4.1K",
    views: "34.5K",
    url: "https://www.tiktok.com/@d4vide106",
    sound: "Dungeon Atmosphere • @d4vide106",
  },
  {
    id: "tt-extreme-obby",
    title: "Extreme Obby! • Hardcore Speedrun ⏱️",
    description: "50+ levels of intense parkour precision. Can you beat the record without falling?",
    hashtags: ["#Roblox", "#Parkour", "#ExtremeObby", "#Speedrun"],
    poster: "/images/roblox/extreme-obby-thumb.png",
    likes: "1.8K",
    views: "14.2K",
    url: "https://www.tiktok.com/@d4vide106",
    sound: "Speedrun Beat • @d4vide106",
  },
  {
    id: "tt-boss-rpg",
    title: "Project: Boss RPG • Custom Boss Battles 🛡️",
    description: "Epic custom bosses, specialized combat gear and questlines. Available on CurseForge and Modrinth.",
    hashtags: ["#CurseForge", "#Modrinth", "#BossRPG", "#MinecraftMods"],
    poster: "https://cdn.modrinth.com/data/6qXHHAYn/365235145c0d9cc2cd208c674761ade3f3d1b825.png",
    likes: "5.6K",
    views: "47.8K",
    url: "https://www.tiktok.com/@d4vide106",
    sound: "Boss Fight Music • @d4vide106",
  },
  {
    id: "tt-dodger-climber",
    title: "Dodger Climber • Vertical Hazards ⛰️",
    description: "Scale challenging vertical cliffs while dodging falling obstacles and testing timing.",
    hashtags: ["#Roblox", "#DodgerClimber", "#Gaming", "#InfinityProjectStudios"],
    poster: "/images/roblox/dodger-climber-thumb.png",
    likes: "1.2K",
    views: "9.7K",
    url: "https://www.tiktok.com/@d4vide106",
    sound: "Mountain Echoes • @d4vide106",
  },
];

const SLIDE_DURATION_MS = 6000;

export default function TikTokVerticalFeed({ dict = {} }: { dict?: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(70);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);

  const activeVideo = TIKTOK_VIDEOS[currentIndex];

  // Advance to next video
  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % TIKTOK_VIDEOS.length);
    setProgress(0);
    elapsedBeforePauseRef.current = 0;
    startTimeRef.current = Date.now();
  };

  // Back to previous video
  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + TIKTOK_VIDEOS.length) % TIKTOK_VIDEOS.length);
    setProgress(0);
    elapsedBeforePauseRef.current = 0;
    startTimeRef.current = Date.now();
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // Like button toggle
  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle auto-advance timer and progress bar
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;
    const remainingTime = Math.max(SLIDE_DURATION_MS - elapsedBeforePauseRef.current, 100);

    // Progress bar animation loop
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      elapsedBeforePauseRef.current = elapsed;
      const pct = Math.min((elapsed / SLIDE_DURATION_MS) * 100, 100);
      setProgress(pct);
    }, 50);

    // Timer trigger to change video
    timerRef.current = setTimeout(() => {
      nextVideo();
    }, remainingTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPlaying]);

  return (
    <div className={styles.tiktokFeedCard}>
      {/* Top Header */}
      <div className={styles.tiktokHeader}>
        <div className={styles.tiktokTitle}>
          <SiTiktok className={styles.tiktokIcon} />
          <span>TIKTOK SHORTS</span>
        </div>
        <a
          href="https://www.tiktok.com/@d4vide106"
          target="_blank"
          rel="noreferrer"
          className={styles.tiktokProfileBtn}
          title="Apri profilo TikTok @d4vide106"
        >
          <span>@d4vide106</span>
          <FiArrowUpRight size={12} />
        </a>
      </div>

      {/* Vertical Video Stage */}
      <div className={styles.videoStage} onClick={togglePlayPause}>
        {/* Story Progress Indicators at Top */}
        <div className={styles.progressBarsContainer}>
          {TIKTOK_VIDEOS.map((v, idx) => {
            let fillWidth = "0%";
            if (idx < currentIndex) fillWidth = "100%";
            else if (idx === currentIndex) fillWidth = `${progress}%`;

            return (
              <div
                key={v.id}
                className={styles.progressBarTrack}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                  setProgress(0);
                  elapsedBeforePauseRef.current = 0;
                }}
              >
                <div className={styles.progressBarFill} style={{ width: fillWidth }} />
              </div>
            );
          })}
        </div>

        {/* Live / Status Pill */}
        <div
          className={styles.statusPill}
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
        >
          <span className={isPlaying ? styles.statusDotPulse : styles.statusDotPaused} />
          <span>{isPlaying ? "AUTOPLAY" : "PAUSA"}</span>
        </div>

        {/* Media Background Preview */}
        <img
          src={resolveAssetUrl(activeVideo.poster)}
          alt={activeVideo.title}
          className={styles.slideImage}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/roblox/slip-and-drift-thumb.png";
          }}
        />

        {/* Dark Vignette Overlay */}
        <div className={styles.vignetteOverlay} />

        {/* Center Play/Pause indicator */}
        <div className={styles.centerPlayOverlay}>
          <div className={`${styles.playPauseCenterBtn} ${!isPlaying ? styles.alwaysVisible : ""}`}>
            {isPlaying ? <FiPause /> : <FiPlay style={{ marginLeft: 3 }} />}
          </div>
        </div>

        {/* Prev & Next Floating Navigation Arrows */}
        <button
          className={styles.navArrowLeft}
          onClick={(e) => {
            e.stopPropagation();
            prevVideo();
          }}
          aria-label="Video precedente"
        >
          <FiChevronLeft size={18} />
        </button>

        <button
          className={styles.navArrowRight}
          onClick={(e) => {
            e.stopPropagation();
            nextVideo();
          }}
          aria-label="Video successivo"
        >
          <FiChevronRight size={18} />
        </button>

        {/* Right Floating Actions Column */}
        <div className={styles.rightActionsCol}>
          <button
            className={styles.actionBtn}
            onClick={(e) => toggleLike(activeVideo.id, e)}
            aria-label="Mi piace"
          >
            <div
              className={styles.actionIconBox}
              style={{
                background: likedMap[activeVideo.id] ? "#ff0050" : undefined,
                borderColor: likedMap[activeVideo.id] ? "#ff0050" : undefined,
              }}
            >
              <FiHeart fill={likedMap[activeVideo.id] ? "#ffffff" : "none"} />
            </div>
            <span className={styles.actionLabel}>
              {likedMap[activeVideo.id] ? "Liked" : activeVideo.likes}
            </span>
          </button>

          <div className={styles.actionBtn}>
            <div className={styles.actionIconBox}>
              <FiEye />
            </div>
            <span className={styles.actionLabel}>{activeVideo.views}</span>
          </div>

          <a
            href={activeVideo.url}
            target="_blank"
            rel="noreferrer"
            className={styles.actionBtn}
            onClick={(e) => e.stopPropagation()}
            aria-label="Condividi su TikTok"
          >
            <div className={styles.actionIconBox}>
              <FiShare2 />
            </div>
            <span className={styles.actionLabel}>TikTok</span>
          </a>
        </div>

        {/* Bottom Meta Information */}
        <div className={styles.bottomMetaArea}>
          <div className={styles.creatorHandleBadge}>
            <span>@d4vide106</span>
            <FiCheckCircle className={styles.verifiedCheck} size={13} />
          </div>
          <div className={styles.videoTitle}>{activeVideo.title}</div>
          <div className={styles.tagsRow}>
            {activeVideo.hashtags.map((tag, i) => (
              <span key={i} className={styles.tagPill}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.soundTrack}>
            <FiMusic size={11} />
            <span>{activeVideo.sound}</span>
          </div>
        </div>
      </div>

      {/* Audio Deck & Volume Controls */}
      <div className={styles.audioDeck}>
        <div className={styles.audioControlLeft}>
          <button
            className={styles.muteBtn}
            onClick={() => setIsMuted((prev) => !prev)}
            title={isMuted ? "Attiva audio" : "Silenzia audio"}
            aria-label="Mute/Unmute audio"
          >
            {isMuted || volume === 0 ? (
              <FiVolumeX />
            ) : volume < 50 ? (
              <FiVolume1 />
            ) : (
              <FiVolume2 />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = Number(e.target.value);
              setVolume(val);
              if (val > 0 && isMuted) setIsMuted(false);
            }}
            className={styles.volumeSlider}
            aria-label="Regola volume audio"
            title={`Volume: ${isMuted ? "0" : volume}%`}
          />
        </div>

        <a
          href="https://www.tiktok.com/@d4vide106"
          target="_blank"
          rel="noreferrer"
          className={styles.deckActionBtn}
        >
          <SiTiktok size={11} />
          <span>SEGUI</span>
        </a>
      </div>
    </div>
  );
}
