import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DeviceSelector } from "./device-selector";

describe("DeviceSelector", () => {
  const mockDevices = [
    { id: "1", name: "Device 1" },
    { id: "2", name: "Device 2" },
  ] as WebMidi.MIDIInput[];

  it("should render a loading state", () => {
    render(
      <DeviceSelector
        devices={[]}
        isLoading={true}
        selectedMIDIInput={null}
        onSelect={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/Searching for MIDI devices.../i),
    ).toBeInTheDocument();
  });

  it("should render an error state", () => {
    render(
      <DeviceSelector
        devices={[]}
        isLoading={false}
        error="Access denied"
        selectedMIDIInput={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText(/Error: Access denied/i)).toBeInTheDocument();
  });

  it("should render a list of devices", () => {
    render(
      <DeviceSelector
        devices={mockDevices}
        isLoading={false}
        selectedMIDIInput={null}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("Device 1")).toBeInTheDocument();
    expect(screen.getByText("Device 2")).toBeInTheDocument();
  });

  it("should call onSelect when a device is clicked", () => {
    const onSelect = vi.fn();
    render(
      <DeviceSelector
        devices={mockDevices}
        isLoading={false}
        selectedMIDIInput={null}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByText("Device 1"));
    expect(onSelect).toHaveBeenCalledWith(mockDevices[0]);
  });

  it("should highlight the selected device", () => {
    render(
      <DeviceSelector
        devices={mockDevices}
        isLoading={false}
        selectedMIDIInput={mockDevices[0]}
        onSelect={vi.fn()}
      />,
    );

    const selectedButton = screen.getByText("Device 1").closest("button");
    expect(selectedButton).toHaveAttribute("aria-pressed", "true");
  });
});
