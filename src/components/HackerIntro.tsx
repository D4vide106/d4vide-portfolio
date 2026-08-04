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
  "      ___",
  "   .-'   '-.",
  "  /         \\",
  "  |  O   O  |",
  "  |    _    |",
  "  \\  '-'-'  /",
  "   '-.   .-'",
  "      '--'",
  "SYSTEM COMPROMISED.",
  "Access Granted.",
  "Welcome back, Administrator D4vide106."
];

export default function HackerIntro() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
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
    if (finished) return;

    if (currentLineIdx < introLines.length) {
      const line = introLines[currentLineIdx];
      
      // Calculate delay to make the whole sequence ~7.5 seconds
      // Total lines = 27. Average delay = 7500 / 27 = ~270ms. 
      // We'll make ASCII art faster, and other lines a bit slower.
      let delay = 250;
      if (line.includes("0x") || line.includes("___") || line.includes("|") || line.includes("\\") || line.includes("/")) {
        delay = 40; // Super fast for hashes and ASCII
      } else if (line.includes("Access Granted") || line.includes("Welcome back")) {
        delay = 800; // Pause for dramatic effect
      } else {
        delay = 150 + Math.random() * 200; 
      }
      
      const timer = setTimeout(() => {
        setLines(prev => [...prev, line]);
        setCurrentLineIdx(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Finished all lines, wait 1.5s then fade out
      const finishTimer = setTimeout(() => {
        setFinished(true);
      }, 1500);
      return () => clearTimeout(finishTimer);
    }
  }, [currentLineIdx, finished]);

  if (finished) return null;

  return (
    <div className={styles.introContainer}>
      {/* 
        Using a fast typing / hacker sound effect from a public sound library. 
        Note: Autoplay might be blocked by browser. 
      */}
      <audio 
        ref={audioRef}
        src="https://www.soundjay.com/mechanical/sounds/typewriter-1.mp3" 
        loop
        autoPlay 
      />
      
      <div className={styles.terminalWindow}>
        {lines.map((line, i) => (
          <div key={i} className={
            line.includes("WARNING") || line.includes("COMPROMISED") ? styles.warnLine :
            line.includes("Granted") || line.includes("Welcome back") ? styles.successLine :
            line.includes("0x") ? styles.hashLine :
            line.includes("___") || line.includes("|") || line.includes("\\") || line.includes("/") || line.includes("'-") ? styles.asciiLine :
            styles.normalLine
          }>
            {/* Preserve spaces for ASCII art */}
            <pre style={{ margin: 0, fontFamily: 'inherit' }}>{line}</pre>
          </div>
        ))}
        <span className={styles.cursor}>_</span>
      </div>
    </div>
  );
}
