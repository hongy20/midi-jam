import type { Meta, StoryObj } from "@storybook/react";

import type { HitQuality } from "@/features/gameplay";

import { PlayPageView } from "./play-page.view";

const mockPianoInput = {
  id: "piano-1",
  name: "Yamaha P-125 Piano",
  manufacturer: "Yamaha",
} as WebMidi.MIDIInput;

const mockDrumInput = {
  id: "drum-1",
  name: "Roland TD-17 Drum",
  manufacturer: "Roland",
} as WebMidi.MIDIInput;

const mockNotes = Array.from({ length: 25 }, (_, i) => ({
  id: String(i),
  pitch: 48 + i,
  startTimeMs: i * 500,
  durationMs: 400,
  velocity: 0.8,
}));

const mockGroups = [
  {
    index: 0,
    startMs: 0,
    durationMs: 5000,
    notes: [
      { id: "1", pitch: 60, startTimeMs: 1000, durationMs: 500, velocity: 0.8 },
      { id: "2", pitch: 64, startTimeMs: 1500, durationMs: 500, velocity: 0.8 },
    ],
  },
];

const meta: Meta<typeof PlayPageView> = {
  title: "App/Play",
  component: PlayPageView,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    selectedMIDIInput: mockPianoInput,
    selectedTrack: { name: "Golden" },
    getScore: () => 0,
    getCombo: () => 0,
    getLastHitQuality: () => null as HitQuality,
    getProgress: () => 0,
    handlePause: () => console.log("Pause clicked"),
    isFullscreen: false,
    handleToggleFullscreen: () => console.log("Toggle fullscreen"),
    liveActiveNotesRef: { current: new Set() },
    playbackNotesRef: { current: new Set() },
    notes: mockNotes,
    groups: mockGroups,
    scrollRef: { current: null },
    getCurrentTimeMs: () => 0,
    speed: 1,
  },
};

export default meta;
type Story = StoryObj<typeof PlayPageView>;

/** Piano stage, no active notes, score at zero. */
export const PianoDefault: Story = {};

/** Piano stage with live MIDI notes and a score. */
export const PianoWithScore: Story = {
  args: {
    liveActiveNotesRef: { current: new Set([60, 64, 67]) },
    playbackNotesRef: { current: new Set([72]) },
    getScore: () => 1250,
    getCombo: () => 8,
    getProgress: () => 0.4,
    getLastHitQuality: () => "good" as HitQuality,
  },
};

/** Fullscreen mode active. */
export const Fullscreen: Story = {
  args: {
    isFullscreen: true,
  },
};

/** Drum stage branch. */
export const DrumDefault: Story = {
  args: {
    selectedMIDIInput: mockDrumInput,
  },
};
