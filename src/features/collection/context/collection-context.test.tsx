import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CollectionProvider, useCollection } from "./collection-context";

const mockTrack = {
  id: "track-1",
  name: "Test Track",
  artist: "Test Artist",
  difficulty: "Medium",
  url: "/test.mid",
};

describe("CollectionProvider & useCollection", () => {
  it("should throw an error if used outside of CollectionProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useCollection())).toThrow(
      "useCollection must be used within a CollectionProvider",
    );
    consoleSpy.mockRestore();
  });

  it("should provide selectedTrack with null default", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CollectionProvider>{children}</CollectionProvider>
    );

    const { result } = renderHook(() => useCollection(), { wrapper });

    expect(result.current.selectedTrack).toBe(null);
  });

  it("should allow updating selectedTrack", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CollectionProvider>{children}</CollectionProvider>
    );

    const { result } = renderHook(() => useCollection(), { wrapper });

    act(() => {
      result.current.setSelectedTrack(mockTrack);
    });

    expect(result.current.selectedTrack).toEqual(mockTrack);
  });
});
