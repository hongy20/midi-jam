"use client";

import { ChevronDown, ChevronUp, Music, Piano, Sparkles } from "lucide-react";
import { memo } from "react";
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

  // Midi Control Center Props (Selectors only)
  files: MidiFile[];
  selectedFile: MidiFile | null;
  onSelectFile: (file: MidiFile) => void;

  // Header State
  isMinimized?: boolean;
  onToggleMinimize?: () => void;

  // Demo Mode
  demoMode?: boolean;
  onToggleDemo?: () => void;
}

export const MidiHeader = memo(function MidiHeader({
  devices,
  isLoading,
  error,
  selectedDevice,
  onSelectDevice,
  files,
  selectedFile,
  onSelectFile,
  isMinimized = false,
  onToggleMinimize,
  demoMode = true,
  onToggleDemo,
}: MidiHeaderProps) {
  return (
    <>
      {/* Backdrop overlay when expanded */}
      <button
        type="button"
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-500 ${
          isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={onToggleMinimize}
        tabIndex={-1}
        aria-label="Close menu"
      />

      {/* Status Bar (Pill) - Minimized state - Top Left */}
      <button
        type="button"
        data-testid="status-bar"
        onClick={onToggleMinimize}
        tabIndex={isMinimized ? 0 : -1}
        className={`fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-full px-5 py-3 cursor-pointer hover:scale-105 transition-all duration-500 ease-out ${
          !isMinimized
            ? "opacity-0 -translate-x-12 pointer-events-none"
            : "opacity-100 translate-x-0"
        } flex items-center gap-4`}
      >
        <div className="flex items-center gap-2 text-gray-700">
          <Piano className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-xs">
            {selectedDevice ? selectedDevice.name : "Connect MIDI"}
          </span>
        </div>
        <div className="h-3 w-px bg-gray-300" />
        <div className="flex items-center gap-2 text-gray-700">
          <Music className="w-4 h-4 text-purple-500" />
          <span className="font-bold text-xs truncate max-w-[100px]">
            {selectedFile ? selectedFile.name : "Select Song"}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
      </button>

      {/* Full Header (Popup) - Expanded state */}
      <header
        className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-gray-100 shadow-2xl z-40 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${
          isMinimized
            ? "opacity-0 -translate-y-full pointer-events-none"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          <div className="flex justify-between items-center border-b border-gray-100 pb-8">
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-blue-600 tracking-tighter italic transform -rotate-1 select-none">
                MIDI JAM
              </h1>
              <p className="text-slate-500 font-semibold ml-1">
                The immersive way to learn piano.
              </p>
            </div>

            <div className="flex items-center gap-6">
              {onToggleDemo && (
                <button
                  type="button"
                  onClick={onToggleDemo}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg ${
                    demoMode
                      ? "bg-blue-600 text-white shadow-blue-500/40 scale-105"
                      : "bg-slate-100 text-slate-400 grayscale"
                  }`}
                >
                  <Sparkles
                    className={`w-4 h-4 ${demoMode ? "animate-pulse" : ""}`}
                  />
                  <span>Demo {demoMode ? "On" : "Off"}</span>
                </button>
              )}

              {onToggleMinimize && (
                <button
                  type="button"
                  onClick={onToggleMinimize}
                  className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-all duration-300 text-slate-500 hover:text-slate-800 hover:rotate-180"
                  aria-label="Minimize header"
                >
                  <ChevronUp className="w-8 h-8" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-200/50">
              <DeviceSelector
                devices={devices}
                isLoading={isLoading}
                error={error}
                selectedDevice={selectedDevice}
                onSelect={onSelectDevice}
              />
            </div>

            <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-200/50">
              <MidiControlCenter
                files={files}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
});
