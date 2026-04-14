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
 * Uses per-element Set tracking to prevent counter drift and correctly handle unmounts.
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
    // Using a Set per pitch ensures idempotency and immunity to IO batching delays.
    const activeElements = new Map<number, Set<Element>>();
    const observedElements = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        // Partition entries to process exits (Off) before entries (On)
        const exits = entries.filter((e) => !e.isIntersecting);
        const entriesIn = entries.filter((e) => e.isIntersecting);

        // Process exits (Off) first
        for (const entry of exits) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          const elements = activeElements.get(pitch);
          if (elements?.has(entry.target)) {
            elements.delete(entry.target);
            // Only trigger physical Note Off when the VERY LAST element for this pitch exits.
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

          // Trigger physical Note On only if this is the FIRST element for this pitch.
          if (wasEmpty) {
            onNoteOn(pitch, 0.7);
          }
          elements.add(entry.target);
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

    // Helper to cleanup any active elements associated with a removed DOM tree
    const cleanupActiveElements = (pitch: number, element: Element) => {
      const elements = activeElements.get(pitch);
      if (elements?.has(element)) {
        elements.delete(element);
        if (elements.size === 0) {
          activeElements.delete(pitch);
          onNoteOff(pitch);
        }
      }
    };

    // Initial observation
    observeNotes(container);

    // Dynamic observation via MutationObserver
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (
                node.hasAttribute("data-pitch") &&
                !observedElements.has(node)
              ) {
                observer.observe(node);
                observedElements.add(node);
              }
              // Also check children in case a LaneSegment was added
              observeNotes(node);
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
              observedElements.delete(node);

              // Explicitly cleanup active note tracking when DOM elements are removed.
              // This is a safety layer for abrupt unmounts (segment transitions).
              if (node.hasAttribute("data-pitch")) {
                const pitch = Number(node.getAttribute("data-pitch"));
                cleanupActiveElements(pitch, node);
              }
              const activeChildren = node.querySelectorAll("[data-pitch]");
              activeChildren.forEach((child) => {
                const pitch = Number(child.getAttribute("data-pitch"));
                cleanupActiveElements(pitch, child);
              });
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

      // Final cleanup: release any currently active notes on unmount
      for (const [pitch, elements] of activeElements.entries()) {
        if (elements.size > 0) {
          onNoteOff(pitch);
        }
      }
      activeElements.clear();
    };
  }, [containerRef, demoMode, isLoading, groups, onNoteOn, onNoteOff]);
}
