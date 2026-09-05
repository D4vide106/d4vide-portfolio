"use client";

import React, { useState } from "react";
import { SiDiscord, SiGithub, SiYoutube, SiCurseforge, SiModrinth, SiItchdotio } from "react-icons/si";
import { FiCopy, FiCheck, FiArrowUpRight } from "react-icons/fi";
import styles from "./Contact.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const isItalian = lang === "it";
  const discordUsername = "d4vide106";

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(discordUsername);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const SECONDARY_LINKS = [
    { label: "YouTube", handle: "@d4vide106", url: "https://youtube.com/@d4vide106", icon: SiYoutube, color: "#ff453a" },
    { label: "GitHub", handle: "D4vide106", url: "https://github.com/D4vide106", icon: SiGithub, color: "#ffffff" },
    { label: "CurseForge", handle: "d4vide106", url: "https://www.curseforge.com/members/d4vide106/projects", icon: SiCurseforge, color: "#f16436" },
    { label: "Modrinth", handle: "D4vide106", url: "https://modrinth.com/user/D4vide106", icon: SiModrinth, color: "#1bd96a" },
    { label: "Itch.io", handle: "d4vide106", url: "https://d4vide106.itch.io", icon: SiItchdotio, color: "#fa5c5c" },
  ];

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        {/* Header Title */}
        <div className={styles.headerWrap}>
          <span className={styles.sectionBadge}>
            {isItalian ? "CONTATTI & COMMUNITY" : "GET IN TOUCH & COMMUNITY"}
          </span>
          <h2 className={styles.sectionTitle}>
            {isItalian ? "Parliamo del prossimo progetto" : "Let's connect & build together"}
          </h2>
          <p className={styles.sectionDesc}>
            {isItalian
              ? "Che tu voglia proporre una collaborazione, richiedere supporto o semplicemente unirti alla community, ecco come puoi trovarmi."
              : "Whether you want to collaborate on a project, join the community, or simply chat, here is where you can find me."}
          </p>
        </div>

        {/* Highlighted Discord Card */}
        <div className={styles.discordCard}>
          <div className={styles.discordTopRow}>
            <div className={styles.discordProfileInfo}>
              <div className={styles.discordIconBox}>
                <SiDiscord />
              </div>
              <div className={styles.discordDetails}>
                <span className={styles.discordRole}>
                  {isItalian ? "DISCORD UFFICIALE" : "OFFICIAL DISCORD"}
                </span>
                <span className={styles.discordUsername}>@{discordUsername}</span>
                <div className={styles.discordStatusRow}>
                  <span className={styles.onlineDot} />
                  <span>{isItalian ? "Attivo su Discord & Community" : "Active on Discord & Community"}</span>
                </div>
              </div>
            </div>

            <div className={styles.discordActionsRow}>
              <button onClick={handleCopyDiscord} className={styles.copyBtn} title="Copia username Discord">
                {copied ? <FiCheck color="#22c55e" size={15} /> : <FiCopy size={15} />}
                <span>{copied ? (isItalian ? "Copiato!" : "Copied!") : (isItalian ? "Copia Tag" : "Copy Username")}</span>
              </button>

              <a
                href="https://discord.gg/7T3u9a9"
                target="_blank"
                rel="noreferrer"
                className={styles.joinServerBtn}
              >
                <span>{isItalian ? "Unisciti al Server" : "Join Server"}</span>
                <FiArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Secondary Links Grid */}
        <div className={styles.linksGrid}>
          {SECONDARY_LINKS.map((link) => {
            const IconComp = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={styles.linkCard}
              >
                <IconComp className={styles.linkIcon} style={{ color: link.color }} />
                <div className={styles.linkTextGroup}>
                  <span className={styles.linkLabel}>{link.label}</span>
                  <span className={styles.linkHandle}>{link.handle}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
