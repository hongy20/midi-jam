import { isBlackKey } from "@/lib/device/piano";
import styles from "./background-grid.module.css";

interface BackgroundGridProps {
  rangeStart: number;
  rangeEnd: number;
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
}

/**
 * A background component that renders semitone-aligned lanes and note beams.
 * Alignment is handled via the shared high-resolution CSS Grid.
 */
export const BackgroundGrid = ({
  rangeStart,
  rangeEnd,
  liveNotes,
  playbackNotes,
}: BackgroundGridProps) => {
  const notes = [];
  for (let n = rangeStart; n <= rangeEnd; n++) {
    notes.push(n);
  }

  const getSource = (note: number) => {
    const isLive = liveNotes.has(note);
    const isPlayback = playbackNotes.has(note);
    if (isLive && isPlayback) return "both";
    if (isLive) return "live";
    if (isPlayback) return "playback";
    return "none";
  };

  return (
    <div className={styles.container}>
      {notes.map((note) => {
        const source = getSource(note);
        const active = source !== "none";
        const isBlack = isBlackKey(note);
        const noteClass = styles[`note-${note}`];

        return (
          <div key={note} className="contents">
            {/* Background Lane */}
            <div
              className={`${styles.lane} ${noteClass}`}
              data-black={isBlack}
            />

            {/* Note Beam Effect (Colored by key type) */}
            <div
              className={`${styles.beam} ${noteClass}`}
              data-active={active}
              data-black={isBlack}
              data-source={source}
            >
              <div className={styles.flare} data-source={source} />
              <div className={styles.beamLine} data-source={source} />
            </div>
          </div>
        );
      })}
    </div>
  );
};