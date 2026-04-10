"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { CollectionPageView } from "./collection-page.view";
import type { SongCardTrack } from "./song-card";

const mockTracks: SongCardTrack[] = [
  {
    id: "1",
    name: "Golden",
    artist: "Kpop Demon Hunters",
    difficulty: "Hard",
    url: "/midi/golden.mid",
  },
  {
    id: "2",
    name: "Blue",
    artist: "Yung Kai",
    difficulty: "Easy",
    url: "/midi/blue.mid",
  },
  {
    id: "3",
    name: "What It Sounds Like",
    artist: "Kpop Demon Hunters",
    difficulty: "Medium",
    url: "/midi/what.mid",
  },
];

const meta: Meta<typeof CollectionPageView> = {
  title: "App/Collection/View",
  component: CollectionPageView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CollectionPageView>;

export const Loading: Story = {
  args: {
    tracks: [],
    selectedTrack: null,
    isLoading: true,
    onSelect: (track) => console.log("Selected:", track),
    onShuffle: () => console.log("Shuffle clicked"),
    onContinue: () => console.log("Continue clicked"),
    onBack: () => console.log("Back clicked"),
  },
};

export const Empty: Story = {
  args: {
    tracks: [],
    selectedTrack: null,
    isLoading: false,
    onSelect: (track) => console.log("Selected:", track),
    onShuffle: () => console.log("Shuffle clicked"),
    onContinue: () => console.log("Continue clicked"),
    onBack: () => console.log("Back clicked"),
  },
};

export const WithTracks: Story = {
  args: {
    tracks: mockTracks,
    selectedTrack: null,
    isLoading: false,
    onSelect: (track) => console.log("Selected:", track),
    onShuffle: () => console.log("Shuffle clicked"),
    onContinue: () => console.log("Continue clicked"),
    onBack: () => console.log("Back clicked"),
  },
};

export const WithSelection: Story = {
  args: {
    tracks: mockTracks,
    selectedTrack: mockTracks[0],
    isLoading: false,
    onSelect: (track) => console.log("Selected:", track),
    onShuffle: () => console.log("Shuffle clicked"),
    onContinue: () => console.log("Continue clicked"),
    onBack: () => console.log("Back clicked"),
  },
};
