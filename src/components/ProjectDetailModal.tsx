"use client";

import React, { useEffect, useState } from "react";
import {
  SiModrinth,
  SiCurseforge,
  SiGamejolt,
  SiItchdotio,
  SiGithub,
  SiRoblox,
} from "react-icons/si";
import {
  FiDownload,
  FiEye,
  FiGlobe,
  FiStar,
  FiUsers,
  FiTag,
  FiExternalLink,
  FiThumbsUp,
  FiThumbsDown,
  FiServer,
  FiCheckCircle,
} from "react-icons/fi";
import { FaCube } from "react-icons/fa";
import { UnifiedProject, resolveAssetUrl } from "@/data/projectsData";
import AnimatedNumber from "./AnimatedNumber";
import styles from "./ProjectDetailModal.module.css";

const PLATFORM_NAMES: Record<string, string> = {
  curseforge: "CurseForge",
  modrinth: "Modrinth",
  gamejolt: "GameJolt",
  itch: "Itch.io",
  roblox: "Roblox",
  github: "GitHub",
  web: "Web",
};

interface ProjectDetailModalProps {
  project: UnifiedProject | null;
  onClose: () => void;
  portfolioViews: number;
  getProjectViews: (id: string) => number;
  incrementDownloadLink: (projectId: string, url: string) => void;
  projectDataDict?: Record<string, { title?: string; description?: string }>;
  modalDict?: any;
}

export default function ProjectDetailModal({
  project,
  onClose,
  portfolioViews,
  getProjectViews,
  incrementDownloadLink,
  projectDataDict = {},
  modalDict = {},
}: ProjectDetailModalProps) {
  const [thumbSrc, setThumbSrc] = useState<string>("");
  const [iconSrc, setIconSrc] = useState<string>("");

  useEffect(() => {
    if (!project) return;
    setThumbSrc(resolveAssetUrl(project.thumbnail_url || project.fallback_thumbnail_url));
    setIconSrc(resolveAssetUrl(project.icon_url || project.fallback_icon_url));

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const isRoblox = project.category === "roblox";
  const pTitle = projectDataDict[project.id]?.title || project.title;
  const pDesc = projectDataDict[project.id]?.description || project.description;
  const robloxStats = project.robloxStats;
  const robloxGameUrl =
    project.links.find((l) => l.url.includes("/games/"))?.url || project.links[0]?.url;

  const groupLinksByPlatform = (p: UnifiedProject) => {
    const groups: Record<string, typeof p.links> = {};
    for (const link of p.links) {
      if (!groups[link.platform]) groups[link.platform] = [];
      groups[link.platform].push(link);
    }
    return groups;
  };

  const grouped = groupLinksByPlatform(project);

  const getPlatformIcon = (platform: string, size = 16) => {
    switch (platform) {
      case "modrinth": return <SiModrinth size={size} />;
      case "curseforge": return <SiCurseforge size={size} />;
      case "gamejolt": return <SiGamejolt size={size} />;
      case "itch": return <SiItchdotio size={size} />;
      case "github": return <SiGithub size={size} />;
      case "web": return <FiExternalLink size={size} />;
      case "roblox": return <SiRoblox size={size} color="#ff3b30" />;
      default: return <FaCube size={size} />;
    }
  };

  // Up/down votes & rating calculations
  const ratingPercent = robloxStats?.ratingPercent ?? 100;
  const upVotes = robloxStats?.upVotes ?? 0;
  const downVotes = robloxStats?.downVotes ?? 0;
  const isPlaying = (robloxStats?.playing ?? 0) > 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* macOS Traffic Lights Header */}
        <div className={styles.modalMacHeader}>
          <div className={styles.modalTrafficLights}>
            <span className={`${styles.trafficDot} ${styles.dotRed}`} onClick={onClose} title="Chiudi" />
            <span className={`${styles.trafficDot} ${styles.dotYellow}`} />
            <span className={`${styles.trafficDot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.macHeaderTitle}>{pTitle}</span>
          <button className={styles.modalCloseBtn} onClick={onClose} aria-label="Close modal">×</button>
        </div>

        {/* 16:9 Widescreen Thumbnail Banner for Roblox Maps */}
        {thumbSrc && (
          <div className={styles.thumbnailBannerWrapper}>
            <img
              src={thumbSrc}
              alt={`${pTitle} thumbnail preview`}
              className={styles.thumbnailBannerImg}
              onError={() => {
                if (project.fallback_thumbnail_url) {
                  const fallback = resolveAssetUrl(project.fallback_thumbnail_url);
                  if (thumbSrc !== fallback) setThumbSrc(fallback);
                }
              }}
            />
            <div className={styles.thumbnailOverlay} />
            <div className={styles.thumbnailBadge}>
              <span className={styles.livePulseDot} />
              <span>{modalDict?.gameplayPreview || "ANTEPRIMA MAPPA"}</span>
            </div>
          </div>
        )}

        {/* Modal Info Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalLogoBox}>
            <img
              src={iconSrc}
              alt={pTitle}
              className={styles.modalLogo}
              onError={() => {
                if (project.fallback_icon_url) {
                  const fallback = resolveAssetUrl(project.fallback_icon_url);
                  if (iconSrc !== fallback) setIconSrc(fallback);
                }
              }}
            />
          </div>
          <div className={styles.modalTitleArea}>
            <span className={`${styles.modalCategoryBadge} ${isRoblox ? styles.robloxModalBadge : ""}`}>
              {isRoblox ? (
                <>
                  <SiRoblox size={11} /> ROBLOX MAP • {project.type.toUpperCase()}
                </>
              ) : (
                project.type.toUpperCase()
              )}
            </span>
            <h2 className={styles.modalTitle}>{pTitle}</h2>

            {/* Official Roblox Studio Card */}
            {isRoblox && robloxStats && (
              <div className={styles.modalCreatorCard}>
                <img
                  src={resolveAssetUrl(robloxStats.groupLogo || "/images/roblox/infinity-group.png")}
                  alt={robloxStats.creatorName}
                  className={styles.creatorGroupAvatar}
                />
                <div className={styles.creatorDetails}>
                  <span className={styles.creatorLabel}>{modalDict?.createdBy || "CREATO DA"}</span>
                  <a
                    href={robloxStats.creatorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.creatorGroupLink}
                  >
                    <strong>{robloxStats.creatorName}</strong> (D4vide106) <FiCheckCircle size={11} color="#64d2ff" />
                  </a>
                </div>
              </div>
            )}

            <p className={styles.modalDesc}>{pDesc}</p>
          </div>
        </div>

        {/* ── REDESIGNED PREMIUM FROSTED STATS CARDS ── */}
        <div className={styles.statsGrid}>
          {isRoblox ? (
            <>
              {/* Card 1: Visite Totali */}
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={`${styles.statIconBadge} ${styles.badgeEmerald}`}>
                    <FiEye size={13} />
                  </span>
                  <span className={styles.statLabel}>{modalDict?.totalVisits || "VISITE TOTALI"}</span>
                </div>
                <div className={styles.statMainValue}>
                  <AnimatedNumber value={project.downloads} />
                </div>
                <div className={styles.statFooterChip}>
                  <span className={styles.subPillGreen}>
                    <span className={styles.microDotLive} />
                    <span>{modalDict?.cumulativeVisits || "Giocate cumulative"}</span>
                  </span>
                </div>
              </div>

              {/* Card 2: Valutazione Community */}
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={`${styles.statIconBadge} ${styles.badgeGold}`}>
                    <FiStar size={13} />
                  </span>
                  <span className={styles.statLabel}>{modalDict?.rating || "VALUTAZIONE"}</span>
                </div>
                <div className={styles.statMainValue}>
                  <span className={styles.statStarIcon}>⭐</span>
                  <span>{ratingPercent}%</span>
                </div>
                <div className={styles.ratingProgressTrack}>
                  <div
                    className={styles.ratingProgressBar}
                    style={{ width: `${Math.min(Math.max(ratingPercent, 0), 100)}%` }}
                  />
                </div>
                <div className={styles.votesRow}>
                  <span className={styles.voteChipPositive}>
                    <FiThumbsUp size={10} /> {upVotes}
                  </span>
                  <span className={styles.voteChipNegative}>
                    <FiThumbsDown size={10} /> {downVotes}
                  </span>
                </div>
              </div>

              {/* Card 3: Giocatori Online & Server */}
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={`${styles.statIconBadge} ${styles.badgeCyan}`}>
                    <FiUsers size={13} />
                  </span>
                  <span className={styles.statLabel}>{modalDict?.activePlayers || "GIOCATORI ONLINE"}</span>
                </div>
                <div className={styles.statMainValue}>
                  <span>{robloxStats?.playing ?? 0}</span>
                </div>
                <div className={styles.statFooterChip}>
                  <span className={styles.serverCapacityChip}>
                    <FiServer size={10} />
                    <span>Capienza: max {robloxStats?.maxPlayers ?? 50} slot</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Card 1: Total Downloads */}
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={`${styles.statIconBadge} ${styles.badgeEmerald}`}>
                    <FiDownload size={13} />
                  </span>
                  <span className={styles.statLabel}>{modalDict?.totalDownloads || "DOWNLOAD TOTALI"}</span>
                </div>
                <div className={styles.statMainValue}>
                  <AnimatedNumber value={project.downloads} />
                </div>
                <div className={styles.statFooterChip}>
                  <span className={styles.subPillGreen}>
                    <span className={styles.microDotLive} />
                    <span>Download verificati</span>
                  </span>
                </div>
              </div>

              {/* Card 2: Project Views */}
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={`${styles.statIconBadge} ${styles.badgeCyan}`}>
                    <FiEye size={13} />
                  </span>
                  <span className={styles.statLabel}>{modalDict?.projectViews || "VISITE PROGETTO"}</span>
                </div>
                <div className={styles.statMainValue}>
                  <AnimatedNumber value={getProjectViews(project.id)} />
                </div>
                <div className={styles.statFooterChip}>
                  <span>Visualizzazioni uniche</span>
                </div>
              </div>

              {/* Card 3: Portfolio Views */}
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <span className={`${styles.statIconBadge} ${styles.badgePurple}`}>
                    <FiGlobe size={13} />
                  </span>
                  <span className={styles.statLabel}>{modalDict?.portfolioViews || "VISITE PORTFOLIO"}</span>
                </div>
                <div className={styles.statMainValue}>
                  <AnimatedNumber value={portfolioViews} />
                </div>
                <div className={styles.statFooterChip}>
                  <span>Traffico globale portfolio</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tags & Specs */}
        {project.tags && project.tags.length > 0 && (
          <div className={styles.modalTagsSection}>
            <div className={styles.sectionLabel}>
              <FiTag size={12} /> {modalDict?.tagsAndSpecs || "TAGS & SPECIFICHE"}
            </div>
            <div className={styles.modalTagsList}>
              {project.tags.map((tag, idx) => (
                <span key={idx} className={styles.modalTagBadge}>#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Platforms / Actions */}
        {isRoblox ? (
          <div className={styles.modalPlatformsSection}>
            <div className={styles.sectionLabel}>
              <FiExternalLink size={12} /> {modalDict?.playOnRoblox || "GIOCA SU ROBLOX"}
            </div>
            <div className={styles.modalRobloxActions}>
              <a
                href={robloxGameUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.robloxPrimaryPlayBtn}
                onClick={() => incrementDownloadLink(project.id, robloxGameUrl)}
              >
                <SiRoblox size={22} />
                <span>{modalDict?.playOnRoblox || "GIOCA ORA SU ROBLOX"}</span>
                <FiExternalLink size={16} />
              </a>

              {robloxStats?.creatorUrl && (
                <a
                  href={robloxStats.creatorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.robloxGroupBtn}
                >
                  <img
                    src={resolveAssetUrl(robloxStats.groupLogo || "/images/roblox/infinity-group.png")}
                    alt="Studio Group"
                    className={styles.groupBtnIcon}
                  />
                  <span>
                    {robloxStats.creatorName} — {modalDict?.visitGroup || "GRUPPO UFFICIALE"}
                  </span>
                  <FiExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.modalPlatformsSection}>
            <div className={styles.sectionLabel}>
              <FiExternalLink size={12} /> {modalDict?.platformsAndDownloads || "PIATTAFORME & DOWNLOAD"}
            </div>
            <div className={styles.platformGroupsGrid}>
              {Object.entries(grouped).map(([platform, links]) => {
                const platformName = PLATFORM_NAMES[platform] || platform;
                const platformTotal = links.reduce((sum, l) => sum + (l.initialDownloads || 0), 0);
                return (
                  <div key={platform} className={styles.platformGroup}>
                    <div className={styles.platformGroupHeader}>
                      <span className={styles.platformGroupIcon}>{getPlatformIcon(platform, 18)}</span>
                      <span className={styles.platformGroupName}>{platformName}</span>
                      {platformTotal > 0 && (
                        <span className={styles.platformGroupTotal}>
                          <FiDownload size={11} /> {platformTotal.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className={styles.platformEditions}>
                      {links.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.editionBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            incrementDownloadLink(project.id, link.url);
                          }}
                        >
                          <span>{link.label.replace(`${platformName} `, "")}</span>
                          {link.initialDownloads !== undefined && link.initialDownloads > 0 && (
                            <span className={styles.editionDownloads}>
                              {link.initialDownloads.toLocaleString()}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
