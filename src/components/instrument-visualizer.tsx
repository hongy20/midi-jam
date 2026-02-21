"use client";

import { useMemo } from "react";
import { getInstrumentVisualizerConfig } from "@/lib/instrument/visualizer-config";

interface InstrumentVisualizerProps {
  instrumentId: string;
  liveNotes: Set<number>;
  demoNotes: Set<number>;
}

export function InstrumentVisualizer({
  instrumentId,
  liveNotes,
  demoNotes,
}: InstrumentVisualizerProps) {
  const config = useMemo(
    () => getInstrumentVisualizerConfig(instrumentId),
    [instrumentId],
  );
  const { Component } = config;

  return (
    <div className="w-full h-full flex items-end">
      <Component liveNotes={liveNotes} playbackNotes={demoNotes} />
    </div>
  );
}
