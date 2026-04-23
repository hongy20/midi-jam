import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CollectionProvider } from "@/features/collection";

import { PlayOrchestrator, usePlayOrchestrator } from "./play-orchestrator";

vi.mock("@/features/midi-assets", () => ({
  getTrackData: vi.fn().mockResolvedValue({ notes: [], groups: [], totalDurationMs: 0 }),
}));

describe("PlayOrchestrator & usePlayOrchestrator", () => {
  it("should throw an error if used outside of PlayOrchestrator", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => usePlayOrchestrator())).toThrow(
      "usePlayOrchestrator must be used within a PlayOrchestrator",
    );
    consoleSpy.mockRestore();
  });

  it("should provide trackDataPromise with null default", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CollectionProvider>
        <PlayOrchestrator>{children}</PlayOrchestrator>
      </CollectionProvider>
    );

    const { result } = renderHook(() => usePlayOrchestrator(), { wrapper });

    expect(result.current.trackDataPromise).toBe(null);
  });
});
