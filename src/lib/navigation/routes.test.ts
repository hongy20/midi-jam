import { expect, test } from "vitest";
import { ROUTES } from "./routes";

test("ROUTES should match the new arcade naming scheme", () => {
  // @ts-ignore - checking that old keys are gone
  expect(ROUTES.TRACKS).toBeUndefined();
  // @ts-ignore
  expect(ROUTES.INSTRUMENTS).toBeUndefined();
  // @ts-ignore
  expect(ROUTES.GAME).toBeUndefined();
  // @ts-ignore
  expect(ROUTES.RESULTS).toBeUndefined();
  // @ts-ignore
  expect(ROUTES.SETTINGS).toBeUndefined();

  expect(ROUTES.COLLECTION).toBe("/collection");
  expect(ROUTES.GEAR).toBe("/gear");
  expect(ROUTES.PLAY).toBe("/play");
  expect(ROUTES.PAUSE).toBe("/pause");
  expect(ROUTES.SCORE).toBe("/score");
  expect(ROUTES.OPTIONS).toBe("/options");
});
