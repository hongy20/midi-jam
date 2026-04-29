import type { Meta, StoryObj } from "@storybook/react";

import type { Track } from "@/shared/types/track";

import { TrackCard } from "./track-card";

const mockTrack: Track = {
  id: "1",
  name: "Golden",
  artist: "Kpop Demon Hunters",
  difficulty: "hard",
  url: "/midi/golden.mid",
};

const meta: Meta<typeof TrackCard> = {
  title: "Features/Collection/TrackCard",
  component: TrackCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "200px", height: "160px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    track: mockTrack,
  },
};

export default meta;
type Story = StoryObj<typeof TrackCard>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    isSelected: true,
  },
};

export const Clickable: Story = {
  args: {
    onClick: () => console.log("TrackCard clicked"),
  },
};

export const EasyDifficulty: Story = {
  args: {
    track: { ...mockTrack, difficulty: "easy", name: "Blue", artist: "Yung Kai" },
  },
};
