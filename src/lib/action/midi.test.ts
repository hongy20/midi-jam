import fs from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { getMidiFiles } from "./midi";

vi.mock("node:fs/promises", () => ({
  default: {
    readdir: vi.fn(),
  },
}));

describe("getMidiFiles", () => {
  it("should return a list of formatted midi file objects", async () => {
    const mockFiles = [
      "my_cool_song.mid",
      "DanceOfTheSugarPlum.mid",
      "kebab-case-song.mid",
      "lowerCamelCase.mid",
      "Regular Song.mid",
    ];

    // biome-ignore lint/suspicious/noExplicitAny: just give me a break
    vi.mocked(fs.readdir).mockResolvedValue(mockFiles as any);

    const result = await getMidiFiles();

    expect(result).toEqual([
      { name: "Dance Of The Sugar Plum", url: "/midi/DanceOfTheSugarPlum.mid" },
      { name: "Kebab Case Song", url: "/midi/kebab-case-song.mid" },
      { name: "Lower Camel Case", url: "/midi/lowerCamelCase.mid" },
      { name: "My Cool Song", url: "/midi/my_cool_song.mid" },
      { name: "Regular Song", url: "/midi/Regular Song.mid" },
    ]);
  });

  it("should return an empty array if the directory is empty", async () => {
    vi.mocked(fs.readdir).mockResolvedValue([]);
    const result = await getMidiFiles();
    expect(result).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(fs.readdir).mockRejectedValue(new Error("Directory not found"));
    const result = await getMidiFiles();
    expect(result).toEqual([]);
  });
});
