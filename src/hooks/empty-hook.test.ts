import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Empty Hook", () => {
  it("should work", () => {
    const { result } = renderHook(() => ({ foo: "bar" }));
    expect(result.current.foo).toBe("bar");
  });
});
