"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./DraggableTerminal.module.css";
import { FiTerminal, FiX, FiMinus, FiSquare } from "react-icons/fi";
import { SiDiscord, SiGithub, SiYoutube } from "react-icons/si";

const terminalText = [
  "C:\\Users\\D4vide106> ./fetch_system_status.sh",
  "Status: ONLINE 🟢",
  "Uptime: 99.99%",
  "",
  "C:\\Users\\D4vide106> ./list_links.sh",
  "Available Quick Links:",
  "1. [GitHub] -> https://github.com/D4vide106",
  "2. [YouTube] -> https://youtube.com/@d4vide106",
  "3. [Discord] -> https://discord.gg/7T3u9a9",
  "",
  "C:\\Users\\D4vide106> _"
];

export default function DraggableTerminal() {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initial animation logic
  useEffect(() => {
    if (currentLineIndex >= terminalText.length) return;

    const line = terminalText[currentLineIndex];
    if (currentCharIndex < line.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
        setTypedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = "";
          }
          newLines[currentLineIndex] = line.slice(0, currentCharIndex + 1);
          return newLines;
        });
      }, Math.random() * 20 + 5);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, line === "" ? 100 : 300);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && terminalRef.current) {
      const terminalWidth = terminalRef.current.offsetWidth;
      const terminalHeight = terminalRef.current.offsetHeight;
      
      let newX = e.clientX - dragStartPos.current.x;
      let newY = e.clientY - dragStartPos.current.y;
      
      // Boundaries
      newX = Math.max(0, Math.min(newX, window.innerWidth - terminalWidth));
      newY = Math.max(0, Math.min(newY, window.innerHeight - terminalHeight));
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const renderLine = (line: string, i: number) => {
    if (line.includes("[GitHub]")) {
      return <span>1. [<a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" style={{color: '#0ea5e9'}}>GitHub</a>] - <SiGithub style={{display: 'inline', verticalAlign: 'middle'}}/></span>;
    }
    if (line.includes("[YouTube]")) {
      return <span>2. [<a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" style={{color: '#0ea5e9'}}>YouTube</a>] - <SiYoutube style={{display: 'inline', verticalAlign: 'middle'}} color="#ff0000"/></span>;
    }
    if (line.includes("[Discord]")) {
      return <span>3. [<a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" style={{color: '#0ea5e9'}}>Discord</a>] - <SiDiscord style={{display: 'inline', verticalAlign: 'middle'}} color="#5865F2"/></span>;
    }
    return line;
  };

  return (
    <div 
      ref={terminalRef}
      className={styles.terminalContainer} 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div 
        className={styles.terminalHeader} 
        onMouseDown={handleMouseDown}
      >
        <div className={styles.headerLeft}>
          <FiTerminal className={styles.termIcon} />
          <span>Windows PowerShell - Control Center</span>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.controlBtn}><FiMinus /></button>
          <button className={styles.controlBtn}><FiSquare /></button>
          <button className={`${styles.controlBtn} ${styles.closeBtn}`}><FiX /></button>
        </div>
      </div>
      <div className={styles.terminalBody}>
        {typedLines.map((line, i) => (
          <div key={i} className={styles.terminalLine}>
            {renderLine(line, i)}
            {i === currentLineIndex && <span className={styles.cursor}>█</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
