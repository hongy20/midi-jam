/**
 * Observer factory for musical note elements in the DOM.
 * Handles both IntersectionObserver (for crossing the target line)
 * and MutationObserver (for dynamic DOM updates).
 */
interface NoteObserverOptions {
  container: HTMLElement;
  onPitchStart: (pitch: number, el: Element) => void;
  onPitchEnd: (pitch: number, el: Element) => void;
}

export function createNoteObserver({ container, onPitchStart, onPitchEnd }: NoteObserverOptions) {
  const activeCounts = new Map<number, number>();
  const observedElements = new Set<Element>();
  const activeElements = new Set<Element>();

  const handleNoteOn = (pitch: number, el: Element) => {
    if (activeElements.has(el)) return;
    activeElements.add(el);

    const currentCount = activeCounts.get(pitch) || 0;
    activeCounts.set(pitch, currentCount + 1);
    if (currentCount === 0) {
      onPitchStart(pitch, el);
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
        onPitchEnd(pitch, el);
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const exits = entries
        .filter((e) => !e.isIntersecting)
        .filter((e) => e.rootBounds && e.boundingClientRect.top > e.rootBounds.bottom);
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
            observeNotes(node);
          }
        });

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
            processRemoval(node);
            node.querySelectorAll("[data-pitch]").forEach(processRemoval);
          }
        });
      }
    }
  });

  mutationObserver.observe(container, { childList: true, subtree: true });

  return {
    disconnect: () => {
      observer.disconnect();
      mutationObserver.disconnect();
      observedElements.clear();
      // Cleanup: notify end for all remaining active pitches
      for (const [pitch, count] of activeCounts.entries()) {
        if (count > 0) {
          // We don't have the original 'el' here easily, but the hook mainly needs the pitch
          onPitchEnd(pitch, null as unknown as Element);
        }
      }
      activeCounts.clear();
      activeElements.clear();
    },
  };
}
