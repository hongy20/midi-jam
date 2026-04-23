import type { MidiNote, MidiNoteGroup } from "@/shared/types/midi";

import { CLUSTER_CONNECTION_GAP_MS } from "./constant";

interface BuildMidiNoteGroupsOptions {
  notes: MidiNote[];
  totalDurationMs: number;
  thresholdMs: number;
}

/**
 * Groups notes into discrete clusters for rendering.
 */
export function buildMidiNoteGroups({
  notes,
  totalDurationMs,
  thresholdMs,
}: BuildMidiNoteGroupsOptions): MidiNoteGroup[] {
  if (notes.length === 0) return [];

  const groups: MidiNoteGroup[] = [];
  let currentGroupNotes: MidiNote[] = [];
  let currentStartMs = 0;
  let currentMaxEndMs = 0;

  notes.forEach((note, index) => {
    const noteEndMs = note.startTimeMs + note.durationMs;
    const isFirstNote = currentGroupNotes.length === 0;

    const visualDuration = note.startTimeMs - currentStartMs;
    const isUnderThreshold = visualDuration < thresholdMs;
    const isConnected = note.startTimeMs <= currentMaxEndMs + CLUSTER_CONNECTION_GAP_MS;
    const isTailTooSmall = totalDurationMs - note.startTimeMs < thresholdMs / 2;

    if (isFirstNote || isUnderThreshold || isConnected || isTailTooSmall) {
      currentGroupNotes.push(note);
      currentMaxEndMs = Math.max(currentMaxEndMs, noteEndMs);
    } else {
      const nextNoteStartMs = note.startTimeMs;
      const midpoint = (currentMaxEndMs + nextNoteStartMs) / 2;

      groups.push({
        index: groups.length,
        startMs: currentStartMs,
        durationMs: midpoint - currentStartMs,
        notes: currentGroupNotes,
      });

      currentStartMs = midpoint;
      currentGroupNotes = [note];
      currentMaxEndMs = noteEndMs;
    }

    if (index === notes.length - 1) {
      groups.push({
        index: groups.length,
        startMs: currentStartMs,
        durationMs: totalDurationMs - currentStartMs,
        notes: currentGroupNotes,
      });
    }
  });

  return groups;
}
