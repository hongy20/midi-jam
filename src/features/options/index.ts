// Options Feature Public API

export type { Difficulty } from "./context/options-context";
export { OptionsProvider, useOptions } from "./context/options-context";
export {
  difficultyToSpeed,
  getDifficultyLabel,
  speedToDifficulty,
  DIFFICULTY_SPEEDS,
} from "./lib/difficulty";
