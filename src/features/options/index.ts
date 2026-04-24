// Options Feature Public API

export { OptionsProvider, useOptions } from "./context/options-context";
export {
  type Difficulty,
  difficultyToSpeed,
  getDifficultyLabel,
  speedToDifficulty,
} from "./lib/difficulty";
