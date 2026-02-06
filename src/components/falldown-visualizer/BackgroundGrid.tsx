import { useMemo } from "react";
import { isBlackKey } from "@/lib/device/piano";
import styles from "./background-grid.module.css";

interface BackgroundGridProps {
  rangeStart: number;
  rangeEnd: number;
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
}

/**
 * Static lanes that only re-render when the note range changes.
 */
const BackgroundLanes = ({ notes }: { notes: number[] }) => {
  return (
    <>
      {notes.map((note) => (
        <div
          key={`lane-${note}`}
          className={`${styles.lane} ${styles[`note-${note}`]}`}
          data-black={isBlackKey(note)}
        />
      ))}
    </>
  );
};

/**
 * Dynamic beam effects that only render for currently active notes.
 */
const BeamEffects = ({
  rangeStart,
  rangeEnd,
  liveNotes,
  playbackNotes,
}: {
  rangeStart: number;
  rangeEnd: number;
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
}) => {
  // Identify all unique active notes in the current range
  const activeNotesInRange = useMemo(() => {
    const active = new Set([
      ...Array.from(liveNotes),
      ...Array.from(playbackNotes),
    ]);
    return Array.from(active).filter((n) => n >= rangeStart && n <= rangeEnd);
  }, [liveNotes, playbackNotes, rangeStart, rangeEnd]);

  return (
    <>
      {activeNotesInRange.map((note) => {
        const isLive = liveNotes.has(note);
        const isPlayback = playbackNotes.has(note);
        const source =
          isLive && isPlayback ? "both" : isLive ? "live" : "playback";
        const isBlack = isBlackKey(note);
        const noteClass = styles[`note-${note}`];

        return (
          <div
            key={`beam-${note}`}
            className={`${styles.beam} ${noteClass}`}
            data-active="true"
            data-black={isBlack}
            data-source={source}
          >
            <div className={styles.flare} data-source={source} />
            <div className={styles.beamLine} data-source={source} />
          </div>
        );
      })}
    </>
  );
};

/**
 * A background component that separates static lanes and dynamic note beams
 * for optimal rendering performance.
 */
export const BackgroundGrid = ({
  rangeStart,
  rangeEnd,
  liveNotes,
  playbackNotes,
}: BackgroundGridProps) => {
  const notes = useMemo(() => {
    const list = [];
    for (let n = rangeStart; n <= rangeEnd; n++) {
      list.push(n);
    }
    return list;
  }, [rangeStart, rangeEnd]);

  return (
    <div className={styles.container}>
      <BackgroundLanes notes={notes} />
      <BeamEffects
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        liveNotes={liveNotes}
        playbackNotes={playbackNotes}
      />
    </div>
  );
};
