"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import styles from "./DraggableTerminal.module.css";
import { FiTerminal } from "react-icons/fi";
import { SiDiscord, SiGithub, SiYoutube } from "react-icons/si";

export default function DraggableTerminal() {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const [userPrompt, setUserPrompt] = useState("C:\\Users\\Visitor>");

  // Detect visitor OS/Device for dynamic visitor terminal path
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      if (ua.includes("Win")) {
        setUserPrompt("C:\\Users\\Visitor>");
      } else if (ua.includes("Mac")) {
        setUserPrompt("visitor@macbook:~$");
      } else if (ua.includes("Linux")) {
        setUserPrompt("visitor@linux:~$");
      } else {
        setUserPrompt("visitor@d4vide106:~$");
      }
    }
  }, []);

  const terminalText = useMemo(() => [
    `${userPrompt} ./fetch_system_status.sh`,
    "Status: ONLINE 🟢",
    "Uptime: 99.99%",
    "",
    `${userPrompt} ./list_links.sh`,
    "Available Quick Links:",
    "1. [GitHub] -> https://github.com/D4vide106",
    "2. [YouTube] -> https://youtube.com/@d4vide106",
    "3. [Discord] -> https://discord.gg/7T3u9a9",
    "",
    `${userPrompt} _`
  ], [userPrompt]);

  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Initial typewriter animation logic
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
      }, Math.random() * 30 + 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, line === "" ? 100 : 300);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, terminalText]);

  const isDraggingRef = useRef(false);
  const positionRef = useRef(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !terminalRef.current) return;

    const terminalWidth = terminalRef.current.offsetWidth;
    const terminalHeight = terminalRef.current.offsetHeight;

    let newX = e.clientX - dragStartPos.current.x;
    let newY = e.clientY - dragStartPos.current.y;

    newX = Math.max(0, Math.min(newX, window.innerWidth - terminalWidth));
    newY = Math.max(80, Math.min(newY, window.innerHeight - terminalHeight));

    positionRef.current = { x: newX, y: newY };
    terminalRef.current.style.left = `${newX}px`;
    terminalRef.current.style.top = `${newY}px`;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      setPosition(positionRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const renderLine = (line: string, i: number) => {
    if (!line) return <span key={i}></span>;
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
    <>
      {/* Minimized Bottom-Left Dock Badge */}
      {isMinimized && (
        <button 
          className={styles.minimizedDockBadge}
          onClick={() => setIsMinimized(false)}
          title="Restore CMD Terminal"
        >
          <span className={styles.greenPulseDot}></span>
          <FiTerminal className={styles.dockTermIcon} />
          <span>Terminal — Control Center</span>
        </button>
      )}

      {/* Main Draggable CMD Window */}
      {!isMinimized && (
        <div 
          ref={terminalRef}
          className={`${styles.terminalContainer} ${isMaximized ? styles.maximizedContainer : ""}`} 
          style={isMaximized ? {} : { left: `${position.x}px`, top: `${position.y}px` }}
        >
          <div 
            className={styles.terminalHeader} 
            onMouseDown={handleMouseDown}
          >
            <div className={styles.macTrafficLights}>
              <span 
                className={`${styles.trafficDot} ${styles.dotRed}`} 
                onClick={() => setIsMinimized(true)} 
                title="Close" 
              />
              <span 
                className={`${styles.trafficDot} ${styles.dotYellow}`} 
                onClick={() => setIsMinimized(true)} 
                title="Minimize" 
              />
              <span 
                className={`${styles.trafficDot} ${styles.dotGreen}`} 
                onClick={() => setIsMaximized(!isMaximized)} 
                title={isMaximized ? "Restore" : "Maximize"} 
              />
            </div>
            <div className={styles.headerTitle}>
              <FiTerminal className={styles.termIcon} />
              <span>Terminal — Control Center</span>
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
      )}
    </>
  );
}
