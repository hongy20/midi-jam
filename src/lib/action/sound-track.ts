"use server";

import fs from "node:fs/promises";
import path from "node:path";

/**
 * Formats a filename into a human-readable string.
 * Handles snake_case, kebab-case, CamelCase, and lowerCamelCase.
 */
function formatFilename(filename: string): string {
  // Remove extension
  const nameWithoutExt = path.parse(filename).name;

  // Replace underscores and hyphens with spaces
  // Insert space before capital letters (for CamelCase)
  const spacedName = nameWithoutExt
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");

  // Split into words, capitalize each word, and join
  return spacedName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const METADATA: Record<
  string,
  { title: string; artist: string; difficulty: string }
> = {
  "Golden Kpop Demon Hunters.mid": {
    title: "Golden",
    artist: "Kpop Demon Hunters",
    difficulty: "Hard",
  },
  "What It Sounds Like - KPop Demon Hunters.mid": {
    title: "What It Sounds Like",
    artist: "Kpop Demon Hunters",
    difficulty: "Medium",
  },
  "yung kai - blue.mid": {
    title: "Blue",
    artist: "Yung Kai",
    difficulty: "Easy",
  },
};

export async function getSoundTracks() {
  try {
    const midiDir = path.join(process.cwd(), "public", "midi");
    const files = await fs.readdir(midiDir);

    const midiFiles = files
      .filter((file) => file.endsWith(".mid") || file.endsWith(".midi"))
      .map((file) => {
        const metadata = METADATA[file];
        return {
          id: file, // use file as ID
          name: metadata?.title || formatFilename(file),
          artist: metadata?.artist || "Unknown Artist",
          difficulty: metadata?.difficulty || "Medium",
          url: `/midi/${file}`,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return midiFiles;
  } catch (error) {
    console.error("Failed to read MIDI directory:", error);
    return [];
  }
}
