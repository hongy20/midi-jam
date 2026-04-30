import type { Meta, StoryObj } from "@storybook/react";

import { BackgroundLane } from "./background-lane";

const meta: Meta<typeof BackgroundLane> = {
  title: "Features/Piano/BackgroundLane",
  component: BackgroundLane,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div
        style={
          {
            width: "100%",
            height: "400px",
            background: "var(--background)",
            position: "relative",
            "--start-unit": "36",
            "--end-unit": "192",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BackgroundLane>;

export const Default: Story = {
  args: {
    liveNotesRef: { current: new Set() },
    playbackNotesRef: { current: new Set() },
  },
};

/** Reactive state with active notes showing beam and flare effects. */
export const Reactive: Story = {
  args: {
    liveNotesRef: { current: new Set([60, 64, 67]) }, // C4, E4, G4
    playbackNotesRef: { current: new Set([72, 76, 79]) }, // C5, E5, G5
  },
};

/** Narrowed viewport showing only the middle octave (C4–B4, units 108–129). */
export const NarrowViewport: Story = {
  args: {
    liveNotesRef: { current: new Set([60]) },
    playbackNotesRef: { current: new Set([64]) },
  },
  decorators: [
    (Story) => (
      <div
        style={
          {
            width: "100%",
            height: "400px",
            background: "var(--background)",
            position: "relative",
            "--start-unit": "108",
            "--end-unit": "129",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};
