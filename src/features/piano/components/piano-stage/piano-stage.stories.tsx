import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { PianoStage } from "./piano-stage";

// Representative notes spanning C3–C5 (MIDI 48–72)
const mockNotes = Array.from({ length: 25 }, (_, i) => ({
  id: String(i),
  pitch: 48 + i,
  startTimeMs: i * 500,
  durationMs: 400,
  velocity: 0.8,
}));

const meta: Meta<typeof PianoStage> = {
  title: "Features/Piano/PianoStage",
  component: PianoStage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          height: "100dvh",
          background: "var(--background)",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div /> {/* header placeholder */}
        <Story />
      </div>
    ),
  ],
  args: {
    notes: mockNotes,
    liveActiveNotesRef: { current: new Set() },
    playbackNotesRef: { current: new Set() },
    highway: <div style={{ width: "100%", height: "100%" }} />,
  },
};

export default meta;
type Story = StoryObj<typeof PianoStage>;

/** Default state — no active notes. */
export const Default: Story = {};

/** With live MIDI input notes (C major chord). */
export const WithLiveNotes: Story = {
  args: {
    liveActiveNotesRef: { current: new Set([60, 64, 67]) }, // C4 major chord
  },
};

/** With playback notes active. */
export const WithPlayback: Story = {
  args: {
    playbackNotesRef: { current: new Set([60, 64, 67, 72]) },
  },
};
