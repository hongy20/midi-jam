"use client";

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
    <div className="bg-background text-foreground flex h-dvh w-full flex-col overflow-hidden">
      <header className="bg-background/80 border-foreground dark:border-ring flex h-auto min-h-16 w-full shrink-0 items-center gap-2 overflow-hidden border-b-4 px-4 py-2 backdrop-blur-sm sm:gap-4 sm:px-6">
        <LiveScore
          getScore={getScore}
          getCombo={getCombo}
          getLastHitQuality={getLastHitQuality}
          getProgress={getProgress}
          headerText={`${selectedMIDIInput.name} • ${selectedTrack.name}`}
        />

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleToggleFullscreen}
            size="icon"
            font="retro"
            className="shrink-0"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
          <Button
            variant="secondary"
            onClick={handlePause}
            size="icon"
            font="retro"
            className="shrink-0"
            title="Pause"
          >
            <Pause className="size-4" />
          </Button>
        </div>
      </header>

      <main className="relative min-h-0 w-full flex-1 overflow-hidden">
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
      </main>
    </div>
  );
}
