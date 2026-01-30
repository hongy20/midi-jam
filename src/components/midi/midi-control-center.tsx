"use client";

import { Pause, Play, Square, Volume2, VolumeX } from "lucide-react";

interface MidiFile {
  name: string;
  url: string;
}

interface MidiControlCenterProps {
  files: MidiFile[];
  selectedFile: MidiFile | null;
  onSelectFile: (file: MidiFile) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function MidiControlCenter({
  files,
  selectedFile,
  onSelectFile,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  speed,
  onSpeedChange,
  isMuted,
  onToggleMute,
}: MidiControlCenterProps) {
  const speeds = [0.5, 1.0, 1.5, 2.0];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-blue-50 rounded-3xl border-2 border-blue-100 shadow-inner">
      <div className="flex-1 w-full space-y-2">
        <label
          htmlFor="midi-file-select"
          className="block text-sm font-bold text-blue-700 uppercase tracking-wider ml-1"
        >
          Select MIDI File
        </label>
        <select
          id="midi-file-select"
          value={selectedFile?.url || ""}
          onChange={(e) => {
            const file = files.find((f) => f.url === e.target.value);
            if (file) onSelectFile(file);
          }}
          className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Choose a song...
          </option>
          {files.map((file) => (
            <option key={file.url} value={file.url}>
              {file.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMute}
          className={`p-4 rounded-2xl transition-all shadow-md active:scale-95 ${
            isMuted
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>

        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!selectedFile}
          className={`p-4 rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:grayscale ${
            isPlaying
              ? "bg-amber-400 text-white hover:bg-amber-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </button>

        <button
          type="button"
          onClick={onStop}
          disabled={!selectedFile}
          className="p-4 bg-gray-200 text-gray-600 rounded-2xl hover:bg-gray-300 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:grayscale"
          aria-label="Stop"
        >
          <Square className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-bold text-blue-700 uppercase tracking-wider ml-1">
          Speed
        </span>
        <div className="flex bg-white p-1 rounded-2xl border-2 border-blue-100 shadow-sm">
          {speeds.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSpeedChange(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                speed === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-blue-400 hover:bg-blue-50"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
