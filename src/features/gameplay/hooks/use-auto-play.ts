import { useEffect, useState } from "react";
import { type MIDINoteEvent } from "@/shared/types/midi";
import { createNoteObserver } from "../lib/note-observer";

interface UseAutoPlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  onNoteOn: (pitch: number) => void;
  onNoteOff: (pitch: number) => void;
  processNoteEvent: (event: MIDINoteEvent) => void;
}

/**
 * Hook to handle automated note playback by observing visual note elements
 * as they cross the target line in the gameplay lane.
 * 
 * Strict Isolation: This hook does NOT import from the audio feature.
 * It relies on callbacks for audio triggering.
 */
export function useAutoPlay({
  containerRef,
  enabled,
  onNoteOn,
  onNoteOff,
  processNoteEvent,
}: UseAutoPlayProps) {
  const [playbackNotes, setPlaybackNotes] = useState<Set<number>>(new Set());

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
        
        onNoteOn(pitch);
        processNoteEvent({ type: "note-on", pitch, velocity: 0.7 });
      },
      onPitchEnd: (pitch) => {
        setPlaybackNotes((prev) => {
          const next = new Set(prev);
          next.delete(pitch);
          return next;
        });

        onNoteOff(pitch);
        processNoteEvent({ type: "note-off", pitch, velocity: 0 });
      },
    });

    return () => {
      disconnect();
      setPlaybackNotes(new Set());
    };
  }, [containerRef, enabled, onNoteOn, onNoteOff, processNoteEvent]);

  return { playbackNotes };
}
