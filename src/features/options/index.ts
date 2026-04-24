// Options Feature Public API

export { OptionsProvider, useOptions } from "./context/options-context";
export {
  type Difficulty,
  difficultyToSpeed,
  getDifficultyLabel,
  SPEED_EASY,
  SPEED_HARD,
  SPEED_NORMAL,
  speedToDifficulty,
} from "./lib/difficulty";
