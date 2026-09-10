"use client";

import React, { useState, useEffect } from "react";
import { SiDiscord } from "react-icons/si";
import { FiArrowUpRight } from "react-icons/fi";
import styles from "./Contact.module.css";
import { useLanguage } from "@/context/LanguageContext";

interface DiscordPresence {
  status: "online" | "idle" | "dnd" | "offline";
  customStatus?: string;
  avatarUrl: string;
  displayName: string;
  username: string;
}

export default function Contact() {
  const { lang } = useLanguage();
  const isItalian = lang === "it";

  const discordUserId = "768071128999788555";
  const discordUsername = "d4vide106";
  const defaultAvatar = "https://cdn.discordapp.com/avatars/768071128999788555/f622e4ed7e91f9ea6dd476c42ff225fb.png?size=128";

  const [presence, setPresence] = useState<DiscordPresence>({
    status: "online",
    avatarUrl: defaultAvatar,
    displayName: "Davide",
    username: discordUsername,
  });

  // Fetch real-time Discord presence via Lanyard API
  useEffect(() => {
    let isMounted = true;

    async function fetchDiscordPresence() {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data && isMounted) {
            const data = json.data;
            const discordUser = data.discord_user;
            const avatarHash = discordUser.avatar;
            const avatar = avatarHash
              ? `https://cdn.discordapp.com/avatars/${discordUserId}/${avatarHash}.${avatarHash.startsWith("a_") ? "gif" : "png"}?size=128`
              : defaultAvatar;

            const custom = data.activities?.find((a: any) => a.type === 4)?.state;

            setPresence({
              status: data.discord_status || "online",
              customStatus: custom,
              avatarUrl: avatar,
              displayName: discordUser.global_name || "Davide",
              username: discordUser.username || discordUsername,
            });
          }
        }
      } catch (err) {
        // Fallback to default user data
      }
    }

    fetchDiscordPresence();
    const interval = setInterval(fetchDiscordPresence, 15000); // Live poll every 15s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getStatusLabel = () => {
    if (presence.customStatus) return presence.customStatus;
    switch (presence.status) {
      case "dnd":
        return isItalian ? "Non disturbare" : "Do Not Disturb";
      case "idle":
        return isItalian ? "Inattivo su Discord" : "Idle on Discord";
      case "offline":
        return isItalian ? "Offline su Discord" : "Offline on Discord";
      case "online":
      default:
        return isItalian ? "Online su Discord" : "Online on Discord";
    }
  };

  const getStatusColor = () => {
    switch (presence.status) {
      case "dnd":
        return "#f23f43";
      case "idle":
        return "#f0b232";
      case "offline":
        return "#80848e";
      case "online":
      default:
        return "#23a55a";
    }
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerWrap}>
          <span className={styles.sectionBadge}>
            {isItalian ? "CONTATTI & COLLABORAZIONI" : "GET IN TOUCH & COLLAB"}
          </span>
          <h2 className={styles.sectionTitle}>
            {isItalian ? "Parliamo del prossimo progetto" : "Let's connect & build together"}
          </h2>
          <p className={styles.sectionDesc}>
            {isItalian
              ? "Hai un'idea per una mod, vuoi commissionare un datapack o semplicemente fare due chiacchiere? Connettiti direttamente con me su Discord."
              : "Have an idea for a mod, want to commission custom development, or chat? Reach out directly on Discord."}
          </p>
        </div>

        {/* Real-time Discord Profile Card */}
        <div className={styles.discordProfileCard}>
          <div className={styles.profileLeft}>
            <div className={styles.avatarContainer}>
              <img
                src={presence.avatarUrl}
                alt="Davide Discord Avatar"
                className={styles.avatarImg}
                width={72}
                height={72}
                draggable={false}
              />
              <div className={styles.discordIconBadge} title="Discord">
                <SiDiscord size={13} />
              </div>
              <span
                className={styles.activeDot}
                style={{ backgroundColor: getStatusColor(), boxShadow: `0 0 10px ${getStatusColor()}` }}
                title={getStatusLabel()}
              />
            </div>

            <div className={styles.profileInfo}>
              <div className={styles.nameRow}>
                <span className={styles.displayName}>{presence.displayName}</span>
                <span className={styles.usernameTag}>@{presence.username}</span>
              </div>
              <div className={styles.statusRow}>
                <span className={styles.statusPillText}>{getStatusLabel()}</span>
              </div>
            </div>
          </div>

          <div className={styles.profileActions}>
            <a
              href={`https://discord.com/users/${discordUserId}`}
              target="_blank"
              rel="noreferrer"
              className={styles.primaryDiscordBtn}
              draggable={false}
            >
              <SiDiscord size={18} />
              <span>{isItalian ? "Contattami su Discord" : "Message on Discord"}</span>
              <FiArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
