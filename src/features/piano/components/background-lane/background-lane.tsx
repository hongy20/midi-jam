"use client";

import "../../styles/piano-layout.css";

import { useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import {
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
  PIANO_GRID_CLASS,
  PIANO_GRID_ITEM_CLASS,
} from "../../lib/constants";
import styles from "./background-lane.module.css";

interface BackgroundLaneProps {
  liveNotes?: Set<number>;
  playbackNotes?: Set<number>;
}

/**
 * Static lanes matching the piano keys.
 * Always renders the full 88-key range.
 * Uses imperative Ref updates for high-performance visual effects.
 */
export function BackgroundLane({
  liveNotes = new Set(),
  playbackNotes = new Set(),
}: BackgroundLaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const notes = Array.from(
    { length: PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1 },
    (_, i) => PIANO_88_KEY_MIN + i,
  );

  // Imperative sync: Update data attributes on lane elements without re-rendering
  useEffect(() => {
    const lanes = containerRef.current?.querySelectorAll<HTMLDivElement>("[data-pitch]");
    if (!lanes) return;

    for (const lane of lanes) {
      const pitch = Number(lane.dataset.pitch);
      const isLive = liveNotes.has(pitch);
      const isPlayback = playbackNotes.has(pitch);

      if (lane.dataset.live !== isLive.toString()) {
        lane.dataset.live = isLive.toString();
      }
      if (lane.dataset.playback !== isPlayback.toString()) {
        lane.dataset.playback = isPlayback.toString();
      }
    }
  }, [liveNotes, playbackNotes]);

  return (
    <div ref={containerRef} className={cn(styles.container, PIANO_GRID_CLASS)}>
      {notes.map((note) => (
        <div
          key={`lane-${note}`}
          className={cn(styles.lane, PIANO_GRID_ITEM_CLASS)}
          data-pitch={note}
          data-live="false"
          data-playback="false"
        />
      ))}
    </div>
  );
}
