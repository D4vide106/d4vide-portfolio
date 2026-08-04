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
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function HackerIntro() {
  const [lines, setLines] = useState<string[]>([]);
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [finished, setFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Guard against strict mode double execution
  const hasRun = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked by browser."));
    }

    if (hasRun.current) return;
    hasRun.current = true;

    // Preload SFX
    const errSound = new Audio("https://actions.google.com/sounds/v1/alarms/dosimeter_alarm.ogg");
    errSound.volume = 0.6;
    const okSound = new Audio("https://actions.google.com/sounds/v1/science_fiction/power_up.ogg");
    okSound.volume = 0.7;

    async function runSequence() {
      for (const line of introLines) {
        if (line === "[TRIGGER_UNAUTH]") {
          setShowUnauthorized(true);
          errSound.currentTime = 0;
          errSound.play().catch(() => {});
          await sleep(800);
          setShowUnauthorized(false);
          setLines(prev => [...prev, "[WARNING] ACCESS DENIED."]);
          continue;
        }

        let delay = 250;
        if (line.includes("0x") || line.includes("node") || line.includes("Decrypting mainframe")) {
          delay = 40; 
        } else if (line.includes("SYSTEM COMPROMISED")) {
          delay = 500; 
        } else {
          delay = 100 + Math.random() * 150; 
        }

        setLines(prev => [...prev, line]);
        await sleep(delay);
      }

      // Finish sequence
      await sleep(300);
      okSound.play().catch(() => {});
      setShowAccessGranted(true);
      await sleep(2500);
      
      if (audioRef.current) audioRef.current.pause();
      setFinished(true);
    }

    runSequence();
  }, []);

  if (finished) return null;

  return (
    <div className={styles.introContainer}>
      <div className={styles.scanlines}></div>
      <audio 
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/foley/typing_on_a_typewriter.ogg" 
        loop
        autoPlay 
      />
      
      <div className={styles.terminalWindow}>
        {lines.map((line, i) => (
          <div key={i} className={
            !line ? styles.normalLine :
            line.includes("WARNING") || line.includes("COMPROMISED") || line.includes("DENIED") ? styles.warnLine :
            line.includes("0x") ? styles.hashLine :
            styles.normalLine
          }>
            {line}
          </div>
        ))}
        {!showAccessGranted && !showUnauthorized && <span className={styles.cursor}>_</span>}
      </div>

      {(showAccessGranted || showUnauthorized) && (
        <div className={styles.overlayDarken}></div>
      )}

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
