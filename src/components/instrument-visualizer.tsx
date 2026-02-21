"use client";

import { getInstrumentVisualizer } from "@/lib/device/visualizer";

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
  const Instrument = getInstrumentVisualizer(instrumentId);

  return (
    <div className="w-full h-full flex items-end">
      <Instrument liveNotes={liveNotes} playbackNotes={demoNotes} />
    </div>
  );
}
