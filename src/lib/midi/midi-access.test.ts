import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestMIDIAccess } from "./midi-access";

describe("requestMIDIAccess", () => {
  beforeEach(() => {
    vi.stubGlobal("navigator", {
      requestMIDIAccess: undefined,
    });
  });

  it("should throw an error if Web MIDI API is not supported", async () => {
    await expect(requestMIDIAccess()).rejects.toThrow(
      "Web MIDI API is not supported in this browser.",
    );
  });

  it("should return MIDI access if supported and granted", async () => {
    const mockMIDIAccess = { inputs: new Map(), outputs: new Map() };
    const requestMIDIAccessMock = vi.fn().mockResolvedValue(mockMIDIAccess);

    vi.stubGlobal("navigator", {
      requestMIDIAccess: requestMIDIAccessMock,
    });

    const access = await requestMIDIAccess();
    expect(access).toBe(mockMIDIAccess);
    expect(requestMIDIAccessMock).toHaveBeenCalled();
  });

  it("should throw an error if access is denied", async () => {
    const requestMIDIAccessMock = vi
      .fn()
      .mockRejectedValue(new Error("Access denied"));

    vi.stubGlobal("navigator", {
      requestMIDIAccess: requestMIDIAccessMock,
    });

    await expect(requestMIDIAccess()).rejects.toThrow(
      "Failed to access MIDI devices: Access denied",
    );
  });
});
