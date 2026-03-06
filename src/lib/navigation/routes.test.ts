import { expect, test } from "vitest";
import { ROUTES } from "./routes";

test("ROUTES should match the new arcade naming scheme", () => {
  // @ts-expect-error - checking that old keys are gone
  expect(ROUTES.TRACKS).toBeUndefined();
  // @ts-expect-error
  expect(ROUTES.INSTRUMENTS).toBeUndefined();
  // @ts-expect-error
  expect(ROUTES.GAME).toBeUndefined();
  // @ts-expect-error
  expect(ROUTES.RESULTS).toBeUndefined();
  // @ts-expect-error
  expect(ROUTES.SETTINGS).toBeUndefined();

  // @ts-expect-error - checking new keys before they are added
  expect(ROUTES.COLLECTION).toBe("/collection");
  // @ts-expect-error
  expect(ROUTES.GEAR).toBe("/gear");
  // @ts-expect-error
  expect(ROUTES.PLAY).toBe("/play");
  // @ts-expect-error
  expect(ROUTES.PAUSE).toBe("/pause");
  // @ts-expect-error
  expect(ROUTES.SCORE).toBe("/score");
  // @ts-expect-error
  expect(ROUTES.OPTIONS).toBe("/options");
});
