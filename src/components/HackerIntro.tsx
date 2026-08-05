"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./HackerIntro.module.css";
import { FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const introLines = [
  "Wake up...",
  "The Matrix has you...",
  "Follow the white rabbit.",
  "--------------------------------------------------",
  "Initializing boot sequence [OK]",
  "Loading kernel modules [OK]",
  "Mounting root filesystem [OK]",
  "Establishing secure connection to proxy 192.168.1.104...",
  "Bypassing firewall protocols... [SUCCESS]",
  "Injecting payload into mainframe...",
  "0x19AF 0x2BCC 0x3DDE 0x4EEF 0x5F11 0x6A22 0x7B33",
  "0x8C44 0x9D55 0xAE66 0xBF77 0xC088 0xD199 0xE2AA",
  "Decrypting master password: [********]",
  "[TRIGGER_UNAUTH]", // First failure
  "Attempting bruteforce on secondary port...",
  "0x9A12 0xBC34 0xDE56 0xF078 0x129A 0x34BC",
  "Bypassing node A-14...",
  "Decrypting master password: [********]",
  "[TRIGGER_UNAUTH]", // Second failure
  "Initiating deep override... [OVERDRIVE MODE]",
  "Bypassing node B-99...",
  "Bypassing node C-12...",
  "Decrypting mainframe...",
  "SYSTEM COMPROMISED."
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function HackerIntro() {
  const [lines, setLines] = useState<string[]>([]);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [finished, setFinished] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasRun = useRef(false);

  // Full Original Hacker Terminal Sequence
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function runSequence() {
      for (const line of introLines) {
        if (line === "[TRIGGER_UNAUTH]") {
          setShowUnauthorized(true);
          await sleep(600);
          setShowUnauthorized(false);
          setLines((prev) => [...prev, "[WARNING] ACCESS DENIED."]);
          continue;
        }

        let delay = 180;
        if (line.includes("0x") || line.includes("node") || line.includes("Decrypting")) {
          delay = 35;
        } else if (line.includes("SYSTEM COMPROMISED")) {
          delay = 400;
        } else {
          delay = 90 + Math.random() * 100;
        }

        setLines((prev) => [...prev, line]);
        await sleep(delay);
      }

      await sleep(200);
      setShowAccessGranted(true);
      await sleep(1800);
      setFinished(true);
    }

    runSequence();
  }, []);

  // Lightning Spark / Glitch Dot Matrix Canvas (Random lightning bursts, no circles, no mouse follow)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const gap = 20;
    const cols = Math.floor(width / gap);
    const rows = Math.floor(height / gap);

    const render = () => {
      ctx.fillStyle = "rgba(5, 5, 5, 0.25)";
      ctx.fillRect(0, 0, width, height);

      const sparkCount = 35 + Math.floor(Math.random() * 40);
      for (let s = 0; s < sparkCount; s++) {
        const i = Math.floor(Math.random() * cols);
        const j = Math.floor(Math.random() * rows);
        const x = i * gap;
        const y = j * gap;

        const isLightningStrike = Math.random() > 0.85;
        const radius = isLightningStrike ? 2 + Math.random() * 2.5 : 1 + Math.random();
        const opacity = isLightningStrike ? 0.9 : Math.random() * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isLightningStrike ? `#ffffff` : `rgba(200, 220, 255, ${opacity})`;
        ctx.fill();

        if (isLightningStrike && Math.random() > 0.6) {
          const targetX = x + (Math.random() * 80 - 40);
          const targetY = y + (Math.random() * 80 - 40);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(targetX, targetY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.7})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (finished) return null;

  return (
    <div className={styles.introOverlay}>
      <canvas ref={canvasRef} className={styles.lightningCanvas} />

      <div className={styles.terminalWindow}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              !line
                ? styles.normalLine
                : line.includes("WARNING") || line.includes("COMPROMISED") || line.includes("DENIED")
                ? styles.warnLine
                : line.includes("0x")
                ? styles.hashLine
                : styles.normalLine
            }
          >
            {line}
          </div>
        ))}
        {!showAccessGranted && !showUnauthorized && <span className={styles.cursor}>_</span>}
      </div>

      {(showAccessGranted || showUnauthorized) && <div className={styles.overlayDarken}></div>}

      {showUnauthorized && (
        <div className={styles.unauthorizedPopup}>
          <FaExclamationTriangle className={styles.alertIcon} />
          <div className={styles.popupText}>SYSTEM ACCESS DENIED</div>
        </div>
      )}

      {showAccessGranted && (
        <div className={styles.accessPopup}>
          <FaCheckCircle className={styles.successIcon} />
          <div className={styles.popupText}>SYSTEM COMPROMISED</div>
        </div>
      )}
    </div>
  );
}



