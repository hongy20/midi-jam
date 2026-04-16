import { useCallback, useEffect, useMemo, useRef } from "react";
import type { MidiEvent } from "@/lib/midi/midi-parser";
import { useMIDINotes } from "./use-midi-notes";

const PERFECT_THRESHOLD = 200; // ms (increased from 150 for better tolerance)
const GOOD_THRESHOLD = 500; // ms (increased from 300)
const DURATION_GRACE_MS = 150; // ms to account for scheduling jitter

export type HitQuality = "perfect" | "good" | "miss" | null;

interface UseLaneScoreEngineProps {
  midiInput: WebMidi.MIDIInput | null;
  modelEvents: MidiEvent[];
  getCurrentTimeMs: () => number;
  initialScore?: number;
  initialCombo?: number;
  initialTimeMs?: number;
}

export function useLaneScoreEngine({
  midiInput,
  modelEvents,
  getCurrentTimeMs,
  initialScore = 0,
  initialCombo = 0,
  initialTimeMs = 0,
}: UseLaneScoreEngineProps) {
  const scoreRef = useRef(initialScore);
  // Only process noteOn events for scoring targets to ensure sequential indexing for multipliers.
  // Note-off duration logic is handled via the durationMs property already present on NoteOn events.
  const scoredEvents = useMemo(
    () => modelEvents.filter((e) => e.type === "noteOn"),
    [modelEvents],
  );

  const comboRef = useRef(initialCombo);
  const lastHitQualityRef = useRef<HitQuality>(null);

  const processedNotesRef = useRef<Set<number>>(new Set());
  const currentIndexRef = useRef(0);
  const activeHitsRef = useRef<
    Map<
      number,
      {
        actualOnTimeMs: number;
        modelIdx: number;
        basePoints: number;
        comboMultiplier: number;
      }
    >
  >(new Map());

  // Restore state on mount if needed
  useEffect(() => {
    if (initialTimeMs > 0) {
      let nextIndex = 0;
      for (let i = 0; i < modelEvents.length; i++) {
        const modelEvent = modelEvents[i];
        const targetTimeMs = modelEvent.timeMs;

        if (targetTimeMs < initialTimeMs - GOOD_THRESHOLD) {
          processedNotesRef.current.add(i);
          nextIndex = i + 1;
        } else {
          break;
        }
      }
      currentIndexRef.current = nextIndex;
    }
  }, [initialTimeMs, modelEvents]);

  const resetScore = useCallback(() => {
    scoreRef.current = 0;
    comboRef.current = 0;
    lastHitQualityRef.current = null;
    processedNotesRef.current.clear();
    currentIndexRef.current = 0;
    activeHitsRef.current.clear();
  }, []);

  const calculateOverlapRatio = useCallback(
    (
      actualOn: number,
      actualOff: number,
      targetOn: number,
      targetOff: number,
    ) => {
      const targetDuration = targetOff - targetOn;
      if (targetDuration <= 0) return 0;

      // Apply grace period to actual boundaries to account for jitter
      const effectiveActualOn = Math.max(
        actualOn - DURATION_GRACE_MS,
        targetOn,
      );
      const effectiveActualOff = Math.min(
        actualOff + DURATION_GRACE_MS,
        targetOff,
      );

      const intersectionStart = Math.max(effectiveActualOn, targetOn);
      const intersectionEnd = Math.min(effectiveActualOff, targetOff);
      const intersection = Math.max(0, intersectionEnd - intersectionStart);

      return Math.min(1.0, intersection / targetDuration);
    },
    [],
  );

  const processNoteEvent = useCallback(
    (event: {
      type: "note-on" | "note-off";
      note: number;
      velocity: number;
    }) => {
      const currentTimeMs = getCurrentTimeMs();

      // --- HANDLE NOTE OFF ---
      if (event.type === "note-off") {
        const hit = activeHitsRef.current.get(event.note);
        if (hit) {
          const modelEvent = scoredEvents[hit.modelIdx];
          if (!modelEvent) {
            activeHitsRef.current.delete(event.note);
            return;
          }
          const targetOn = modelEvent.timeMs;
          const targetOff = targetOn + (modelEvent.durationMs ?? 0);

          const precision = calculateOverlapRatio(
            hit.actualOnTimeMs,
            currentTimeMs,
            targetOn,
            targetOff,
          );

          scoreRef.current += hit.basePoints * precision * hit.comboMultiplier;
          activeHitsRef.current.delete(event.note);
        }
        return;
      }

      // --- HANDLE NOTE ON ---
      // Find closest model noteOn event for this pitch within a window
      let bestMatchIdx = -1;
      let minDelta = Infinity;

      for (let i = currentIndexRef.current; i < scoredEvents.length; i++) {
        const modelEvent = scoredEvents[i];
        // We already filtered to noteOn, but checking type is safe
        if (modelEvent.type !== "noteOn") continue;

        const targetTimeMs = modelEvent.timeMs;
        const delta = Math.abs(currentTimeMs - targetTimeMs);

        if (targetTimeMs > currentTimeMs + GOOD_THRESHOLD) break;

        if (
          modelEvent.note === event.note &&
          !processedNotesRef.current.has(i)
        ) {
          if (delta < minDelta) {
            minDelta = delta;
            bestMatchIdx = i;
          }
        }
      }

      if (bestMatchIdx !== -1 && minDelta < GOOD_THRESHOLD) {
        processedNotesRef.current.add(bestMatchIdx);

        let quality: HitQuality = "good";
        let points = 50;

        if (minDelta < PERFECT_THRESHOLD) {
          quality = "perfect";
          points = 100;
        }

        const multiplier = 1 + Math.floor(comboRef.current / 10) * 0.1;

        // Register active hit - points are added on release
        activeHitsRef.current.set(event.note, {
          actualOnTimeMs: currentTimeMs,
          modelIdx: bestMatchIdx,
          basePoints: points,
          comboMultiplier: multiplier,
        });

        lastHitQualityRef.current = quality;
        comboRef.current += 1;
      } else {
        lastHitQualityRef.current = "miss";
        comboRef.current = 0;
      }
    },
    [scoredEvents, getCurrentTimeMs, calculateOverlapRatio],
  );

  useMIDINotes(midiInput, processNoteEvent);

  // Miss detection, window advancement, and stale hit cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTimeMs = getCurrentTimeMs();

      // 1. Check for missing noteOn (User never pressed)
      for (let i = currentIndexRef.current; i < scoredEvents.length; i++) {
        const modelEvent = scoredEvents[i];
        const targetTimeMs = modelEvent.timeMs;

        if (currentTimeMs > targetTimeMs + GOOD_THRESHOLD) {
          if (!processedNotesRef.current.has(i)) {
            processedNotesRef.current.add(i);
            lastHitQualityRef.current = "miss";
            comboRef.current = 0;
          }
          currentIndexRef.current = i + 1;
        } else {
          break;
        }
      }

      // 2. Check for missing noteOff (User held forever or release missed)
      for (const [note, hit] of activeHitsRef.current.entries()) {
        const modelEvent = scoredEvents[hit.modelIdx];
        if (!modelEvent) {
          activeHitsRef.current.delete(note);
          continue;
        }
        const targetOff = modelEvent.timeMs + (modelEvent.durationMs ?? 0);

        // If we are significantly past the target release, finalize the score
        if (currentTimeMs > targetOff + GOOD_THRESHOLD) {
          const precision = calculateOverlapRatio(
            hit.actualOnTimeMs,
            currentTimeMs,
            modelEvent.timeMs,
            targetOff,
          );
          scoreRef.current += hit.basePoints * precision * hit.comboMultiplier;
          activeHitsRef.current.delete(note);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [scoredEvents, getCurrentTimeMs, calculateOverlapRatio]);

  const finalizeScore = useCallback(() => {
    const currentTimeMs = getCurrentTimeMs();
    for (const [note, hit] of activeHitsRef.current.entries()) {
      const modelEvent = scoredEvents[hit.modelIdx];
      if (modelEvent) {
        const targetOff = modelEvent.timeMs + (modelEvent.durationMs ?? 0);
        const precision = calculateOverlapRatio(
          hit.actualOnTimeMs,
          currentTimeMs,
          modelEvent.timeMs,
          targetOff,
        );
        scoreRef.current += hit.basePoints * precision * hit.comboMultiplier;
      }
      activeHitsRef.current.delete(note);
    }
  }, [scoredEvents, getCurrentTimeMs, calculateOverlapRatio]);

  return {
    getScore: useCallback(() => scoreRef.current, []),
    getCombo: useCallback(() => comboRef.current, []),
    getLastHitQuality: useCallback(() => lastHitQualityRef.current, []),
    processNoteEvent,
    resetScore,
    finalizeScore,
  };
}
