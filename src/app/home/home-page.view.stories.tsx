import type { Meta, StoryObj } from "@storybook/react";
import { HomePageView } from "./home-page.view";

const meta: Meta<typeof HomePageView> = {
  title: "Pages/HomePage",
  component: HomePageView,
  parameters: {
    layout: "fullscreen",
  },
  args: {},
  argTypes: {
    onStart: { action: "onStart" },
    onOptions: { action: "onOptions" },
  },
};

export default meta;
type Story = StoryObj<typeof HomePageView>;

export const Default: Story = {
  args: {},
};
