// Options Feature Public API

export type { Difficulty } from "./context/options-context";
export { OptionsProvider, useOptions } from "./context/options-context";
export {
  DIFFICULTY_SPEEDS,
  difficultyToSpeed,
  getDifficultyLabel,
  speedToDifficulty,
} from "./lib/difficulty";
