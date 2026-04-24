// Options Feature Public API

export { OptionsProvider, useOptions } from "./context/options-context";
export {
  type Difficulty,
  difficultyToSpeed,
  getDifficultyLabel,
  speedToDifficulty,
  SPEED_EASY,
  SPEED_NORMAL,
  SPEED_HARD,
} from "./lib/difficulty";
