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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          if (entry.isIntersecting) {
            onNoteOn(pitch, 0.7);
          } else {
            onNoteOff(pitch);
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
