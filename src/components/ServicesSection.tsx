"use client";

import { useState } from "react";
import { 
  SiDiscord, 
  SiGithub, 
  SiPython, 
  SiReact, 
  SiTypescript, 
  SiNextdotjs 
} from "react-icons/si";
import { 
  FiCheckCircle, 
  FiArrowUpRight, 
  FiBriefcase, 
  FiGlobe, 
  FiTerminal, 
  FiZap, 
  FiClock, 
  FiDollarSign,
  FiExternalLink
} from "react-icons/fi";
import styles from "./ServicesSection.module.css";
import { 
  SERVICES_LIST, 
  EXTERNAL_PROJECTS, 
  ESTIMATOR_SERVICE_TYPES, 
  ESTIMATOR_COMPLEXITIES, 
  ServiceItem 
} from "@/data/servicesData";

export default function ServicesSection({ dict }: { dict?: any }) {
  const [selectedServiceId, setSelectedServiceId] = useState("discord_bot");
  const [selectedComplexityId, setSelectedComplexityId] = useState("standard");
  const [fastDelivery, setFastDelivery] = useState(false);

  const activeServiceOpt = ESTIMATOR_SERVICE_TYPES.find((s) => s.id === selectedServiceId) || ESTIMATOR_SERVICE_TYPES[0];
  const activeComplexityOpt = ESTIMATOR_COMPLEXITIES.find((c) => c.id === selectedComplexityId) || ESTIMATOR_COMPLEXITIES[0];

  let calculatedPrice = activeServiceOpt.basePrice + activeComplexityOpt.basePrice;
  let calculatedDays = activeServiceOpt.estDays + activeComplexityOpt.estDays;

  if (fastDelivery) {
    calculatedPrice += 15;
    calculatedDays = Math.max(1, Math.round(calculatedDays * 0.6));
  }

  const getServiceIcon = (iconType: string) => {
    switch (iconType) {
      case "discord": return <SiDiscord className={styles.discordIcon} />;
      case "fiverr": return <FiBriefcase className={styles.fiverrIcon} />;
      case "web": return <FiGlobe className={styles.webIcon} />;
      case "system": return <FiTerminal className={styles.systemIcon} />;
      default: return <FiZap />;
    }
  };

  const buildDiscordPrompt = () => {
    const text = encodeURIComponent(
      `Hi D4VIDE106! I'm interested in commissioning a project: ${activeServiceOpt.label} (${activeComplexityOpt.label}). Est Price: ~$${calculatedPrice}.`
    );
    return `https://discord.gg/7T3u9a9?prompt=${text}`;
  };

  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        
        {/* ── Section Title Header ───────────────────────────────── */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionBadge}>
            <FiZap size={13} />
            <span>{dict?.tag || "FREELANCE & EXTERNAL LABS"}</span>
          </div>
          <h2 className={styles.sectionTitle}>
            {dict?.title || "Services, Discord Bots & Extra Projects"}
          </h2>
          <p className={styles.sectionSubtitle}>
            {dict?.subtitle || "Custom software solutions beyond Minecraft: custom Discord bots, Fiverr freelance contracts, modern web applications, and system automation."}
          </p>
        </div>

        {/* ── 1. The 4 Service Pillars Grid ────────────────────── */}
        <div className={styles.servicesGrid}>
          {SERVICES_LIST.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.cardTopHeader}>
                <div className={styles.iconBox}>
                  {getServiceIcon(service.iconType)}
                </div>
                <span className={styles.pillBadge}>{service.badge}</span>
              </div>

              <div className={styles.cardMainInfo}>
                <span className={styles.categoryTag}>{service.category}</span>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.description}</p>
              </div>

              {/* Feature Checklist */}
              <ul className={styles.featureList}>
                {service.features.map((feat, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <FiCheckCircle className={styles.checkIcon} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack */}
              <div className={styles.techTags}>
                {service.techStack.map((tech, idx) => (
                  <span key={idx} className={styles.techTag}>#{tech}</span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className={styles.cardActions}>
                {service.fiverrUrl && (
                  <a href={service.fiverrUrl} target="_blank" rel="noreferrer" className={styles.btnPrimary}>
                    <span>Fiverr Order</span> <FiArrowUpRight size={13} />
                  </a>
                )}
                {service.discordUrl && (
                  <a href={service.discordUrl} target="_blank" rel="noreferrer" className={styles.btnSecondary}>
                    <SiDiscord size={14} />
                    <span>Discord Request</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── 2. Interactive Project Estimator Widget ──────────── */}
        <div className={styles.estimatorContainer}>
          <div className={styles.estimatorHeader}>
            <div className={styles.estimatorTitleGroup}>
              <h3 className={styles.estimatorTitle}>
                {dict?.estimatorTitle || "Project Cost & Time Estimator"}
              </h3>
              <p className={styles.estimatorSubtitle}>
                {dict?.estimatorSubtitle || "Select options to calculate an indicative estimate of timeframe and budget."}
              </p>
            </div>
          </div>

          <div className={styles.estimatorGrid}>
            <div className={styles.optionsCol}>
              
              {/* Option 1: Service Type */}
              <div className={styles.optionBlock}>
                <span className={styles.optionLabel}>1. SELECT SERVICE TYPE</span>
                <div className={styles.buttonGroup}>
                  {ESTIMATOR_SERVICE_TYPES.map((opt) => (
                    <button
                      key={opt.id}
                      className={`${styles.optionBtn} ${selectedServiceId === opt.id ? styles.activeOption : ""}`}
                      onClick={() => setSelectedServiceId(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Complexity Level */}
              <div className={styles.optionBlock}>
                <span className={styles.optionLabel}>2. COMPLEXITY LEVEL</span>
                <div className={styles.buttonGroup}>
                  {ESTIMATOR_COMPLEXITIES.map((opt) => (
                    <button
                      key={opt.id}
                      className={`${styles.optionBtn} ${selectedComplexityId === opt.id ? styles.activeOption : ""}`}
                      onClick={() => setSelectedComplexityId(opt.id)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Express Delivery Toggle */}
              <div 
                className={styles.toggleRow} 
                onClick={() => setFastDelivery(!fastDelivery)}
              >
                <div className={`${styles.checkbox} ${fastDelivery ? styles.checkedBox : ""}`}>
                  {fastDelivery && <FiCheckCircle size={14} />}
                </div>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#ffffff", fontWeight: 600 }}>
                  Priority Express Delivery (+⚡ Fast Track)
                </span>
              </div>

            </div>

            {/* Price & Delivery Calculation Box */}
            <div className={styles.resultCard}>
              <span className={styles.resultHeader}>ESTIMATED INDICATIVE QUOTE</span>
              
              <div className={styles.priceDisplay}>
                <div className={styles.priceAmount}>${calculatedPrice}</div>
                <div className={styles.timeEstimate}>
                  <FiClock style={{ verticalAlign: "middle", marginRight: 4, color: "#64d2ff" }} /> 
                  Est. Delivery: ~{calculatedDays} Days
                </div>
              </div>

              <a 
                href={buildDiscordPrompt()} 
                target="_blank" 
                rel="noreferrer" 
                className={styles.btnPrimary}
                style={{ justifyContent: "center", width: "100%" }}
              >
                <span>Order / Request on Discord</span>
                <FiArrowUpRight size={14} />
              </a>
            </div>

          </div>
        </div>

        {/* ── 3. External Projects Showcase Grid ───────────────── */}
        <div className={styles.externalSection}>
          <div className={styles.externalHeader}>
            <h3 className={styles.externalTitle}>
              {dict?.externalTitle || "External Projects & Tools Showcase"}
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
