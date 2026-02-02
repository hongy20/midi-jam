"use client";

import { ChevronDown, ChevronUp, Music, Piano } from "lucide-react";
import { DeviceSelector } from "./device-selector";
import { MidiControlCenter } from "./midi-control-center";

interface MidiFile {
  name: string;
  url: string;
}

interface MidiHeaderProps {
  // Device Selector Props
  devices: WebMidi.MIDIInput[];
  isLoading: boolean;
  error?: string | null;
  selectedDevice: WebMidi.MIDIInput | null;
  onSelectDevice: (device: WebMidi.MIDIInput | null) => void;

  // Midi Control Center Props
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

  // Header State
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export function MidiHeader({
  devices,
  isLoading,
  error,
  selectedDevice,
  onSelectDevice,
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
  isMinimized = false,
  onToggleMinimize,
}: MidiHeaderProps) {
  if (isMinimized) {
    return (
      <div
        data-testid="status-bar"
        onClick={onToggleMinimize}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg rounded-full px-6 py-3 cursor-pointer hover:scale-105 transition-all flex items-center gap-6"
      >
        <div className="flex items-center gap-2 text-gray-700">
          <Piano className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-sm">
            {selectedDevice ? selectedDevice.name : "No Device"}
          </span>
        </div>
        <div className="h-4 w-px bg-gray-300" />
        <div className="flex items-center gap-2 text-gray-700">
          <Music className="w-5 h-5 text-purple-500" />
          <span className="font-bold text-sm">
            {selectedFile ? selectedFile.name : "No Song"}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
      </div>
    );
  }

  return (
    <header className="relative w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-blue-600 tracking-tighter italic transform -rotate-1">
              MIDI JAM
            </h1>
          </div>
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              aria-label="Minimize header"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <DeviceSelector
              devices={devices}
              isLoading={isLoading}
              error={error}
              selectedDevice={selectedDevice}
              onSelect={onSelectDevice}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Backing Track</h2>
            <MidiControlCenter
              files={files}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              isPlaying={isPlaying}
              onPlay={onPlay}
              onPause={onPause}
              onStop={onStop}
              speed={speed}
              onSpeedChange={onSpeedChange}
              isMuted={isMuted}
              onToggleMute={onToggleMute}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
