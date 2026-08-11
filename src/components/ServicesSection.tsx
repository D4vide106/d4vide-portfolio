"use client";

import { 
  SiDiscord, 
  SiGithub, 
  SiPython, 
  SiReact, 
  SiTypescript, 
  SiNextdotjs,
  SiOpenjdk
} from "react-icons/si";
import { 
  FiCheckCircle, 
  FiArrowUpRight, 
  FiGlobe, 
  FiTerminal, 
  FiZap, 
  FiExternalLink,
  FiCode,
  FiCpu
} from "react-icons/fi";
import styles from "./ServicesSection.module.css";
import { 
  LABS_DOMAINS, 
  EXTERNAL_PROJECTS, 
  LabDomain 
} from "@/data/servicesData";

export default function ServicesSection({ dict }: { dict?: any }) {
  const getDomainIcon = (iconType: string) => {
    switch (iconType) {
      case "discord": return <SiDiscord className={styles.discordIcon} />;
      case "plugin": return <FiCode className={styles.pluginIcon} />;
      case "web": return <FiGlobe className={styles.webIcon} />;
      case "system": return <FiTerminal className={styles.systemIcon} />;
      default: return <FiCpu />;
    }
  };

  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        
        {/* ── Section Title Header ───────────────────────────────── */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <FiZap size={13} />
            <span>{dict?.tag || "CREATOR LABS & SOFTWARE"}</span>
          </div>
          <h2 className={styles.sectionTitle}>
            {dict?.title || "Discord Bots, Software & Extra Projects"}
          </h2>
          <p className={styles.sectionSubtitle}>
            {dict?.subtitle || "Explore software engineering capabilities beyond Minecraft: custom Discord bots, plugin architecture, modern web development, and backend automation."}
          </p>
        </div>

        {/* ── 1. The 4 Software & Labs Domains Grid ────────────── */}
        <div className={styles.servicesGrid}>
          {LABS_DOMAINS.map((domain) => (
            <div key={domain.id} className={styles.serviceCard}>
              <div className={styles.cardTopHeader}>
                <div className={styles.iconBox}>
                  {getDomainIcon(domain.iconType)}
                </div>
                <span className={styles.pillBadge}>{domain.badge}</span>
              </div>

              <div className={styles.cardMainInfo}>
                <span className={styles.categoryTag}>{domain.category}</span>
                <h3 className={styles.cardTitle}>{domain.title}</h3>
                <p className={styles.cardDesc}>{domain.description}</p>
              </div>

              {/* Capability Checklist */}
              <ul className={styles.featureList}>
                {domain.capabilities.map((cap, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <FiCheckCircle className={styles.checkIcon} />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack */}
              <div className={styles.techTags}>
                {domain.techStack.map((tech, idx) => (
                  <span key={idx} className={styles.techTag}>#{tech}</span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className={styles.cardActions}>
                {domain.discordUrl && (
                  <a href={domain.discordUrl} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                    <SiDiscord size={15} />
                    <span>{dict?.contactDiscord || "Join Discord Server"}</span>
                  </a>
                )}
                {domain.githubUrl && (
                  <a href={domain.githubUrl} target="_blank" rel="noreferrer" className={styles.btnSecondary}>
                    <SiGithub size={14} />
                    <span>GitHub Profile</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── 2. External Projects Showcase Grid ───────────────── */}
        <div className={styles.externalSection}>
          <div className={styles.externalHeader}>
            <h3 className={styles.externalTitle}>
              {dict?.externalTitle || "External Software & Projects Showcase"}
            </h3>
          </div>

          <div className={styles.externalGrid}>
            {EXTERNAL_PROJECTS.map((ext) => (
              <div key={ext.id} className={styles.extCard}>
                <div className={styles.extCardHeader}>
                  <img src={ext.iconUrl} alt={ext.title} className={styles.extIcon} />
                  <div>
                    <span className={styles.extCategory}>{ext.category}</span>
                    <h4 className={styles.extTitle}>{ext.title}</h4>
                  </div>
                </div>

                <p className={styles.extDesc}>{ext.description}</p>

                <div className={styles.techTags}>
                  {ext.tags.map((t, idx) => (
                    <span key={idx} className={styles.techTag}>#{t}</span>
                  ))}
                </div>

                <a 
                  href={ext.linkUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.btnSecondary}
                  style={{ justifyContent: "space-between", marginTop: "0.5rem" }}
                >
                  <span>{ext.linkLabel}</span>
                  <FiExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
