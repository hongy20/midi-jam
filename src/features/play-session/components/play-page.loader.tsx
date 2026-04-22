"use client";

import { useCollection } from "@/features/collection";
import {
  buildMidiNoteGroups,
  LANE_SEGMENT_DURATION_MS,
  loadMidiFile,
  parseMidiNotes,
} from "@/features/midi-assets";
import { usePlay } from "../context/play-context";

// Stable promise cache to prevent redundant fetches during suspension cycles
const promiseCache = new Map<string, Promise<void>>();

/**
 * PlayPageLoader handles the asynchronous loading and parsing of MIDI files.
 * It uses the Suspense pattern by throwing a promise when loading is required,
 * which leverages the route's loading.tsx boundary.
 */
export function PlayPageLoader({ children }: { children: React.ReactNode }) {
  const { playStatus, setPlayStatus } = usePlay();
  const { selectedTrack } = useCollection();

  // If no track is selected, we can't load anything (NavigationGuard will handle redirect)
  if (!selectedTrack) {
    return <>{children}</>;
  }

  // If we are not ready and not currently loading, initiate the load
  if (!playStatus.isReady && !playStatus.isLoading) {
    const url = selectedTrack.url;

    if (!promiseCache.has(url)) {
      const promise = (async () => {
        try {
          // We don't set playStatus.isLoading=true here immediately to avoid
          // a render-phase state update warning before suspension.
          // The suspension itself handles the UI state via loading.tsx.

          const midi = await loadMidiFile(url);
          const notes = parseMidiNotes(midi);
          const totalDurationMs = midi.duration * 1000;
          const groups = buildMidiNoteGroups({
            notes,
            totalDurationMs,
            thresholdMs: LANE_SEGMENT_DURATION_MS,
          });

          setPlayStatus({
            isLoading: false,
            isReady: true,
            totalDurationMs,
            notes,
            groups,
            error: null,
          });
        } catch (err) {
          setPlayStatus({
            isLoading: false,
            isReady: false,
            error: err instanceof Error ? err.message : String(err),
          });
        } finally {
          promiseCache.delete(url);
        }
      })();
      promiseCache.set(url, promise);
    }

    // Throw the promise to suspend
    throw promiseCache.get(url)!;
  }

  return <>{children}</>;
}
