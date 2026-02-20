import fs from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { getSoundTracks } from "./sound-track";

vi.mock("node:fs/promises", () => ({
  default: {
    readdir: vi.fn(),
  },
}));

describe("getSoundTracks", () => {
  it("should return a list of formatted midi file objects", async () => {
    const mockFiles = [
      "my_cool_song.mid",
      "DanceOfTheSugarPlum.mid",
      "kebab-case-song.mid",
      "lowerCamelCase.mid",
      "Regular Song.mid",
    ];

    vi.mocked(
      fs.readdir as unknown as () => Promise<string[]>,
    ).mockResolvedValue(mockFiles);

    const result = await getSoundTracks();

    expect(result).toEqual([
      { id: "DanceOfTheSugarPlum.mid", name: "Dance Of The Sugar Plum", artist: "Unknown Artist", difficulty: "Medium", url: "/midi/DanceOfTheSugarPlum.mid" },
      { id: "kebab-case-song.mid", name: "Kebab Case Song", artist: "Unknown Artist", difficulty: "Medium", url: "/midi/kebab-case-song.mid" },
      { id: "lowerCamelCase.mid", name: "Lower Camel Case", artist: "Unknown Artist", difficulty: "Medium", url: "/midi/lowerCamelCase.mid" },
      { id: "my_cool_song.mid", name: "My Cool Song", artist: "Unknown Artist", difficulty: "Medium", url: "/midi/my_cool_song.mid" },
      { id: "Regular Song.mid", name: "Regular Song", artist: "Unknown Artist", difficulty: "Medium", url: "/midi/Regular Song.mid" },
    ]);
  });

  it("should return an empty array if the directory is empty", async () => {
    vi.mocked(fs.readdir).mockResolvedValue([]);
    const result = await getSoundTracks();
    expect(result).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(fs.readdir).mockRejectedValue(new Error("Directory not found"));
    // Avoid logging mocked errors during unit tests
    vi.spyOn(console, "error").mockImplementation(() => { });
    const result = await getSoundTracks();
    expect(result).toEqual([]);
  });
});
