"use client";

import { useCallback } from "react";

import { useCollection } from "@/features/collection";
import { useGear } from "@/features/midi-hardware";
import { useScore } from "@/features/score";

/**
 * Hook to reset the global application state.
 * Resets collection, gear, and score state.
 * Note: Play-specific state is managed by PlayProvider which unmounts when leaving the stage.
 */
export function useAppReset() {
  const { resetCollection } = useCollection();
  const { selectMIDIInput } = useGear();
  const { resetScore } = useScore();

  const resetAll = useCallback(() => {
    resetCollection();
    resetScore();
    selectMIDIInput(null);
  }, [resetCollection, resetScore, selectMIDIInput]);

  return { resetAll };
}
