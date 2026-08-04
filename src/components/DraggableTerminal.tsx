"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./DraggableTerminal.module.css";
import { FiTerminal, FiX, FiMinus, FiSquare } from "react-icons/fi";

const terminalText = [
  "C:\\Users\\D4vide106> whoami",
  "d4vide106",
  "",
  "C:\\Users\\D4vide106> ./fetch_skills.sh",
  "Loading skills...",
  "-> Java [100%]",
  "-> Scripting [100%]",
  "-> React [90%]",
  "-> Modding [100%]",
  "",
  "C:\\Users\\D4vide106> _"
];

export default function DraggableTerminal() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Center it initially after mount
  useEffect(() => {
    setPosition({ x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 150 });
  }, []);

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
      }, Math.random() * 30 + 10);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, line === "" ? 200 : 500);
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
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
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

  return (
    <div 
      className={styles.terminalContainer} 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div 
        className={styles.terminalHeader} 
        onMouseDown={handleMouseDown}
      >
        <div className={styles.headerLeft}>
          <FiTerminal className={styles.termIcon} />
          <span>Windows PowerShell</span>
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
            {line}
            {i === currentLineIndex && <span className={styles.cursor}>█</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
