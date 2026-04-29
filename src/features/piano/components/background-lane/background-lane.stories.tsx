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

/** Full 88-key range with the default octave viewport. */
export const Default: Story = {};

/** Narrowed viewport showing only the middle octave (C4–B4, units 108–129). */
export const NarrowViewport: Story = {
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
