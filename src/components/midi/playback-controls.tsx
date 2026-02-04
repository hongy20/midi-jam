import { Pause, Play, Rabbit, Snail, Sparkles, Square } from "lucide-react";
import { memo } from "react";

interface PlaybackControlsProps {
  isPlaying: boolean;

  onPlay: () => void;

  onPause: () => void;

  onStop: () => void;

  speed: number;

  onSpeedChange: (speed: number) => void;

  demoMode?: boolean;

  onToggleDemo?: () => void;
}

export const PlaybackControls = memo(function PlaybackControls({
  isPlaying,

  onPlay,

  onPause,

  onStop,

  speed,

  onSpeedChange,

  demoMode = true,

  onToggleDemo,
}: PlaybackControlsProps) {
  const speeds = [
    { value: 0.75, label: <Snail className="w-4 h-4" /> },
    { value: 1.0, label: "1x" },
    { value: 1.25, label: <Rabbit className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-4 py-1 pointer-events-auto">
      <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
        {onToggleDemo && (
          <button
            type="button"
            onClick={onToggleDemo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-wider transition-all duration-300 ${
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
        )}

        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          className={`p-2 rounded-full transition-all ${
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
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          aria-label="Stop"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </div>

      <div className="h-4 w-px bg-gray-300 mx-1" />

      <div className="flex items-center gap-1 pl-1">
        {speeds.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onSpeedChange(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center min-w-[2.5rem] ${
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
  );
});
