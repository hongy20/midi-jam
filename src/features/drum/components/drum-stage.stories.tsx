import type { Meta, StoryObj } from "@storybook/react";

import { DrumStage } from "./drum-stage";

const meta: Meta<typeof DrumStage> = {
  title: "Features/Drum/DrumStage",
  component: DrumStage,
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
    notes: [],
    liveActiveNotesRef: { current: new Set() },
    playbackNotesRef: { current: new Set() },
  },
};

export default meta;
type Story = StoryObj<typeof DrumStage>;

/** Placeholder state — no highway element mounted. */
export const NoHighway: Story = {
  args: {
    highway: undefined as unknown as React.ReactElement,
  },
};

/** With a highway slot passed in (simulated with a colored div). */
export const WithHighway: Story = {
  args: {
    highway: (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "var(--muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-retro)",
          color: "var(--muted-foreground)",
        }}
      >
        Highway Slot
      </div>
    ),
  },
};
