import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLaneScoreEngine } from "./use-lane-score-engine";
import { useMIDINotes } from "./use-midi-notes";

vi.mock("./use-midi-notes", () => ({
  useMIDINotes: vi.fn(),
}));

describe("useLaneScoreEngine hook", () => {
  const modelEvents = [
    { type: "noteOn", note: 60, time: 1, velocity: 0.7 }, // 1000ms
  ] as any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("increases score and combo on perfect hit", () => {
    let onNoteCallback: any;
    vi.mocked(useMIDINotes).mockImplementation((_input, cb) => {
      onNoteCallback = cb;
    });

    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: {} as any,
        modelEvents,
        getCurrentTimeMs: () => 1000,
        isPlaying: true,
      }),
    );

    act(() => {
      onNoteCallback({ type: "note-on", note: 60, velocity: 0.7 });
    });

    expect(result.current.score).toBeGreaterThan(0);
    expect(result.current.combo).toBe(1);
    expect(result.current.lastHitQuality).toBe("perfect");
  });

  it("resets combo on miss (wrong note)", () => {
    let onNoteCallback: any;
    vi.mocked(useMIDINotes).mockImplementation((_input, cb) => {
      onNoteCallback = cb;
    });

    const { result } = renderHook(() =>
      useLaneScoreEngine({
        midiInput: {} as any,
        modelEvents,
        getCurrentTimeMs: () => 1000,
        isPlaying: true,
      }),
    );

    // First a good hit to get combo
    act(() => {
      onNoteCallback({ type: "note-on", note: 60, velocity: 0.7 });
    });
    expect(result.current.combo).toBe(1);

    // Then a wrong note
    act(() => {
      onNoteCallback({ type: "note-on", note: 62, velocity: 0.7 });
    });

    expect(result.current.combo).toBe(0);
    expect(result.current.lastHitQuality).toBe("miss");
  });
});
