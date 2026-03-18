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

    // Track which elements are currently active per pitch
    const activeElements = new Map<number, Set<Element>>();

    const observer = new IntersectionObserver(
      (entries) => {
        const exits = entries.filter((e) => !e.isIntersecting);
        const entriesIn = entries.filter((e) => e.isIntersecting);

        // Process exits first to allow re-triggering if same pitch starts in the same batch
        for (const entry of exits) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          const elements = activeElements.get(pitch);
          if (elements) {
            elements.delete(entry.target);
            if (elements.size === 0) {
              onNoteOff(pitch);
            }
          }
        }

        // Process entry arrivals
        for (const entry of entriesIn) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          let elements = activeElements.get(pitch);
          if (!elements) {
            elements = new Set();
            activeElements.set(pitch, elements);
          }

          if (elements.size === 0) {
            onNoteOn(pitch, 0.7);
          }
          elements.add(entry.target);
        }
      },
      {
        root: container,
        rootMargin: "-99% 0px 0px 0px",
        threshold: 0, // Only trigger on boundary entry/exit
      },
    );

    const observedElements = new Set<Element>();

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
              observedElements.delete(node);
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
      for (const [pitch, elements] of activeElements.entries()) {
        if (elements.size > 0) {
          onNoteOff(pitch);
        }
      }
      activeElements.clear();
    };
  }, [containerRef, demoMode, isLoading, groups, onNoteOn, onNoteOff]);
}
