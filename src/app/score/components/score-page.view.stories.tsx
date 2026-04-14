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
    stats: [{ id: 1, title: "Total Score", stats: "1,234,567" }],
    report: [
      { id: 1, title: "Accuracy", description: "98%" },
      { id: 2, title: "Max Combo", description: 450 },
    ],
    onRetry: () => {},
    onCollection: () => {},
    onHome: () => {},
  },
};

export const Great: Story = {
  args: {
    ...Outstanding.args,
    title: "Great Job!",
    report: [
      { id: 1, title: "Accuracy", description: "75%" },
      { id: 2, title: "Max Combo", description: 120 },
    ],
  },
};

export const KeepPracticing: Story = {
  args: {
    ...Outstanding.args,
    title: "Keep Practicing!",
    report: [
      { id: 1, title: "Accuracy", description: "32%" },
      { id: 2, title: "Max Combo", description: 15 },
    ],
  },
};
