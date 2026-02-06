"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isBlackKey } from "@/lib/device/piano";
import { PIANO_88_KEY_MAX, PIANO_88_KEY_MIN } from "@/lib/midi/constant";
import type { NoteSpan } from "@/lib/midi/midi-parser";
import { BackgroundGrid } from "./BackgroundGrid";
import { BarLines } from "./BarLines";
import { NoteSpans } from "./NoteSpans";

interface FalldownVisualizerProps {
  spans: NoteSpan[];
  barLines: number[];
  currentTime: number;
  speed: number;
  liveNotes: Set<number>;
  playbackNotes: Set<number>;
  rangeStart?: number;
  rangeEnd?: number;
}

/**
 * Visualizes MIDI notes falling from top to bottom.
 * Optimized using a static full-track render and a moving container for high performance.
 */
export const FalldownVisualizer = ({
  spans,
  barLines,
  currentTime,
  speed,
  liveNotes,
  playbackNotes,
  rangeStart = PIANO_88_KEY_MIN,
  rangeEnd = PIANO_88_KEY_MAX,
}: FalldownVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const PIXELS_PER_SECOND = 100 * speed;

  const indices: Record<number, number> = {};
  let whiteKeysCount = 0;
  for (let i = rangeStart; i <= rangeEnd; i++) {
    if (!isBlackKey(i)) {
      indices[i] = whiteKeysCount++;
    }
  }

  const getHorizontalPosition = (note: number) => {
    if (!isBlackKey(note)) {
      const index = indices[note];
      if (index === undefined) return null;
      return {
        leftRatio: index / whiteKeysCount,
        widthRatio: 1 / whiteKeysCount,
      };
    }
    const leftWhiteKeyIndex = indices[note - 1];
    if (leftWhiteKeyIndex === undefined) return null;
    return {
      leftRatio: (leftWhiteKeyIndex + 0.7) / whiteKeysCount,
      widthRatio: (1 / whiteKeysCount) * 0.6,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative flex-1 min-h-0 overflow-hidden bg-white/10 backdrop-blur-2xl rounded-t-3xl border-t border-x border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
      role="img"
      aria-label="MIDI notes falling down synchronized with the piano keyboard"
    >
      <BackgroundGrid
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        liveNotes={liveNotes}
        playbackNotes={playbackNotes}
      />

      {/* 
        The Moving Container: Core performance optimization.
        Instead of dynamically adding/removing notes from the DOM, we render the whole track
        and move it via transform.
      */}
      <div
        className="absolute w-full pointer-events-none"
        style={{
          bottom: 0,
          left: 0,
          height: "100%",
          transform: `translate3d(0, ${currentTime * PIXELS_PER_SECOND}px, 0)`,
          willChange: "transform",
        }}
      >
        <BarLines barLines={barLines} pixelsPerSecond={PIXELS_PER_SECOND} />

        <NoteSpans
          spans={spans}
          getHorizontalPosition={getHorizontalPosition}
          containerWidth={dimensions.width}
          pixelsPerSecond={PIXELS_PER_SECOND}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
        />
      </div>
    </div>
  );
};
