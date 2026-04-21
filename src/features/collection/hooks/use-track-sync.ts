"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useStage } from "@/app/play/context/stage-context";
import {
  buildMidiNoteGroups,
  LANE_SEGMENT_DURATION_MS,
  loadMidiFile,
  parseMidiNotes,
  useTrack,
} from "@/features/midi-assets";
import { useGear } from "@/features/midi-hardware";
import { ROUTES } from "@/shared/lib/routes";
import { useScore } from "@/features/score";
import { useCollection } from "../context/collection-context";

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
        const notes = parseMidiNotes(midi);
        const totalDurationMs = midi.duration * 1000;
        const thresholdMs = LANE_SEGMENT_DURATION_MS; // Alias for clarity

        const groups = buildMidiNoteGroups({
          notes,
          totalDurationMs,
          thresholdMs,
        });

        lastLoadedTrackId.current = selectedTrack.id;

        setTrackStatus({
          isLoading: false,
          isReady: true,
          totalDurationMs,
          notes,
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
  const { resetScore } = useScore();
  const { resetStage } = useStage();
  const { resetTrack } = useTrack();

  const resetAll = useCallback(() => {
    resetCollection();
    resetScore();
    resetStage();
    resetTrack();
    selectMIDIInput(null);
  }, [resetCollection, resetScore, resetStage, resetTrack, selectMIDIInput]);

  return { resetAll };
}
