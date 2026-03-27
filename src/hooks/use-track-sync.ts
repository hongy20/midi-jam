"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useCollection } from "@/context/collection-context";
import { useGear } from "@/context/gear-context";
import { useHome } from "@/context/home-context";
import { useScore } from "@/context/score-context";
import { useStage } from "@/context/stage-context";
import { useTrack } from "@/context/track-context";
import { LANE_SEGMENT_DURATION_MS } from "@/lib/midi/constant";
import { buildSegmentGroups } from "@/lib/midi/lane-segment-utils";
import { loadMidiFile } from "@/lib/midi/midi-loader";
import { getMidiEvents, getNoteSpans } from "@/lib/midi/midi-parser";
import { ROUTES } from "@/lib/navigation/routes";

/**
 * Coordinator hook to sync track selection with track loading logic.
 * Bridges CollectionProvider and TrackProvider.
 */
export function useTrackSync() {
  const pathname = usePathname();
  const { selectedTrack } = useCollection();
  const { trackStatus, setTrackStatus } = useTrack();
  const lastLoadedTrackId = useRef<string | null>(null);

  useEffect(() => {
    const isGamePath = pathname === ROUTES.PLAY || pathname === ROUTES.PAUSE;

    if (!isGamePath || !selectedTrack) {
      if (!selectedTrack) {
        setTrackStatus({ isLoading: false, isReady: false, error: null });
        lastLoadedTrackId.current = null;
      }
      return;
    }

    // Skip loading if already ready for this SPECIFIC track
    if (trackStatus.isReady && lastLoadedTrackId.current === selectedTrack.id) {
      return;
    }

    let mounted = true;
    setTrackStatus({ isLoading: true, isReady: false, error: null });

    loadMidiFile(selectedTrack.url)
      .then((midi) => {
        if (!mounted) return;
        const events = getMidiEvents(midi);
        const spans = getNoteSpans(events);
        const totalDurationMs = midi.duration * 1000;
        const threshold = LANE_SEGMENT_DURATION_MS; // Alias for clarity

        const groups = buildSegmentGroups({
          spans,
          totalDurationMs,
          thresholdMs: threshold,
        });

        lastLoadedTrackId.current = selectedTrack.id;

        setTrackStatus({
          isLoading: false,
          isReady: true,
          totalDurationMs,
          events,
          groups,
          error: null,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        setTrackStatus({
          isLoading: false,
          isReady: false,
          error: err instanceof Error ? err.message : String(err),
        });
      });

    return () => {
      mounted = false;
    };
  }, [pathname, selectedTrack, trackStatus.isReady, setTrackStatus]);
}

/**
 * Coordinator hook for resetting all application state slices.
 */
export function useAppReset() {
  const { resetCollection } = useCollection();
  const { selectMIDIInput } = useGear();
  const { resetHome } = useHome();
  const { resetScore } = useScore();
  const { resetStage } = useStage();
  const { resetTrack } = useTrack();

  const resetAll = useCallback(() => {
    resetCollection();
    resetHome();
    resetScore();
    resetStage();
    resetTrack();
    selectMIDIInput(null);
  }, [
    resetCollection,
    resetHome,
    resetScore,
    resetStage,
    resetTrack,
    selectMIDIInput,
  ]);

  return { resetAll };
}
