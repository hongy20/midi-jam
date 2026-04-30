"use client";

import "../../styles/piano-layout.css";

import { memo, useEffect, useRef } from "react";

import { cn } from "@/shared/lib/utils";

import {
  PIANO_88_KEY_MAX,
  PIANO_88_KEY_MIN,
  PIANO_GRID_CLASS,
  PIANO_GRID_ITEM_CLASS,
} from "../../lib/constants";
import styles from "./background-lane.module.css";

interface BackgroundLaneProps {
  liveNotesRef?: React.MutableRefObject<Set<number>>;
  playbackNotesRef?: React.MutableRefObject<Set<number>>;
}

/**
 * Memoized static lanes to prevent 88-element reconciliation 
 * every time notes change during 60fps gameplay.
 */
const StaticLanes = memo(() => {
  const notes = Array.from(
    { length: PIANO_88_KEY_MAX - PIANO_88_KEY_MIN + 1 },
    (_, i) => PIANO_88_KEY_MIN + i,
  );

  return (
    <>
      {notes.map((note) => (
        <div
          key={`lane-${note}`}
          className={cn(styles.lane, PIANO_GRID_ITEM_CLASS)}
          data-pitch={note}
          data-live="false"
          data-playback="false"
        />
      ))}
    </>
  );
});

StaticLanes.displayName = "StaticLanes";

/**
 * Static lanes matching the piano keys.
 * Always renders the full 88-key range.
 * Uses imperative Ref updates for high-performance visual effects.
 */
export function BackgroundLane({
  liveNotesRef,
  playbackNotesRef,
}: BackgroundLaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // High-performance animation loop to sync DOM with mutable refs
  useEffect(() => {
    let animationFrameId: number;

    const updateDOM = () => {
      const lanes = containerRef.current?.querySelectorAll<HTMLDivElement>("[data-pitch]");
      if (!lanes) return;

      const liveNotes = liveNotesRef?.current;
      const playbackNotes = playbackNotesRef?.current;

      for (const lane of lanes) {
        const pitch = Number(lane.dataset.pitch);
        const isLive = liveNotes ? liveNotes.has(pitch) : false;
        const isPlayback = playbackNotes ? playbackNotes.has(pitch) : false;

        if (lane.dataset.live !== isLive.toString()) {
          lane.dataset.live = isLive.toString();
        }
        if (lane.dataset.playback !== isPlayback.toString()) {
          lane.dataset.playback = isPlayback.toString();
        }
      }

      animationFrameId = requestAnimationFrame(updateDOM);
    };

    animationFrameId = requestAnimationFrame(updateDOM);

    return () => cancelAnimationFrame(animationFrameId);
  }, [liveNotesRef, playbackNotesRef]);

  return (
    <div ref={containerRef} className={cn(styles.container, PIANO_GRID_CLASS)}>
      <StaticLanes />
    </div>
  );
}

