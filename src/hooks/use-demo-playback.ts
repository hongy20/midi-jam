import { useEffect } from "react";
import type { SegmentGroup } from "@/lib/midi/lane-segment-utils";

interface UseDemoPlaybackProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  demoMode: boolean;
  isLoading: boolean;
  groups: SegmentGroup[];
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
}

export function useDemoPlayback({
  containerRef,
  demoMode,
  isLoading,
  groups,
  onNoteOn,
  onNoteOff,
}: UseDemoPlaybackProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !demoMode || isLoading || groups.length === 0) return;

    const activeCounts = new Map<number, number>();
    const observedElements = new Set<Element>();
    const activeElements = new Set<Element>();

    const handleNoteOn = (pitch: number, el: Element) => {
      if (activeElements.has(el)) return;
      activeElements.add(el);

      const currentCount = activeCounts.get(pitch) || 0;
      activeCounts.set(pitch, currentCount + 1);
      if (currentCount === 0) {
        onNoteOn(pitch, 0.7);
      }
    };

    const handleNoteOff = (pitch: number, el: Element) => {
      if (!activeElements.has(el)) return;
      activeElements.delete(el);

      const currentCount = activeCounts.get(pitch) || 0;
      if (currentCount > 0) {
        const nextCount = currentCount - 1;
        activeCounts.set(pitch, nextCount);
        if (nextCount === 0) {
          onNoteOff(pitch);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Partition entries to process exits (Off) before entries (On)
        const exits = entries
          .filter((e) => !e.isIntersecting)
          .filter(
            (e) =>
              // Only trigger Note Off if the element exits through the bottom
              e.rootBounds && e.boundingClientRect.top > e.rootBounds.bottom,
          );
        const entriesIn = entries.filter((e) => e.isIntersecting);

        for (const entry of exits) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (!Number.isNaN(pitch)) {
            handleNoteOff(pitch, entry.target);
          }
        }

        for (const entry of entriesIn) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (!Number.isNaN(pitch)) {
            handleNoteOn(pitch, entry.target);
          }
        }
      },
      {
        root: container,
        rootMargin: "-100% 0px 0px 0px",
        threshold: [0, 1],
      },
    );

    const observeNotes = (root: ParentNode) => {
      const notes = root.querySelectorAll("[data-pitch]");
      notes.forEach((note) => {
        if (!observedElements.has(note)) {
          observer.observe(note);
          observedElements.add(note);
        }
      });
    };

    // Initial observation
    observeNotes(container);

    // Dynamic observation via MutationObserver
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.hasAttribute("data-pitch")) {
                if (!observedElements.has(node)) {
                  observer.observe(node);
                  observedElements.add(node);
                }
              }
              // Also check children in case a LaneSegment was added
              observeNotes(node);
            }
          });
          // Cleanup removed nodes from tracker if necessary (observer handles GC, but tracker helps)
          mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
              const processRemoval = (el: Element) => {
                if (el.hasAttribute("data-pitch")) {
                  const pitch = Number(el.getAttribute("data-pitch"));
                  if (!Number.isNaN(pitch)) {
                    handleNoteOff(pitch, el);
                  }
                  observedElements.delete(el);
                }
              };

              // Check the node itself and its entire subtree
              processRemoval(node);
              node.querySelectorAll("[data-pitch]").forEach(processRemoval);
            }
          });
        }
      }
    });

    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      observedElements.clear();
      // Cleanup: release any currently active notes
      for (const [pitch, count] of activeCounts.entries()) {
        if (count > 0) {
          onNoteOff(pitch);
        }
      }
      activeCounts.clear();
    };
  }, [containerRef, demoMode, isLoading, groups, onNoteOn, onNoteOff]);
}
