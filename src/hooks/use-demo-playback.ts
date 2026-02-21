import { useEffect } from "react";

interface UseDemoPlaybackProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  demoMode: boolean;
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

export function useDemoPlayback({
  containerRef,
  demoMode,
  onNoteOn,
  onNoteOff,
}: UseDemoPlaybackProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !demoMode) return;

    // The IntersectionObserver will observe notes inside the scroll container.
    // The root is the viewport of the LaneStage.
    // We want to trigger when a note hits the bottom 1px of the viewport.

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          // isIntersecting is true when any part of the note is in the 1px band.
          // Since notes fall downwards, entering the band from top means the
          // bottom of the note hit the target line (Note On).
          // Leaving the band from the bottom means the top of the note
          // passed the target line (Note Off).

          if (entry.isIntersecting) {
            onNoteOn(pitch, 0.7); // Use a default velocity for demo
          } else {
            // Only stop if the note has actually passed the target line
            // (i.e., its bounding rect is below the root's bounding rect).
            // Actually, IntersectionObserver triggers on entry and exit.
            // If it's not intersecting, it could be above or below.
            // But since they only fall down, if it was intersecting and now
            // isn't, it must have passed through (or we scrolled back, which we don't).
            onNoteOff(pitch);
          }
        }
      },
      {
        root: container,
        // Target area is a 1px band at the bottom of the viewport.
        // Margin order: top, right, bottom, left.
        // We want the intersection area to be only the bottom edge.
        rootMargin: "0px 0px -99% 0px", // Top is shifted down by 99%
        threshold: [0, 1],
      },
    );

    // Observe all note elements
    const notes = container.querySelectorAll("[data-pitch]");
    notes.forEach((note) => {
      observer.observe(note);
    });

    // Also need to observe new notes if they are added dynamically,
    // but here spans are mostly static after track load.

    return () => {
      observer.disconnect();
    };
  }, [containerRef, demoMode, onNoteOn, onNoteOff]);
}
