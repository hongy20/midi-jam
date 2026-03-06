import { expect, test } from "vitest";
import { ROUTES } from "./routes";

test("ROUTES should match the new arcade naming scheme", () => {
  expect(ROUTES.COLLECTION).toBe("/collection");
  expect(ROUTES.GEAR).toBe("/gear");
  expect(ROUTES.PLAY).toBe("/play");
  expect(ROUTES.PAUSE).toBe("/pause");
  expect(ROUTES.SCORE).toBe("/score");
  expect(ROUTES.OPTIONS).toBe("/options");
});
