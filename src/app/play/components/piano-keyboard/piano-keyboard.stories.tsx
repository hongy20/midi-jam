import type { Meta, StoryObj } from "@storybook/react";
import { PianoKeyboard } from "./PianoKeyboard";

const meta: Meta<typeof PianoKeyboard> = {
  title: "App/Play/Components/PianoKeyboard",
  component: PianoKeyboard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
