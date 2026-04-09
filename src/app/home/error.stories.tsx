import type { Meta, StoryObj } from "@storybook/react";
import HomeError from "./error";

const meta: Meta<typeof HomeError> = {
  title: "App/Home/Error",
  component: HomeError,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    reset: () => console.log("Reset clicked!"),
  },
};

export default meta;
type Story = StoryObj<typeof HomeError>;

export const UnsupportedMIDI: Story = {
  args: {
    error: new Error("MIDI_UNSUPPORTED"),
  },
};

export const GenericError: Story = {
  args: {
    error: new Error("Database connection failed. Please check your network."),
  },
};
