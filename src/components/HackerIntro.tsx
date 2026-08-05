"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./HackerIntro.module.css";
import { FiVolume2, FiArrowRight } from "react-icons/fi";

export default function HackerIntro() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio API Procedural Cyber Synth (Guaranteed audio playback without external dependency issues)
  const initAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Deep Sub Synth Drone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
      gain1.gain.setValueAtTime(0.01, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 1.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();

      // Atmospheric Sine Pulse
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110, ctx.currentTime);
      gain2.gain.setValueAtTime(0.01, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();

      // High futuristic chime on start
      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "sine";
      chime.frequency.setValueAtTime(880, ctx.currentTime);
      chime.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
      chimeGain.gain.setValueAtTime(0.2, ctx.currentTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start();
      chime.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log("Audio Context Error:", e);
    }
  };

  const handleStart = () => {
    if (!started) {
      initAudio();
      setStarted(true);
    }
  };

  // Progress Bar Simulation
  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setFinished(true), 600);
          return 100;
        }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [started]);

  // Dot Matrix Canvas Animation (Image 5 cipher style)
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

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const gap = 24;
    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const cols = Math.floor(width / gap);
      const rows = Math.floor(height / gap);
      const startX = (width - cols * gap) / 2;
      const startY = (height - rows * gap) / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = startX + i * gap;
          const y = startY + j * gap;

          // Wave equation creating dynamic dot matrix intensity matching Image 5
          const distToMouse = Math.hypot(x - mouseX, y - mouseY);
          const distToCenter = Math.hypot(x - width / 2, y - height / 2);
          const wave = Math.sin(distToCenter * 0.015 - time) * Math.cos(distToMouse * 0.01 - time * 0.8);
          
          const dotRadius = Math.max(0.8, (wave + 1.2) * 1.5);
          const alpha = Math.min(0.95, Math.max(0.1, (wave + 1) * 0.4 + (distToMouse < 180 ? (1 - distToMouse / 180) * 0.5 : 0)));

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (finished) return null;

  return (
    <div className={`${styles.introOverlay} ${started && progress === 100 ? styles.fadeOut : ""}`}>
      <canvas ref={canvasRef} className={styles.dotCanvas} />

      {!started ? (
        <div className={styles.startContainer}>
          <div className={styles.brandTitle}>cīphər // d4vīdē</div>
          <div className={styles.subtitle}>CREATIVE GAMING & SYSTEM DESIGN</div>

          <button className={styles.enterBtn} onClick={handleStart}>
            <FiVolume2 className={styles.soundIcon} />
            <span>ENTER EXPERIENCE</span>
            <FiArrowRight className={styles.arrowIcon} />
          </button>
        </div>
      ) : (
        <div className={styles.loadingContainer}>
          <div className={styles.centerLogo}>cīphər</div>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressText}>{progress}%</div>
        </div>
      )}
    </div>
  );
}

