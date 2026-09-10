"use client";

import { useState, useEffect } from "react";
import { FiExternalLink, FiCopy, FiCheck, FiGlobe } from "react-icons/fi";
import styles from "./Affiliates.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function Affiliates() {
  const { lang, dict: contextDict } = useLanguage();
  const dict = (contextDict as any).affiliates || {};

  const [assetPrefix, setAssetPrefix] = useState("/d4vide-portfolio");
  const [copiedBisect, setCopiedBisect] = useState(false);

  const handleCopyBisect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText("Projects");
    setCopiedBisect(true);
    setTimeout(() => setCopiedBisect(false), 2200);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname.startsWith("/d4vide-portfolio")) {
        setAssetPrefix("/d4vide-portfolio");
      } else {
        setAssetPrefix("");
      }
    }
  }, []);

  const isItalian = lang === "it";
  const igBannerImg = isItalian
    ? `${assetPrefix}/partners/instant-gaming-banner-it.jpg`
    : `${assetPrefix}/partners/instant-gaming-banner-en.jpg`;

  const igLang = ["it", "en", "es", "fr", "de", "pt"].includes(lang) ? lang : "en";

  return (
    <section id="affiliates" className={styles.affiliatesSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.headerWrap}>
          <span className={styles.sectionBadge}>
            {dict.sectionTag || (isItalian ? "PARTNER UFFICIALI & SERVIZI" : "OFFICIAL PARTNERS & SERVICES")}
          </span>
          <h2 className={styles.sectionTitle}>
            {dict.title || (isItalian ? "Supporta i miei progetti &" : "Support My Projects &")}{" "}
            <span className={styles.gradientText}>
              {dict.titleHighlight || (isItalian ? "Offerte Esclusive" : "Exclusive Deals")}
            </span>
          </h2>
          <p className={styles.sectionDesc}>
            {dict.description ||
              (isItalian
                ? "Acquista giochi, server Minecraft, setup tech o ordina commissioni con i miei link ufficiali. Nessun costo extra e miglior prezzo garantito."
                : "Buy games, Minecraft servers, tech setup or order custom commissions with my official partner links at zero extra cost.")}
          </p>
        </div>

        {/* 2-Column Area: Left (All Partner Cards) + Right (Skyscraper Banner spanning full height) */}
        <div className={styles.affiliatesLayout}>
          {/* Left Column: All Partner Cards */}
          <div className={styles.partnersColumn}>
            {/* 1. BisectHosting Card */}
            <div className={styles.bisectCard}>
              <div className={styles.cardBackdrop}>
                <img
                  src={`${assetPrefix}/partners/bisecthosting-banner.webp`}
                  alt="BisectHosting Official Banner"
                  className={styles.coverImg}
                  draggable={false}
                />
                <div className={styles.overlayGradientBisect} />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.logoRow}>
                  <img
                    src={`${assetPrefix}/partners/bisecthosting-logo-dark.svg`}
                    alt="BisectHosting"
                    className={styles.brandLogoBisect}
                    draggable={false}
                  />
                </div>

                <h3 className={styles.partnerTitle}>
                  {isItalian ? "Game Server Hosting & Server Dedicati 24/7" : "Game Server Hosting & Dedicated Servers 24/7"}
                </h3>

                <p className={styles.partnerDesc}>
                  {dict.bisect?.desc ||
                    (isItalian
                      ? "Server ultra-performanti per Minecraft, Palworld, Rust e oltre 100 giochi con supporto 24/7/365, installazione modpack con 1 click e protezione DDoS. Usa il codice Projects per il 25% di sconto!"
                      : "Ultra-performance servers for Minecraft, Palworld, Rust, and 100+ games with 24/7/365 live support, 1-click modpack install, and DDoS protection. Use code Projects for 25% off!")}
                </p>

                {/* Actions: CTA Button + Sleek Inline Promo Pill */}
                <div className={styles.actionRow}>
                  <a
                    href="https://www.bisecthosting.com/Projects?r=portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaBtnBisect}
                    draggable={false}
                  >
                    <span>{dict.bisect?.cta || (isItalian ? "Attiva 25% OFF & Crea Server" : "Get 25% OFF & Deploy Server")}</span>
                    <FiExternalLink size={16} />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyBisect}
                    className={styles.copyCodePill}
                    title={isItalian ? "Copia codice promozionale" : "Copy promo code"}
                  >
                    {copiedBisect ? <FiCheck size={14} color="#30d158" /> : <FiCopy size={14} />}
                    <span>{copiedBisect ? (isItalian ? "Copiato!" : "Copied!") : (isItalian ? "Codice: Projects (-25%)" : "Code: Projects (-25%)")}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Instant Gaming Card */}
            <div className={styles.instantGamingCard}>
              <div className={styles.cardBackdrop}>
                <img
                  src={igBannerImg}
                  alt="Instant Gaming Official Banner"
                  className={styles.coverImg}
                  draggable={false}
                />
                <div className={styles.overlayGradientIG} />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.logoRow}>
                  <img
                    src={`${assetPrefix}/partners/instant-gaming-logo.svg`}
                    alt="Instant Gaming"
                    className={styles.brandLogoIG}
                    draggable={false}
                  />
                </div>

                <h3 className={styles.partnerTitle}>
                  {isItalian ? "Videogiochi PC, Steam & Console al Miglior Prezzo" : "PC, Steam & Console Games at Best Prices"}
                </h3>

                <p className={styles.partnerDesc}>
                  {dict.instantGaming?.desc ||
                    (isItalian
                      ? "Tutti i tuoi videogiochi per PC, Steam, PlayStation, Xbox e Nintendo al miglior prezzo con consegna digitale istantanea 24/7."
                      : "All your favorite games for PC, Steam, PlayStation, Xbox, and Nintendo at the best price with instant 24/7 digital delivery.")}
                </p>

                <div className={styles.actionRow}>
                  <a
                    href={`https://www.instant-gaming.com/${igLang}/?igr=D4vide106`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ctaBtnIG}
                    draggable={false}
                  >
                    <span>{dict.instantGaming?.cta || (isItalian ? "Scopri le Offerte Giochi" : "Explore Game Deals")}</span>
                    <FiExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Bottom Row: G2A, Amazon, Fiverr (Equal Height & Aligned Buttons) */}
            <div className={styles.bottomRowGrid}>
              {/* G2A Card */}
              <div className={styles.gridCard}>
                <div className={styles.cardBackdrop}>
                  <img
                    src={`${assetPrefix}/partners/g2a-banner.jpg`}
                    alt="G2A Marketplace"
                    className={styles.coverImg}
                    draggable={false}
                  />
                  <div className={styles.overlayGradientSubtle} />
                </div>

                <div className={styles.gridCardContent}>
                  <div className={styles.logoBox}>
                    <img
                      src={`${assetPrefix}/partners/g2a-logo-brand.svg`}
                      alt="G2A"
                      className={styles.brandLogoG2A}
                      draggable={false}
                    />
                  </div>

                  <h4 className={styles.gridCardTitle}>
                    {isItalian ? "Gift Card & Giochi Digitali" : "Gift Cards & Digital Keys"}
                  </h4>

                  <p className={styles.gridCardDesc}>
                    {dict.g2a?.desc ||
                      (isItalian
                        ? "Marketplace globale per chiavi Steam, Xbox, PlayStation, gift card e abbonamenti."
                        : "Global digital marketplace for Steam keys, Xbox, PlayStation, gift cards, and software.")}
                  </p>

                  <div className={styles.gridCardAction}>
                    <a
                      href="https://www.g2a.com/n/d4vide106?gtag=48998ec5f1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.gridCtaBtn} ${styles.btnG2A}`}
                      draggable={false}
                    >
                      <span>{dict.g2a?.cta || (isItalian ? "Visita G2A" : "Visit G2A")}</span>
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Amazon Card */}
              <div className={styles.gridCard}>
                <div className={styles.cardBackdrop}>
                  <img
                    src={`${assetPrefix}/partners/amazon-banner.jpg`}
                    alt="Amazon Gear & Hardware"
                    className={styles.coverImg}
                    draggable={false}
                  />
                  <div className={styles.overlayGradientSubtle} />
                </div>

                <div className={styles.gridCardContent}>
                  <div className={styles.logoBox}>
                    <img
                      src={`${assetPrefix}/partners/amazon-logo-white.svg`}
                      alt="Amazon"
                      className={styles.brandLogoAmazon}
                      draggable={false}
                    />
                  </div>

                  <h4 className={styles.gridCardTitle}>
                    {isItalian ? "Hardware, Setup & Periferiche" : "Hardware, Setup & Peripherals"}
                  </h4>

                  <p className={styles.gridCardDesc}>
                    {dict.amazon?.desc ||
                      (isItalian
                        ? "Acquista componenti PC o qualsiasi prodotto su Amazon: supporti le mie mod gratis!"
                        : "Shop PC hardware or anything on Amazon through these links: supports my work at zero cost!")}
                  </p>

                  <div className={styles.gridCardAction}>
                    <div className={styles.amazonButtonsRow}>
                      <a
                        href="https://www.amazon.it/?tag=projectsdav-21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.gridCtaBtn} ${styles.btnAmazonIt}`}
                        title="Amazon Italia"
                        draggable={false}
                      >
                        <img
                          src={`${assetPrefix}/flags/it.svg`}
                          alt="Italy Flag"
                          className={styles.btnFlagImg}
                          width={18}
                          height={12}
                          draggable={false}
                        />
                        <span>Amazon.it</span>
                        <FiExternalLink size={13} />
                      </a>
                      <a
                        href="https://www.amazon.com/?tag=projectsdaven-20"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.gridCtaBtn} ${styles.btnAmazonGlobal}`}
                        title="Amazon Global (US/International)"
                        draggable={false}
                      >
                        <FiGlobe size={15} className={styles.btnGlobeIcon} />
                        <span>Amazon.com</span>
                        <FiExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fiverr Card */}
              <div className={styles.gridCard}>
                <div className={styles.cardBackdrop}>
                  <img
                    src={`${assetPrefix}/partners/fiverr-banner.jpg`}
                    alt="Fiverr Commissions"
                    className={styles.coverImg}
                    draggable={false}
                  />
                  <div className={styles.overlayGradientSubtle} />
                </div>

                <div className={styles.gridCardContent}>
                  <div className={styles.logoBox}>
                    <img
                      src={`${assetPrefix}/partners/fiverr-logo-white.svg`}
                      alt="Fiverr"
                      className={styles.brandLogoFiverr}
                      draggable={false}
                    />
                  </div>

                  <h4 className={styles.gridCardTitle}>
                    {isItalian ? "Sviluppo Mod & Script su Misura" : "Custom Modding & Scripting"}
                  </h4>

                  <p className={styles.gridCardDesc}>
                    {dict.fiverr?.desc ||
                      (isItalian
                        ? "Vuoi una mod personalizzata, un datapack o uno script per il tuo server? Ordina una commissione."
                        : "Need a tailored datapack, custom mod, or dedicated server scripts? Commission verified 5-star work.")}
                  </p>

                  <div className={styles.gridCardAction}>
                    <a
                      href="https://www.fiverr.com/d4vide106"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.gridCtaBtn} ${styles.btnFiverr}`}
                      draggable={false}
                    >
                      <span>{dict.fiverr?.cta || (isItalian ? "Richiedi un Lavoro" : "Order Commission")}</span>
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Unbordered Skyscraper Banner spanning full height */}
          <aside className={styles.skyscraperAside}>
            <a
              href="https://www.bisecthosting.com/Projects?r=portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.skyscraperBannerLink}
              title="BisectHosting - 25% OFF Promo Code Projects"
              draggable={false}
            >
              <img
                src={`${assetPrefix}/partners/bisect-custom-banner-power.webp`}
                alt="BisectHosting Official Custom Banner - 25% OFF Code Projects"
                className={styles.skyscraperBannerImg}
                draggable={false}
              />
            </a>
          </aside>
        </div>

        {/* Bottom Disclosure */}
        <p className={styles.bottomNote}>
          {dict.disclosure ||
            (isItalian
              ? "Acquistando tramite questi link o commissionando un lavoro sostieni direttamente lo sviluppo di tutte le mie mod e progetti gratuiti, senza alcun costo aggiuntivo. Grazie per il supporto! ❤️"
              : "Purchasing via these partner links or ordering a commission directly funds and supports all my free mods and community projects at zero extra cost. Thank you! ❤️")}
        </p>
      </div>
    </section>
  );
}
