import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, useTheme } from "./theme-context";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const TestComponent = () => {
  const { theme, mode } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="mode">{mode}</span>
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    document.body.className = "";
    document.documentElement.removeAttribute("data-theme");
  });

  it("provides default theme and mode", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("default");
    expect(screen.getByTestId("mode").textContent).toBe("light");
  });

  it("loads theme from localStorage", () => {
    localStorage.setItem("midi-jam-theme", "sega");
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("sega");
  });

  it("overrides theme with forced props", () => {
    render(
      <ThemeProvider theme="nintendo" mode="dark">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("nintendo");
    expect(screen.getByTestId("mode").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("nintendo");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("theme-nintendo")).toBe(true);
    expect(document.body.classList.contains("theme-nintendo")).toBe(true);
  });

  it("updates state when forced props change", () => {
    const { rerender } = render(
      <ThemeProvider theme="sega">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("sega");

    rerender(
      <ThemeProvider theme="atari">
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme").textContent).toBe("atari");
    expect(document.documentElement.getAttribute("data-theme")).toBe("atari");
    expect(document.documentElement.classList.contains("theme-atari")).toBe(true);
    expect(document.documentElement.classList.contains("theme-sega")).toBe(false);
  });
});
