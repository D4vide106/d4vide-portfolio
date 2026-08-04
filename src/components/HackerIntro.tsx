"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./HackerIntro.module.css";
import { FiTerminal } from "react-icons/fi";

const introLines = [
  "Initialize boot sequence...",
  "Loading kernel modules [OK]",
  "Mounting root filesystem [OK]",
  "Starting network interface [OK]",
  "Establishing secure connection to server...",
  "Bypassing firewall protocols...",
  "[WARNING] Intrusion detected in sector 7G",
  "Deploying counter-measures...",
  "Decrypting master password: [********]",
  "Access Granted.",
  "Welcome back, D4vide106."
];

export default function HackerIntro() {
  const [started, setStarted] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  
  // We'll use a very short base64 string for a beep, but a safer approach 
  // is just using the standard AudioContext to generate a beep dynamically!
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(440 + Math.random() * 200, audioCtx.currentTime); // random pitch
      
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio not supported or blocked");
    }
  };
  
  const playSuccess = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {}
  };

  const handleStart = () => {
    setStarted(true);
    // play an initial blank sound to unlock audio context in some browsers
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtx.resume();
    } catch (e) {}
  };

  useEffect(() => {
    if (!started || finished) return;

    if (currentLineIdx < introLines.length) {
      const line = introLines[currentLineIdx];
      
      // Delay before showing next line
      const delay = currentLineIdx === introLines.length - 2 ? 1200 : Math.random() * 300 + 100;
      
      const timer = setTimeout(() => {
        setLines(prev => [...prev, line]);
        setCurrentLineIdx(prev => prev + 1);
        
        if (currentLineIdx === introLines.length - 2) {
          playSuccess(); // "Access Granted"
        } else {
          playBeep();
        }
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      // Finished all lines, wait 1.5s then fade out
      const finishTimer = setTimeout(() => {
        setFinished(true);
      }, 1500);
      return () => clearTimeout(finishTimer);
    }
  }, [started, currentLineIdx, finished]);

  if (finished) return null; // Component removes itself from DOM after finishing

  return (
    <div className={`${styles.introContainer} ${started ? styles.started : ''}`}>
      {!started ? (
        <button className={styles.startBtn} onClick={handleStart}>
          <FiTerminal size={24} />
          Initialize System
        </button>
      ) : (
        <div className={styles.terminalWindow}>
          {lines.map((line, i) => (
            <div key={i} className={
              line.includes("WARNING") ? styles.warnLine :
              line.includes("Granted") ? styles.successLine :
              styles.normalLine
            }>
              {line}
            </div>
          ))}
          <span className={styles.cursor}>_</span>
        </div>
      )}
    </div>
  );
}
