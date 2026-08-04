"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./HackerIntro.module.css";
import { FaSkullCrossbones } from "react-icons/fa";

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

export default function HackerIntro() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  
  // States for epic popups
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [finished, setFinished] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked by browser."));
    }
  }, []);

  useEffect(() => {
    if (finished || showAccessGranted) return;
    if (showUnauthorized) return; // Pause terminal while UNAUTHORIZED is flashing

    if (currentLineIdx < introLines.length) {
      const line = introLines[currentLineIdx];
      
      if (line === "[TRIGGER_UNAUTH]") {
        setShowUnauthorized(true);
        // Show red popup for 800ms, then hide and proceed
        setTimeout(() => {
          setShowUnauthorized(false);
          setCurrentLineIdx(prev => prev + 1);
          setLines(prev => [...prev, "[WARNING] ACCESS DENIED."]);
        }, 800);
        // Do not return a cleanup function here, otherwise the timer gets canceled immediately when state changes!
        return;
      }
      
      let delay = 250;
      if (line.includes("0x") || line.includes("node") || line.includes("Decrypting mainframe")) {
        delay = 40; 
      } else if (line.includes("SYSTEM COMPROMISED")) {
        delay = 500; 
      } else {
        delay = 100 + Math.random() * 150; 
      }
      
      const timer = setTimeout(() => {
        setLines(prev => [...prev, line]);
        setCurrentLineIdx(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Trigger Access Granted popup!
      const accessTimer = setTimeout(() => {
        setShowAccessGranted(true);
        
        // After 2.5 seconds of showing Access Granted, finish the intro
        setTimeout(() => {
          if (audioRef.current) audioRef.current.pause();
          setFinished(true);
        }, 2500);
      }, 300);
      return () => clearTimeout(accessTimer);
    }
  }, [currentLineIdx, finished, showAccessGranted, showUnauthorized]);

  if (finished) return null;

  return (
    <div className={styles.introContainer}>
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
          UNAUTHORIZED <FaSkullCrossbones style={{ marginLeft: "0.5rem" }} />
        </div>
      )}

      {showAccessGranted && (
        <div className={styles.accessPopup}>
          ACCESS GRANTED
        </div>
      )}
    </div>
  );
}
