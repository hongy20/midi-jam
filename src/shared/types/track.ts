/**
 * Represents the essential metadata for a music track in the library.
 * This shared interface allows features like collection and track-parser
 * to communicate without feature-to-feature structural dependencies.
 */
export interface Track {
  id: string;
  name: string;
  artist: string;
  difficulty: string;
  url: string;
}
