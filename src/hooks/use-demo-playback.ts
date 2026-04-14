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

/**
 * Hook to handle MIDI demo playback using IntersectionObserver on note elements.
 * Uses per-element state tracking to prevent counter drift caused by IO callback delays.
 */
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

    // Track which elements are currently "active" for each pitch.
    // Using a Set per pitch ensures that multiple elements of the same pitch
    // (e.g., during segment transitions or IO batch delays) don't cause counter drift.
    const activeElements = new Map<number, Set<Element>>();
    const observedElements = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Partition entries to process exits (Off) before entries (On)
        const exits = entries
          .filter((e) => !e.isIntersecting)
          .filter(
            (e) =>
              // Only trigger Note Off if the element exits through the bottom
              // (This prevents premature off events for elements entering from the top)
              e.rootBounds && e.boundingClientRect.top > e.rootBounds.bottom,
          );
        const entriesIn = entries.filter((e) => e.isIntersecting);

        // Process exits (Off) first
        for (const entry of exits) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          const elements = activeElements.get(pitch);
          if (elements?.has(entry.target)) {
            elements.delete(entry.target);
            if (elements.size === 0) {
              activeElements.delete(pitch);
              onNoteOff(pitch);
            }
          }
        }

        // Process entries (On) second
        for (const entry of entriesIn) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          let elements = activeElements.get(pitch);
          const wasEmpty = !elements || elements.size === 0;

          if (!elements) {
            elements = new Set();
            activeElements.set(pitch, elements);
          }

          elements.add(entry.target);
          if (wasEmpty) {
            onNoteOn(pitch, 0.7);
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

          mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
              observedElements.delete(node);

              // If the removed node or any of its children were in activeElements,
              // we should technically clean them up, though IO disconnection
              // usually fires a final isIntersecting=false callback.
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
