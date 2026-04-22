import type { Meta, StoryObj } from "@storybook/react";

import { GearPageView } from "./gear-page.view";

const mockInputs = [
  { id: "1", name: "Yamaha P-125", manufacturer: "Yamaha" },
  { id: "2", name: "MPK mini 3", manufacturer: "Akai" },
  { id: "3", name: "Komplete Kontrol", manufacturer: "Native Instruments" },
] as WebMidi.MIDIInput[];

const meta: Meta<typeof GearPageView> = {
  title: "App/Gear/View",
  component: GearPageView,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GearPageView>;

export const Default: Story = {
  args: {
    inputs: mockInputs,
    selectedMIDIInput: null,
    onSelect: (input) => console.log("Selected:", input),
    onContinue: () => console.log("Continue clicked"),
    onBack: () => console.log("Back clicked"),
  },
};

export const Selected: Story = {
  args: {
    inputs: mockInputs,
    selectedMIDIInput: mockInputs[0],
    onSelect: (input) => console.log("Selected:", input),
    onContinue: () => console.log("Continue clicked"),
    onBack: () => console.log("Back clicked"),
  },
};

export const Empty: Story = {
  args: {
    inputs: [],
    selectedMIDIInput: null,
    onSelect: (input) => console.log("Selected:", input),
    onContinue: () => console.log("Continue clicked"),
    onBack: () => console.log("Back clicked"),
  },
};
