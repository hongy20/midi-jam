import type { Meta, StoryObj } from "@storybook/react";
import { ScorePageView } from "./score-page.view";

const meta: Meta<typeof ScorePageView> = {
  title: "App/Score/View",
  component: ScorePageView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ScorePageView>;

export const Outstanding: Story = {
  args: {
    title: "Outstanding!",
    score: "100.0",
    combo: 450,
    onRetry: () => {},
    onSongs: () => {},
    onHome: () => {},
  },
};

export const Great: Story = {
  args: {
    ...Outstanding.args,
    title: "Great Job!",
    combo: 120,
  },
};

export const KeepPracticing: Story = {
  args: {
    ...Outstanding.args,
    title: "Keep Practicing!",
    combo: 15,
  },
};
