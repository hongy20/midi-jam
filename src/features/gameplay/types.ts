type GameplayStatus = "idle" | "playing" | "paused" | "finished";

interface SessionData {
  score: number;
  combo: number;
  currentProgress: number;
}

export interface ResultsData {
  score: number;
  combo: number;
}

export type GameplayState =
  | { status: "idle" }
  | ({ status: "playing" } & SessionData)
  | ({ status: "paused" } & SessionData)
  | { status: "finished"; results: ResultsData };
