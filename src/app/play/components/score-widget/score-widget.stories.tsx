import type { Meta, StoryObj } from "@storybook/react";
import type { HitQuality } from "@/features/score";
import { ScoreWidget } from "./score-widget";

const meta: Meta<typeof ScoreWidget> = {
  title: "App/Play/Components/ScoreWidget",
  component: ScoreWidget,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScoreWidget>;

const mockGetters = {
  getScore: () => 12500,
  getCombo: () => 42,
  getLastHitQuality: () => "perfect" as const,
  getProgress: () => 0.65,
};

export const Default: Story = {
  args: {
    ...mockGetters,
  },
};

export const Empty: Story = {
  args: {
    getScore: () => 0,
    getCombo: () => 0,
    getLastHitQuality: () => null as HitQuality,
    getProgress: () => 0,
  },
};
