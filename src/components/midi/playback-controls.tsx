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

  const handleIconInteraction = useCallback(() => {
    resetCollapseTimer();
  }, [resetCollapseTimer]);

  // Filtered interaction handler for the container - only resets timer if an icon (button) is targeted
  const handleContainerInteraction = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      handleIconInteraction();
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      {/* Mobile Toggle Button (Sandwich) */}
      <button
        type="button"
        onClick={handleToggleExpand}
        aria-expanded={isExpanded}
        aria-label="Toggle playback controls"
        className={`md:hidden w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-full transition-all duration-300 z-50 ${isExpanded ? "opacity-0 pointer-events-none scale-75" : "opacity-100"}`}
      >
        <Menu className="w-6 h-6 text-slate-600" />
      </button>

      {/* Controls Container */}
      <div
        onMouseMove={handleContainerInteraction}
        onClick={handleContainerInteraction}
        className={`
          flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-4 py-1 pointer-events-auto
          transition-all duration-500 ease-in-out
          ${
            isExpanded
              ? "opacity-100 translate-x-0 pointer-events-auto flex"
              : "opacity-0 translate-x-8 pointer-events-none hidden md:flex md:opacity-100 md:translate-x-0 md:pointer-events-auto"
          }
          absolute right-0 md:relative md:right-auto
        `}
      >
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={onToggleDemo}
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
            onClick={isPlaying ? onPause : onPlay}
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
            onClick={onStop}
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
              onClick={() => onSpeedChange(s.value)}
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