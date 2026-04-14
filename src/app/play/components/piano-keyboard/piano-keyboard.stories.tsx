import type { Meta, StoryObj } from "@storybook/react";
import { PianoKeyboard } from "./PianoKeyboard";

const meta: Meta<typeof PianoKeyboard> = {
  title: "App/Play/Components/PianoKeyboard",
  component: PianoKeyboard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={
          {
            width: "100%",
            height: "400px",
            background: "var(--background)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            "--start-unit": "36",
            "--end-unit": "192",
          } as React.CSSProperties
        }
      >
        <div
          style={{
            height: "151px",
            width: "100%",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PianoKeyboard>;

export const Default: Story = {
  args: {
    liveNotes: new Set(),
    playbackNotes: new Set(),
  },
};

export const WithActiveNotes: Story = {
  args: {
    liveNotes: new Set([60, 64, 67]), // C4 Major chord
    playbackNotes: new Set([72]), // C5 playback
  },
};
