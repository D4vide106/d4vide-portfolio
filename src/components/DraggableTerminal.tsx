"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./DraggableTerminal.module.css";
import { FiTerminal } from "react-icons/fi";
import { SiDiscord, SiGithub, SiYoutube, SiModrinth, SiCurseforge, SiInstagram, SiTiktok } from "react-icons/si";
import { useLiveStats } from "@/context/LiveStatsContext";

interface HistoryItem {
  type: "banner" | "cmd" | "output";
  content?: string | React.ReactNode;
  cmdText?: string;
}

export default function DraggableTerminal({ inlineMode = false }: { inlineMode?: boolean }) {
  const { totalDownloads, portfolioViews, projects } = useLiveStats();
  
  // Default position & state
  const [position, setPosition] = useState({ x: 40, y: 120 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFloating, setIsFloating] = useState(!inlineMode);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [userPrompt, setUserPrompt] = useState("visitor@d4vide106:~$");

  const dragStartPos = useRef({ x: 0, y: 0 });
  const terminalRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const positionRef = useRef(position);

  // 1. Restore Position and Closed State from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedPos = localStorage.getItem("d4v_term_pos_v4");
        if (savedPos) {
          const parsed = JSON.parse(savedPos);
          if (typeof parsed.x === "number" && typeof parsed.y === "number") {
            setPosition(parsed);
            positionRef.current = parsed;
          }
        }
        const savedClosed = localStorage.getItem("d4v_term_closed_v4");
        if (savedClosed === "true") {
          setIsMinimized(true);
        }
      } catch {}

      const ua = navigator.userAgent;
      if (ua.includes("Win")) setUserPrompt("C:\\Users\\Visitor>");
      else if (ua.includes("Mac")) setUserPrompt("visitor@macbook:~$");
      else setUserPrompt("visitor@d4vide106:~$");
    }
  }, []);

  // Update position ref
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Initial welcome banner
  useEffect(() => {
    setHistory([
      {
        type: "banner",
        content: (
          <div style={{ color: "#30d158", marginBottom: "0.5rem" }}>
            <pre style={{ margin: 0, fontSize: "0.68rem", lineHeight: 1.15, fontFamily: "var(--font-mono)", color: "#64d2ff" }}>
{`  ____  _  ___     _____ ____  _____ 
 |  _ \\| || \\ \\   / /_ _|  _ \\| ____|
 | | | | || |\\ \\ / / | || | | |  _|  
 | |_| |__   _\\ V /  | || |_| | |___ 
 |____/   |_|  \\_/  |___|____/|_____|`}
            </pre>
            <div style={{ margin: "0.4rem 0 0.6rem 0", color: "#a1a1a6", fontSize: "0.76rem" }}>
              [D4VIDE106 System OS Kernel v4.2.0] — Type <span style={{ color: "#30d158", fontWeight: 700 }}>help</span> for available commands.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.3rem 0.8rem", fontSize: "0.75rem", background: "rgba(255, 255, 255, 0.04)", padding: "0.6rem 0.8rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#86868b" }}>Status:</span> <span style={{ color: "#30d158", fontWeight: 700 }}>ONLINE 🟢 (99.99% Uptime)</span>
              <span style={{ color: "#86868b" }}>Kernel:</span> <span style={{ color: "#ffffff" }}>Minecraft Modding Core & Custom Engine</span>
              <span style={{ color: "#86868b" }}>Downloads:</span> <span style={{ color: "#64d2ff", fontWeight: 700 }}>{totalDownloads.toLocaleString()} TOTAL</span>
              <span style={{ color: "#86868b" }}>Site Views:</span> <span style={{ color: "#bf5af2", fontWeight: 700 }}>{portfolioViews.toLocaleString()} REALS</span>
            </div>
          </div>
        )
      }
    ]);
  }, [totalDownloads, portfolioViews]);

  // Auto-scroll terminal body on history change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  // Handle Dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !terminalRef.current) return;

    const terminalWidth = terminalRef.current.offsetWidth;
    const terminalHeight = terminalRef.current.offsetHeight;

    let newX = e.clientX - dragStartPos.current.x;
    let newY = e.clientY - dragStartPos.current.y;

    newX = Math.max(0, Math.min(newX, window.innerWidth - terminalWidth));
    newY = Math.max(60, Math.min(newY, window.innerHeight - terminalHeight));

    positionRef.current = { x: newX, y: newY };
    terminalRef.current.style.left = `${newX}px`;
    terminalRef.current.style.top = `${newY}px`;
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setPosition(positionRef.current);
      try {
        localStorage.setItem("d4v_term_pos_v4", JSON.stringify(positionRef.current));
      } catch {}
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    if (!isFloating) {
      setIsFloating(true);
      if (terminalRef.current) {
        const rect = terminalRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
        positionRef.current = { x: rect.left, y: rect.top };
      }
    }
    isDraggingRef.current = true;
    dragStartPos.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Touch Gesture Drag Handlers (Mobile & iPad)
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDraggingRef.current || !terminalRef.current || !e.touches[0]) return;

    const touch = e.touches[0];
    const terminalWidth = terminalRef.current.offsetWidth;
    const terminalHeight = terminalRef.current.offsetHeight;

    let newX = touch.clientX - dragStartPos.current.x;
    let newY = touch.clientY - dragStartPos.current.y;

    newX = Math.max(0, Math.min(newX, window.innerWidth - terminalWidth));
    newY = Math.max(40, Math.min(newY, window.innerHeight - terminalHeight));

    positionRef.current = { x: newX, y: newY };
    terminalRef.current.style.left = `${newX}px`;
    terminalRef.current.style.top = `${newY}px`;
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setPosition(positionRef.current);
      try {
        localStorage.setItem("d4v_term_pos_v4", JSON.stringify(positionRef.current));
      } catch {}
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized || !e.touches[0]) return;
    const touch = e.touches[0];
    if (!isFloating) {
      setIsFloating(true);
      if (terminalRef.current) {
        const rect = terminalRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
        positionRef.current = { x: rect.left, y: rect.top };
      }
    }
    isDraggingRef.current = true;
    dragStartPos.current = {
      x: touch.clientX - positionRef.current.x,
      y: touch.clientY - positionRef.current.y,
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
  };

  const toggleMinimize = (min: boolean) => {
    setIsMinimized(min);
    try {
      localStorage.setItem("d4v_term_closed_v4", min ? "true" : "false");
    } catch {}
  };

  // Interactive Command Execution Engine
  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    const newEntries: HistoryItem[] = [{ type: "cmd", cmdText: cmdStr }];

    switch (trimmed) {
      case "help":
        newEntries.push({
          type: "output",
          content: (
            <div style={{ color: "#e4e4e7", fontSize: "0.75rem", lineHeight: 1.6 }}>
              <div style={{ color: "#64d2ff", fontWeight: 700, marginBottom: "0.2rem" }}>AVAILABLE COMMANDS:</div>
              <div>• <span style={{ color: "#30d158", fontWeight: 700 }}>neofetch</span> — Show D4VIDE106 system specs & live banner</div>
              <div>• <span style={{ color: "#30d158", fontWeight: 700 }}>projects</span> — List top Minecraft mods & quick launch links</div>
              <div>• <span style={{ color: "#30d158", fontWeight: 700 }}>stats</span> — Display live total downloads & portfolio page views</div>
              <div>• <span style={{ color: "#30d158", fontWeight: 700 }}>socials</span> — List all official social channels (@d4vide106)</div>
              <div>• <span style={{ color: "#30d158", fontWeight: 700 }}>whoami</span> — Display creator bio & core technical stack</div>
              <div>• <span style={{ color: "#30d158", fontWeight: 700 }}>clear</span> — Clear the terminal history</div>
            </div>
          )
        });
        break;

      case "neofetch":
      case "./fetch_system_status.sh":
        newEntries.push({
          type: "output",
          content: (
            <div style={{ fontSize: "0.75rem", color: "#e4e4e7" }}>
              <span style={{ color: "#30d158", fontWeight: 700 }}>OS:</span> D4VIDE106 Creator Kernel v4.2.0<br />
              <span style={{ color: "#30d158", fontWeight: 700 }}>Uptime:</span> 99.99% (Live Active)<br />
              <span style={{ color: "#30d158", fontWeight: 700 }}>Total Downloads:</span> {totalDownloads.toLocaleString()}<br />
              <span style={{ color: "#30d158", fontWeight: 700 }}>Portfolio Views:</span> {portfolioViews.toLocaleString()}<br />
              <span style={{ color: "#30d158", fontWeight: 700 }}>Active Projects:</span> {projects.length} Minecraft Mods & Modpacks
            </div>
          )
        });
        break;

      case "projects":
      case "works":
        newEntries.push({
          type: "output",
          content: (
            <div style={{ fontSize: "0.75rem", color: "#e4e4e7" }}>
              <div style={{ color: "#64d2ff", fontWeight: 700, marginBottom: "0.3rem" }}>TOP CREATED MODS:</div>
              {projects.map((p, idx) => (
                <div key={p.id} style={{ marginBottom: "0.2rem" }}>
                  {idx + 1}. <span style={{ color: "#ffffff", fontWeight: 700 }}>{p.title}</span> ({p.downloads.toLocaleString()} DLs)
                </div>
              ))}
            </div>
          )
        });
        break;

      case "stats":
        newEntries.push({
          type: "output",
          content: (
            <div style={{ fontSize: "0.75rem", color: "#e4e4e7" }}>
              <div>🟢 <span style={{ color: "#30d158", fontWeight: 700 }}>Total Downloads:</span> {totalDownloads.toLocaleString()}</div>
              <div>👀 <span style={{ color: "#64d2ff", fontWeight: 700 }}>Portfolio Real Views:</span> {portfolioViews.toLocaleString()}</div>
            </div>
          )
        });
        break;

      case "socials":
        newEntries.push({
          type: "output",
          content: (
            <div style={{ fontSize: "0.75rem", color: "#e4e4e7", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <a href="https://modrinth.com/user/D4vide106" target="_blank" rel="noreferrer" style={{ color: "#1bd96a", textDecoration: "none" }}><SiModrinth style={{ verticalAlign: "middle", marginRight: 4 }} /> Modrinth (@D4vide106)</a>
              <a href="https://www.curseforge.com/members/d4vide106/projects" target="_blank" rel="noreferrer" style={{ color: "#f16436", textDecoration: "none" }}><SiCurseforge style={{ verticalAlign: "middle", marginRight: 4 }} /> CurseForge (@d4vide106)</a>
              <a href="https://youtube.com/@d4vide106" target="_blank" rel="noreferrer" style={{ color: "#ff453a", textDecoration: "none" }}><SiYoutube style={{ verticalAlign: "middle", marginRight: 4 }} /> YouTube (@d4vide106)</a>
              <a href="https://instagram.com/d4vide106" target="_blank" rel="noreferrer" style={{ color: "#e1306c", textDecoration: "none" }}><SiInstagram style={{ verticalAlign: "middle", marginRight: 4 }} /> Instagram (@d4vide106)</a>
              <a href="https://tiktok.com/@d4vide106" target="_blank" rel="noreferrer" style={{ color: "#00f2fe", textDecoration: "none" }}><SiTiktok style={{ verticalAlign: "middle", marginRight: 4 }} /> TikTok (@d4vide106)</a>
              <a href="https://discord.gg/7T3u9a9" target="_blank" rel="noreferrer" style={{ color: "#5865f2", textDecoration: "none" }}><SiDiscord style={{ verticalAlign: "middle", marginRight: 4 }} /> Discord (@d4vide106)</a>
              <a href="https://github.com/D4vide106" target="_blank" rel="noreferrer" style={{ color: "#ffffff", textDecoration: "none" }}><SiGithub style={{ verticalAlign: "middle", marginRight: 4 }} /> GitHub (@D4vide106)</a>
            </div>
          )
        });
        break;

      case "whoami":
        newEntries.push({
          type: "output",
          content: (
            <div style={{ fontSize: "0.75rem", color: "#e4e4e7" }}>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>D4VIDE106</span> — System Designer & Minecraft Mod Creator.<br />
              Specialized in procedural RPG mechanics, custom dimension engines,boss AI, and high-performance Web apps.
            </div>
          )
        });
        break;

      case "clear":
      case "cls":
        setHistory([]);
        setInputVal("");
        return;

      default:
        newEntries.push({
          type: "output",
          content: (
            <div style={{ color: "#ff453a", fontSize: "0.75rem" }}>
              Command not found: &apos;{cmdStr}&apos;. Type <span style={{ color: "#30d158", fontWeight: 700 }}>help</span> for available commands.
            </div>
          )
        });
        break;
    }

    setHistory((prev) => [...prev, ...newEntries]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    }
  };

  return (
    <>
      {/* Minimized Bottom-Left Floating Dock Badge */}
      {isMinimized && (
        <button 
          className={styles.minimizedDockBadge}
          onClick={() => toggleMinimize(false)}
          title="Restore CMD Terminal"
        >
          <span className={styles.greenPulseDot}></span>
          <FiTerminal className={styles.dockTermIcon} />
          <span>Terminal — Control Center</span>
        </button>
      )}

      {/* Main Draggable Terminal Window */}
      {!isMinimized && (
        <div 
          ref={terminalRef}
          className={`
            ${styles.terminalContainer} 
            ${!isFloating ? styles.inlineTerminal : ""} 
            ${isMaximized ? styles.maximizedContainer : ""}
          `} 
          style={isMaximized ? {} : isFloating ? { left: `${position.x}px`, top: `${position.y}px`, position: "fixed" } : { position: "relative" }}
        >
          <div 
            className={styles.terminalHeader} 
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className={styles.macTrafficLights}>
              <span 
                className={`${styles.trafficDot} ${styles.dotRed}`} 
                onClick={() => toggleMinimize(true)} 
                title="Close" 
              />
              <span 
                className={`${styles.trafficDot} ${styles.dotYellow}`} 
                onClick={() => toggleMinimize(true)} 
                title="Minimize" 
              />
              <span 
                className={`${styles.trafficDot} ${styles.dotGreen}`} 
                onClick={() => {
                  setIsFloating(true);
                  setIsMaximized(!isMaximized);
                }} 
                title={isMaximized ? "Restore" : "Maximize"} 
              />
            </div>
            <div className={styles.headerTitle}>
              <FiTerminal className={styles.termIcon} />
              <span>Terminal — Control Center</span>
            </div>
          </div>

          <div ref={bodyRef} className={styles.terminalBody}>
            {history.map((item, index) => (
              <div key={index} style={{ marginBottom: "0.4rem" }}>
                {item.type === "cmd" && (
                  <div style={{ color: "#30d158", fontWeight: 600 }}>
                    <span style={{ color: "#64d2ff" }}>{userPrompt}</span> {item.cmdText}
                  </div>
                )}
                {item.type !== "cmd" && item.content}
              </div>
            ))}

            {/* Interactive Input Line */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.4rem" }}>
              <span style={{ color: "#64d2ff", fontWeight: 600, flexShrink: 0 }}>{userPrompt}</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className={styles.termInput}
                placeholder="type 'help' or command..."
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
