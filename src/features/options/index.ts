// Options Feature Public API

export { OptionsProvider, useOptions } from "./context/options-context";
export {
  type Difficulty,
  DIFFICULTY_SPEEDS,
  difficultyToSpeed,
  getDifficultyLabel,
  speedToDifficulty,
} from "./lib/difficulty";
