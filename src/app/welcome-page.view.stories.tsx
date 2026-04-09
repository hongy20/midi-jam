import type { Meta, StoryObj } from "@storybook/react";
import { WelcomePageView } from "./welcome-page.view";

const meta: Meta<typeof WelcomePageView> = {
  title: "Pages/WelcomePage",
  component: WelcomePageView,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    onStart: { action: "onStart" },
    onOptions: { action: "onOptions" },
  },
};

export default meta;
type Story = StoryObj<typeof WelcomePageView>;

export const Loading: Story = {
  args: {
    isLoading: true,
    isSupported: true,
  },
};

export const Ready: Story = {
  args: {
    isLoading: false,
    isSupported: true,
  },
};

export const Unsupported: Story = {
  args: {
    isLoading: false,
    isSupported: false,
  },
};

export const MobilePortrait: Story = {
  args: {
    isLoading: false,
    isSupported: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone14",
    },
  },
};

export const MobileLandscape: Story = {
  args: {
    isLoading: false,
    isSupported: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "iphone14landscape",
    },
  },
};

export const TabletPortrait: Story = {
  args: {
    isLoading: false,
    isSupported: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "ipadair",
    },
  },
};
