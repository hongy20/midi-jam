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
    const effectId = Math.random().toString(36).slice(2, 6);

    console.log(`[DEMO][${effectId}] Effect STARTED. groups=${groups.length}`);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          const noteId = entry.target.getAttribute("data-note-id") ?? "?";
          const isIntersecting = entry.isIntersecting;
          const rect = entry.boundingClientRect;
          const root = entry.rootBounds;
          const isConnected = entry.target.isConnected;
          const count = activeCounts.get(pitch) || 0;

          const exitFilter = !isIntersecting && root && rect.top > root.bottom;

          console.log(
            `[IO][${effectId}] pitch=${pitch} noteId=${noteId} ` +
            `isIntersecting=${isIntersecting} isConnected=${isConnected} ` +
            `rectTop=${rect.top.toFixed(1)} rectBottom=${rect.bottom.toFixed(1)} ` +
            `rootBottom=${root?.bottom ?? "null"} exitFilter=${exitFilter} count=${count}`
          );
        }

        // Partition entries to process exits (Off) before entries (On)
        const exits = entries
          .filter((e) => !e.isIntersecting)
          .filter(
            (e) =>
              // Only trigger Note Off if the element exits through the bottom
              e.rootBounds && e.boundingClientRect.top > e.rootBounds.bottom,
          );
        const entriesIn = entries.filter((e) => e.isIntersecting);

        // Process exits (Off) first
        for (const entry of exits) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          const currentCount = activeCounts.get(pitch) || 0;
          if (currentCount > 0) {
            const nextCount = currentCount - 1;
            activeCounts.set(pitch, nextCount);
            console.log(`[DEMO][${effectId}] NOTE OFF pitch=${pitch} count=${currentCount}->${nextCount} noteId=${entry.target.getAttribute("data-note-id")}`);
            if (nextCount === 0) {
              onNoteOff(pitch);
            }
          } else {
            console.warn(`[DEMO][${effectId}] NOTE OFF IGNORED pitch=${pitch} count was 0! noteId=${entry.target.getAttribute("data-note-id")}`);
          }
        }

        // Process entries (On) second
        for (const entry of entriesIn) {
          const pitch = Number(entry.target.getAttribute("data-pitch"));
          if (Number.isNaN(pitch)) continue;

          const currentCount = activeCounts.get(pitch) || 0;
          const nextCount = currentCount + 1;
          activeCounts.set(pitch, nextCount);
          console.log(`[DEMO][${effectId}] NOTE ON pitch=${pitch} count=${currentCount}->${nextCount} noteId=${entry.target.getAttribute("data-note-id")}`);
          if (currentCount === 0) {
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

    const observeNotes = (root: ParentNode, source: string) => {
      const notes = root.querySelectorAll("[data-pitch]");
      notes.forEach((note) => {
        if (!observedElements.has(note)) {
          observer.observe(note);
          observedElements.add(note);
          console.log(`[DEMO][${effectId}] observe() via ${source} pitch=${note.getAttribute("data-pitch")} noteId=${note.getAttribute("data-note-id")}`);
        }
      });
    };

    // Initial observation
    observeNotes(container, "Initial");

    // Dynamic observation via MutationObserver
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.hasAttribute("data-pitch") && !observedElements.has(node)) {
                observer.observe(node);
                observedElements.add(node);
                console.log(`[DEMO][${effectId}] observe() via MO_Add pitch=${node.getAttribute("data-pitch")} noteId=${node.getAttribute("data-note-id")}`);
              }
              observeNotes(node, "MO_Subtree");
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
              observedElements.delete(node);
              // Log if removed node has active children
              if (node instanceof HTMLElement) {
                const activeChildren = node.querySelectorAll("[data-pitch]");
                activeChildren.forEach(child => {
                  const pitch = Number(child.getAttribute("data-pitch"));
                  const count = activeCounts.get(pitch) || 0;
                  if (count > 0) {
                    console.warn(`[DEMO][${effectId}] MO REMOVAL pitch=${pitch} was ACTIVE! count=${count} noteId=${child.getAttribute("data-note-id")}`);
                  }
                });
              }
            }
          });
        }
      }
    });

    mutationObserver.observe(container, { childList: true, subtree: true });

    return () => {
      console.log(`[DEMO][${effectId}] Effect CLEANUP.`);
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
