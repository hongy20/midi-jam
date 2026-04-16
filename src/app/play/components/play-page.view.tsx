"use client";

import { Maximize2, Minimize2, Pause } from "lucide-react";
import type { SegmentGroup } from "@/features/midi-assets";
import type { HitQuality } from "@/features/score/hooks/use-lane-score-engine";
import { Button } from "@/shared/components/ui/8bit/button";
import { LaneStage } from "./lane-stage/lane-stage";
import { PianoKeyboard } from "./piano-keyboard/PianoKeyboard";
import styles from "./play-page.view.module.css";
import { ScoreWidget } from "./score-widget/score-widget";

interface PlayPageViewProps {
  selectedMIDIInput: { name?: string };
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
  groups: SegmentGroup[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  getCurrentTimeMs: () => number;
  startUnit: number;
  endUnit: number;
  speed: number;
  laneScrollDurationMs: number;
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
  groups,
  scrollRef,
  getCurrentTimeMs,
  startUnit,
  endUnit,
  speed,
  laneScrollDurationMs,
}: PlayPageViewProps) {
  return (
    <div
      className={styles.container}
      style={
        {
          "--start-unit": startUnit,
          "--end-unit": endUnit,
          "--lane-scroll-duration-ms": laneScrollDurationMs,
          "--speed": speed,
        } as React.CSSProperties
      }
    >
      <header className={styles.header}>
        <div className={styles.songInfo}>
          <span className={styles.badge}>
            {selectedMIDIInput.name} • {selectedTrack.name}
          </span>
          <ScoreWidget
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
            {isFullscreen ? (
              <Minimize2 className="size-4" />
            ) : (
              <Maximize2 className="size-4" />
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={handlePause}
            size="icon"
            font="retro"
            title="Pause"
          >
            <Pause className="size-4" />
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <LaneStage
          groups={groups}
          scrollRef={scrollRef}
          getCurrentTimeMs={getCurrentTimeMs}
        />
      </main>

      <footer className={styles.footer}>
        <div className={styles.keyboardWrapper} data-testid="piano-keyboard">
          <PianoKeyboard
            liveNotes={liveActiveNotes}
            playbackNotes={playbackNotes}
          />
        </div>
      </footer>
    </div>
  );
}
