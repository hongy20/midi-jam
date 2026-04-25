"use client";

import { Maximize2, Minimize2, Pause } from "lucide-react";

import { DrumStage } from "@/features/drum";
import { NoteHighway } from "@/features/note-highway";
import { PianoStage } from "@/features/piano";
import type { HitQuality } from "@/features/score";
import { LiveScore } from "@/features/score";
import { Button } from "@/shared/components/ui/8bit/button";
import { getInstrumentType } from "@/shared/lib/instrument";
import { type MidiNote, type MidiNoteGroup } from "@/shared/types/midi";

import styles from "./play-page.view.module.css";

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
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.songInfo}>
          <span className={styles.badge}>
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
        noteHighway={
          <NoteHighway
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
