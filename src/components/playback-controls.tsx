"use client";

import {
  Menu,
  Pause,
  Play,
  Rabbit,
  Snail,
  Sparkles,
  Square,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./playback-controls.module.css";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  demoMode: boolean;
  onToggleDemo: () => void;
}

/**
 * High-performance Playback Controls.
 * Uses CSS Data Attributes for transitions to minimize layout reflows.
 */
export const PlaybackControls = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  speed,
  onSpeedChange,
  demoMode,
  onToggleDemo,
}: PlaybackControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const speeds = [
    { value: 0.75, label: <Snail className="w-4 h-4" /> },
    { value: 1.0, label: "1x" },
    { value: 1.25, label: <Rabbit className="w-4 h-4" /> },
  ];

  const resetCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
    }
    if (isExpanded) {
      collapseTimerRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
    }
  }, [isExpanded]);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  // Auto-collapse timer management
  useEffect(() => {
    resetCollapseTimer();
    return () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
      }
    };
  }, [resetCollapseTimer]);

  // Handle outside clicks to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleCollapse();
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, handleCollapse]);

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      {/* Mobile Toggle Button (Sandwich) */}
      <button
        type="button"
        onClick={handleToggleExpand}
        data-hidden={isExpanded}
        aria-expanded={isExpanded}
        aria-label="Toggle playback controls"
        className={styles.toggleButton}
      >
        <Menu className="w-6 h-6 text-slate-600" />
      </button>

      {/* Controls Container */}
      <div className={styles.container} data-expanded={isExpanded}>
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => {
              resetCollapseTimer();
              onToggleDemo();
            }}
            onMouseEnter={resetCollapseTimer}
            className={`h-9 flex items-center gap-1.5 px-3 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300 ${
              demoMode
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-100 text-slate-400"
            }`}
            aria-label={demoMode ? "Disable Demo Mode" : "Enable Demo Mode"}
          >
            <Sparkles
              className={`w-3 h-3 ${demoMode ? "animate-pulse" : ""}`}
            />
            <span>Demo</span>
          </button>
        </div>

        <div className="h-4 w-0.5 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              resetCollapseTimer();
              isPlaying ? onPause() : onPlay();
            }}
            onMouseEnter={resetCollapseTimer}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
              isPlaying
                ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              resetCollapseTimer();
              onStop();
            }}
            onMouseEnter={resetCollapseTimer}
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            aria-label="Stop"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="h-4 w-0.5 bg-gray-300 mx-1" />

        <div className="flex items-center gap-1 pl-1">
          {speeds.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                resetCollapseTimer();
                onSpeedChange(s.value);
              }}
              onMouseEnter={resetCollapseTimer}
              className={`w-9 h-9 rounded-full text-xs font-black transition-all flex items-center justify-center ${
                speed === s.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
              aria-label={`${s.value}x Speed`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
