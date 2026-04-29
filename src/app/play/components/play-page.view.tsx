"use client";

import "./play-page.view.module.css";

import { Maximize2, Minimize2, Pause } from "lucide-react";

import { DrumStage } from "@/features/drum";
import { type HitQuality, LiveScore } from "@/features/gameplay";
import { Highway } from "@/features/highway";
import { PianoStage } from "@/features/piano";
import { Button } from "@/shared/components/ui/8bit/button";
import { getInstrumentType } from "@/shared/lib/instrument";
import { MidiNote, MidiNoteGroup } from "@/shared/types/midi";

interface PlayPageViewProps {
  selectedMIDIInput: WebMidi.MIDIInput;
  selectedTrack: { name: string };
  getScore: () => number;
  getCombo: () => number;
  getLastHitQuality: () => HitQuality;
  getProgress: () => number;
  handlePause: () => void;
  isFullscreen: boolean;
  handleToggleFullscreen: () => void;
  liveActiveNotes: Set<number>;
  playbackNotes: Set<number>;
  notes: MidiNote[];
  groups: MidiNoteGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  speed: number;
}

/**
 * PlayPageView handles only the "happy path" of data-ready gameplay.
 * Separation of concerns: Presentation layer using semantic HTML and localized components.
 */
export function PlayPageView({
  selectedMIDIInput,
  selectedTrack,
  getScore,
  getCombo,
  getLastHitQuality,
  getProgress,
  handlePause,
  isFullscreen,
  handleToggleFullscreen,
  liveActiveNotes,
  playbackNotes,
  notes,
  groups,
  scrollRef,
  getCurrentTimeMs,
  speed,
}: PlayPageViewProps) {
  const instrumentType = getInstrumentType(selectedMIDIInput);
  const Stage = instrumentType === "piano" ? PianoStage : DrumStage;

  return (
    <div className="bg-background text-foreground grid h-dvh w-screen grid-rows-[auto_1fr_auto] overflow-hidden">
      <header className="bg-background/80 border-foreground dark:border-ring flex h-12 w-full items-center justify-between border-b-4 px-6 backdrop-blur-sm [@media(min-height:601px)]:h-16">
        <div className="flex flex-1 flex-col">
          <span className="text-foreground/60 font-retro mb-1 text-[10px] font-black tracking-[0.2em] uppercase">
            {selectedMIDIInput.name} • {selectedTrack.name}
          </span>
          <LiveScore
            getScore={getScore}
            getCombo={getCombo}
            getLastHitQuality={getLastHitQuality}
            getProgress={getProgress}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handleToggleFullscreen}
            size="icon"
            font="retro"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
          <Button variant="secondary" onClick={handlePause} size="icon" font="retro" title="Pause">
            <Pause className="size-4" />
          </Button>
        </div>
      </header>

      <Stage
        notes={notes}
        liveActiveNotes={liveActiveNotes}
        playbackNotes={playbackNotes}
        highway={
          <Highway
            groups={groups}
            scrollRef={scrollRef}
            getCurrentTimeMs={getCurrentTimeMs}
            speed={speed}
          />
        }
      />
    </div>
  );
}
