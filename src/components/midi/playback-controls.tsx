import { memo } from "react";
import { Pause, Play, Square, Volume2, VolumeX } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PlaybackControls = memo(function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  speed,
  onSpeedChange,
  isMuted,
  onToggleMute,
}: PlaybackControlsProps) {
  const speeds = [0.5, 1.0, 1.5, 2.0];

  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-4 py-1 pointer-events-auto">
      <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
        <button
          type="button"
          onClick={onToggleMute}
          className={`p-2 rounded-full transition-all hover:bg-gray-100 ${
            isMuted ? "text-red-500" : "text-gray-600"
          }`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

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

      <div className="flex items-center gap-1 pl-1">
        {speeds.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSpeedChange(s)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              speed === s
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-100"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
