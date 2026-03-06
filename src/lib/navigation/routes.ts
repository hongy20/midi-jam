export const ROUTES = {
  HOME: "/",
  COLLECTION: "/collection",
  GEAR: "/gear",
  PLAY: "/play",
  PAUSE: "/pause",
  SCORE: "/score",
  OPTIONS: "/options",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
