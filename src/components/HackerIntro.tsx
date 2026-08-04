"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./HackerIntro.module.css";

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
  "[WARNING] Intrusion detected in sector 7G",
  "Deploying counter-measures...",
  "Overriding security protocols...",
  "Bypassing node A-14...",
  "Bypassing node B-99...",
  "Bypassing node C-12...",
  "Decrypting mainframe...",
  "SYSTEM COMPROMISED."
];

export default function HackerIntro() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [showAccessGranted, setShowAccessGranted] = useState(false);
  const [finished, setFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Attempt to play audio immediately
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked by browser. User interaction needed."));
    }
  }, []);

  useEffect(() => {
    if (finished || showAccessGranted) return;

    if (currentLineIdx < introLines.length) {
      const line = introLines[currentLineIdx];
      
      let delay = 250;
      if (line.includes("0x") || line.includes("node") || line.includes("Decrypting mainframe")) {
        delay = 50; // Super fast for hashes and nodes
      } else if (line.includes("SYSTEM COMPROMISED")) {
        delay = 500; // Pause for dramatic effect
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
        
        // After 2 seconds of showing Access Granted, finish the intro
        setTimeout(() => {
          setFinished(true);
        }, 2000);
      }, 300);
      return () => clearTimeout(accessTimer);
    }
  }, [currentLineIdx, finished, showAccessGranted]);

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
            line.includes("WARNING") || line.includes("COMPROMISED") ? styles.warnLine :
            line.includes("0x") ? styles.hashLine :
            styles.normalLine
          }>
            {line}
          </div>
        ))}
        {!showAccessGranted && <span className={styles.cursor}>_</span>}
      </div>

      {showAccessGranted && (
        <>
          <div className={styles.overlayDarken}></div>
          <div className={styles.accessPopup}>
            ACCESS GRANTED
          </div>
        </>
      )}
    </div>
  );
}
