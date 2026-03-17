import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TrackProvider, useTrack } from "./track-context";

describe("TrackProvider & useTrack", () => {
  it("should throw an error if used outside of TrackProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useTrack())).toThrow(
      "useTrack must be used within a TrackProvider",
    );
    consoleSpy.mockRestore();
  });

  it("should provide trackStatus with default loading: false state", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TrackProvider>{children}</TrackProvider>
    );

    const { result } = renderHook(() => useTrack(), { wrapper });

    expect(result.current.trackStatus.isLoading).toBe(false);
    expect(result.current.trackStatus.isReady).toBe(false);
  });

  it("should allow updating trackStatus", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TrackProvider>{children}</TrackProvider>
    );

    const { result } = renderHook(() => useTrack(), { wrapper });

    act(() => {
      result.current.setTrackStatus({
        isLoading: false,
        isReady: true,
        totalDurationMs: 120000,
        events: [],
        spans: [],
        error: null,
      });
    });

    const status = result.current.trackStatus;
    if (status.isReady) {
      expect(status.totalDurationMs).toBe(120000);
    } else {
      throw new Error("Track status should be ready");
    }
  });
});
