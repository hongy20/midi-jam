import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import { Timeline, TimelineProps } from "./Timeline";

const meta: Meta<typeof Timeline> = {
  title: "Features/Visualizer/Timeline",
  component: Timeline,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={
          {
            width: "100%",
            height: "400px",
            background: "var(--background)",
            position: "relative",
            "--start-unit": "36",
            "--end-unit": "192",
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Timeline>;

const mockGroups = [
  {
    index: 0,
    startMs: 0,
    durationMs: 5000,
    notes: [
      { id: "1", pitch: 60, startTimeMs: 1000, durationMs: 500, velocity: 0.8 },
      { id: "2", pitch: 64, startTimeMs: 1500, durationMs: 500, velocity: 0.8 },
      { id: "3", pitch: 67, startTimeMs: 2000, durationMs: 500, velocity: 0.8 },
    ],
  },
  {
    index: 1,
    startMs: 5000,
    durationMs: 5000,
    notes: [{ id: "4", pitch: 72, startTimeMs: 6000, durationMs: 1000, velocity: 0.9 }],
  },
];

export const Default: Story = {
  args: {
    groups: mockGroups,
    scrollRef: { current: null },
    getCurrentTimeMs: () => 0,
  },
};

export const Playing: Story = {
  args: {
    groups: mockGroups,
    scrollRef: { current: null },
    getCurrentTimeMs: () => 1500,
  },
};

export const Animated: Story = {
  render: (args: TimelineProps) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [time, setTime] = useState(0);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const start = performance.now();
      const interval = setInterval(() => {
        setTime((performance.now() - start) % 10000); // Loop every 10s
      }, 16);
      return () => clearInterval(interval);
    }, []);

    return <Timeline {...args} getCurrentTimeMs={() => time} />;
  },
  args: {
    groups: mockGroups,
    scrollRef: { current: null },
    getCurrentTimeMs: () => 0, // Fallback
  },
};
