import type { Meta, StoryObj } from "@storybook/react";
import HomeLoading from "./loading";

const meta: Meta<typeof HomeLoading> = {
  title: "Pages/Home/Loading",
  component: HomeLoading,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HomeLoading>;

export const Default: Story = {};
