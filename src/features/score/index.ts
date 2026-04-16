export type { ScoreContextType, SessionResults } from "./context/score-context";
export { ScoreProvider, useScore } from "./context/score-context";
export { calculateNoteWeights } from "./lib/score-engine";
export { useScoreEngine } from "./hooks/use-score-engine";
export type { HitQuality } from "./hooks/use-score-engine";
