import { useEffect, useState } from "react";

import { type MIDINoteEvent } from "@/shared/types/midi";

import { createNoteObserver } from "../lib/note-observer";
import { useNotePlayer } from "./use-note-player";

interface UseTrackPlayerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  selectedMIDIOutput: WebMidi.MIDIOutput | null;
  processNoteEvent: (event: MIDINoteEvent) => void;
}

/**
 * Hook to handle automated note playback by observing visual note elements
 * as they cross the target line in the gameplay lane.
 */
export function useTrackPlayer({
  containerRef,
  enabled,
  selectedMIDIOutput,
  processNoteEvent,
}: UseTrackPlayerProps) {
  const [playbackNotes, setPlaybackNotes] = useState<Set<number>>(new Set());
  const { playNote, stopNote } = useNotePlayer(selectedMIDIOutput);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const { disconnect } = createNoteObserver({
      container,
      onPitchStart: (pitch) => {
        setPlaybackNotes((prev) => {
          const next = new Set(prev);
          next.add(pitch);
          return next;
        });

        const velocity = 0.7;
        playNote(pitch, velocity);
        processNoteEvent({ type: "note-on", pitch, velocity });
      },
      onPitchEnd: (pitch) => {
        setPlaybackNotes((prev) => {
          const next = new Set(prev);
          next.delete(pitch);
          return next;
        });

        stopNote(pitch);
        processNoteEvent({ type: "note-off", pitch, velocity: 0 });
      },
    });

    return () => {
      disconnect();
      setPlaybackNotes(new Set());
    };
  }, [containerRef, enabled, playNote, stopNote, processNoteEvent]);

  return { playbackNotes };
}
