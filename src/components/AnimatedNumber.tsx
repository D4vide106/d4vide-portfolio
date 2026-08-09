"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isScaling, setIsScaling] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = value;

    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    // Trigger scale up pulse animation when number increases
    if (endVal > startVal) {
      setIsScaling(true);
      const timer = setTimeout(() => setIsScaling(false), 700);
      prevValueRef.current = endVal;
      
      let startTimestamp: number | null = null;
      const duration = 650; // duration in ms

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(startVal + (endVal - startVal) * progress);
        setDisplayValue(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(endVal);
        }
      };

      requestAnimationFrame(step);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(endVal);
      prevValueRef.current = endVal;
    }
  }, [value]);

  return (
    <span
      style={{
        display: "inline-block",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease",
        transform: isScaling ? "scale(1.22)" : "scale(1)",
        color: isScaling ? "#64d2ff" : "inherit",
      }}
    >
      {displayValue.toLocaleString()}
    </span>
  );
}
