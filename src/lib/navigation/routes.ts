export const ROUTES = {
  HOME: "/",
  TRACKS: "/tracks",
  INSTRUMENTS: "/instruments",
  GAME: "/game",
  PAUSE: "/game/pause",
  RESULTS: "/results",
  RECONNECT: "/reconnect",
  SETTINGS: "/settings",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
