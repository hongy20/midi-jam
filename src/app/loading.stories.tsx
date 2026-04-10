import type { Meta, StoryObj } from "@storybook/react";
import RootLoading from "./loading";

const meta: Meta<typeof RootLoading> = {
  title: "App/Global/Loading",
  component: RootLoading,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof RootLoading>;

export const Default: Story = {};
