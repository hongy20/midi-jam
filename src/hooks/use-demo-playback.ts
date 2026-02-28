import { useEffect } from "react";
import type { NoteSpan } from "@/lib/midi/midi-parser";

interface UseDemoPlaybackProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  demoMode: boolean;
  isLoading: boolean;
  spans: NoteSpan[];
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

export function useDemoPlayback({
  containerRef,
  demoMode,
  isLoading,
  spans,
  onNoteOn,
  onNoteOff,
}: UseDemoPlaybackProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !demoMode || isLoading || spans.length === 0) return;

    const activeCounts = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Partition entries to process exits (Off) before entries (On)
        const exits = entries.filter((e) => !e.isIntersecting);
        const entriesIn = entries.filter((e) => e.isIntersecting);

        // Process exits (Off) first
        for (const entry of exits) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          const currentCount = activeCounts.get(pitch) || 0;
          if (currentCount > 0) {
            const nextCount = currentCount - 1;
            activeCounts.set(pitch, nextCount);
            if (nextCount === 0) {
              onNoteOff(pitch);
            }
          }
        }

        // Process entries (On) second
        for (const entry of entriesIn) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          const currentCount = activeCounts.get(pitch) || 0;
          activeCounts.set(pitch, currentCount + 1);
          if (currentCount === 0) {
            onNoteOn(pitch, 0.7);
          }
        }
      },
      {
        root: container,
        rootMargin: "-99% 0px 0px 0px",
        threshold: [0, 1],
      },
    );

    // Observe all note elements
    const notes = container.querySelectorAll("[data-pitch]");
    notes.forEach((note) => {
      observer.observe(note);
    });

    return () => {
      observer.disconnect();
    };
  }, [containerRef, demoMode, isLoading, spans, onNoteOn, onNoteOff]);
}
