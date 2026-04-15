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
    score: "1,234",
    accuracy: "98%",
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
    accuracy: "75%",
    combo: 120,
  },
};

export const KeepPracticing: Story = {
  args: {
    ...Outstanding.args,
    title: "Keep Practicing!",
    accuracy: "32%",
    combo: 15,
  },
};
